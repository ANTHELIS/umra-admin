"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './layout.module.css';
import { getToken } from '@/lib/api';

const ALLOWED_ROLES = ['admin', 'super_admin'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/auth/signin');
      return;
    }

    // BUG 14 FIX — try umrah_role first, fall back to parsing umrah_user JSON
    let role = typeof window !== 'undefined' ? localStorage.getItem('umrah_role') : null;
    if (!role && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('umrah_user');
        if (raw) {
          const user = JSON.parse(raw);
          role = user.role ?? null;
          // Backfill the missing key for future checks
          if (role) localStorage.setItem('umrah_role', role);
        }
      } catch {}
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      router.replace('/auth/signin');
      return;
    }

    setAuthorized(true);
  }, [router]);

  // Show nothing while checking auth to prevent flash of dashboard
  if (!authorized) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-page)',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(201,168,76,0.2)',
          borderTop: '3px solid var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Authenticating…</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className={styles.mainWrapper}>
        <Header onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
