"use client";

import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, Search, Plus, X, RefreshCw, AlertCircle } from 'lucide-react';
import { superAdminApi, showToast } from '@/lib/api';
import styles from './page.module.css';

// NOTE: No GET /super-admin/admins endpoint exists yet.
// TODO: Replace INITIAL_ADMINS with live data once backend provides GET endpoint.
const INITIAL_ADMINS = [
  { id: '1', name: 'Fatima Al-Zahra', email: 'fatima@umrahtravel.com', role: 'super_admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: '2', name: 'Omar Hassan', email: 'omar.h@umrahtravel.com', role: 'admin', status: 'Active', lastLogin: '1 hour ago' },
  { id: '3', name: 'Tariq Al-Mansouri', email: 'tariq@umrahtravel.com', role: 'admin', status: 'Suspended', lastLogin: '3 days ago' },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
  franchise: 'Franchise',
};

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>(INITIAL_ADMINS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Role change confirmation
  const [pendingRoleChange, setPendingRoleChange] = useState<{ id: string; role: string } | null>(null);
  const [roleChanging, setRoleChanging] = useState(false);

  const filteredAdmins = admins.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    const res = await superAdminApi.createAdmin(newAdmin);
    setCreating(false);
    if (res?.error) {
      setCreateError(res.error);
    } else {
      showToast('Admin account created successfully!', 'success');
      setShowAddModal(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', phone: '', password: '' });
      // TODO: refresh admin list once GET endpoint exists
    }
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    setRoleChanging(true);
    const res = await superAdminApi.updateUserRole(pendingRoleChange.id, pendingRoleChange.role as any);
    setRoleChanging(false);
    if (res?.error) {
      showToast(`Role update failed: ${res.error}`, 'error');
    } else {
      showToast('User role updated successfully.', 'success');
      setAdmins((prev) => prev.map((a) => a.id === pendingRoleChange.id ? { ...a, role: pendingRoleChange.role } : a));
    }
    setPendingRoleChange(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Admin Management</h1>
          <p className="muted-text">Oversee and configure system access across regional command centers.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ gap: '8px' }}>
          <Plus size={18} /> Add New Admin
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className="card">
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Admins</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-gold)' }}>{admins.length}</div>
        </div>
        <div className="card">
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Active</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>
            {admins.filter((a) => a.status === 'Active').length}
          </div>
        </div>
        <div className="card" style={{ border: '1px solid rgba(255, 68, 68, 0.3)' }}>
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Suspended</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-danger)' }}>
            {admins.filter((a) => a.status === 'Suspended').length}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className={styles.searchBox}>
            <Search size={18} className="muted-text" />
            <input
              type="text"
              placeholder="Search admins by name or email..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Admin Details</th>
              <th>Role Permissions</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}><span className="muted-text">No admins found.</span></td></tr>
            )}
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>{admin.name.charAt(0)}</div>
                    <div>
                      <div className={styles.userName}>{admin.name}</div>
                      <div className={styles.userEmail}>{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.roleChip}>
                    {admin.role === 'super_admin' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                    {ROLE_LABELS[admin.role] ?? admin.role}
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${admin.status === 'Active' ? 'success' : 'danger'}`}>{admin.status}</span>
                </td>
                <td className="muted-text" style={{ fontSize: '13px' }}>{admin.lastLogin}</td>
                <td>
                  <select
                    className="input-field"
                    style={{ padding: '4px 8px', height: '32px', width: '160px' }}
                    value={admin.role}
                    onChange={(e) => setPendingRoleChange({ id: admin.id, role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="user">User</option>
                    <option value="franchise">Franchise (External Partner)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '420px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Create New Admin</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label className="muted-text" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>First Name</label>
                  <input required className="input-field" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="muted-text" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>Last Name</label>
                  <input required className="input-field" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="muted-text" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>Email</label>
                <input type="email" required className="input-field" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div>
                <label className="muted-text" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>Phone</label>
                <input required className="input-field" value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
              </div>
              <div>
                <label className="muted-text" style={{ fontSize: '12px', marginBottom: '6px', display: 'block' }}>Password</label>
                <input type="password" required minLength={8} className="input-field" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              </div>
              {createError && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-danger)', fontSize: '13px' }}>
                  <AlertCircle size={14} /> {createError}
                </div>
              )}
              <button type="submit" className="btn-primary" style={{ marginTop: '8px', gap: '8px' }} disabled={creating}>
                {creating ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</> : 'Create Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Role change confirmation modal */}
      {pendingRoleChange && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '380px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
            <ShieldAlert size={32} style={{ color: 'var(--color-warning)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Confirm Role Change</h3>
            <p className="muted-text" style={{ fontSize: '13px', marginBottom: '16px' }}>
              Change role to <strong style={{ color: 'var(--color-gold)' }}>{ROLE_LABELS[pendingRoleChange.role]}</strong>?<br />
              This will immediately affect access permissions.
            </p>
            {/* BUG 6 FIX — warn when downgrading to non-admin role */}
            {(pendingRoleChange.role === 'franchise' || pendingRoleChange.role === 'user') && (
              <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginBottom: '16px', background: 'rgba(229,57,53,0.1)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(229,57,53,0.3)' }}>
                ⚠ This will <strong>remove admin panel access</strong> from this account.
                {pendingRoleChange.role === 'franchise' && ' Franchise is an external business partner role.'}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setPendingRoleChange(null)} disabled={roleChanging}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, gap: '8px' }} onClick={confirmRoleChange} disabled={roleChanging}>
                {roleChanging ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
