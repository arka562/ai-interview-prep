# IPL CRUNCH '26

This folder contains a complete first-pass hackathon submission built from Cricsheet IPL JSON files.

## What it answers

- Do teams that win the toss actually win more matches?
- Which phase is most linked to winning: powerplay, middle overs, or death overs?
- Who are the top 5 batters by runs and top 5 bowlers by wickets across the latest five seasons in the JSON folder?
- One surprising finding for the Wooble written response.

## How to run

```powershell
python ipl_crunch_26/ipl_crunch_analysis.py --input-dir "C:\Users\arka7\Downloads\ipl_json"
```

By default, the script analyses the latest five seasons available in the JSON files and writes outputs to:

```text
ipl_crunch_26/outputs
```

To analyse a different number of recent seasons:

```powershell
python ipl_crunch_26/ipl_crunch_analysis.py --latest-seasons 3
```

## Main outputs

- `outputs/csv/ipl_ball_by_ball.csv`: flattened ball-by-ball data.
- `outputs/csv/ipl_matches.csv`: match-level data.
- `outputs/charts/toss_win_rate.svg`: Chart 1 for the submission.
- `outputs/charts/phase_runs.svg`: Chart 2 for the submission.
- `outputs/summary/top_batters.csv`: top 5 batters table.
- `outputs/summary/top_bowlers.csv`: top 5 bowlers table.
- `outputs/summary/submission_summary.md`: plain-English answer to upload to Wooble.

## Method notes

- Only the first two innings are used for winner-vs-loser phase analysis, so Super Overs do not distort normal phase totals.
- Batter rankings use credited batter runs.
- Bowler rankings count wickets credited to the bowler: bowled, caught, caught and bowled, lbw, stumped, hit wicket, and hit the ball twice.
- Toss win rate excludes matches without a winner.
