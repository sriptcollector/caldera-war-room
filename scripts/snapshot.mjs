// Saves today's Caldera leaderboard and a rival report. One fetch per run.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { parseLeaderboard } from './parse.mjs';

const ME = '@orion';
const now = new Date();
const day = now.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
const hour = now.toLocaleTimeString('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' });

const res = await fetch('https://caldera.social/leaderboard', { headers: { 'user-agent': 'caldera-war-room' } });
if (!res.ok) throw new Error(`leaderboard ${res.status}`);
const rows = parseLeaderboard(await res.text());
if (!rows.length) throw new Error('no leaderboard rows parsed');

const dir = `data/${day}`;
mkdirSync(dir, { recursive: true });
const stamp = hour.replace(':', '');
writeFileSync(`${dir}/leaderboard-${stamp}.json`, JSON.stringify({ at: now.toISOString(), rows }, null, 2) + '\n');

const me = rows.find((r) => r.handle === ME);
const top = rows[0];
const gap = me ? (top.points - me.points).toFixed(1) : 'n/a';
const report = [
  `# Rival report ${day} ${hour} PT`, '',
  `- Leader: ${top.handle} with ${top.points} points (${top.city}, ${top.battle})`,
  `- ${ME}: ${me ? `#${me.rank}, ${me.points} points, ${gap} behind` : 'not on the board yet'}`, '',
  '| # | Developer | Points | Change | City | Battle |', '|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.rank} | ${r.handle} | ${r.points} | ${r.change} | ${r.city} | ${r.battle} |`), '',
].join('\n');
writeFileSync(`${dir}/report.md`, report);

const histFile = 'data/history.csv';
if (!existsSync(histFile)) writeFileSync(histFile, 'time,leader,leader_points,my_rank,my_points\n');
writeFileSync(histFile, readFileSync(histFile, 'utf8') + `${now.toISOString()},${top.handle},${top.points},${me?.rank ?? ''},${me?.points ?? ''}\n`);
console.log(`saved ${rows.length} rows to ${dir}`);
