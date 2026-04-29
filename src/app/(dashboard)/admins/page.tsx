"use client";

import React, { useState } from 'react';
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
        <div className={styles.headerText}>
          <h1 className="page-title">Admin Management</h1>
          <p className="muted-text">Oversee and configure system access across regional command centers.</p>
        </div>
        <button className={`btn-primary ${styles.addBtn}`} onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Admin
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={`card ${styles.statCard}`}>
          <div className={`muted-text ${styles.statLabel}`}>Total Admins</div>
          <div className={`${styles.statValue} gold-text`}>{admins.length}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={`muted-text ${styles.statLabel}`}>Active</div>
          <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            {admins.filter((a) => a.status === 'Active').length}
          </div>
        </div>
        <div className={`card ${styles.statCard} ${styles.statCardDanger}`}>
          <div className={`muted-text ${styles.statLabel}`}>Suspended</div>
          <div className={styles.statValue} style={{ color: 'var(--color-danger)' }}>
            {admins.filter((a) => a.status === 'Suspended').length}
          </div>
        </div>
      </div>

      <div className={`card ${styles.tableCard}`}>
        <div className={styles.tableHeader}>
          <div className={styles.searchBox}>
            <Search size={18} className="muted-text" style={{ flexShrink: 0 }} />
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
              <tr><td colSpan={5} className={styles.emptyState}><span className="muted-text">No admins found.</span></td></tr>
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

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {filteredAdmins.length === 0 && (
          <div className={styles.emptyState}>No admins found.</div>
        )}
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className={`card ${styles.mobileCard}`}>
            <div className={styles.mobileCardTop}>
              <div className={styles.userCell}>
                <div className={styles.avatar}>{admin.name.charAt(0)}</div>
                <div style={{ minWidth: 0 }}>
                  <div className={styles.userName}>{admin.name}</div>
                  <div className={styles.userEmail}>{admin.email}</div>
                </div>
              </div>
              <span className={`status-pill ${admin.status === 'Active' ? 'success' : 'danger'}`}>{admin.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Role</span>
              <div className={styles.roleChip}>
                {admin.role === 'super_admin' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                {ROLE_LABELS[admin.role] ?? admin.role}
              </div>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Last Active</span><span style={{color:'var(--color-white)'}}>{admin.lastLogin}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Change Role</span>
              <select
                className={`input-field ${styles.mobileSelect}`}
                value={admin.role}
                onChange={(e) => setPendingRoleChange({ id: admin.id, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="user">User</option>
                <option value="franchise">Franchise (External)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Create Admin Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={`card ${styles.modalCard}`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Admin</h2>
              <button onClick={() => setShowAddModal(false)} className={styles.modalCloseBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateAdmin} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <label className={`muted-text ${styles.formLabel}`}>First Name</label>
                  <input required className="input-field" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} />
                </div>
                <div className={styles.formCol}>
                  <label className={`muted-text ${styles.formLabel}`}>Last Name</label>
                  <input required className="input-field" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={`muted-text ${styles.formLabel}`}>Email</label>
                <input type="email" required className="input-field" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div>
                <label className={`muted-text ${styles.formLabel}`}>Phone</label>
                <input required className="input-field" value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
              </div>
              <div>
                <label className={`muted-text ${styles.formLabel}`}>Password</label>
                <input type="password" required minLength={8} className="input-field" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              </div>
              {createError && (
                <div className={styles.errorMsg}>
                  <AlertCircle size={14} /> {createError}
                </div>
              )}
              <button type="submit" className={`btn-primary ${styles.modalSubmitBtn}`} disabled={creating}>
                {creating ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</> : 'Create Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Role change confirmation modal */}
      {pendingRoleChange && (
        <div className={styles.modalOverlay}>
          <div className={`card ${styles.modalCard} ${styles.modalCenterText}`}>
            <ShieldAlert size={32} style={{ color: 'var(--color-warning)', margin: '0 auto 16px' }} />
            <h3 className={styles.modalConfirmTitle}>Confirm Role Change</h3>
            <p className={`muted-text ${styles.modalConfirmDesc}`}>
              Change role to <strong style={{ color: 'var(--color-gold)' }}>{ROLE_LABELS[pendingRoleChange.role]}</strong>?<br />
              This will immediately affect access permissions.
            </p>
            {(pendingRoleChange.role === 'franchise' || pendingRoleChange.role === 'user') && (
              <p className={styles.modalWarningBox}>
                ⚠ This will <strong>remove admin panel access</strong> from this account.
                {pendingRoleChange.role === 'franchise' && ' Franchise is an external business partner role.'}
              </p>
            )}
            <div className={styles.modalActionRow}>
              <button className={`btn-secondary ${styles.modalBtn}`} onClick={() => setPendingRoleChange(null)} disabled={roleChanging}>Cancel</button>
              <button className={`btn-primary ${styles.modalBtn}`} onClick={confirmRoleChange} disabled={roleChanging}>
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
