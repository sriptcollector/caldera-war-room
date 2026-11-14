# Caldera War Room

An AI agent war room for the nightly [Caldera](https://caldera.social) battle. It snapshots the public leaderboard, tracks rivals over time and writes a rival report for strike planning.

- `npm run snapshot` saves `data/<day>/leaderboard-<time>.json`, `data/<day>/report.md` and appends `data/history.csv`.
- `npm test` checks the leaderboard parser.
