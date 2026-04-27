"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from './layout.module.css';
import { getToken } from '@/lib/api';

const ALLOWED_ROLES = ['admin', 'super_admin'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role  = typeof window !== 'undefined' ? localStorage.getItem('umrah_role') : null;

    if (!token) {
      router.replace('/auth/signin');
      return;
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      // Token exists but role is not allowed (franchise/user somehow got here)
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
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
