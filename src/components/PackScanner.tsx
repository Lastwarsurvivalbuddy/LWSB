'use client';

// src/components/PackScanner.tsx
// Pack Scanner modal — Pro / Elite / Founding / Alliance only
// Free users see the button but get an upgrade prompt

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface PackScannerProps {
  subscriptionTier: string;
}

type Verdict = 'BUY' | 'SKIP' | 'MAYBE' | 'UNKNOWN' | null;

const ALLOWED_TIERS = ['pro', 'elite', 'founding', 'alliance'];

const verdictConfig: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  BUY:     { label: 'BUY',     color: '#00ff88', bg: '#0a2a1a', border: '#00ff88', emoji: '✅' },
  SKIP:    { label: 'SKIP',    color: '#ff4444', bg: '#2a0a0a', border: '#ff4444', emoji: '❌' },
  MAYBE:   { label: 'MAYBE',   color: '#ffcc00', bg: '#2a220a', border: '#ffcc00', emoji: '⚠️' },
  UNKNOWN: { label: 'UNKNOWN', color: '#888888', bg: '#1a1a1a', border: '#555555', emoji: '❓' },
};

function parseAnalysis(raw: string) {
  const sections: { packIdentified: string; reasons: string[]; spendCallout: string } = {
    packIdentified: '',
    reasons: [],
    spendCallout: '',
  };

  const packMatch = raw.match(/PACK IDENTIFIED:\s*(.+?)(?:\n|REASON:)/);
  if (packMatch) sections.packIdentified = packMatch[1].trim();

  const reasonMatch = raw.match(/REASON:\s*([\s\S]+?)(?:SPEND TIER CALLOUT:|$)/);
  if (reasonMatch) {
    sections.reasons = reasonMatch[1]
      .split('\n')
      .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
      .filter(l => l.length > 0);
  }

  const spendMatch = raw.match(/SPEND TIER CALLOUT:\s*(.+)/);
  if (spendMatch) sections.spendCallout = spendMatch[1].trim();

  return sections;
}

export default function PackScanner({ subscriptionTier }: PackScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAllowed = ALLOWED_TIERS.includes(subscriptionTier?.toLowerCase() ?? '');

  function handleOpen() {
    setIsOpen(true);
    setImagePreview(null);
    setImageBase64(null);
    setVerdict(null);
    setAnalysis('');
    setError(null);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setVerdict(null);
    setAnalysis('');

    const mediaType = file.type || 'image/jpeg';
    setImageMediaType(mediaType);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      // Strip data URL prefix to get raw base64
      const base64 = result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleScan() {
    if (!imageBase64) return;

    setIsScanning(true);
    setError(null);
    setVerdict(null);
    setAnalysis('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Session expired. Please sign in again.');
        return;
      }

      const res = await fetch('/api/pack-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          screenshot_base64: imageBase64,
          screenshot_media_type: imageMediaType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'daily_limit_reached' || data.error === 'screenshot_limit_reached') {
          setError(data.message ?? 'Daily limit reached.');
        } else if (data.error === 'upgrade_required') {
          setError('Pack Scanner requires a Pro or higher plan.');
        } else {
          setError('Something went wrong. Try again.');
        }
        return;
      }

      setVerdict(data.verdict as Verdict);
      setAnalysis(data.analysis ?? '');
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setIsScanning(false);
    }
  }

  function handleReset() {
    setImagePreview(null);
    setImageBase64(null);
    setVerdict(null);
    setAnalysis('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const parsed = verdict && analysis ? parseAnalysis(analysis) : null;
  const vc = verdict ? verdictConfig[verdict] : null;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={isAllowed ? handleOpen : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isAllowed ? '#1a1a2e' : '#111',
          border: isAllowed ? '1px solid #333' : '1px solid #222',
          borderRadius: '8px',
          padding: '12px 16px',
          color: isAllowed ? '#ccc' : '#555',
          cursor: isAllowed ? 'pointer' : 'default',
          fontSize: '14px',
          fontWeight: 600,
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
        title={isAllowed ? 'Scan a pack screenshot' : 'Upgrade to Pro to unlock Pack Scanner'}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📦</span>
          <span>Pack Scanner</span>
          {!isAllowed && (
            <span style={{
              fontSize: '10px',
              background: '#2a1a00',
              color: '#ffaa00',
              border: '1px solid #ffaa00',
              borderRadius: '4px',
              padding: '2px 6px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>PRO</span>
          )}
        </span>
        <span style={{ fontSize: '12px', color: '#555' }}>
          {isAllowed ? 'Upload a screenshot →' : 'Upgrade to unlock'}
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d0d1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>📦 Pack Scanner</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Upload a pack screenshot for a verdict</div>
              </div>
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Upload Area */}
            {!imagePreview && (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #333',
                  borderRadius: '8px',
                  padding: '32px 16px',
                  cursor: 'pointer',
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: '16px',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '8px' }}>📷</span>
                <span style={{ fontSize: '14px', color: '#888' }}>Tap to upload pack screenshot</span>
                <span style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>JPG or PNG</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}

            {/* Image Preview */}
            {imagePreview && !verdict && (
              <div style={{ marginBottom: '16px' }}>
                <img
                  src={imagePreview}
                  alt="Pack screenshot"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    maxHeight: '280px',
                    objectFit: 'contain',
                    background: '#111',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    style={{
                      flex: 1,
                      background: isScanning ? '#1a1a2e' : '#1a3a5c',
                      border: '1px solid #2a5a8c',
                      borderRadius: '6px',
                      color: isScanning ? '#555' : '#7ab8f5',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isScanning ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isScanning ? '⏳ Scanning...' : '🔍 Scan This Pack'}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isScanning}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#666',
                      padding: '10px 14px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: '#2a0a0a',
                border: '1px solid #ff4444',
                borderRadius: '8px',
                padding: '12px',
                color: '#ff8888',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            {/* Verdict Card */}
            {verdict && vc && parsed && (
              <div>
                {/* Verdict Badge */}
                <div style={{
                  background: vc.bg,
                  border: `2px solid ${vc.border}`,
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '14px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{vc.emoji}</div>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: vc.color,
                    letterSpacing: '0.1em',
                  }}>{vc.label}</div>
                  {parsed.packIdentified && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                      {parsed.packIdentified}
                    </div>
                  )}
                </div>

                {/* Reasons */}
                {parsed.reasons.length > 0 && (
                  <div style={{
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '12px',
                  }}>
                    {parsed.reasons.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#bbb',
                        marginBottom: i < parsed.reasons.length - 1 ? '8px' : 0,
                        lineHeight: '1.5',
                      }}>
                        <span style={{ color: vc.color, flexShrink: 0 }}>•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Spend Callout */}
                {parsed.spendCallout && (
                  <div style={{
                    background: '#1a1a0a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '14px',
                    fontStyle: 'italic',
                  }}>
                    💰 {parsed.spendCallout}
                  </div>
                )}

                {/* Unknown Pack — TeachBuddy CTA */}
                {verdict === 'UNKNOWN' && (
                  <a
                    href="/dashboard#teach-buddy"
                    onClick={handleClose}
                    style={{
                      display: 'block',
                      background: '#1a1a2e',
                      border: '1px solid #4444aa',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#8888ff',
                      fontSize: '13px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      marginBottom: '12px',
                      fontWeight: 600,
                    }}
                  >
                    📚 Teach Buddy about this pack →
                  </a>
                )}

                {/* Scan Another */}
                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#666',
                    padding: '10px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Scan another pack
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
