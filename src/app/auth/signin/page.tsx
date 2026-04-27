"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { adminApi, setToken, showToast } from '@/lib/api';

const ALLOWED_ROLES = ['admin', 'super_admin'];

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    const res = await adminApi.login(email.trim(), password);
    setLoading(false);

    // Network / server error
    if (res?.error || res?.status === 'error') {
      setError(res?.message ?? res?.error ?? 'Login failed. Please try again.');
      return;
    }

    // Extract data from { status: 'success', message: '...', data: { user, tokens } }
    const user   = res?.data?.user   ?? res?.user;
    const tokens = res?.data?.tokens ?? res?.tokens;

    if (!user || !tokens?.accessToken) {
      setError('Unexpected response from server. Please try again.');
      return;
    }

    const role: string = user.role ?? '';

    // Block non-admin roles
    if (!ALLOWED_ROLES.includes(role)) {
      setError(
        role === 'franchise'
          ? 'Franchise partners do not have access to the Admin Panel. Please use the Franchise Portal.'
          : 'Your account does not have admin access. Contact your Super Admin.'
      );
      return;
    }

    // Persist token + user info
    setToken(tokens.accessToken);
    if (typeof window !== 'undefined') {
      const parsedName = user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin';
      localStorage.setItem('umrah_user', JSON.stringify({
        id:        user.id ?? user._id,
        firstName: user.firstName || (parsedName.split(' ')[0]),
        lastName:  user.lastName || (parsedName.split(' ').slice(1).join(' ')),
        email:     user.email,
        role:      user.role,
        fullName:  parsedName,
        name:      parsedName,
      }));
      localStorage.setItem('umrah_role', role);
    }

    const welcomeName = user.name || user.firstName || 'Admin';
    showToast(`Welcome back, ${welcomeName}! 🌙`, 'success');
    router.replace('/');
  };

  return (
    <div className={styles.authCard}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.logoMini}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <h2 className={styles.title}>Umrah Travel</h2>
        <span className={styles.subtitle}>Admin &amp; Super Admin Panel</span>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleLogin} noValidate>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@umrahtravel.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="password">Password</label>
          </div>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className={styles.inputIconRight}
              tabIndex={-1}
              aria-label="Toggle password visibility"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(122,26,26,0.3)',
            border: '1px solid rgba(255,68,68,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#FF8080',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div className={styles.divider} />

      {/* Role info pills */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { role: 'Admin',       color: '#2DB966', bg: 'rgba(45,185,102,0.1)' },
          { role: 'Super Admin', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)' },
        ].map(({ role, color, bg }) => (
          <span key={role} style={{ fontSize: '11px', fontWeight: 600, color, background: bg, border: `1px solid ${color}44`, borderRadius: '50px', padding: '3px 10px' }}>
            {role}
          </span>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <Lock size={12} className="gold-text" />
        <span className={styles.secureText}>Secured with SSL Encryption</span>
      </div>
    </div>
  );
}
