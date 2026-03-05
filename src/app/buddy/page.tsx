'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase =
  typeof window !== 'undefined'
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

const t = {
  bg: '#07080a',
  surface: '#0e1014',
  surfaceRaised: '#13161b',
  border: '#1e2229',
  borderHover: '#2a3040',
  gold: '#c9a84c',
  goldDim: '#7a6030',
  goldFaint: '#c9a84c18',
  red: '#c0281a',
  text: '#e8e6e0',
  textMuted: '#606878',
  textDim: '#9ca3af',
  green: '#22c55e',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── SUGGESTED PROMPTS ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What are my top 3 moves today?",
  "Should I open speedups today or wait?",
  "What should I focus on for Arms Race right now?",
  "Is today a good day to train troops?",
  "What's the best way to use my Alliance Duel points today?",
];

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
      padding: '0 4px',
    }}>
      {/* Buddy avatar */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${t.red}, ${t.gold})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, marginRight: 10, marginTop: 2,
        }}>
          💬
        </div>
      )}

      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? t.gold : t.surfaceRaised,
        border: isUser ? 'none' : `1px solid ${t.border}`,
        color: isUser ? '#07080a' : t.text,
        fontSize: 14,
        lineHeight: 1.6,
        fontWeight: isUser ? 600 : 400,
      }}>
        {/* Render assistant messages with basic markdown-like formatting */}
        {!isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 4px' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${t.red}, ${t.gold})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        💬
      </div>
      <div style={{
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        background: t.surfaceRaised, border: `1px solid ${t.border}`,
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: t.textMuted,
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── LIMIT REACHED BANNER ─────────────────────────────────────────────────────

function LimitBanner({ message }: { message: string }) {
  return (
    <div style={{
      margin: '16px 0',
      padding: '16px',
      background: `${t.gold}12`,
      border: `1px solid ${t.goldDim}`,
      borderRadius: 12,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
      <p style={{ color: t.text, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{
          padding: '10px 20px', borderRadius: 8,
          background: t.gold, border: 'none',
          color: '#07080a', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
          fontFamily: '"Rajdhani", sans-serif',
        }}>
          Upgrade to Pro — $4.99/mo
        </button>
        <button style={{
          padding: '10px 20px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${t.gold}`,
          color: t.gold, fontWeight: 700, fontSize: 13,
          cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
          fontFamily: '"Rajdhani", sans-serif',
        }}>
          Founding Member — $59
        </button>
      </div>
    </div>
  );
}

// ─── MAIN CHAT PAGE ───────────────────────────────────────────────────────────

export default function BuddyChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionsRemaining, setQuestionsRemaining] = useState<number | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [commanderName, setCommanderName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/signin'); return; }
      setToken(session.access_token);

      // Get commander name
      const { data: profile } = await supabase
        .from('profiles')
        .select('commander_name')
        .eq('id', session.user.id)
        .single();
      if (profile?.commander_name) setCommanderName(profile.commander_name);

      // Create a new chat session
      const { data: chatSession } = await supabase
        .from('chat_sessions')
        .insert({ user_id: session.user.id, title: 'New Session' })
        .select()
        .single();
      if (chatSession) setSessionId(chatSession.id);

      // Check today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usage } = await supabase
        .from('daily_usage')
        .select('question_count')
        .eq('user_id', session.user.id)
        .eq('usage_date', today)
        .single();
      const used = usage?.question_count || 0;
      setQuestionsRemaining(Math.max(0, 5 - used));
    }
    init();
  }, [router]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(content?: string) {
    const text = content || input.trim();
    if (!text || loading || !token) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setLimitMessage(null);

    try {
      const res = await fetch('/api/buddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          sessionId,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setLimitMessage(data.message);
        setQuestionsRemaining(0);
        return;
      }

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Something went wrong. Try again in a moment.',
        }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.questionsRemaining !== null) {
        setQuestionsRemaining(data.questionsRemaining);
      }

      // Update session title from first message
      if (messages.length === 0 && sessionId && supabase) {
        const title = text.slice(0, 50);
        await supabase
          .from('chat_sessions')
          .update({ title })
          .eq('id', sessionId);
      }

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Check your internet and try again.',
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const showSuggestions = messages.length === 0 && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${t.bg}; overflow: hidden; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        textarea { resize: none; font-family: inherit; }
        textarea::placeholder { color: ${t.textMuted}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
      `}</style>

      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: t.bg, maxWidth: 640, margin: '0 auto',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          padding: '12px 16px',
          background: `${t.bg}ee`, backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'transparent', border: 'none', color: t.textMuted,
                cursor: 'pointer', fontSize: 18, padding: '4px 8px 4px 0',
              }}
            >
              ←
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.red}, ${t.gold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>
              💬
            </div>
            <div>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, fontSize: 15, color: t.text, letterSpacing: '0.04em' }}>
                Buddy AI
              </div>
              <div style={{ fontSize: 11, color: t.textMuted }}>
                {commanderName ? `Commander ${commanderName}` : 'Your personal Last War coach'}
              </div>
            </div>
          </div>

          {/* Questions remaining badge */}
          {questionsRemaining !== null && (
            <div style={{
              padding: '4px 10px', borderRadius: 20,
              background: questionsRemaining > 0 ? t.goldFaint : `${t.red}20`,
              border: `1px solid ${questionsRemaining > 0 ? t.goldDim : t.red}`,
              fontSize: 11, color: questionsRemaining > 0 ? t.gold : t.red,
              letterSpacing: '0.06em',
            }}>
              {questionsRemaining > 0 ? `${questionsRemaining} left today` : 'Limit reached'}
            </div>
          )}
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 16px 8px',
        }}>

          {/* Welcome message */}
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎖️</div>
              <h2 style={{
                fontFamily: '"Rajdhani", sans-serif', fontSize: 22, fontWeight: 700,
                color: t.gold, letterSpacing: '0.06em', marginBottom: 8,
              }}>
                {commanderName ? `Ready, Commander ${commanderName}` : 'Buddy is ready'}
              </h2>
              <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                Ask me anything about today's strategy, events, pack value, or your next moves.
              </p>
            </div>
          )}

          {/* Suggested prompts */}
          {showSuggestions && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: t.textMuted, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Try asking...
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      padding: '11px 14px', background: t.surface,
                      border: `1px solid ${t.border}`, borderRadius: 10,
                      color: t.textDim, fontSize: 13, cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLButtonElement).style.borderColor = t.goldDim;
                      (e.target as HTMLButtonElement).style.color = t.text;
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLButtonElement).style.borderColor = t.border;
                      (e.target as HTMLButtonElement).style.color = t.textDim;
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {/* Typing indicator */}
          {loading && <TypingIndicator />}

          {/* Limit reached */}
          {limitMessage && <LimitBanner message={limitMessage} />}

          <div ref={bottomRef} />
        </div>

        {/* ── INPUT BAR ── */}
        <div style={{
          padding: '12px 16px 24px',
          borderTop: `1px solid ${t.border}`,
          background: t.bg,
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: '10px 12px',
            transition: 'border-color 0.15s',
          }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = t.goldDim)}
            onBlurCapture={e => (e.currentTarget.style.borderColor = t.border)}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Buddy anything..."
              rows={1}
              disabled={loading || questionsRemaining === 0}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: t.text, fontSize: 14, outline: 'none',
                lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
                padding: 0,
              }}
              onInput={e => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || questionsRemaining === 0}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: input.trim() && !loading && questionsRemaining !== 0
                  ? `linear-gradient(135deg, ${t.red}, ${t.gold})`
                  : t.border,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0, transition: 'all 0.15s',
              }}
            >
              ↑
            </button>
          </div>
          <p style={{ color: t.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </>
  );
}
