'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Conversion {
  id: string;
  subscription_tier: string;
  converted_at: string;
}

interface AffiliateStats {
  total_conversions: number;
  active_subscriptions: number;
  founding_conversions: number;
  payout_rate_pct: number;
  estimated_monthly_recurring: number;
  founding_earnings: number;
  referral_link: string;
}

interface DashboardData {
  status: string;
  referral_code: string;
  name: string;
  ign: string;
  payout_method: string | null;
  payout_account: string | null;
  payout_country: string | null;
  conversions: Conversion[];
  stats: AffiliateStats;
}

const PAYOUT_METHODS = [
  { value: 'paypal', label: 'PayPal', hint: 'PayPal email address' },
  { value: 'wise', label: 'Wise', hint: 'Wise email address' },
  { value: 'venmo', label: 'Venmo', hint: 'Venmo username or phone (US only)' },
  { value: 'cashapp', label: 'Cash App', hint: 'Cash App $cashtag (US/UK only)' },
  { value: 'other', label: 'Other', hint: 'Describe how you\'d like to be paid' },
]

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Payout setup state
  const [showPayoutSetup, setShowPayoutSetup] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [payoutCountry, setPayoutCountry] = useState('');
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSaved, setPayoutSaved] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setToken(session.access_token);

      const res = await fetch('/api/affiliate/dashboard', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setError('Could not load affiliate data.');
        setLoading(false);
        return;
      }

      const json = await res.json();

      if (json.status !== 'approved') {
        router.push('/affiliate');
        return;
      }

      setData(json);

      // Pre-fill payout fields if already set
      if (json.payout_method) {
        setPayoutMethod(json.payout_method);
        setPayoutAccount(json.payout_account ?? '');
        setPayoutCountry(json.payout_country ?? '');
      }

      // Auto-open setup if payout method not set
      if (!json.payout_method) {
        setShowPayoutSetup(true);
      }

      setLoading(false);
    };
    load();
  }, [router]);

  const copyLink = () => {
    if (!data?.stats?.referral_link) return;
    navigator.clipboard.writeText(data.stats.referral_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePayoutMethod = async () => {
    if (!token || !payoutMethod || !payoutAccount) return;
    setPayoutSaving(true);
    setPayoutError('');

    const res = await fetch('/api/affiliate/payout-method', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        payout_method: payoutMethod,
        payout_account: payoutAccount,
        payout_country: payoutCountry,
      }),
    });

    if (res.ok) {
      setData(prev => prev ? {
        ...prev,
        payout_method: payoutMethod,
        payout_account: payoutAccount,
        payout_country: payoutCountry,
      } : prev);
      setPayoutSaved(true);
      setShowPayoutSetup(false);
      setTimeout(() => setPayoutSaved(false), 3000);
    } else {
      setPayoutError('Failed to save. Please try again.');
    }
    setPayoutSaving(false);
  };

  const tierLabel = (tier: string) => {
    if (tier === 'pro') return { label: 'Pro', color: '#60a0e8' };
    if (tier === 'elite') return { label: 'Elite', color: '#e8a020' };
    if (tier === 'founding') return { label: 'Founding', color: '#c090f0' };
    return { label: tier, color: '#8090a0' };
  };

  const selectedMethod = PAYOUT_METHODS.find(m => m.value === payoutMethod);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#07080a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, letterSpacing: '0.2em', color: '#606878', textTransform: 'uppercase' }}>Loading...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#07080a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#ff6b6b', fontSize: 14 }}>{error}</div>
    </div>
  );

  if (!data) return null;

  const { stats, conversions } = data;
  const hasPayoutMethod = !!data.payout_method;

  return (
    <div style={{
      minHeight: '100vh', background: '#07080a', color: '#e8e8e8',
      fontFamily: "'Open Sans', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(232,160,32,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.05), transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '80px 24px 60px' }}>

        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#606878', fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8a020', marginBottom: 8 }}>
            Affiliate Dashboard
          </div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
            Welcome, <span style={{ color: '#e8a020' }}>{data.ign}</span>
          </h1>
          <div style={{ fontSize: 13, color: '#606878' }}>
            Payout rate: <span style={{ color: '#e8a020', fontWeight: 600 }}>{stats.payout_rate_pct}%</span> · Life of subscriber
          </div>
        </div>

        {/* ── PAYOUT METHOD SETUP / STATUS ── */}
        {!hasPayoutMethod && !showPayoutSetup && (
          <div style={{
            background: 'rgba(232,160,32,0.06)', border: '1px solid rgba(232,160,32,0.25)',
            borderRadius: 14, padding: '20px 24px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e8a020', marginBottom: 4 }}>
                ⚠ Payout Method Required
              </div>
              <div style={{ fontSize: 13, color: '#8090a0' }}>
                Set up how you'd like to receive payments before sharing your link.
              </div>
            </div>
            <button
              onClick={() => setShowPayoutSetup(true)}
              style={{
                background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.3)',
                borderRadius: 8, padding: '10px 20px', color: '#e8a020',
                fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Set Up Now
            </button>
          </div>
        )}

        {/* Payout setup form */}
        {showPayoutSetup && (
          <div style={{
            background: '#0e1014', border: '1px solid #2a3040', borderRadius: 14,
            padding: '24px', marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />

            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#606878', marginBottom: 16 }}>
              {hasPayoutMethod ? 'Update Payout Method' : 'Set Up Payout Method'}
            </div>

            {/* Method selector */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#606878', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Payment Method
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PAYOUT_METHODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setPayoutMethod(m.value)}
                    style={{
                      background: payoutMethod === m.value ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${payoutMethod === m.value ? 'rgba(232,160,32,0.5)' : '#2a3040'}`,
                      borderRadius: 8, padding: '8px 16px',
                      color: payoutMethod === m.value ? '#e8a020' : '#8090a0',
                      fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700,
                      letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account field */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#606878', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {selectedMethod?.hint ?? 'Account / Email / Username'}
              </div>
              <input
                type="text"
                value={payoutAccount}
                onChange={e => setPayoutAccount(e.target.value)}
                placeholder={selectedMethod?.hint ?? 'Your account details'}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #2a3040',
                  borderRadius: 8, padding: '11px 14px', color: '#e8e8e8',
                  fontSize: 14, fontFamily: 'monospace', outline: 'none',
                }}
              />
            </div>

            {/* Country field */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#606878', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Country
              </div>
              <input
                type="text"
                value={payoutCountry}
                onChange={e => setPayoutCountry(e.target.value)}
                placeholder="e.g. United States, Netherlands, UK..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #2a3040',
                  borderRadius: 8, padding: '11px 14px', color: '#e8e8e8',
                  fontSize: 14, outline: 'none',
                }}
              />
            </div>

            {payoutError && (
              <div style={{ fontSize: 12, color: '#ff6b6b', marginBottom: 12 }}>{payoutError}</div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={savePayoutMethod}
                disabled={payoutSaving || !payoutMethod || !payoutAccount}
                style={{
                  flex: 1, background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.3)',
                  borderRadius: 8, padding: '12px', color: '#e8a020',
                  fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: payoutSaving || !payoutMethod || !payoutAccount ? 'not-allowed' : 'pointer',
                  opacity: payoutSaving || !payoutMethod || !payoutAccount ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {payoutSaving ? 'Saving...' : 'Save Payout Method'}
              </button>
              {hasPayoutMethod && (
                <button
                  onClick={() => setShowPayoutSetup(false)}
                  style={{
                    background: 'none', border: '1px solid #2a3040', borderRadius: 8,
                    padding: '12px 20px', color: '#606878',
                    fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payout method set — compact status row */}
        {hasPayoutMethod && !showPayoutSetup && (
          <div style={{
            background: 'rgba(48,184,112,0.06)', border: '1px solid rgba(48,184,112,0.2)',
            borderRadius: 10, padding: '12px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#30b870', fontSize: 13 }}>✓</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#30b870' }}>
                {PAYOUT_METHODS.find(m => m.value === data.payout_method)?.label ?? data.payout_method}
              </span>
              <span style={{ fontSize: 13, color: '#606878', fontFamily: 'monospace' }}>
                {data.payout_account}
              </span>
              {data.payout_country && (
                <span style={{ fontSize: 12, color: '#4a5568' }}>· {data.payout_country}</span>
              )}
            </div>
            <button
              onClick={() => {
                setShowPayoutSetup(true)
                setPayoutSaved(false)
              }}
              style={{
                background: 'none', border: 'none', color: '#4a5568',
                fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Edit
            </button>
          </div>
        )}

        {payoutSaved && (
          <div style={{
            background: 'rgba(48,184,112,0.08)', border: '1px solid rgba(48,184,112,0.25)',
            borderRadius: 8, padding: '10px 16px', marginBottom: 16,
            fontSize: 13, color: '#30b870',
          }}>
            ✓ Payout method saved.
          </div>
        )}

        {/* Referral link — show always, but with subtle lock if no payout method */}
        <div style={{
          background: '#0e1014', border: `1px solid ${hasPayoutMethod ? '#2a3040' : '#1a2030'}`,
          borderRadius: 14, padding: '24px', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
          opacity: hasPayoutMethod ? 1 : 0.6,
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#606878', marginBottom: 10 }}>
            Your Referral Link
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a3040',
              borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#8090a0',
              fontFamily: 'monospace', wordBreak: 'break-all',
            }}>
              {stats.referral_link}
            </div>
            <button
              onClick={hasPayoutMethod ? copyLink : undefined}
              style={{
                background: copied ? 'rgba(48,184,112,0.15)' : 'rgba(232,160,32,0.12)',
                border: `1px solid ${copied ? 'rgba(48,184,112,0.4)' : 'rgba(232,160,32,0.3)'}`,
                borderRadius: 8, padding: '11px 20px', color: copied ? '#30b870' : '#e8a020',
                fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: hasPayoutMethod ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy Link'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#606878', marginTop: 10 }}>
            {hasPayoutMethod
              ? `Share this link anywhere. Every paying subscriber you bring in earns you ${stats.payout_rate_pct}% of their subscription — for as long as they stay subscribed.`
              : 'Set up your payout method above to start sharing your link.'}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Conversions', value: stats.total_conversions, color: '#e8e8e8' },
            { label: 'Active Subs', value: stats.active_subscriptions, color: '#60a0e8' },
            { label: 'Founding Members', value: stats.founding_conversions, color: '#c090f0' },
            { label: 'Est. Monthly', value: `$${stats.estimated_monthly_recurring.toFixed(2)}`, color: '#e8a020' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#0e1014', border: '1px solid #222830', borderRadius: 12,
              padding: '20px 18px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#606878' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Founding earnings row */}
        {stats.founding_conversions > 0 && (
          <div style={{
            background: 'rgba(192,144,240,0.08)', border: '1px solid rgba(192,144,240,0.25)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c090f0' }}>
              Founding Member Earnings
            </span>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: '#c090f0' }}>
              ${stats.founding_earnings.toFixed(2)}
            </span>
          </div>
        )}

        {/* Conversions table */}
        <div style={{ background: '#0e1014', border: '1px solid #222830', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #222830', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#606878' }}>
              Conversion History
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#606878' }}>
              {conversions.length} total
            </div>
          </div>

          {conversions.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#606878', fontSize: 13 }}>
              No conversions yet. Share your link to start earning.
            </div>
          ) : (
            <div>
              {conversions.map((c, i) => {
                const t = tierLabel(c.subscription_tier);
                return (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', borderBottom: i < conversions.length - 1 ? '1px solid #1a1e26' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        background: `${t.color}22`, border: `1px solid ${t.color}55`,
                        borderRadius: 6, padding: '3px 10px',
                        fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: t.color,
                      }}>
                        {t.label}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#606878' }}>
                      {new Date(c.converted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: '#606878', textAlign: 'center', lineHeight: 1.7 }}>
          Earnings are estimated based on current active subscriptions.<br />
          Payouts are processed manually on a biweekly cycle.
        </div>
      </div>
    </div>
  );
}
