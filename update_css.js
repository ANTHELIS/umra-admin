const fs = require('fs');
const path = require('path');

const files = [
  'sip-transactions/page.module.css',
  'customers/page.module.css',
  'documents/page.module.css',
  'promotions/page.module.css',
  'notifications/page.module.css',
  'commissions/page.module.css',
  'reports/page.module.css',
  'payment-gateways/page.module.css',
  'settlements/page.module.css',
  'admins/page.module.css',
  'franchises/page.module.css',
  'audit-logs/page.module.css',
  'settings/page.module.css',
  'bookings/page.module.css',
  'packages/page.module.css'
];

const basePath = path.join(process.cwd(), 'src', 'app', '(dashboard)');

const newHeaderStyles = `  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .header > div {
    flex: 1;
    padding-right: 8px;
  }

  .header button, .header a, .header .btn-primary, .header .btn-outline-gold {
    padding: 6px 10px;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }`;

const newStatsStyles = `  .statsRow {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  .statCard {
    padding: var(--space-3);
    gap: 8px;
  }

  .statIcon {
    width: 32px;
    height: 32px;
  }

  .statLabel {
    font-size: 10px;
    white-space: normal;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .statValue {
    font-size: 16px;
  }`;

files.forEach(file => {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the @media (max-width: 768px) block
  const mediaIdx = content.indexOf('@media (max-width: 768px)');
  if (mediaIdx === -1) return;

  let beforeMedia = content.substring(0, mediaIdx);
  let mediaBlock = content.substring(mediaIdx);

  // Replace .header block inside @media
  mediaBlock = mediaBlock.replace(/  \.header\s*\{[\s\S]*?\n  \}/g, newHeaderStyles);
  
  // Clean up any stray .header button
  mediaBlock = mediaBlock.replace(/  \.header button\s*\{[\s\S]*?\n  \}\n?/g, '');

  // Replace .statsRow block inside @media
  if (mediaBlock.includes('  .statsRow')) {
    mediaBlock = mediaBlock.replace(/  \.statsRow\s*\{[\s\S]*?\n  \}/g, newStatsStyles);
  }

  // Replace .statCard if it's there
  if (mediaBlock.includes('  .statCard')) {
    mediaBlock = mediaBlock.replace(/  \.statCard\s*\{[\s\S]*?\n  \}/g, '');
  }

  content = beforeMedia + mediaBlock;

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
