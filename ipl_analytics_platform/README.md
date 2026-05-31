# IPL Intelligence

End-to-end IPL analytics platform built from raw Cricsheet JSON ball-by-ball data from 2008 onward.

## Project Goal

This project turns raw cricket match JSON files into clean analytical datasets that can power dashboards, SQL analysis, machine learning, and portfolio-ready sports analytics reports.

The final version will answer questions such as:

- How has IPL scoring changed from 2008 to today?
- Does winning the toss still matter?
- Which teams dominate the powerplay, middle overs, and death overs?
- Which batters and bowlers are most valuable by phase, venue, and season?
- What is a venue-specific par score?
- Can we predict win probability during a chase?

## Current Status

Phase 1 is complete: raw JSON extraction into normalized CSV tables.

## Data Source

Raw files are expected in Cricsheet JSON format.

Default input path:

```text
C:\Users\arka7\Downloads\ipl_json
```

The raw data itself is not committed to this project. Keep raw JSON files locally and regenerate processed tables when needed.

## Project Structure

```text
ipl_analytics_platform/
  src/
    build_dataset.py
  data/
    processed/
    warehouse/
  dashboards/
  models/
  notebooks/
  reports/
  tests/
```

## Run The Pipeline

From the project folder:

```powershell
python src/build_dataset.py --input-dir "C:\Users\arka7\Downloads\ipl_json" --output-dir data/processed
```

From the parent workspace:

```powershell
python ipl_analytics_platform/src/build_dataset.py --input-dir "C:\Users\arka7\Downloads\ipl_json" --output-dir ipl_analytics_platform/data/processed
```

## Generated Tables

The pipeline creates these CSV files:

- `matches.csv`: one row per match.
- `innings.csv`: one row per innings.
- `deliveries.csv`: one row per delivery.
- `match_players.csv`: player-team participation by match.
- `batting_summary.csv`: all-time batter run totals.
- `bowling_summary.csv`: wickets, balls, runs conceded, and economy by bowler.
- `phase_summary.csv`: winner vs loser scoring by phase.

## Phase Definitions

- Powerplay: overs 0-5
- Middle: overs 6-15
- Death: overs 16-19

## Resume Positioning

Suggested resume bullet once dashboards and modeling are added:

```text
Built an end-to-end IPL analytics platform using 1,200+ Cricsheet JSON match files from 2008-present, transforming raw ball-by-ball data into normalized analytical tables for SQL, dashboards, and predictive modeling. Developed insights on toss impact, phase-wise scoring, player value, venue trends, and win probability.
```

## Roadmap

1. Build normalized CSV tables from raw JSON.
2. Add DuckDB warehouse tables and SQL analysis queries.
3. Add exploratory reports for season, team, player, and venue trends.
4. Build an interactive dashboard in Streamlit or Power BI.
5. Add predictive models for score prediction and win probability.
6. Publish a polished GitHub README with screenshots and key findings.
