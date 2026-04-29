"use client";

import React, { useState } from 'react';
import { History, Search, Download, Filter } from 'lucide-react';
import styles from './page.module.css';

const INITIAL_LOGS = [
  { id: 1, user: "Tariq Al-Mansouri", action: "Commission Config", detail: "Before → After", module: "Settings", time: "10 mins ago", type: "Admin" },
  { id: 2, user: "Ahmed Al-Rashidi", action: "Created Booking", detail: "#UT-2024-001", module: "Mecca Tours", time: "45 mins ago", type: "Franchise" },
  { id: 3, user: "Fatima Siddiqui", action: "Updated Package", detail: "Umrah Premium 2025", module: "Packages", time: "2 hours ago", type: "Critical" },
  { id: 4, user: "Tariq Al-Mansouri", action: "API Keys Updated", detail: "Razorpay Config", module: "Gateways", time: "3 hours ago", type: "Critical" },
  { id: 5, user: "System", action: "Auto-Suspend", detail: "Customer #12430", module: "Al-Madinah", time: "5 hours ago", type: "System" },
];

export default function AuditLogs() {
  const [logs] = useState(INITIAL_LOGS);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="muted-text">Complete record of all platform actions and changes</p>
        </div>
        <button className="btn-secondary">
          <Download size={18} style={{ marginRight: '8px' }} />
          Export Logs
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className="card">
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Actions Today</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-gold)' }}>284</div>
        </div>
        <div className="card">
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Admin Actions</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-white)' }}>142</div>
        </div>
        <div className="card">
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Franchise Actions</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>89</div>
        </div>
        <div className="card" style={{ border: '1px solid rgba(255, 68, 68, 0.3)' }}>
          <div className="muted-text" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>Critical Actions</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-danger)' }}>12</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.searchBox}>
            <Search size={18} className="muted-text" />
            <input type="text" placeholder="Search audit logs..." className={styles.searchInput} />
          </div>
          <button className="btn-secondary" style={{ padding: '0 16px' }}><Filter size={16} style={{ marginRight: '8px' }} /> Filters</button>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User / System</th>
              <th>Action Taken</th>
              <th>Module / Detail</th>
              <th>Timestamp</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.avatar}>{log.user.charAt(0)}</div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{log.user}</div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{log.action}</div>
                  <div className="muted-text" style={{ fontSize: '12px', marginTop: '2px' }}>{log.detail}</div>
                </td>
                <td className="muted-text">{log.module}</td>
                <td className="muted-text" style={{ fontSize: '13px' }}>{log.time}</td>
                <td>
                  <span className={`status-pill ${log.type === 'Critical' ? 'danger' : log.type === 'System' ? 'warning' : 'success'}`}>
                    {log.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: 'var(--color-muted)' }}>
          Showing 1 to 5 of 284 entries
        </div>
      </div>

      {/* Mobile timeline card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {logs.map((log, i) => (
          <div key={log.id} className={styles.mobileCard}>
            <div className={styles.mobileCardLeft}>
              <div className={styles.avatar}>{log.user.charAt(0)}</div>
              {i < logs.length - 1 && <div className={styles.mobileCardLine} />}
            </div>
            <div className={styles.mobileCardBody}>
              <div className={styles.mobileCardAction}>{log.action}</div>
              <div className={styles.mobileCardMeta}>{log.user} · {log.module}</div>
              <div className={styles.mobileCardMeta}>{log.detail}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'4px'}}>
                <span style={{fontSize:'11px',color:'var(--color-muted)'}}>{log.time}</span>
                <span className={`status-pill ${log.type === 'Critical' ? 'danger' : log.type === 'System' ? 'warning' : 'success'}`}>{log.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
