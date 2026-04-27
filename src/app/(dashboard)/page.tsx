"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './page.module.css';
import { Users, Calendar, Briefcase, TrendingUp, RefreshCw } from 'lucide-react';
import { superAdminApi, formatINR } from '@/lib/api';

type Stats = {
  totalUsers: number;
  totalBookings: number;
  totalFranchises: number;
  totalRevenue: number;
};

export default function Dashboard() {
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('admin');
  const abortRef = useRef<AbortController | null>(null);

  // BUG 10 FIX — read role from localStorage before fetching analytics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('umrah_role') ?? 'admin';
      setUserRole(role);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    // Only super_admin can call GET /super-admin/analytics
    // Regular admin calling it will get 403 — so skip the call entirely
    const role = typeof window !== 'undefined' ? localStorage.getItem('umrah_role') : null;
    if (role !== 'super_admin') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await superAdminApi.getAnalytics();

    const d = res?.data ?? res;
    if (d && typeof d.totalUsers !== 'undefined') {
      setStats({
        totalUsers:     Number(d.totalUsers)     || 0,
        totalBookings:  Number(d.totalBookings)  || 0,
        totalFranchises:Number(d.totalFranchises)|| 0,
        totalRevenue:   Number(d.totalRevenue)   || 0,
      });
    } else {
      setError(res?.error ?? 'Failed to load analytics');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    return () => abortRef.current?.abort();
  }, [fetchStats]);

  // Build welcome name from localStorage
  const welcomeName = (() => {
    if (typeof window === 'undefined') return 'Admin';
    try {
      const raw = localStorage.getItem('umrah_user');
      if (raw) { 
        const u = JSON.parse(raw); 
        return u.name || u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Admin'; 
      }
    } catch {}
    return 'Admin';
  })();

  const kpis = stats
    ? [
        { title: 'Total Users', value: stats.totalUsers.toLocaleString('en-IN'), change: '+8% this month', icon: Users, isPositive: true },
        { title: 'Total Bookings', value: stats.totalBookings.toLocaleString('en-IN'), change: '+12%', icon: Calendar, isPositive: true },
        { title: 'Active Franchises', value: stats.totalFranchises.toLocaleString('en-IN'), change: '+3 new', icon: Briefcase, isPositive: true },
        { title: 'Total Revenue', value: formatINR(stats.totalRevenue), change: '+18% YoY', icon: TrendingUp, isPositive: true },
      ]
    : null;

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomePattern} />
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeLeft}>
            <h2>Assalamu Alaikum, {welcomeName} 🌙</h2>
            <p>Here&apos;s what&apos;s happening with your platform today.</p>
          </div>
          <div className={styles.welcomeRight}>
            <span className={styles.dateText}>
              {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className={styles.kpiRow}>
        {loading &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.kpiCard} style={{ opacity: 0.5 }}>
              <div style={{ height: '20px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', marginBottom: '16px' }} />
              <div style={{ height: '36px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', width: '60%' }} />
            </div>
          ))}

        {error && !loading && (
          <div
            className="card"
            style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <p className="muted-text">{error}</p>
            <button className="btn-primary" style={{ gap: '8px' }} onClick={fetchStats}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {/* BUG 10 FIX — admin role cannot call /super-admin/analytics (would 403) */}
        {!stats && !loading && !error && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px' }}>
            <p className="muted-text">Analytics dashboard is available to Super Admins only.</p>
            <p className="muted-text" style={{ fontSize: '12px', marginTop: '8px' }}>Contact your Super Admin for platform-wide insights.</p>
          </div>
        )}

        {kpis &&
          kpis.map((kpi, idx) => (
            <div key={idx} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiIconWrapper}>
                  <kpi.icon size={20} className="gold-text" />
                </div>
                <span className={`status-pill ${kpi.isPositive ? 'success' : 'warning'}`}>{kpi.change}</span>
              </div>
              <div className={styles.kpiBody}>
                <span className={styles.kpiTitle}>{kpi.title}</span>
                <span className={styles.kpiValue}>{kpi.value}</span>
              </div>
            </div>
          ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCardLeft}>
          <div className={styles.cardHeader}>
            <h3>Revenue Overview</h3>
            <div className={styles.tabs}>
              <span className={styles.tabActive}>Week</span>
              <span className={styles.tab}>Month</span>
              <span className={styles.tab}>Year</span>
            </div>
          </div>
          <div className={styles.chartPlaceholder}>
            <p className="muted-text">Area Chart Visualization</p>
          </div>
        </div>

        <div className={styles.chartCardRight}>
          <div className={styles.cardHeader}>
            <h3>Booking Split</h3>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.donutPlaceholder}>
              <span>{stats ? stats.totalBookings.toLocaleString('en-IN') : '—'}</span>
              <small>Total</small>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className="card" style={{ flex: 1 }}>
          <div className={styles.cardHeader}>
            <h3>Recent Bookings</h3>
            <button className="gold-text">View All →</button>
          </div>
          {/* TODO: Connect to GET /bookings once backend endpoint is available */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="gold-text">#UT-2024-001</td>
                <td>Khalid Hassan</td>
                <td>Hajj Premium 2025</td>
                <td><span className="status-pill success">Confirmed</span></td>
              </tr>
              <tr>
                <td className="gold-text">#UT-2024-002</td>
                <td>Fatima Al-Zahra</td>
                <td>Umrah Economy</td>
                <td><span className="status-pill warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
