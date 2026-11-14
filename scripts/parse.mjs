// Turns the public caldera.social leaderboard page into rows.
export function pageText(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n').map((l) => l.trim()).filter(Boolean);
}

export function parseLeaderboard(html) {
  const t = pageText(html);
  const start = t.indexOf('Battle');
  const rows = [];
  for (let i = start + 1; i < t.length; i++) {
    if (!/^\d+$/.test(t[i])) continue;
    let j = i + 1;
    if (t[j] && !t[j].startsWith('@') && t[j + 1]?.startsWith('@')) j++;
    if (!t[j]?.startsWith('@')) continue;
    const handle = t[j];
    let k = j + 1;
    let name = '';
    if (!/^-?\d+(\.\d+)?$/.test(t[k])) name = t[k++];
    const points = Number(t[k]);
    if (Number.isNaN(points)) continue;
    rows.push({ rank: Number(t[i]), handle, name, points, change: t[k + 1], city: t[k + 2], battle: t[k + 3] });
    i = k + 3;
  }
  return rows;
}
