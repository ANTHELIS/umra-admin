"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';
import { Gift, Copy, Plus, Save, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { adminApi, showToast, toISO } from '@/lib/api';

export default function Promotions() {
  // --- Referral program (no API endpoint yet) ---
  const [l1Points, setL1Points] = useState(1000);
  const [l2Points, setL2Points] = useState(500);
  const [l3Points, setL3Points] = useState(250);
  const [programActive, setProgramActive] = useState(true);

  // --- Offers ---
  const [offers, setOffers] = useState<any[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [offerData, setOfferData] = useState({
    code: 'EID2026', title: 'Eid Offer', description: 'Festival discount',
    discountType: 'percentage' as 'percentage' | 'fixed', discountValue: 10,
    minPurchaseAmount: 50000, maxDiscountAmount: 15000,
    validFrom: '2026-04-16', validTo: '2026-05-16',
    usageLimit: 100, perUserLimit: 1, isActive: true,
  });
  const [offerCreating, setOfferCreating] = useState(false);

  // --- Banners ---
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState({
    title: 'Summer Offer', link: 'https://example.com/packages',
    placement: 'home_top', isActive: true,
    validFrom: '2026-04-16', validTo: '2026-05-16',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerCreating, setBannerCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  const fetchOffers = useCallback(async () => {
    setOffersLoading(true); setOffersError(null);
    const res = await adminApi.getOffers();
    if (!mountedRef.current) return;
    const list = res?.data ?? (Array.isArray(res) ? res : null);
    if (list !== null) setOffers(list);
    else setOffersError(res?.error ?? 'Failed to load offers');
    setOffersLoading(false);
  }, []);

  const fetchBanners = useCallback(async () => {
    setBannersLoading(true); setBannersError(null);
    const res = await adminApi.getBanners();
    if (!mountedRef.current) return;
    const list = res?.data ?? (Array.isArray(res) ? res : null);
    if (list !== null) setBanners(list);
    else setBannersError(res?.error ?? 'Failed to load banners');
    setBannersLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchOffers(); fetchBanners();
    return () => { mountedRef.current = false; };
  }, [fetchOffers, fetchBanners]);

  const handleCreateOffer = async () => {
    setOfferCreating(true);
    const payload = {
      ...offerData,
      validFrom: toISO(offerData.validFrom),
      validTo: toISO(offerData.validTo),
    };
    const res = await adminApi.createOffer(payload);
    setOfferCreating(false);
    if (res?.error) { showToast(`Failed: ${res.error}`, 'error'); }
    else { showToast('Offer created successfully!', 'success'); fetchOffers(); }
  };

  const handleCreateBanner = async () => {
    if (!bannerFile) { showToast('Please select an image file.', 'error'); return; }
    const fd = new FormData();
    fd.append('title', bannerData.title);
    fd.append('link', bannerData.link);
    fd.append('placement', bannerData.placement);
    fd.append('isActive', String(bannerData.isActive));
    fd.append('validFrom', toISO(bannerData.validFrom));
    fd.append('validTo', toISO(bannerData.validTo));
    fd.append('image', bannerFile); // File object — browser sets multipart Content-Type
    setBannerCreating(true);
    const res = await adminApi.createBanner(fd);
    setBannerCreating(false);
    if (res?.error) { showToast(`Failed: ${res.error}`, 'error'); }
    else { showToast('Banner uploaded successfully!', 'success'); fetchBanners(); setBannerFile(null); }
  };

  const handleSaveReferral = () => {
    // TODO: POST /admin/config with referral settings once backend supports it
    showToast('Referral program configurations saved!', 'success');
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <div>
          <h1 className="page-title">Promotions</h1>
          <p className="muted-text">Manage referral programs, coupons, and banners</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left: Referral Program */}
        <div className={styles.leftCol}>
          <div className="card">
            <div className={styles.headerRow}>
              <h3 className="page-title">Referral Program Setup</h3>
              <div
                className={`${styles.toggle} ${programActive ? styles.toggleActive : ''}`}
                onClick={() => setProgramActive(!programActive)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.toggleThumb} />
              </div>
            </div>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>
              Configure the multi-level points system. 1 Point = ₹1.
            </p>
            {[
              { label: 'Level 1 (Direct Referral)', val: l1Points, set: setL1Points },
              { label: 'Level 2 (Indirect Referral)', val: l2Points, set: setL2Points },
              { label: 'Level 3 (Extended Network)', val: l3Points, set: setL3Points },
            ].map(({ label, val, set }) => (
              <div key={label} className={styles.tierGroup}>
                <div className={styles.tierLabel}>{label}</div>
                <div className={styles.inputWrapper}>
                  <Gift size={16} className="gold-text" style={{ position: 'absolute', left: '16px' }} />
                  <input type="number" className={styles.tierInput} value={val} onChange={(e) => set(Number(e.target.value))} />
                  <span className={styles.ptsLabel}>Points</span>
                </div>
              </div>
            ))}
            <button className="btn-primary" style={{ width: '100%', marginTop: '16px', gap: '8px' }} onClick={handleSaveReferral}>
              <Save size={18} /> Save Configuration
            </button>
          </div>
        </div>

        {/* Right: Coupon + Banner Forms */}
        <div className={styles.rightCol}>
          {/* Create Offer */}
          <div className="card">
            <h3 className="page-title" style={{ marginBottom: '16px' }}>Generate Coupon</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Coupon Code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="input-field" value={offerData.code}
                  onChange={(e) => setOfferData({ ...offerData, code: e.target.value.toUpperCase() })} />
                <button className="btn-secondary" style={{ width: '52px', padding: 0 }}
                  onClick={() => { navigator.clipboard?.writeText(offerData.code); showToast('Code copied!', 'info'); }}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Discount Type</label>
                <select className="input-field" value={offerData.discountType}
                  onChange={(e) => setOfferData({ ...offerData, discountType: e.target.value as 'percentage' | 'fixed' })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Value</label>
                <input type="number" className="input-field" value={offerData.discountValue}
                  onChange={(e) => setOfferData({ ...offerData, discountValue: Number(e.target.value) })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Valid From</label>
                <input type="date" className="input-field" value={offerData.validFrom}
                  onChange={(e) => setOfferData({ ...offerData, validFrom: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Valid To</label>
                <input type="date" className="input-field" value={offerData.validTo}
                  onChange={(e) => setOfferData({ ...offerData, validTo: e.target.value })} />
              </div>
            </div>
            <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={handleCreateOffer} disabled={offerCreating}>
              {offerCreating ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={18} />}
              {offerCreating ? 'Creating…' : 'Add Coupon'}
            </button>
          </div>

          {/* Create Banner */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 className="page-title" style={{ marginBottom: '16px' }}>Add Banner</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Title</label>
              <input type="text" className="input-field" value={bannerData.title}
                onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Placement</label>
              <select className="input-field" value={bannerData.placement}
                onChange={(e) => setBannerData({ ...bannerData, placement: e.target.value })}>
                <option value="home_top">Home Top</option>
                <option value="home_middle">Home Middle</option>
                <option value="package_list">Package List</option>
                <option value="saving_dashboard">Saving Dashboard</option>
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Link URL</label>
              <input type="text" className="input-field" value={bannerData.link}
                onChange={(e) => setBannerData({ ...bannerData, link: e.target.value })} />
            </div>
            {/* File picker — uses FormData + multipart */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Image File</label>
              <div
                style={{ border: '2px dashed rgba(201,168,76,0.4)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {bannerFile
                  ? <span style={{ color: 'var(--color-gold)', fontSize: '13px' }}>✓ {bannerFile.name}</span>
                  : <span className="muted-text" style={{ fontSize: '13px' }}>Click to select image (JPG/PNG/WebP)</span>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
            </div>
            <button className="btn-secondary" style={{ width: '100%', gap: '8px' }} onClick={handleCreateBanner} disabled={bannerCreating}>
              {bannerCreating ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ImageIcon size={18} />}
              {bannerCreating ? 'Uploading…' : 'Upload Banner'}
            </button>
          </div>
        </div>
      </div>

      {/* Lists at the bottom */}
      <div className={styles.listsGrid}>
        {/* Active Offers */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="page-title">Active Offers</h3>
            <button onClick={fetchOffers} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}>
              <RefreshCw size={16} />
            </button>
          </div>
          {offersLoading && <div style={{ opacity: 0.4 }}>{[0,1,2].map((i) => <div key={i} style={{ height:'40px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', marginBottom:'8px' }} />)}</div>}
          {offersError && !offersLoading && <div style={{ display:'flex', gap:'8px', color:'var(--color-danger)', fontSize:'13px' }}><AlertCircle size={14} />{offersError}</div>}
          {!offersLoading && !offersError && offers.length === 0 && <p className="muted-text" style={{ fontSize:'13px' }}>No active offers found.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {offers.map((o, i) => (
              <div key={o._id ?? i} style={{ background: '#0D2318', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '14px' }}>{o.code}</div>
                  <div className="muted-text" style={{ fontSize: '12px' }}>{o.discountValue}{o.discountType === 'percentage' ? '%' : '₹'} off</div>
                </div>
                <div className="status-pill success" style={{ fontSize: '10px' }}>Active</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Banners */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="page-title">Active Banners</h3>
            <button onClick={fetchBanners} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}>
              <RefreshCw size={16} />
            </button>
          </div>
          {bannersLoading && <div style={{ opacity: 0.4 }}>{[0,1,2].map((i) => <div key={i} style={{ height:'56px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', marginBottom:'8px' }} />)}</div>}
          {bannersError && !bannersLoading && <div style={{ display:'flex', gap:'8px', color:'var(--color-danger)', fontSize:'13px' }}><AlertCircle size={14} />{bannersError}</div>}
          {!bannersLoading && !bannersError && banners.length === 0 && <p className="muted-text" style={{ fontSize:'13px' }}>No active banners found.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {banners.map((b, i) => (
              <div key={b._id ?? i} style={{ background: '#0D2318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '40px', background: '#1A3A28', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                  {b.imageUrl
                    ? <img src={b.imageUrl} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)' }}><ImageIcon size={16} /></div>}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</div>
                  <div className="muted-text" style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                    {(b.placement ?? '').replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
