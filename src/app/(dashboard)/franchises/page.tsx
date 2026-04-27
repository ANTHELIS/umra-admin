"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, Phone, Mail, FileText, Plus, ArrowUpRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { superAdminApi, showToast, formatINR } from '@/lib/api';
import styles from './page.module.css';

export default function FranchiseManagement() {
  const [franchises, setFranchises] = useState<any[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const mountedRef = useRef(true);

  const getId = (f: any) => f?._id ?? f?.id;

  const fetchFranchises = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await superAdminApi.getFranchises();
    if (!mountedRef.current) return;
    const list: any[] = res?.data ?? (Array.isArray(res) ? res : null);
    if (list) {
      setFranchises(list);
      setSelectedFranchise((prev: any) => {
        if (prev) return list.find((f: any) => getId(f) === getId(prev)) ?? list[0] ?? null;
        return list[0] ?? null;
      });
    } else {
      setError(res?.error ?? 'Failed to load franchises');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchFranchises();
    return () => { mountedRef.current = false; };
  }, [fetchFranchises]);

  const handleApprove = async () => {
    if (!selectedFranchise || actionLoading) return;
    setActionLoading(true);
    const res = await superAdminApi.approveFranchise(getId(selectedFranchise));
    setActionLoading(false);
    if (res?.error) { showToast(`Approval failed: ${res.error}`, 'error'); }
    else { showToast('Franchise approved successfully!', 'success'); fetchFranchises(); }
  };

  const handleToggleStatus = async () => {
    if (!selectedFranchise || actionLoading) return;
    const current = (selectedFranchise.status ?? '').toLowerCase();
    const newStatus = current === 'active' ? 'suspended' : 'active';
    // Optimistic update
    const optimistic = (list: any[]) => list.map((f) => getId(f) === getId(selectedFranchise) ? { ...f, status: newStatus } : f);
    setFranchises((p) => optimistic(p));
    setSelectedFranchise((p: any) => ({ ...p, status: newStatus }));

    setActionLoading(true);
    const res = await superAdminApi.updateFranchiseStatus(getId(selectedFranchise), newStatus as 'active' | 'suspended');
    setActionLoading(false);
    if (res?.error) {
      showToast(`Status update failed: ${res.error}`, 'error');
      const revert = (list: any[]) => list.map((f) => getId(f) === getId(selectedFranchise) ? { ...f, status: current } : f);
      setFranchises((p) => revert(p));
      setSelectedFranchise((p: any) => ({ ...p, status: current }));
    } else {
      showToast(`Franchise ${newStatus === 'active' ? 'activated' : 'suspended'}.`, 'success');
    }
  };

  const totalCount = franchises.length;
  const activeCount = franchises.filter((f) => (f.status ?? '').toLowerCase() === 'active').length;
  const pendingCount = franchises.filter((f) => (f.status ?? '').toLowerCase() === 'pending').length;
  const suspendedCount = franchises.filter((f) => (f.status ?? '').toLowerCase() === 'suspended').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Franchise Management</h1>
          <p className="muted-text">Manage and monitor all franchise partners across regions.</p>
        </div>
        <button className="btn-primary" onClick={fetchFranchises} disabled={loading} style={{ gap: '8px' }}>
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Total Franchises', val: totalCount, color: 'var(--color-gold)' },
          { label: 'Pending Approval', val: pendingCount, color: 'var(--color-warning)' },
          { label: 'Active', val: activeCount, color: 'var(--color-success)' },
          { label: 'Suspended', val: suspendedCount, color: 'var(--color-danger)' },
        ].map(({ label, val, color }) => (
          <div className="card" key={label}>
            <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color }}>{loading ? '—' : val}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ opacity: 0.4, minHeight: '120px' }} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="muted-text">{error}</p>
          <button className="btn-primary" onClick={fetchFranchises} style={{ gap: '8px' }}><RefreshCw size={16} /> Retry</button>
        </div>
      )}

      {!loading && !error && franchises.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="muted-text">No franchise partners found.</p>
        </div>
      )}

      {!loading && !error && franchises.length > 0 && (
        <div className={styles.mainContent}>
          <div className={styles.listSection}>
            <div className={styles.gridCards}>
              {franchises.map((f, idx) => {
                const isSelected = getId(f) === getId(selectedFranchise);
                const statusLower = (f.status ?? 'pending').toLowerCase();
                return (
                  <div
                    key={getId(f) ?? idx}
                    className={`card ${styles.franchiseCard} ${isSelected ? styles.selectedCard : ''}`}
                    onClick={() => setSelectedFranchise(f)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{f.name ?? f.businessName ?? 'Franchise'}</h3>
                        <div className="muted-text" style={{ fontSize: '13px', marginTop: '4px' }}>{f.city ?? f.location ?? '—'}</div>
                      </div>
                      <span className={`status-pill ${statusLower === 'active' ? 'success' : statusLower === 'suspended' ? 'danger' : 'warning'}`}>
                        {f.status ?? 'Pending'}
                      </span>
                    </div>
                    <div className={styles.metricsGrid}>
                      <div>
                        <div className="muted-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Customers</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>{f.totalCustomers?.toLocaleString('en-IN') ?? '—'}</div>
                      </div>
                      <div>
                        <div className="muted-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Bookings</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {f.totalBookings?.toLocaleString('en-IN') ?? '—'}
                          {f.totalBookings > 0 && <ArrowUpRight size={14} className="gold-text" />}
                        </div>
                      </div>
                    </div>
                    {f.totalCommission !== undefined && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="muted-text" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Commission Earned</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-gold)', marginTop: '4px' }}>{formatINR(f.totalCommission)}</div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className={`card ${styles.onboardCard}`}>
                <div className={styles.iconCircle}><Plus size={24} className="gold-text" /></div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '16px' }}>Onboard New Partner</h3>
                <p className="muted-text" style={{ fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
                  {/* TODO: POST /super-admin/franchises once backend endpoint is available */}
                  Send an invite link or manually create a franchise account.
                </p>
              </div>
            </div>
          </div>

          {selectedFranchise && (
            <div className={styles.detailsSection}>
              <div className="card" style={{ position: 'sticky', top: '24px' }}>
                <div className={styles.detailsHeader}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedFranchise.name ?? selectedFranchise.businessName ?? 'Franchise'}</h2>
                    <div className="muted-text" style={{ fontSize: '13px', marginTop: '4px' }}>ID: {getId(selectedFranchise) ?? 'N/A'}</div>
                  </div>
                  <div className={styles.commissionBadge}>{selectedFranchise.commissionRate ? `${selectedFranchise.commissionRate}% Rate` : '15% Rate'}</div>
                </div>
                <div className={styles.detailsBody}>
                  {[
                    { Icon: Building2, label: 'Primary Owner', value: selectedFranchise.ownerName ?? selectedFranchise.owner ?? '—' },
                    { Icon: Phone, label: 'Contact', value: selectedFranchise.phone ?? selectedFranchise.contactPhone ?? '—' },
                    { Icon: Mail, label: 'Email Address', value: selectedFranchise.email ?? '—' },
                    { Icon: FileText, label: 'Tax / GST Number', value: selectedFranchise.gstNumber ?? selectedFranchise.gst ?? '—' },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className={styles.infoRow}>
                      <div className={styles.infoIcon}><Icon size={16} /></div>
                      <div>
                        <div className="muted-text" style={{ fontSize: '12px' }}>{label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.detailsFooter}>Approved by: {selectedFranchise.approvedBy ?? 'Pending'}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button className="btn-primary" style={{ flex: 1, gap: '6px' }} onClick={handleApprove} disabled={actionLoading}>
                    <CheckCircle size={16} />{actionLoading ? 'Processing…' : 'Approve'}
                  </button>
                  <button className="btn-outline-warning" style={{ flex: 1 }} onClick={handleToggleStatus} disabled={actionLoading}>
                    {(selectedFranchise.status ?? '').toLowerCase() === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
                <button className="btn-secondary" style={{ width: '100%', marginTop: '12px' }}>Manage Permissions</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
