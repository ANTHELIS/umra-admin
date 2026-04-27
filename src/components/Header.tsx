"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { checkHealth, clearToken, showToast } from '@/lib/api';
import styles from './Header.module.css';

const ROUTE_MAP: Record<string, { title: string; breadcrumbs: string }> = {
  '/packages':         { title: 'Package Management',       breadcrumbs: 'Admin / Pilgrimage / Packages' },
  '/bookings':         { title: 'Booking Management',       breadcrumbs: 'Admin / Pilgrimage / Bookings' },
  '/saving-plans':     { title: 'Saving Plans',             breadcrumbs: 'Admin / Savings & SIP / Plans' },
  '/saving-pools':     { title: 'Saving Pools',             breadcrumbs: 'Admin / Savings & SIP / Pools' },
  '/sip-transactions': { title: 'SIP Transactions',         breadcrumbs: 'Admin / Savings & SIP / Transactions' },
  '/customers':        { title: 'Customer Management',      breadcrumbs: 'Admin / People / Customers' },
  '/documents':        { title: 'Document Verification',    breadcrumbs: 'Admin / People / Documents' },
  '/admins':           { title: 'Admin Management',         breadcrumbs: 'Admin / People / Admins' },
  '/franchises':       { title: 'Franchise Management',     breadcrumbs: 'Admin / People / Franchises' },
  '/promotions':       { title: 'Promotions & Coupons',     breadcrumbs: 'Admin / Marketing / Promotions' },
  '/notifications':    { title: 'Notifications',            breadcrumbs: 'Admin / Marketing / Notifications' },
  '/reports':          { title: 'Revenue & Reports',        breadcrumbs: 'Admin / Finance / Reports' },
  '/settlements':      { title: 'Payment Settlements',      breadcrumbs: 'Admin / Finance / Settlements' },
  '/commissions':      { title: 'Commission Config',        breadcrumbs: 'Admin / Finance / Commissions' },
  '/payment-gateways': { title: 'Payment Gateway Settings', breadcrumbs: 'Admin / Finance / Gateway' },
  '/settings':         { title: 'System Settings',          breadcrumbs: 'Admin / Platform / Settings' },
  '/audit-logs':       { title: 'Audit Logs',               breadcrumbs: 'Admin / Platform / Audit' },
};

const ROLE_LABELS: Record<string, string> = {
  admin:       'Admin',
  super_admin: 'Super Admin',
};

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();

  const [health,        setHealth]        = useState<'live' | 'issue' | 'checking'>('checking');
  const [userName,      setUserName]      = useState('Admin');
  const [userRole,      setUserRole]      = useState('');
  const [showDropdown,  setShowDropdown]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('umrah_user');
        if (raw) {
          const user = JSON.parse(raw);
          setUserName(user.firstName ?? user.fullName ?? 'Admin');
          setUserRole(user.role ?? '');
        }
      } catch {}
    }
  }, []);

  // Health polling
  useEffect(() => {
    const poll = async () => setHealth(await checkHealth());
    poll();
    intervalRef.current = setInterval(poll, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('umrah_user');
      localStorage.removeItem('umrah_role');
    }
    showToast('Logged out successfully.', 'info');
    router.replace('/auth/signin');
  };

  const route      = Object.entries(ROUTE_MAP).find(([key]) => pathname.includes(key));
  const title      = route?.[1].title      ?? 'Dashboard';
  const breadcrumbs = route?.[1].breadcrumbs ?? 'Admin / Dashboard';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.breadcrumbs}>{breadcrumbs}</span>
      </div>

      <div className={styles.center}>
        <div className={styles.searchPill}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users, bookings, packages..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        {/* Platform health — polls /health every 60s */}
        <div className={styles.statusPill}>
          <span
            className={styles.statusDot}
            style={{
              background: health === 'live' ? 'var(--color-success)' : health === 'issue' ? 'var(--color-danger)' : 'var(--color-warning)',
              animation:  health !== 'live' ? 'pulse 1.2s infinite' : 'none',
            }}
          />
          <span className={styles.statusText}>
            {health === 'checking' ? 'Checking…' : health === 'live' ? 'Live' : 'Issue'}
          </span>
        </div>

        <div className={styles.divider} />

        <button className={styles.notificationBtn}>
          <Bell size={20} />
          <span className={styles.notificationBadge} />
        </button>

        <div className={styles.divider} />

        {/* User dropdown */}
        <div className={styles.userDropdown} ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setShowDropdown((p) => !p)}
          >
            <div className={styles.avatarMini}>{userName.charAt(0).toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className={styles.userName}>{userName}</span>
              {userRole && (
                <span style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 600, lineHeight: 1 }}>
                  {ROLE_LABELS[userRole] ?? userRole}
                </span>
              )}
            </div>
            <ChevronDown size={14} className={styles.chevron} style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }} />
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              background: 'var(--bg-card)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '12px',
              minWidth: '180px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              zIndex: 100,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{userName}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-gold)', marginTop: '2px' }}>
                  {ROLE_LABELS[userRole] ?? userRole}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-danger)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
