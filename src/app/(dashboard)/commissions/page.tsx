"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Percent, Award, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { adminApi, showToast } from '@/lib/api';
import styles from './page.module.css';

type ConfigEntry = { key: string; value: any; description?: string; group: string };
const GROUP_ORDER = ['payment', 'franchise', 'general', 'saving'];
const GROUP_LABELS: Record<string, string> = {
  payment: 'Payment Settings',
  franchise: 'Franchise Settings',
  general: 'General Settings',
  saving: 'Saving Plan Settings',
};

export default function Commissions() {
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  // Local editable values for the known commission keys
  const [platformFee, setPlatformFee] = useState(5.0);
  const [franchiseRate, setFranchiseRate] = useState(15.0);
  const [referralReward, setReferralReward] = useState(500);
  const [registrationFee, setRegistrationFee] = useState(25000);

  const fetchConfig = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await adminApi.getConfig();
    if (!mountedRef.current) return;
    const list: ConfigEntry[] = res?.data ?? (Array.isArray(res) ? res : null);
    if (list) {
      setConfigs(list);
      const find = (key: string) => list.find((c) => c.key === key)?.value;
      if (find('payment.platformFee') !== undefined) setPlatformFee(Number(find('payment.platformFee')));
      if (find('franchise.commissionRate') !== undefined) setFranchiseRate(Number(find('franchise.commissionRate')));
      if (find('general.referralReward') !== undefined) setReferralReward(Number(find('general.referralReward')));
      if (find('franchise.registrationFee') !== undefined) setRegistrationFee(Number(find('franchise.registrationFee')));
    } else {
      setError(res?.error ?? 'Failed to load config');
    }
    setLoading(false);
  }, []);

  useEffect(() => { mountedRef.current = true; fetchConfig(); return () => { mountedRef.current = false; }; }, [fetchConfig]);

  const handleSaveConfigs = async () => {
    setSaving(true);
    const updates = [
      { key: 'payment.platformFee', value: platformFee, group: 'payment' as const },
      { key: 'franchise.commissionRate', value: franchiseRate, group: 'franchise' as const },
      { key: 'general.referralReward', value: referralReward, group: 'general' as const },
      { key: 'franchise.registrationFee', value: registrationFee, group: 'franchise' as const },
    ];
    let allOk = true;
    for (const upd of updates) {
      const res = await adminApi.upsertConfig(upd);
      if (res?.error) { allOk = false; break; }
    }
    setSaving(false);
    if (allOk) { showToast('Platform configurations saved!', 'success'); fetchConfig(); }
    else { showToast('Some configs failed to save. Check connection.', 'error'); }
  };

  // Group configs by their group field for display
  const grouped = GROUP_ORDER.reduce<Record<string, ConfigEntry[]>>((acc, g) => {
    acc[g] = configs.filter((c) => c.group === g);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Commission & Config</h1>
          <p className="muted-text">Configure platform-wide commission rates and system settings.</p>
        </div>
        <button className="btn-primary" onClick={handleSaveConfigs} disabled={saving} style={{ gap: '8px' }}>
          {saving ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
          {saving ? 'Saving…' : 'Save Configurations'}
        </button>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {[0, 1].map((i) => <div key={i} className="card" style={{ opacity: 0.4, minHeight: '120px' }} />)}
        </div>
      )}

      {error && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="muted-text">{error}</p>
          <button className="btn-primary" onClick={fetchConfig} style={{ gap: '8px' }}><RefreshCw size={16} /> Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={styles.grid}>
            <div className="card">
              <h2 className={styles.sectionTitle}><Percent size={18} className="gold-text" /> Platform Commissions</h2>
              <div className={styles.inputGroup}>
                <label>Platform Booking Fee (%)</label>
                <input type="number" step="0.1" className="input-field" value={platformFee}
                  onChange={(e) => setPlatformFee(Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                <label>Franchise Commission Rate (%)</label>
                <input type="number" step="0.1" className="input-field" value={franchiseRate}
                  onChange={(e) => setFranchiseRate(Number(e.target.value))} />
              </div>
            </div>
            <div className="card">
              <h2 className={styles.sectionTitle}><Award size={18} className="gold-text" /> Referral & Onboarding</h2>
              <div className={styles.inputGroup}>
                <label>Referral Reward (₹)</label>
                <input type="number" className="input-field" value={referralReward}
                  onChange={(e) => setReferralReward(Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                <label>Franchise Registration Fee (₹)</label>
                <input type="number" className="input-field" value={registrationFee}
                  onChange={(e) => setRegistrationFee(Number(e.target.value))} />
                <p className="muted-text" style={{ fontSize: '12px', marginTop: '4px' }}>One-time onboarding fee</p>
              </div>
            </div>
          </div>

          {/* All Config Entries Grouped */}
          {configs.length > 0 && (
            <div className="card" style={{ marginTop: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>All System Config Entries</h3>
              {GROUP_ORDER.map((group) =>
                grouped[group]?.length > 0 ? (
                  <div key={group} style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>
                      {GROUP_LABELS[group]}
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Key', 'Value', 'Description'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[group].map((c) => (
                          <tr key={c.key}>
                            <td style={{ padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-gold)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{c.key}</td>
                            <td style={{ padding: '10px 12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{String(c.value)}</td>
                            <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--color-muted)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{c.description ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Saving Plan Tiers */}
          <div className="card" style={{ padding: '24px', border: '1px solid var(--border-gold)', borderRadius: '16px', overflowX: 'auto', marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>Saving Plan Tier Management</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', minWidth: '600px' }}>
              {[
                { label: 'Daily', amounts: [100, 200, 500] },
                { label: 'Weekly', amounts: [1000, 2500, 5000] },
                { label: 'Monthly', amounts: [5000, 10000, 25000] },
              ].map(({ label, amounts }, i) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...(i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '24px' } : {}) }}>
                  <div className="muted-text" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                  {amounts.map((amt) => (
                    <div key={amt} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: '#223D2C', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', width: '120px' }}>
                        <span className="gold-text" style={{ marginRight: '4px', fontWeight: 600 }}>₹</span>
                        <input type="number" defaultValue={amt} style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', outline: 'none', width: '100%', fontWeight: 600 }} />
                      </div>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px', fontSize: '16px' }}>×</button>
                    </div>
                  ))}
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600, textAlign: 'left', marginTop: '8px', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Plus size={14} /> Add Tier
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>Save Plan Config</button>
          </div>

          {/* Pool Rules */}
          <div className="card" style={{ padding: '24px', border: '1px solid var(--border-gold)', borderRadius: '16px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>Saving Pool Rules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Max members per pool', control: <input type="number" defaultValue={100} style={{ background: '#0D2318', border: '1px solid var(--border-gold)', borderRadius: '8px', color: 'white', padding: '8px 12px', width: '80px', outline: 'none', textAlign: 'right' as const }} /> },
              ].map(({ label, control }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div className="muted-text" style={{ fontSize: '14px' }}>{label}</div>
                  {control}
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div className="muted-text" style={{ fontSize: '14px' }}>Selection Criteria</div>
                <select style={{ background: '#0D2318', border: '1px solid var(--border-gold)', borderRadius: '8px', color: 'white', padding: '8px 12px', outline: 'none' }}>
                  <option>Completion + First-come-first-served</option>
                  <option>Completion + Random Draw</option>
                  <option>Admin Manual Select</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '32px' }}>Save Pool Config</button>
          </div>
        </>
      )}
    </div>
  );
}
