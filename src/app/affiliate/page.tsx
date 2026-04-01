'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AppStatus = 'idle' | 'loading' | 'submitted' | 'already_applied' | 'error';

export default function AffiliatePage() {
  const router = useRouter();
  const [status, setStatus] = useState<AppStatus>('idle');
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    ign: '',
    server: '',
    promo_method: '',
  });

  useEffect(() => {
    const checkExisting = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch('/api/affiliate/dashboard', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setExistingStatus(data.status);
          setStatus('already_applied');
        }
      }
    };
    checkExisting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setStatus('loading');
    setErrorMsg('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    const res = await fetch('/api/affiliate/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.status === 409) {
      setExistingStatus(data.status);
      setStatus('already_applied');
      return;
    }
    if (!res.ok) {
      setErrorMsg(data.error ?? 'Something went wrong. Try again.');
      setStatus('error');
      return;
    }
    setStatus('submitted');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07080a',
      color: '#e8e8e8',
      fontFamily: "'Open Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(232,160,32,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.06), transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '80px 24px 60px' }}>

        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none', border: 'none', color: '#606878',
            fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
            marginBottom: 40, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.25)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#e8a020',
              boxShadow: '0 0 8px #e8a020', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', color: '#e8a020', textTransform: 'uppercase',
            }}>
              Affiliate Program
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            Earn With<br /><span style={{ color: '#e8a020' }}>Last War Buddy</span>
          </h1>

          <p style={{ fontSize: 14, color: '#8090a0', lineHeight: 1.8, fontWeight: 300 }}>
            Share your referral link. Earn a commission on every subscription you bring in — for the life of that subscriber.
            Commission rates are confirmed individually at approval based on your audience and reach.
            Applications are reviewed manually. You'll hear back within 48 hours.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 36 }}>
          {[
            {
              label: 'Standard',
              name: 'Community affiliate',
              rate: 'Competitive',
              rateNote: 'commission',
              desc: 'Alliance leaders, Discord mods, and active community members.',
            },
            {
              label: 'Partner',
              name: 'High-volume partner',
              rate: 'Enhanced',
              rateNote: 'commission',
              desc: 'Content creators and guide writers with consistent referral volume.',
              featured: true,
            },
            {
              label: 'Strategic',
              name: 'Creator partner',
              rate: 'By invitation',
              rateNote: 'only',
              desc: 'Major YouTube channels and large-scale platform partnerships.',
            },
          ].map(tier => (
            <div
              key={tier.label}
              style={{
                background: '#0e1014',
                border: tier.featured ? '1px solid rgba(232,160,32,0.5)' : '1px solid #222830',
                borderRadius: 10,
                padding: '16px 14px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {tier.featured && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, transparent, #e8a020, transparent)',
                  borderRadius: '10px 10px 0 0',
                }} />
              )}
              <div style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: tier.featured ? '#e8a020' : '#606878', marginBottom: 8,
              }}>
                {tier.label}
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700,
                color: tier.featured ? '#e8a020' : '#c8c8c8', lineHeight: 1.1, marginBottom: 2,
              }}>
                {tier.rate}
              </div>
              <div style={{ fontSize: 10, color: '#606878', marginBottom: 10 }}>
                {tier.rateNote}
              </div>
              <div style={{ fontSize: 11, color: '#606878', lineHeight: 1.5 }}>
                {tier.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Already applied */}
        {status === 'already_applied' && (
          <div style={{
            background: existingStatus === 'approved' ? 'rgba(48,184,112,0.08)' : 'rgba(232,160,32,0.08)',
            border: `1px solid ${existingStatus === 'approved' ? 'rgba(48,184,112,0.3)' : 'rgba(232,160,32,0.3)'}`,
            borderRadius: 12, padding: '24px 28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>
              {existingStatus === 'approved' ? '✅' : existingStatus === 'rejected' ? '❌' : '⏳'}
            </div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
            }}>
              {existingStatus === 'approved'
                ? 'Application Approved'
                : existingStatus === 'rejected'
                ? 'Application Not Approved'
                : 'Application Under Review'}
            </div>
            <div style={{ fontSize: 13, color: '#8090a0', lineHeight: 1.7 }}>
              {existingStatus === 'approved'
                ? 'Your affiliate account is active. Head to your dashboard to get your referral link.'
                : existingStatus === 'rejected'
                ? 'Your application was not approved. Contact us if you think this is an error.'
                : 'Your application has been submitted and is pending review. Check back within 48 hours.'}
            </div>
            {existingStatus === 'approved' && (
              <button
                onClick={() => router.push('/affiliate/dashboard')}
                style={{
                  marginTop: 20,
                  background: 'linear-gradient(135deg, #c06010, #e8a020)',
                  border: 'none', borderRadius: 8, padding: '12px 28px', color: '#fff',
                  fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Go to Dashboard →
              </button>
            )}
          </div>
        )}

        {/* Submitted confirmation */}
        {status === 'submitted' && (
          <div style={{
            background: 'rgba(48,184,112,0.08)', border: '1px solid rgba(48,184,112,0.3)',
            borderRadius: 12, padding: '32px 28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🎯</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em', color: '#30b870', marginBottom: 10,
            }}>
              Application Submitted
            </div>
            <div style={{ fontSize: 13, color: '#8090a0', lineHeight: 1.75 }}>
              You'll hear back within 48 hours. Once approved, you'll get your referral link and
              dashboard access automatically.
            </div>
          </div>
        )}

        {/* Form */}
        {status !== 'already_applied' && status !== 'submitted' && (
          <div style={{
            background: '#0e1014', border: '1px solid #2a3040',
            borderRadius: 16, padding: '32px 28px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #e8a020, transparent)',
            }} />

            <div style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8a020',
              marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚡ Apply to Join
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #2a3040, transparent)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name */}
              <div>
                <label style={{
                  display: 'block', fontFamily: "'Rajdhani', sans-serif", fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#606878', marginBottom: 6,
                }}>
                  Full Name
                </label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Your name"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #222830', borderRadius: 8, padding: '12px 14px',
                    color: '#e8e8e8', fontSize: 14, fontFamily: "'Open Sans', sans-serif",
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* IGN */}
              <div>
                <label style={{
                  display: 'block', fontFamily: "'Rajdhani', sans-serif", fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#606878', marginBottom: 6,
                }}>
                  In-Game Name (IGN)
                </label>
                <input
                  name="ign" value={form.ign} onChange={handleChange}
                  placeholder="Your Last War IGN"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #222830', borderRadius: 8, padding: '12px 14px',
                    color: '#e8e8e8', fontSize: 14, fontFamily: "'Open Sans', sans-serif",
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Server */}
              <div>
                <label style={{
                  display: 'block', fontFamily: "'Rajdhani', sans-serif", fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#606878', marginBottom: 6,
                }}>
                  Server Number
                </label>
                <input
                  name="server" value={form.server} onChange={handleChange}
                  placeholder="e.g. 1032"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #222830', borderRadius: 8, padding: '12px 14px',
                    color: '#e8e8e8', fontSize: 14, fontFamily: "'Open Sans', sans-serif",
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Promo method */}
              <div>
                <label style={{
                  display: 'block', fontFamily: "'Rajdhani', sans-serif", fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#606878', marginBottom: 6,
                }}>
                  How Will You Promote?
                </label>
                <textarea
                  name="promo_method" value={form.promo_method} onChange={handleChange}
                  placeholder="e.g. I'm R5 on Server 1032 and will share in alliance chat. I run a YouTube channel with 5k subs. etc."
                  rows={4}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #222830', borderRadius: 8, padding: '12px 14px',
                    color: '#e8e8e8', fontSize: 13, fontFamily: "'Open Sans', sans-serif",
                    outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                  }}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  fontSize: 13, color: '#ff6b6b', background: 'rgba(255,107,107,0.08)',
                  border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, padding: '10px 14px',
                }}>
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !form.name || !form.ign || !form.server || !form.promo_method}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #c0281a, #c06010, #e8a020)',
                  border: 'none', borderRadius: 8, padding: '15px', color: '#fff',
                  fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                  opacity: status === 'loading' || !form.name || !form.ign || !form.server || !form.promo_method ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Application →'}
              </button>

              <div style={{ fontSize: 11, color: '#606878', textAlign: 'center', lineHeight: 1.6 }}>
                Applications are reviewed manually. You'll receive confirmation within 48 hours.<br />
                Commission rate is confirmed individually at approval. Rates are not publicly disclosed.
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
