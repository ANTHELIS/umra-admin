"use client";

import React from 'react';
import { 
  Download, FileText, AlertCircle, 
  Search, Eye, Smartphone, CreditCard as CardIcon
} from 'lucide-react';
import styles from './page.module.css';

const MOCK_TX = [
  { id: "TX-9921", date: "12:45 PM, Today", name: "Ibrahim Ali", type: "Hajj", freq: "Monthly", amount: "₹10,000", method: "AutoPay", status: "Success", franchise: "Al-Noor Travels", city: "Mumbai" },
  { id: "TX-9922", date: "11:30 AM, Today", name: "Omar Farooq", type: "Ziyarat", freq: "Daily", amount: "₹500", method: "UPI", status: "Success", franchise: "ZamZam Tours", city: "Hyderabad" },
  { id: "TX-9923", date: "09:15 AM, Today", name: "Fatima Syed", type: "Hajj", freq: "Monthly", amount: "₹15,000", method: "Card", status: "Failed", franchise: "Al-Noor Travels", city: "Mumbai" },
  { id: "TX-9924", date: "Yesterday", name: "Aisha Khan", type: "Umrah", freq: "Weekly", amount: "₹2,500", method: "Bank Transfer", status: "Pending", franchise: "Direct", city: "Delhi" },
];

export default function SipTransactions() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">SIP Transactions</h1>
          <p className="muted-text">All saving plan payment records</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline-gold">
            <Download size={16} style={{ marginRight: '8px' }} /> Export CSV
          </button>
          <button className="btn-outline-gold">
            <FileText size={16} style={{ marginRight: '8px' }} /> Export PDF
          </button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.borderGreen}`}>
          <div>
            <div className={styles.statLabel}>Total Collected Today</div>
            <div className={styles.statValue}>₹ 45,500</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGold}`}>
          <div>
            <div className={styles.statLabel}>Total Collected This Month</div>
            <div className={styles.statValue}>₹ 12,84,000</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderRed}`}>
          <div>
            <div className={styles.statLabel}>Failed Transactions</div>
            <div className={styles.statValue} style={{ color: 'var(--color-danger)' }}>1</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGreen}`}>
          <div>
            <div className={styles.statLabel}>AutoPay Success Rate</div>
            <div className={styles.statValue}>98.5%</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGold}`}>
          <div>
            <div className={styles.statLabel}>Platform Collections Today</div>
            <div className={styles.statValue}>₹ 12,45,500</div>
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className="muted-text" />
          <input type="text" placeholder="Date Range..." className={styles.searchInput} style={{ width: '150px' }} />
        </div>
        <select className={styles.filterSelect}><option>Plan Type: All</option></select>
        <select className={styles.filterSelect}><option>Method: All</option></select>
        <select className={styles.filterSelect}><option>Status: All</option></select>
        <select className={styles.filterSelect}>
          <option>Franchise: All</option>
          <option>Al-Noor Travels</option>
        </select>
        <select className={styles.filterSelect}>
          <option>City/Region: All</option>
          <option>Mumbai</option>
          <option>Delhi</option>
        </select>
        <button className={styles.resetLink}>Reset</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Customer</th>
              <th>Franchise</th>
              <th>City</th>
              <th>Plan Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TX.map(tx => (
              <React.Fragment key={tx.id}>
                <tr>
                  <td className="mono-text gold-text" style={{ fontSize: '13px' }}>{tx.date}</td>
                  <td style={{ fontWeight: 600 }}>{tx.name}</td>
                  <td className="muted-text">{tx.franchise}</td>
                  <td className="muted-text">{tx.city}</td>
                  <td><span className={`${styles.typePill} ${styles[tx.type.toLowerCase()]}`}>{tx.type}</span></td>
                  <td style={{ fontWeight: 600 }}>{tx.amount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tx.method === 'UPI' ? <Smartphone size={14} className="muted-text"/> : <CardIcon size={14} className="muted-text"/>}
                      <span className="muted-text">{tx.method}</span>
                    </div>
                  </td>
                  <td className="mono-text muted-text">{tx.id}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[tx.status.toLowerCase()]}`}>{tx.status}</span>
                  </td>
                  <td>
                    <button className={styles.actionBtn}><Eye size={16} /></button>
                  </td>
                </tr>
                {/* Expanded row for Failed transaction */}
                {tx.status === 'Failed' && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={10}>
                      <div className={styles.failedDetail}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{tx.name}</span> • {tx.type} Plan • Gateway Error: Insufficient Funds
                        </div>
                        <button className="btn-outline-warning" style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}>Retry Payment</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
          <div className="muted-text" style={{ fontSize: '12px' }}>Showing 1 to 4 of 4 entries</div>
        </div>
      </div>

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {MOCK_TX.map(tx => (
          <div key={tx.id} className={`card ${styles.mobileCard}`}>
            <div className={styles.mobileCardTop}>
              <div>
                <div style={{fontWeight:600,fontSize:'14px',color:'var(--color-white)'}}>{tx.name}</div>
                <div style={{fontSize:'11px',color:'var(--color-muted)'}}>{tx.city} · {tx.franchise}</div>
              </div>
              <span className={`${styles.statusPill} ${styles[tx.status.toLowerCase()]}`}>{tx.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>TX ID</span><span style={{fontFamily:'monospace',color:'var(--color-gold)'}}>{tx.id}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Plan</span>
              <span className={`${styles.typePill} ${styles[tx.type.toLowerCase()]}`}>{tx.type}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Amount</span><span style={{fontWeight:700,color:'var(--color-white)'}}>{tx.amount}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Method</span><span style={{color:'var(--color-muted)'}}>{tx.method}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Time</span><span style={{color:'var(--color-muted)',fontSize:'11px'}}>{tx.date}</span>
            </div>
            {tx.status === 'Failed' && (
              <button className="btn-outline-warning" style={{width:'100%',marginTop:'4px',fontSize:'12px',height:'32px'}}>Retry Payment</button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.alertCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={styles.alertIcon}><AlertCircle size={24} className="danger-text" /></div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-danger)' }}>1 transaction failed today</div>
            <div className="muted-text" style={{ fontSize: '14px', marginTop: '4px' }}>Send reminder to affected customers to update payment methods.</div>
          </div>
        </div>
        <button className="btn-primary" style={{ background: 'var(--color-warning)', color: '#000' }}>Send Reminders</button>
      </div>
    </div>
  );
}
