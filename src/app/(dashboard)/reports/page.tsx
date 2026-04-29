"use client";

import React from 'react';
import { Download, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import styles from './page.module.css';

export default function RevenueReports() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className="page-title">Financial Overview</h1>
          <p className="muted-text">Complete financial overview of the platform</p>
        </div>
        <div className={styles.actions}>
          <select className={`input-field ${styles.periodSelect}`}>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className={`btn-primary ${styles.exportBtn}`}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`card ${styles.kpiCard}`}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiLabel}>Gross Volume (GMV)</div>
            <div className={styles.iconCircle} style={{ background: 'rgba(46, 204, 113, 0.15)', color: 'var(--color-success)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className={styles.kpiValue}>₹ 1,24,50,000</div>
          <div className={styles.kpiChange} style={{ color: 'var(--color-success)' }}>+14.5% from last month</div>
        </div>

        <div className={`card ${styles.kpiCard}`}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiLabel}>Platform Revenue</div>
            <div className={styles.iconCircle} style={{ background: 'rgba(201, 168, 76, 0.15)', color: 'var(--color-gold)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className={styles.kpiValue}>₹ 18,67,500</div>
          <div className={styles.kpiChange} style={{ color: 'var(--color-success)' }}>+8.2% from last month</div>
        </div>

        <div className={`card ${styles.kpiCard}`}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiLabel}>Pending Settlements</div>
            <div className={styles.iconCircle} style={{ background: 'rgba(240, 165, 0, 0.15)', color: 'var(--color-warning)' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div className={styles.kpiValue}>₹ 4,20,000</div>
          <div className={styles.kpiChange} style={{ color: 'var(--color-muted)' }}>To be cleared next Tuesday</div>
        </div>
      </div>

      <div className={`card ${styles.chartCard}`}>
        <div className={styles.chartInner}>
          <BarChartPlaceholder />
          <p className={styles.chartLabel}>Revenue Chart Visualization (Integration Pending)</p>
        </div>
      </div>
    </div>
  );
}

function BarChartPlaceholder() {
  return (
    <div className={styles.barChart}>
      {[40, 70, 45, 90, 60, 110, 85].map((h, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{
            height: `${h}px`,
            background: i === 5 ? 'var(--color-gold)' : 'var(--bg-inner)',
          }}
        />
      ))}
    </div>
  );
}
