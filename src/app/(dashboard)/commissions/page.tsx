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
      if (find('PLATFORM_COMMISSION_PERCENTAGE') !== undefined) setPlatformFee(Number(find('PLATFORM_COMMISSION_PERCENTAGE')));
      if (find('FRANCHISE_COMMISSION_PERCENTAGE') !== undefined) setFranchiseRate(Number(find('FRANCHISE_COMMISSION_PERCENTAGE')));
      if (find('REFERRAL_REWARD_AMOUNT') !== undefined) setReferralReward(Number(find('REFERRAL_REWARD_AMOUNT')));
      if (find('FRANCHISE_REGISTRATION_FEE') !== undefined) setRegistrationFee(Number(find('FRANCHISE_REGISTRATION_FEE')));
    } else {
      setError(res?.error ?? 'Failed to load config');
    }
    setLoading(false);
  }, []);

  useEffect(() => { mountedRef.current = true; fetchConfig(); return () => { mountedRef.current = false; }; }, [fetchConfig]);

  const handleSaveConfigs = async () => {
    setSaving(true);
    const updates = [
      { key: 'PLATFORM_COMMISSION_PERCENTAGE', value: platformFee, description: 'Default platform commission on each booking (percentage)', group: 'general' as const },
      { key: 'FRANCHISE_COMMISSION_PERCENTAGE', value: franchiseRate, description: 'Default franchise commission on each booking (percentage)', group: 'franchise' as const },
      { key: 'REFERRAL_REWARD_AMOUNT', value: referralReward, description: 'Reward amount for successful referrals', group: 'general' as const },
      { key: 'FRANCHISE_REGISTRATION_FEE', value: registrationFee, description: 'One-time onboarding fee for franchises', group: 'franchise' as const },
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

  const grouped = GROUP_ORDER.reduce<Record<string, ConfigEntry[]>>((acc, g) => {
    acc[g] = configs.filter((c) => c.group === g);
    return acc;
  }, {});

  return (
    <div className={styles.container}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Commission &amp; Config</h1>
          <p className="muted-text">Configure platform-wide commission rates and system settings.</p>
        </div>
        <button className="btn-primary" onClick={handleSaveConfigs} disabled={saving} style={{ gap: '8px' }}>
          {saving ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
          {saving ? 'Saving…' : 'Save Configurations'}
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className={styles.skeletonGrid}>
          {[0, 1].map((i) => <div key={i} className="card" style={{ opacity: 0.4, minHeight: '120px' }} />)}
        </div>
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="muted-text">{error}</p>
          <button className="btn-primary" onClick={fetchConfig} style={{ gap: '8px' }}><RefreshCw size={16} /> Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Commission Rate Cards ── */}
          <div className={styles.grid}>
            <div className="card">
              <h2 className={styles.sectionTitle}><Percent size={18} className="gold-text" /> Platform Commissions</h2>
              <div className={styles.inputGroup}>
                <label>Platform Booking Fee (%)</label>
                <input type="number" step="0.1" className="input-field" value={platformFee}
                  onChange={(e) => setPlatformFee(Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup}>
                <label>Franchise Commission Rate (%)</label>
                <input type="number" step="0.1" className="input-field" value={franchiseRate}
                  onChange={(e) => setFranchiseRate(Number(e.target.value))} />
              </div>
            </div>

            <div className="card">
              <h2 className={styles.sectionTitle}><Award size={18} className="gold-text" /> Referral &amp; Onboarding</h2>
              <div className={styles.inputGroup}>
                <label>Referral Reward (₹)</label>
                <input type="number" className="input-field" value={referralReward}
                  onChange={(e) => setReferralReward(Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup}>
                <label>Franchise Registration Fee (₹)</label>
                <input type="number" className="input-field" value={registrationFee}
                  onChange={(e) => setRegistrationFee(Number(e.target.value))} />
                <p className="muted-text" style={{ fontSize: '12px' }}>One-time onboarding fee</p>
              </div>
            </div>
          </div>

          {/* ── All Config Entries ── */}
          {configs.length > 0 && (
            <div className={`card ${styles.configCard}`}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>All System Config Entries</h3>
              {GROUP_ORDER.map((group) =>
                grouped[group]?.length > 0 ? (
                  <div key={group} style={{ marginBottom: '24px' }}>
                    <div className={styles.configGroupLabel}>{GROUP_LABELS[group]}</div>

                    {/* Desktop table */}
                    <table className={styles.configTable}>
                      <thead>
                        <tr>
                          {['Key', 'Value', 'Description'].map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[group].map((c) => (
                          <tr key={c.key}>
                            <td className={styles.configKeyCell}>{c.key}</td>
                            <td>{String(c.value)}</td>
                            <td className={styles.configDescCell}>{c.description ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile card list */}
                    <div className={styles.configMobileList}>
                      {grouped[group].map((c) => (
                        <div key={c.key} className={styles.configMobileItem}>
                          <div className={styles.configMobileKey}>{c.key}</div>
                          <div className={styles.configMobileRow}>
                            <span className="muted-text" style={{ fontSize: '11px' }}>Value</span>
                            <span className={styles.configMobileValue}>{String(c.value)}</span>
                          </div>
                          {c.description && (
                            <div className={styles.configMobileDesc}>{c.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* ── Saving Plan Tier Management ── */}
          <div className={`card ${styles.tierCard}`} style={{ border: '1px solid var(--border-gold)', borderRadius: '16px' }}>
            <h3 className={styles.tierCardTitle}>Saving Plan Tier Management</h3>

            <div className={styles.tierGrid}>
              {[
                { label: 'Daily', amounts: [100, 200, 500] },
                { label: 'Weekly', amounts: [1000, 2500, 5000] },
                { label: 'Monthly', amounts: [5000, 10000, 25000] },
              ].map(({ label, amounts }) => (
                <div key={label} className={styles.tierCol}>
                  <div className={styles.tierColLabel}>{label}</div>
                  {amounts.map((amt) => (
                    <div key={amt} className={styles.tierInputRow}>
                      <div className={styles.tierInputBox}>
                        <span className={styles.tierCurrency}>₹</span>
                        <input
                          type="number"
                          defaultValue={amt}
                          className={styles.tierInput}
                        />
                      </div>
                      <button className={styles.tierRemoveBtn} aria-label="Remove tier">×</button>
                    </div>
                  ))}
                  <button className={styles.tierAddBtn}>
                    <Plus size={14} /> Add Tier
                  </button>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>Save Plan Config</button>
          </div>

          {/* ── Saving Pool Rules ── */}
          <div className="card" style={{ border: '1px solid var(--border-gold)', borderRadius: '16px' }}>
            <h3 className={styles.tierCardTitle}>Saving Pool Rules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.poolRuleRow}>
                <div className={styles.poolRuleLabel}>Max members per pool</div>
                <input
                  type="number"
                  defaultValue={100}
                  className={styles.poolInput}
                />
              </div>
              <div className={styles.poolRuleRow}>
                <div className={styles.poolRuleLabel}>Selection Criteria</div>
                <select className={styles.poolSelect}>
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
