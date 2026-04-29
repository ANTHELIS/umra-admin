"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Grid, Briefcase, CalendarCheck, Users,
  FileCheck, Tag, Bell, LogOut, ShieldAlert,
  Building2, BarChart3, CreditCard, Landmark, Percent,
  ClipboardList, Settings, PiggyBank, UsersRound, ArrowRightLeft, X
} from 'lucide-react';
import { clearToken, showToast } from '@/lib/api';
import styles from './Sidebar.module.css';

// Nav items visible to ALL admin roles
const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [{ name: "Dashboard", href: "/", icon: Grid }]
  },
  {
    label: "PILGRIMAGE",
    items: [
      { name: "Package Management",  href: "/packages", icon: Briefcase },
      { name: "Booking Management",  href: "/bookings", icon: CalendarCheck }
    ]
  },
  {
    label: "SAVINGS & SIP",
    items: [
      { name: "Saving Plans",    href: "/saving-plans",     icon: PiggyBank },
      { name: "Saving Pools",    href: "/saving-pools",     icon: UsersRound },
      { name: "SIP Transactions",href: "/sip-transactions", icon: ArrowRightLeft }
    ]
  },
  {
    label: "PEOPLE",
    items: [
      { name: "Customer Management", href: "/customers",  icon: Users },
      { name: "Document Verification", href: "/documents", icon: FileCheck }
    ]
  },
  {
    label: "MARKETING",
    items: [
      { name: "Promotions & Coupons", href: "/promotions",    icon: Tag },
      { name: "Notifications",        href: "/notifications", icon: Bell }
    ]
  },
  {
    label: "FINANCE",
    items: [
      { name: "Commission Config", href: "/commissions", icon: Percent }
    ]
  }
];

// Additional nav items ONLY for super_admin role
const SUPER_ADMIN_GROUPS = [
  {
    label: "PLATFORM CONTROL",
    items: [
      { name: "Admin Management",    href: "/admins",     icon: ShieldAlert },
      { name: "Franchise Management",href: "/franchises", icon: Building2 }
    ]
  },
  {
    label: "FINANCE",
    items: [
      { name: "Revenue & Reports",       href: "/reports",          icon: BarChart3 },
      { name: "Payment Gateways",        href: "/payment-gateways", icon: CreditCard },
      { name: "Payment Settlements",     href: "/settlements",      icon: Landmark }
    ]
  },
  {
    label: "PLATFORM",
    items: [
      { name: "Audit Logs",      href: "/audit-logs", icon: ClipboardList },
      { name: "System Settings", href: "/settings",   icon: Settings }
    ]
  }
];

const ROLE_LABELS: Record<string, string> = {
  admin:       'Admin',
  super_admin: 'Super Admin',
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  const [userName,    setUserName]    = useState('Admin');
  const [userRole,    setUserRole]    = useState('admin');
  const [userInitial, setUserInitial] = useState('A');

  // BUG 2 FIX — read real role from localStorage, never use a toggle
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('umrah_user');
      if (raw) {
        const user = JSON.parse(raw);
        const parsedName = user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin';
        const role = user.role ?? 'admin';
        setUserName(parsedName);
        setUserRole(role);
        setUserInitial(parsedName.charAt(0).toUpperCase());
      }
    } catch {}
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isSuperAdmin = userRole === 'super_admin';
  const rawGroups = isSuperAdmin ? [...NAV_GROUPS, ...SUPER_ADMIN_GROUPS] : NAV_GROUPS;

  const activeNavGroups = rawGroups.reduce((acc, curr) => {
    const existing = acc.find(g => g.label === curr.label);
    if (existing) {
      existing.items.push(...curr.items);
    } else {
      acc.push({ ...curr, items: [...curr.items] });
    }
    return acc;
  }, [] as typeof rawGroups);

  const handleLogout = () => {
    clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('umrah_user');
      localStorage.removeItem('umrah_role');
    }
    showToast('Logged out successfully.', 'info');
    router.replace('/auth/signin');
  };

  const sidebarContent = (
    <>
      <div className={styles.patternOverlay} />

      <div className={styles.topSection}>
        <div className={styles.logoContainer} style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/logo.png"
            alt="Umrah Travel Logo"
            width={140}
            height={40}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Role badge — read-only, shows REAL role from localStorage */}
        <div style={{
          marginTop: '16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          background: 'rgba(0,0,0,0.2)', padding: '10px 12px',
          borderRadius: '12px', border: '1px solid rgba(201,168,76,0.2)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Signed in as</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: isSuperAdmin ? 'var(--color-gold)' : 'var(--color-success)' }}>
            {ROLE_LABELS[userRole] ?? userRole}
          </span>
        </div>
      </div>

      <nav className={styles.navContainer}>
        {activeNavGroups.map((group, idx) => (
          <div key={group.label} className={styles.navGroup}>
            {idx !== 0 && <div className={styles.groupSeparator} />}
            <span className={styles.groupLabel}>{group.label}</span>
            <div className={styles.groupItems}>
              {group.items.map(item => {
                // BUG 3 FIX for active detection — exact match for '/', startsWith for others
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    onClick={onMobileClose}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom pinned user section — shows REAL user data */}
      <div className={styles.bottomPinned}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{userInitial}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>{ROLE_LABELS[userRole] ?? userRole}</span>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar (always visible on desktop) ── */}
      <aside className={styles.sidebar}>
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer Overlay (only on mobile) ── */}
      {/* Backdrop */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        {/* Close button inside drawer */}
        <button
          className={styles.drawerCloseBtn}
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
