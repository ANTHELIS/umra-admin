"use client";

import React, { useState } from 'react';
import { Wallet, CheckCircle2, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const INITIAL_SETTLEMENTS = [
  { id: 1, name: "Mecca Tours & Travels", amount: "₹ 2,40,000", status: "Due", date: "01 May 2025" },
  { id: 2, name: "Holy Land Tours", amount: "₹ 78,000", status: "Overdue", date: "15 Apr 2025" },
  { id: 3, name: "Al-Madinah Travels", amount: "₹ 1,85,000", status: "Settled", date: "10 Apr 2025" },
  { id: 4, name: "Hajj Services Co", amount: "₹ 1,20,000", status: "Due", date: "01 May 2025" },
];

export default function Settlements() {
  const [settlements] = useState(INITIAL_SETTLEMENTS);
  const [selectedFranchise, setSelectedFranchise] = useState(INITIAL_SETTLEMENTS[0]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className="page-title">Payment Settlements</h1>
          <p className="muted-text">Manage franchise payment settlements and track dues.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`card ${styles.statCard}`}>
          <div className={`muted-text ${styles.statLabel}`}>Total Due</div>
          <div className={`${styles.statValue} gold-text`}>₹4,35,000</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={`muted-text ${styles.statLabel}`}>Already Settled</div>
          <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>₹3,84,00,000</div>
        </div>
        <div className={`card ${styles.statCard} ${styles.statCardDanger}`}>
          <div className={`muted-text ${styles.statLabel}`}>Overdue</div>
          <div className={styles.statValue} style={{ color: 'var(--color-danger)' }}>₹78,000</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={`muted-text ${styles.statLabel}`}>Next Payout Date</div>
          <div className={styles.statValue}>01 May 2025</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={`card ${styles.tableCard}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Franchise / Agency</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payout Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(s => (
                <tr key={s.id} onClick={() => setSelectedFranchise(s)} className={selectedFranchise.id === s.id ? styles.activeRow : ''}>
                  <td className={styles.fw600}>{s.name}</td>
                  <td className={styles.fw700} style={{ color: s.status === 'Settled' ? 'var(--color-success)' : 'var(--color-white)' }}>{s.amount}</td>
                  <td>
                    <span className={`status-pill ${s.status === 'Settled' ? 'success' : s.status === 'Overdue' ? 'danger' : 'warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="muted-text">{s.date}</td>
                  <td>
                    <button className={styles.iconBtn}><ArrowRight size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`card ${styles.sidebarCard}`}>
          <h2 className={styles.sidebarTitle}>Settle Payment</h2>
          <div className={styles.settlePreview}>
            <div className={`muted-text ${styles.previewName}`}>{selectedFranchise.name}</div>
            <div className={`muted-text ${styles.previewLabel}`}>Amount to Settle</div>
            <div className={`${styles.previewAmount} gold-text`}>{selectedFranchise.amount}</div>
          </div>

          <div className={styles.actionButtons}>
            <button className={`btn-primary ${styles.actionBtn}`} disabled={selectedFranchise.status === 'Settled'}>
              {selectedFranchise.status === 'Settled' ? 'Already Settled' : 'Process Settlement'}
            </button>
            <button className={`btn-secondary ${styles.actionBtn}`}>View Ledger</button>
          </div>
        </div>
      </div>

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {settlements.map(s => (
          <div 
            key={s.id} 
            className={`card ${styles.mobileCard} ${selectedFranchise.id === s.id ? styles.mobileCardActive : ''}`} 
            onClick={() => setSelectedFranchise(s)}
          >
            <div className={styles.mobileCardTop}>
              <span className={styles.mobileCardName}>{s.name}</span>
              <span className={`status-pill ${s.status === 'Settled' ? 'success' : s.status === 'Overdue' ? 'danger' : 'warning'}`}>{s.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Amount</span>
              <span className={styles.mobileCardAmount} style={{ color: s.status === 'Settled' ? 'var(--color-success)' : 'var(--color-gold)' }}>{s.amount}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Payout Date</span>
              <span className={styles.mobileCardDate}>{s.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
