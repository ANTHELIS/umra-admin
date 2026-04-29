import React from 'react';
import Image from 'next/image';
import styles from './layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        <div className="auth-bg-pattern" />
        <div className={styles.radialGlow} />

        <div className={styles.leftContent}>
          <div className={styles.mosqueGlow} />
          <Image 
            src="/newTaj-signin-logo.png" 
            alt="Mosque Illustration" 
            width={480} 
            height={480} 
            className={styles.mosqueIllustration}
            priority
          />

          <h1 className={styles.headline}>Your Sacred Journey Awaits</h1>
          <p className={styles.subtext}>Manage pilgrimage experiences with excellence.</p>

          <div className={styles.goldDivider} />

          <div className={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
        </div>

        <div className={styles.versionTag}>Umrah Travel Admin v1.0</div>
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        {children}
      </div>
    </div>
  );
}
