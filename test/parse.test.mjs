import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeaderboard } from '../scripts/parse.mjs';

const html = `<table><tr><th>City</th><th>Battle</th></tr>
<tr><td>1</td><td>@mike</td><td>Mike Jones</td><td>113.8</td><td>-119.3</td><td>Houses</td><td>$5.7M budget</td></tr>
<tr><td>2</td><td>A</td><td>@lwts</td><td>0.0</td><td>-28.0</td><td>Houses</td><td>peaceful</td></tr></table>`;

test('parses rows with and without a display name', () => {
  const rows = parseLeaderboard(html);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], { rank: 1, handle: '@mike', name: 'Mike Jones', points: 113.8, change: '-119.3', city: 'Houses', battle: '$5.7M budget' });
  assert.equal(rows[1].handle, '@lwts');
  assert.equal(rows[1].points, 0);
});

test('empty page gives no rows', () => {
  assert.deepEqual(parseLeaderboard('<p>nothing</p>'), []);
});
