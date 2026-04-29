"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Check, X, Eye, Clock, FileText, FileClock, FileCheck, FileX } from 'lucide-react';

const INITIAL_DOCS = [
  {
    id: 1,
    customer: "Omar Abdullah",
    docType: "Passport",
    bookingId: "#UT-2024-088",
    submittedOn: "2 hours ago",
    status: "Pending Review"
  },
  {
    id: 2,
    customer: "Aisha Rahman",
    docType: "Visa Application",
    bookingId: "#UT-2024-092",
    submittedOn: "5 hours ago",
    status: "Pending Review"
  },
  {
    id: 3,
    customer: "Yusuf Ali",
    docType: "Vaccination Cert",
    bookingId: "#UT-2024-045",
    submittedOn: "1 day ago",
    status: "Pending Review"
  }
];

export default function DocumentVerification() {
  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [activeTab, setActiveTab] = useState("Pending");
  const [pendingRejectId, setPendingRejectId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    alert("Document approved successfully.");
  };

  const handleReject = (id: number) => {
    setPendingRejectId(id); // BUG 8 FIX: was window.confirm
  };

  const confirmReject = () => {
    if (pendingRejectId === null) return;
    setDocuments(documents.filter(doc => doc.id !== pendingRejectId));
    setPendingRejectId(null);
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="muted-text">Review and verify uploaded customer documents</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={`card ${styles.borderGold}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={styles.iconCircle} style={{ background: 'rgba(240, 165, 0, 0.15)', color: 'var(--color-warning)' }}>
            <FileClock size={24} />
          </div>
          <div>
            <div className="page-subtitle">In Queue</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>45</div>
          </div>
        </div>
        <div className={`card ${styles.borderGreen}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={styles.iconCircle} style={{ background: 'rgba(46, 204, 113, 0.15)', color: 'var(--color-success)' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div className="page-subtitle">Approved Today</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>128</div>
          </div>
        </div>
        <div className={`card ${styles.borderRed}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={styles.iconCircle} style={{ background: 'rgba(229, 57, 53, 0.15)', color: 'var(--color-danger)' }}>
            <FileX size={24} />
          </div>
          <div>
            <div className="page-subtitle">Rejected</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
          </div>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.tabs}>
          {["Pending", "Approved", "Rejected"].map(tab => (
            <div 
              key={tab}
              className={activeTab === tab ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {tab === "Pending" && <span className={styles.badge}>{documents.length}</span>}
            </div>
          ))}
        </div>
        <button className="btn-secondary">Batch Download</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer / Booking</th>
                  <th>Document Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "Pending" ? documents.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className={styles.cellMain}>{doc.customer}</div>
                      <div className={styles.cellSub}>{doc.bookingId}</div>
                    </td>
                    <td>
                      <div className={styles.docType}>
                        <FileText size={16} className="gold-text" />
                        <span>{doc.docType}</span>
                      </div>
                    </td>
                    <td className="muted-text">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {doc.submittedOn}
                      </div>
                    </td>
                    <td><span className="status-pill warning">{doc.status}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => alert(`View ${doc.docType}`)}><Eye size={16} className="gold-text" /></button>
                        <button className={styles.actionBtn} onClick={() => handleApprove(doc.id)}><Check size={16} style={{color: '#2ECC71'}} /></button>
                        <button className={styles.actionBtn} onClick={() => handleReject(doc.id)}><X size={16} style={{color: '#E53935'}} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                      No {activeTab.toLowerCase()} documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {activeTab === 'Pending' ? documents.map(doc => (
          <div key={doc.id} className={`card ${styles.mobileCard}`}>
            <div className={styles.mobileCardTop}>
              <div>
                <div style={{fontWeight:600,fontSize:'14px',color:'var(--color-white)'}}>{doc.customer}</div>
                <div style={{fontSize:'12px',color:'var(--color-gold)'}}>{doc.bookingId}</div>
              </div>
              <span className="status-pill warning">{doc.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Document</span>
              <div className={styles.docType} style={{fontSize:'11px'}}>
                <FileText size={12} className="gold-text" /><span>{doc.docType}</span>
              </div>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Submitted</span>
              <span style={{color:'var(--color-white)',display:'flex',alignItems:'center',gap:'4px'}}>
                <Clock size={12} />{doc.submittedOn}
              </span>
            </div>
            <div className={styles.mobileCardActions}>
              <button className={styles.actionBtn} onClick={() => alert(`View ${doc.docType}`)}><Eye size={16} className="gold-text" /></button>
              <button className={styles.actionBtn} onClick={() => handleApprove(doc.id)}><Check size={16} style={{color:'#2ECC71'}} /></button>
              <button className={styles.actionBtn} onClick={() => handleReject(doc.id)}><X size={16} style={{color:'#E53935'}} /></button>
            </div>
          </div>
        )) : (
          <div style={{textAlign:'center',padding:'40px',color:'var(--color-muted)'}}>No {activeTab.toLowerCase()} documents found.</div>
        )}
      </div>

      {/* BUG 8 FIX — Reject Confirmation Modal */}
      {pendingRejectId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '360px', border: '1px solid var(--color-danger)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Reject Document?</h3>
            <p className="muted-text" style={{ fontSize: '13px', marginBottom: '24px' }}>
              This document will be marked as rejected. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setPendingRejectId(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, background: 'var(--color-danger)' }} onClick={confirmReject}>Reject Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
