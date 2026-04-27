"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Send, Smartphone, Mail, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminApi, showToast, type NotificationCategory, type NotificationEvent } from '@/lib/api';

// Verified enums from Postman collection
const CATEGORIES: { value: NotificationCategory; label: string }[] = [
  { value: 'system',    label: 'System' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'booking',   label: 'Booking' },
  { value: 'payment',   label: 'Payment' },
  { value: 'general',   label: 'General' },
];

const EVENTS: { value: NotificationEvent; label: string }[] = [
  { value: 'booking_created',   label: 'Booking Created' },
  { value: 'booking_cancelled', label: 'Booking Cancelled' },
  { value: 'payment_success',   label: 'Payment Success' },
  { value: 'payment_failed',    label: 'Payment Failed' },
];

export default function Notifications() {
  const [title,    setTitle]    = useState('Payment Received');
  const [message,  setMessage]  = useState('Your payment was successful');
  const [channel,  setChannel]  = useState('In-App');
  const [userId,   setUserId]   = useState('');
  const [category, setCategory] = useState<NotificationCategory>('payment');
  const [event,    setEvent]    = useState<NotificationEvent>('payment_success');
  const [sending,  setSending]  = useState(false);

  const handleSend = async () => {
    if (!userId.trim())           { showToast('Please enter a Target User ID.', 'error'); return; }
    if (!title.trim())            { showToast('Title is required.', 'error'); return; }
    if (!message.trim())          { showToast('Message body is required.', 'error'); return; }

    setSending(true);
    const res = await adminApi.sendPushNotification({
      userId:   userId.trim(),
      title:    title.trim(),
      message:  message.trim(),
      category,
      event,
      // NOTE: 'channel' is a UI preview toggle only — not sent to backend (BUG 11 fix)
    });
    setSending(false);

    if (res?.error) {
      showToast(`Failed to send: ${res.error}`, 'error');
    } else {
      showToast('Notification sent successfully! 🚀', 'success');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.composerGrid}>
        {/* Left: Composer Form */}
        <div className="card">
          <div className="page-title" style={{ marginBottom: '24px' }}>Compose Broadcast</div>

          {/* Channel selector */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Channel</label>
            <div className={styles.channelOptions}>
              {[
                { name: 'In-App', Icon: Bell,        desc: 'Push to mobile app' },
                { name: 'SMS',    Icon: Smartphone,  desc: 'Direct to phone' },
                { name: 'Email',  Icon: Mail,         desc: 'Newsletter format' },
              ].map(({ name, Icon, desc }) => (
                <div
                  key={name}
                  className={`${styles.channelCard} ${channel === name ? styles.channelActive : ''}`}
                  onClick={() => setChannel(name)}
                >
                  <div className={styles.channelIcon}><Icon size={20} /></div>
                  <div className={styles.channelDetails}>
                    <div className={styles.channelName}>{name}</div>
                    <div className={styles.channelDesc}>{desc}</div>
                  </div>
                  <div className={styles.checkCircle}>
                    {channel === name && <CheckCircle2 size={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target User ID */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Target User ID <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="MongoDB ObjectId e.g. 661d2d6d4c6d5f0012345678"
            />
          </div>

          {/* Category + Event — two columns */}
          <div className={styles.formGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className={styles.label}>
                Category <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value as NotificationCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>
                Event <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select
                className="input-field"
                value={event}
                onChange={(e) => setEvent(e.target.value as NotificationEvent)}
              >
                {EVENTS.map((ev) => (
                  <option key={ev.value} value={ev.value}>{ev.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Title <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Message <span style={{ color: 'var(--color-danger)' }}>*</span></span>
              <span
                className={styles.charCount}
                style={{ color: message.length > 160 ? 'var(--color-danger)' : undefined }}
              >
                {message.length}/160
              </span>
            </label>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', gap: '8px' }}
            onClick={handleSend}
            disabled={sending}
          >
            {sending
              ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
              : <><Send size={18} /> Send Notification</>
            }
          </button>
        </div>

        {/* Right: Live Preview */}
        <div className={styles.previewSection}>
          <div className="page-subtitle" style={{ marginBottom: '16px', textAlign: 'center' }}>Live Preview</div>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneScreen}>
              <div className={styles.previewHeader}>
                {channel === 'SMS' ? 'Messages' : channel === 'Email' ? 'Inbox' : 'Notifications'}
              </div>
              <div className={styles.previewBubble}>
                <div className={styles.previewSender}>Umrah Travel</div>
                {title && (
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{title}</div>
                )}
                <div className={styles.previewText}>
                  {message || 'Start typing to see preview…'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'capitalize' }}>
                    {category} · {event.replace(/_/g, ' ')}
                  </span>
                  <span className={styles.previewTime}>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
