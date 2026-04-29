const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/packages/page.module.css', 'utf8');

const targetStr = `  .filterTabs {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .tab,
  .tabActive {
    flex: 1;
    text-align: center;
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
  }

  .grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .cardImage {
    height: 120px;
  }

  .pkgPrice {
    font-size: var(--text-xl);
  }`;

const replacement = `  .filterTabs {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 8px;
  }

  .tab,
  .tabActive {
    flex: 1 1 calc(50% - 4px);
    text-align: center;
    padding: 10px 12px;
    font-size: 13px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cardImage {
    height: 140px;
  }

  .cardBody {
    padding: 16px;
    gap: 12px;
  }

  .pkgName {
    font-size: 16px;
  }

  .pkgPrice {
    font-size: 20px;
  }

  .includesList {
    gap: 6px;
    margin: 8px 0;
  }

  .includeChip {
    padding: 4px 8px;
    font-size: 10px;
  }

  .cardFooter {
    padding: 12px 16px;
  }`;

content = content.replace(/\r\n/g, '\n');
content = content.replace(targetStr, replacement);
fs.writeFileSync('src/app/(dashboard)/packages/page.module.css', content);
console.log('Updated packages CSS');
