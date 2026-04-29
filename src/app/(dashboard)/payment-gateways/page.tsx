"use client";

import React, { useState } from 'react';
import { AlertTriangle, CreditCard, Building, Smartphone, Save } from 'lucide-react';
import styles from './page.module.css';

export default function PaymentGateways() {
  const [razorpayActive, setRazorpayActive] = useState(true);
  const [payuActive, setPayuActive] = useState(false);
  const [upiActive, setUpiActive] = useState(true);
  const [bankActive, setBankActive] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className="page-title">Payment Gateway Settings</h1>
          <p className="muted-text">Configure payment processors and API credentials</p>
        </div>
        <button className={`btn-primary ${styles.saveBtn}`}>
          <Save size={18} />
          Save Configurations
        </button>
      </div>

      <div className={styles.alertBox}>
        <AlertTriangle size={24} className="gold-text" style={{ flexShrink: 0 }} />
        <div className={styles.alertContent}>
          <div className={styles.alertTitle}>⚠ Sensitive Configuration Area</div>
          <div className={styles.alertDesc}>
            Changes to live API keys immediately affect payment processing. Always test before switching to Live mode.
          </div>
        </div>
      </div>

      <div className={styles.gatewaysGrid}>
        {/* Razorpay */}
        <div className={`card ${styles.gatewayCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.gatewayInfo}>
              <div className={styles.iconBox}><CreditCard size={20} className="gold-text" /></div>
              <div className={styles.gatewayText}>
                <h3 className={styles.gatewayTitle}>Razorpay</h3>
                <p className={`muted-text ${styles.gatewayDesc}`}>Primary Gateway • India</p>
              </div>
            </div>
            <div className={`${styles.toggle} ${razorpayActive ? styles.toggleActive : ''}`} onClick={() => setRazorpayActive(!razorpayActive)}>
              <div className={styles.toggleThumb} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>API Key ID</label>
            <input type="text" className="input-field" defaultValue="rzp_live_89s7f98s7f98" />
          </div>
          <div className={styles.inputGroup}>
            <label>API Key Secret</label>
            <input type="password" className="input-field" defaultValue="*************************" />
          </div>
        </div>

        {/* PayU */}
        <div className={`card ${styles.gatewayCard}`} style={{ opacity: payuActive ? 1 : 0.6 }}>
          <div className={styles.cardHeader}>
            <div className={styles.gatewayInfo}>
              <div className={styles.iconBox}><CreditCard size={20} className="gold-text" /></div>
              <div className={styles.gatewayText}>
                <h3 className={styles.gatewayTitle}>PayU</h3>
                <p className={`muted-text ${styles.gatewayDesc}`}>Secondary Gateway</p>
              </div>
            </div>
            <div className={`${styles.toggle} ${payuActive ? styles.toggleActive : ''}`} onClick={() => setPayuActive(!payuActive)}>
              <div className={styles.toggleThumb} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Merchant Key</label>
            <input type="text" className="input-field" placeholder="Enter PayU Key" disabled={!payuActive} />
          </div>
          <div className={styles.inputGroup}>
            <label>Merchant Salt</label>
            <input type="password" className="input-field" placeholder="Enter PayU Salt" disabled={!payuActive} />
          </div>
        </div>

        {/* UPI / PhonePe */}
        <div className={`card ${styles.gatewayCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.gatewayInfo}>
              <div className={styles.iconBox}><Smartphone size={20} className="gold-text" /></div>
              <div className={styles.gatewayText}>
                <h3 className={styles.gatewayTitle}>UPI / PhonePe</h3>
                <p className={`muted-text ${styles.gatewayDesc}`}>Direct Bank Transfer</p>
              </div>
            </div>
            <div className={`${styles.toggle} ${upiActive ? styles.toggleActive : ''}`} onClick={() => setUpiActive(!upiActive)}>
              <div className={styles.toggleThumb} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Merchant VPA (UPI ID)</label>
            <input type="text" className="input-field" defaultValue="umrahtravel@ybl" />
          </div>
        </div>

        {/* Bank Transfer / NEFT */}
        <div className={`card ${styles.gatewayCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.gatewayInfo}>
              <div className={styles.iconBox}><Building size={20} className="gold-text" /></div>
              <div className={styles.gatewayText}>
                <h3 className={styles.gatewayTitle}>Bank Transfer / NEFT</h3>
                <p className={`muted-text ${styles.gatewayDesc}`}>Manual Verification</p>
              </div>
            </div>
            <div className={`${styles.toggle} ${bankActive ? styles.toggleActive : ''}`} onClick={() => setBankActive(!bankActive)}>
              <div className={styles.toggleThumb} />
            </div>
          </div>
          <div className={styles.checkboxArea}>
            <input type="checkbox" defaultChecked className={styles.checkboxInput} />
            <div className={styles.checkboxTextContent}>
              <div className={styles.checkboxTitle}>Enable AutoPay Instructions</div>
              <div className={styles.checkboxDesc}>Show RTGS/NEFT details to clients for large transactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
