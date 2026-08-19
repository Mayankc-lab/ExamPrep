const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function extractLinks(filePath) {
  const abs = path.resolve(filePath);
  const workbook = xlsx.readFile(abs);
  const links = [];

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    for (const addr of Object.keys(sheet)) {
      if (addr.startsWith('!')) continue;
      const cell = sheet[addr];
      // Hyperlink stored in cell.l.Target in xlsx library
      if (cell && cell.l && (cell.l.Target || cell.l.target)) {
        links.push({ sheet: sheetName, cell: addr, link: cell.l.Target || cell.l.target });
        continue;
      }
      // Fallback: detect URLs in the displayed text
      if (cell && typeof cell.v === 'string') {
        const urlRegex = /(https?:\/\/[^\s"'<>\)\]]+)/g;
        const m = cell.v.match(urlRegex);
        if (m) {
          m.forEach(u => links.push({ sheet: sheetName, cell: addr, link: u }));
        }
      }
    }
  });

  // dedupe
  const seen = new Set();
  const uniq = links.filter(item => {
    const key = `${item.link}@@${item.sheet}@@${item.cell}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniq;
}

function toCSV(items) {
  const header = 'sheet,cell,link\n';
  const rows = items.map(i => `${csvEscape(i.sheet)},${csvEscape(i.cell)},${csvEscape(i.link)}`).join('\n');
  return header + rows + '\n';
}

function csvEscape(s) {
  if (s == null) return '';
  return '"' + String(s).replace(/"/g, '""') + '"';
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node extract_excel_links.js <path-to-xlsx>');
    process.exit(2);
  }
  const items = extractLinks(arg);
  if (items.length === 0) {
    console.log('No links found.');
    return;
  }
  const outCsv = path.join(path.dirname(arg), 'extracted_links.csv');
  fs.writeFileSync(outCsv, toCSV(items), 'utf8');
  console.log(`Found ${items.length} links. Saved to ${outCsv}`);
  // print links
  items.forEach(it => console.log(`${it.link}  (sheet=${it.sheet}, cell=${it.cell})`));
}

if (require.main === module) main();
