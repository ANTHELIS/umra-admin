"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Search, ChevronDown, Eye, Check, X } from 'lucide-react';

const INITIAL_BOOKINGS = [
  {
    id: 1,
    bookingId: "#UT-2024-001",
    customerName: "Khalid Hassan",
    initials: "K",
    package: "Hajj Premium",
    date: "05 Jun 2025",
    travelers: 2,
    amount: "₹3,70,000",
    paymentStatus: "Paid",
    docStatus: "Verified"
  },
  {
    id: 2,
    bookingId: "#UT-2024-002",
    customerName: "Fatima Al-Zahra",
    initials: "F",
    package: "Umrah Economy",
    date: "12 Jun 2025",
    travelers: 1,
    amount: "₹65,000",
    paymentStatus: "Pending",
    docStatus: "Pending"
  }
];

export default function BookingManagement() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRejectId, setPendingRejectId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, paymentStatus: 'Paid', docStatus: 'Verified' } : b
    ));
  };

  const handleReject = (id: number) => {
    setPendingRejectId(id); // BUG 7 FIX: was window.confirm
  };

  const confirmReject = () => {
    if (pendingRejectId === null) return;
    setBookings(bookings.filter(b => b.id !== pendingRejectId));
    setPendingRejectId(null);
  };

  const filteredBookings = bookings.filter(b => 
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.searchPill}>
          <Search size={16} className="gold-text" />
          <input 
            type="text" 
            placeholder="Search booking ID, customer..." 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.dropdown}>
          <span>All Status</span>
          <ChevronDown size={14} className="gold-text" />
        </div>
        
        <div className={styles.dropdown}>
          <span>All Packages</span>
          <ChevronDown size={14} className="gold-text" />
        </div>
        
        <div className={styles.dropdown}>
          <span>All Payments</span>
          <ChevronDown size={14} className="gold-text" />
        </div>
        
        <button className="gold-text" onClick={() => setSearchTerm("")}>Reset</button>
      </div>

      <div className="card">
        <div className={styles.tableHeader}>
          <h3>All Bookings</h3>
          <span className="status-pill warning">{filteredBookings.length}</span>
          <div style={{ flex: 1 }} />
          <button className="gold-text" onClick={() => alert("Downloading CSV...")}>Export CSV</button>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Travel Date</th>
              <th>Travelers</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Docs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, index) => (
              <tr key={b.id}>
                <td>{index + 1}</td>
                <td className="gold-text">{b.bookingId}</td>
                <td>
                  <div className={styles.customerCell}>
                    <div className={styles.avatarMini}>{b.initials}</div>
                    <span>{b.customerName}</span>
                  </div>
                </td>
                <td>{b.package}</td>
                <td>{b.date}</td>
                <td>{b.travelers}</td>
                <td>{b.amount}</td>
                <td>
                  <span className={`status-pill ${b.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${b.docStatus === 'Verified' ? 'success' : 'warning'}`}>
                    {b.docStatus}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => alert(`Viewing details for ${b.bookingId}`)}><Eye size={16} className="gold-text" /></button>
                    {b.paymentStatus === 'Pending' && (
                      <>
                        <button className={styles.iconBtn} onClick={() => handleApprove(b.id)}><Check size={16} style={{color: '#2ECC71'}} /></button>
                        <button className={styles.iconBtn} onClick={() => handleReject(b.id)}><X size={16} style={{color: '#E53935'}} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                  No bookings match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BUG 7 FIX — Reject Confirmation Modal (replaces window.confirm) */}
      {pendingRejectId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '360px', border: '1px solid var(--color-danger)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Cancel Booking?</h3>
            <p className="muted-text" style={{ fontSize: '13px', marginBottom: '24px' }}>
              This action cannot be undone. The booking will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setPendingRejectId(null)}>Keep Booking</button>
              <button className="btn-primary" style={{ flex: 1, background: 'var(--color-danger)' }} onClick={confirmReject}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
