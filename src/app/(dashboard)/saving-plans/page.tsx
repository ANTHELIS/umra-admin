"use client";

import React, { useState } from 'react';
import { 
  Download, TrendingUp, IndianRupee, AlertCircle, CheckCircle, 
  Search, Eye, X, Repeat
} from 'lucide-react';
import styles from './page.module.css';

const MOCK_PLANS = [
  { id: 1, name: "Ibrahim Ali", type: "Hajj", freq: "Monthly", amount: "₹10,000", saved: "₹1,20,000", target: "₹4,00,000", progress: 30, due: "Tomorrow", status: "Active", franchise: "Al-Noor Travels", city: "Mumbai" },
  { id: 2, name: "Aisha Khan", type: "Umrah", freq: "Weekly", amount: "₹2,500", saved: "₹85,000", target: "₹1,00,000", progress: 85, due: "Overdue", status: "Defaulted", franchise: "Direct", city: "Delhi" },
  { id: 3, name: "Omar Farooq", type: "Ziyarat", freq: "Daily", amount: "₹500", saved: "₹60,000", target: "₹60,000", progress: 100, due: "-", status: "Completed", franchise: "ZamZam Tours", city: "Hyderabad" },
  { id: 4, name: "Fatima Syed", type: "Hajj", freq: "Monthly", amount: "₹15,000", saved: "₹1,80,000", target: "₹5,00,000", progress: 36, due: "15 May 2025", status: "Paused", franchise: "Al-Noor Travels", city: "Mumbai" },
];

export default function SavingPlans() {
  const [plans] = useState(MOCK_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<typeof MOCK_PLANS[0] | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Saving Plans</h1>
          <p className="muted-text">Monitor all customer pilgrimage saving plans</p>
        </div>
        <button className="btn-outline-gold">
          <Download size={16} style={{ marginRight: '8px' }} />
          Export Report
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.borderGreen}`}>
          <div className={styles.statIcon}><TrendingUp size={20} className="success-text" /></div>
          <div>
            <div className={styles.statLabel}>Total Active Plans</div>
            <div className={styles.statValue}>3,840</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGold}`}>
          <div className={styles.statIcon}><IndianRupee size={20} className="gold-text" /></div>
          <div>
            <div className={styles.statLabel}>Total Saved Amount</div>
            <div className={styles.statValue}>₹2,84,50,000</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderAmber}`}>
          <div className={styles.statIcon}><AlertCircle size={20} className="warning-text" /></div>
          <div>
            <div className={styles.statLabel}>Missed Payments This Month</div>
            <div className={styles.statValue}>142</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGreen}`}>
          <div className={styles.statIcon}><CheckCircle size={20} className="success-text" /></div>
          <div>
            <div className={styles.statLabel}>Plans Completed</div>
            <div className={styles.statValue}>28</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.borderGold}`}>
          <div className={styles.statIcon}><TrendingUp size={20} className="gold-text" /></div>
          <div>
            <div className={styles.statLabel}>Platform-wide SIP Volume</div>
            <div className={styles.statValue}>₹4,12,00,000</div>
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className="muted-text" />
          <input type="text" placeholder="Search customer name / phone" className={styles.searchInput} />
        </div>
        <select className={styles.filterSelect}>
          <option>Plan Type: All</option>
          <option>Hajj</option>
          <option>Umrah</option>
          <option>Ziyarat</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Frequency: All</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Status: All</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Completed</option>
          <option>Defaulted</option>
        </select>
        <select className={styles.filterSelect}>
          <option>City/Region: All</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Hyderabad</option>
        </select>
        <select className={styles.filterSelect}>
          <option>Franchise: All</option>
          <option>Al-Noor Travels</option>
          <option>ZamZam Tours</option>
        </select>
        <button className={styles.resetLink}>Reset Filters</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Franchise</th>
              <th>City</th>
              <th>Plan Type</th>
              <th>Frequency</th>
              <th>Amount/Period</th>
              <th>Total Saved</th>
              <th>Target</th>
              <th>Progress</th>
              <th>Next Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                <td>
                  <div className={styles.customerCell}>
                    <div className={styles.avatar}>{p.name.charAt(0)}</div>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </div>
                </td>
                <td className="muted-text">{p.franchise}</td>
                <td className="muted-text">{p.city}</td>
                <td><span className={`${styles.typePill} ${styles[p.type.toLowerCase()]}`}>{p.type}</span></td>
                <td className="muted-text">{p.freq}</td>
                <td style={{ fontWeight: 600 }}>{p.amount}</td>
                <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{p.saved}</td>
                <td className="muted-text">{p.target}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ 
                        width: `${p.progress}%`, 
                        background: p.progress === 100 ? 'var(--color-success)' : 'var(--color-gold)' 
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: p.progress === 100 ? 'var(--color-success)' : 'var(--color-gold)' }}>
                      {p.progress}%
                    </span>
                  </div>
                </td>
                <td style={{ 
                  color: p.due === 'Overdue' ? 'var(--color-danger)' : p.due === 'Tomorrow' ? 'var(--color-warning)' : 'var(--color-white)',
                  fontWeight: p.due !== '-' ? 600 : 400
                }}>{p.due}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[p.status.toLowerCase()]}`}>{p.status}</span>
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={() => setSelectedPlan(p)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — hidden on desktop via CSS */}
      <div className={styles.mobileCardList}>
        {plans.map(p => (
          <div key={p.id} className={`card ${styles.mobileCard}`} onClick={() => setSelectedPlan(p)}>
            <div className={styles.mobileCardTop}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div className={styles.avatar}>{p.name.charAt(0)}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:'14px'}}>{p.name}</div>
                  <div style={{fontSize:'11px',color:'var(--color-muted)'}}>{p.city} · {p.franchise}</div>
                </div>
              </div>
              <span className={`${styles.statusPill} ${styles[p.status.toLowerCase()]}`}>{p.status}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Plan</span>
              <span className={`${styles.typePill} ${styles[p.type.toLowerCase()]}`}>{p.type} · {p.freq}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Saved / Target</span>
              <span style={{color:'var(--color-success)',fontWeight:600}}>{p.saved} / {p.target}</span>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Progress</span>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{width:`${p.progress}%`,background:p.progress===100?'var(--color-success)':'var(--color-gold)'}} />
                </div>
                <span style={{fontSize:'11px',fontWeight:700,color:p.progress===100?'var(--color-success)':'var(--color-gold)'}}>{p.progress}%</span>
              </div>
            </div>
            <div className={styles.mobileCardRow}>
              <span>Next Due</span>
              <span style={{color:p.due==='Overdue'?'var(--color-danger)':p.due==='Tomorrow'?'var(--color-warning)':'var(--color-white)',fontWeight:600}}>{p.due}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedPlan && (
        <>
          <div className={styles.overlay} onClick={() => setSelectedPlan(null)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className={styles.drawerAvatar}>{selectedPlan.name.charAt(0)}</div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-white)' }}>{selectedPlan.name}</h2>
                  <div className={styles.verifiedBadge}>VERIFIED PILGRIM</div>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedPlan(null)}><X size={20} /></button>
            </div>

            <div className={styles.drawerContent}>
              {/* Section 1: PLAN OVERVIEW */}
              <div className={styles.drawerSection}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                  <div className={styles.circularProgress}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className={styles.circleTrack} />
                      <circle cx="50" cy="50" r="45" className={styles.circleFill} 
                        style={{ 
                          strokeDasharray: 283, 
                          strokeDashoffset: 283 - (283 * selectedPlan.progress) / 100,
                          stroke: selectedPlan.progress === 100 ? 'var(--color-success)' : 'var(--color-gold)'
                        }} 
                      />
                    </svg>
                    <div className={styles.circleContent}>
                      <span className={styles.circleValue}>{selectedPlan.progress}%</span>
                      <span className={styles.circleLabel}>COMPLETE</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '16px' }}>{selectedPlan.type} Saving Plan</h3>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-gold)', marginTop: '4px' }}>{selectedPlan.target}</div>
                  <div className={styles.savedChip}>{selectedPlan.saved} saved so far</div>
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailCell}>
                    <div className={styles.cellLabel}>FREQUENCY</div>
                    <div className={styles.cellValue}>{selectedPlan.freq}</div>
                  </div>
                  <div className={styles.detailCell}>
                    <div className={styles.cellLabel}>AMOUNT/PERIOD</div>
                    <div className={styles.cellValue}>{selectedPlan.amount}</div>
                  </div>
                  <div className={styles.detailCell}>
                    <div className={styles.cellLabel}>START DATE</div>
                    <div className={styles.cellValue}>12 Jan 2024</div>
                  </div>
                  <div className={styles.detailCell}>
                    <div className={styles.cellLabel}>TARGET DATE</div>
                    <div className={styles.cellValue}>12 Jan 2026</div>
                  </div>
                </div>
              </div>

              {/* Section 2: PAYMENT HISTORY */}
              <div className={styles.drawerSection}>
                <h4 className={styles.sectionTitle}>PAYMENT HISTORY</h4>
                <div className={styles.miniTable}>
                  <div className={styles.miniRow}>
                    <div className="muted-text">01 May 2024</div>
                    <div style={{ fontWeight: 600 }}>{selectedPlan.amount}</div>
                    <div className="muted-text">AutoPay</div>
                    <div className={styles.dotPaid} />
                  </div>
                  <div className={styles.miniRow}>
                    <div className="muted-text">01 Apr 2024</div>
                    <div style={{ fontWeight: 600 }}>{selectedPlan.amount}</div>
                    <div className="muted-text">UPI</div>
                    <div className={styles.dotPaid} />
                  </div>
                  {selectedPlan.status === 'Defaulted' && (
                    <div className={styles.miniRow}>
                      <div className="muted-text">01 Mar 2024</div>
                      <div style={{ fontWeight: 600 }}>{selectedPlan.amount}</div>
                      <div className="muted-text">Card</div>
                      <div className={styles.dotMissed} />
                    </div>
                  )}
                </div>
                <button className={styles.linkBtn}>View Full History</button>
              </div>

              {/* Section 3: AUTOPAY STATUS */}
              <div className={styles.drawerSection}>
                <div className={styles.autoPayCard}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className={styles.actionIcon}><Repeat size={18} className="gold-text" /></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>AutoPay</div>
                      <div className="muted-text" style={{ fontSize: '12px' }}>Automatically deduct from linked account</div>
                    </div>
                  </div>
                  <div className={`${styles.toggle} ${selectedPlan.status === 'Defaulted' ? '' : styles.toggleActive}`}>
                    <div className={styles.toggleThumb} />
                  </div>
                </div>
              </div>

              {/* Section 4: JOURNEY MILESTONES */}
              <div className={styles.drawerSection}>
                <h4 className={styles.sectionTitle}>JOURNEY MILESTONES</h4>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${styles.dotAchieved}`} />
                    <div>
                      <div className={styles.timelineTextAchieved}>Plan Started</div>
                      <div className="muted-text" style={{ fontSize: '12px' }}>12 Jan 2024</div>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${selectedPlan.progress > 25 ? styles.dotAchieved : styles.dotNext}`} />
                    <div>
                      <div className={selectedPlan.progress > 25 ? styles.timelineTextAchieved : styles.timelineTextNext}>25% Milestone</div>
                      <div className="muted-text" style={{ fontSize: '12px' }}>{selectedPlan.progress > 25 ? '15 Apr 2024' : 'Pending'}</div>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${selectedPlan.progress === 100 ? styles.dotAchieved : styles.dotFuture}`} />
                    <div>
                      <div className={styles.timelineTextFuture}>Target Reached</div>
                      <div className="muted-text" style={{ fontSize: '12px' }}>Expected: 12 Jan 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter} style={{ flexWrap: 'wrap', gap: '12px' }}>
              <button className="btn-primary" style={{ flex: '1 1 100%' }}>Force Complete Plan</button>
              <button className="btn-outline-warning" style={{ flex: 1 }}>Waive Missed Payment</button>
              <button className="btn-ghost-danger" style={{ flex: 1 }}>Delete Plan</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
