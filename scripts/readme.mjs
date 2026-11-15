// Rewrites the "Latest standings" block in README.md from data/latest.json.
import { readFileSync, writeFileSync } from 'node:fs';
const { at, rows } = JSON.parse(readFileSync('data/latest.json', 'utf8'));
const block = ['<!-- standings -->', `## Latest standings (${at})`, '', '| # | Developer | Points | City |', '|---|---|---|---|',
  ...rows.slice(0, 10).map((r) => `| ${r.rank} | ${r.handle} | ${r.points} | ${r.city} |`), '<!-- /standings -->'].join('\n');
const md = readFileSync('README.md', 'utf8');
const out = md.includes('<!-- standings -->') ? md.replace(/<!-- standings -->[\s\S]*<!-- \/standings -->/, block) : md.trimEnd() + '\n\n' + block + '\n';
writeFileSync('README.md', out);
