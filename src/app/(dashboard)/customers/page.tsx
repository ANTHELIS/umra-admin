"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Search, Filter, MoreVertical, Mail, Phone, Eye, Edit, Ban } from 'lucide-react';

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: "Khalid Hassan",
    email: "khalid@email.com",
    phone: "+91 9876543210",
    package: "Hajj Premium",
    status: "Active",
    savings: 75,
    points: 1240,
    avatar: "K"
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    email: "fatima.z@email.com",
    phone: "+91 8765432109",
    package: "Umrah Economy",
    status: "Inactive",
    savings: 20,
    points: 450,
    avatar: "F"
  }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="muted-text">Manage all platform customers</p>
        </div>
        <button className="btn-primary">
          + Add Customer
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className="card">
          <div className="page-subtitle">Total Customers</div>
          <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0', color: 'var(--color-white)' }}>4,821</div>
          <div className="status-pill success">+12% this month</div>
        </div>
        <div className="card">
          <div className="page-subtitle">Active Savers</div>
          <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0', color: 'var(--color-white)' }}>1,204</div>
          <div className="status-pill warning">₹2.4M saved</div>
        </div>
        <div className="card">
          <div className="page-subtitle">Referral Points Issued</div>
          <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0', color: 'var(--color-white)' }}>84,500</div>
          <div className="status-pill gold">240 Active Promoters</div>
        </div>
      </div>

      <div className="card">
        <div className={styles.tableHeader}>
          <div className={styles.searchBox}>
            <Search size={16} className="gold-text" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              className={styles.searchInput} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn-secondary" style={{ height: '40px', padding: '0 16px' }}>
            <Filter size={16} /> <span style={{ marginLeft: '8px' }}>Filters</span>
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Package</th>
              <th>Savings Progress</th>
              <th>Referral Pts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td>
                  <div className={styles.customerCell}>
                    <div className={styles.avatarMini}>{c.avatar}</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{c.name}</div>
                      <div className="muted-text" style={{ fontSize: '12px' }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td>{c.phone}</td>
                <td>{c.package}</td>
                <td>
                  <div className={styles.progressCell}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${c.savings}%`, background: 'var(--color-success)' }} />
                    </div>
                    <span className="gold-text" style={{ fontSize: '12px', fontWeight: '600' }}>{c.savings}%</span>
                  </div>
                </td>
                <td className="gold-text">{c.points} pts</td>
                <td>
                  <span className={`status-pill ${c.status === 'Active' ? 'success' : 'warning'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => alert(`View ${c.name}`)}><Eye size={16} className="gold-text" /></button>
                    <button className={styles.iconBtn} onClick={() => alert(`Edit ${c.name}`)}><Edit size={16} className="gold-text" /></button>
                    <button className={styles.iconBtn} onClick={() => alert(`Ban ${c.name}`)}><Ban size={16} style={{color: '#E53935'}} /></button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                  No customers found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {filteredCustomers.map(c => (
          <div key={c.id} className={`card ${styles.mobileCard}`}>
            <div className={styles.mobileCardTop}>
              <div className={styles.mobileCustomerInfo}>
                <div className={styles.avatarMini}>{c.avatar}</div>
                <div>
                  <div className={styles.mobileCustomerName}>{c.name}</div>
                  <div className={styles.mobileCustomerEmail}>{c.email}</div>
                </div>
              </div>
              <span className={`status-pill ${c.status === 'Active' ? 'success' : 'warning'}`}>{c.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Phone</span><span style={{color:'var(--color-white)'}}>{c.phone}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Package</span><span style={{color:'var(--color-white)'}}>{c.package}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Savings</span>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div className={styles.progressBar} style={{width:'80px'}}>
                  <div className={styles.progressFill} style={{width:`${c.savings}%`}} />
                </div>
                <span className="gold-text" style={{fontSize:'11px',fontWeight:700}}>{c.savings}%</span>
              </div>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Referral Pts</span><span className="gold-text" style={{fontWeight:600}}>{c.points} pts</span>
            </div>
            <div className={styles.mobileCardActions}>
              <button className={styles.iconBtn} onClick={() => alert(`View ${c.name}`)}><Eye size={16} className="gold-text" /></button>
              <button className={styles.iconBtn} onClick={() => alert(`Edit ${c.name}`)}><Edit size={16} className="gold-text" /></button>
              <button className={styles.iconBtn} onClick={() => alert(`Ban ${c.name}`)}><Ban size={16} style={{color:'#E53935'}} /></button>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div style={{textAlign:'center',padding:'40px',color:'var(--color-muted)'}}>No customers found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
}
