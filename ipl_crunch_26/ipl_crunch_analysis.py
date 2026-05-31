import argparse
import csv
import json
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


BOWLER_WICKET_KINDS = {
    "bowled",
    "caught",
    "caught and bowled",
    "lbw",
    "stumped",
    "hit wicket",
    "hit the ball twice",
}

PHASES = (
    ("Powerplay", 0, 5),
    ("Middle overs", 6, 15),
    ("Death overs", 16, 19),
)


def first_date(info):
    dates = info.get("dates") or []
    return dates[0] if dates else ""


def season_from_date(date_text):
    return int(date_text[:4]) if date_text else None


def phase_for_over(over):
    for name, start, end in PHASES:
        if start <= over <= end:
            return name
    return "Other"


def load_matches(input_dir):
    matches = []
    for path in sorted(Path(input_dir).glob("*.json")):
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        info = data.get("info", {})
        date_text = first_date(info)
        season = season_from_date(date_text)
        if season is None:
            continue
        matches.append((path, data, season))
    return matches


def choose_seasons(matches, latest_seasons):
    seasons = sorted({season for _, _, season in matches})
    return seasons[-latest_seasons:]


def innings_team_runs(innings):
    runs_by_team = defaultdict(int)
    for inning in innings[:2]:
        team = inning.get("team", "")
        for over in inning.get("overs", []):
            for delivery in over.get("deliveries", []):
                runs_by_team[team] += int(delivery.get("runs", {}).get("total", 0))
    return runs_by_team


def flatten_matches(matches, selected_seasons):
    ball_rows = []
    match_rows = []
    batter_runs = Counter()
    bowler_wickets = Counter()
    phase_runs = defaultdict(lambda: defaultdict(int))

    for path, data, season in matches:
        if season not in selected_seasons:
            continue

        info = data.get("info", {})
        innings = data.get("innings", [])
        match_id = path.stem
        winner = info.get("outcome", {}).get("winner", "")
        result_type = "result" if winner else "no_result_or_tie"
        toss_winner = info.get("toss", {}).get("winner", "")
        toss_decision = info.get("toss", {}).get("decision", "")
        teams = info.get("teams", [])
        date_text = first_date(info)
        city = info.get("city", "")
        venue = info.get("venue", "")
        team_totals = innings_team_runs(innings)

        match_rows.append(
            {
                "match_id": match_id,
                "date": date_text,
                "season": season,
                "venue": venue,
                "city": city,
                "team_1": teams[0] if len(teams) > 0 else "",
                "team_2": teams[1] if len(teams) > 1 else "",
                "winner": winner,
                "result_type": result_type,
                "toss_winner": toss_winner,
                "toss_decision": toss_decision,
                "toss_winner_won_match": int(bool(winner) and toss_winner == winner),
                "team_1_runs": team_totals.get(teams[0], "") if len(teams) > 0 else "",
                "team_2_runs": team_totals.get(teams[1], "") if len(teams) > 1 else "",
            }
        )

        for innings_number, inning in enumerate(innings[:2], start=1):
            batting_team = inning.get("team", "")
            if not winner:
                batting_result = "No result"
            else:
                batting_result = "Winner" if batting_team == winner else "Loser"
            for over in inning.get("overs", []):
                over_number = int(over.get("over", 0))
                phase = phase_for_over(over_number)
                for ball_in_over, delivery in enumerate(over.get("deliveries", []), start=1):
                    runs = delivery.get("runs", {})
                    batter = delivery.get("batter", "")
                    bowler = delivery.get("bowler", "")
                    batter_run_value = int(runs.get("batter", 0))
                    total_run_value = int(runs.get("total", 0))
                    extras = delivery.get("extras", {})
                    wickets = delivery.get("wickets", [])

                    batter_runs[batter] += batter_run_value
                    if batting_result in ("Winner", "Loser"):
                        phase_runs[batting_result][phase] += total_run_value

                    wicket_kinds = []
                    players_out = []
                    credited_bowler_wickets = 0
                    for wicket in wickets:
                        kind = wicket.get("kind", "")
                        wicket_kinds.append(kind)
                        players_out.append(wicket.get("player_out", ""))
                        if kind in BOWLER_WICKET_KINDS:
                            bowler_wickets[bowler] += 1
                            credited_bowler_wickets += 1

                    ball_rows.append(
                        {
                            "match_id": match_id,
                            "date": date_text,
                            "season": season,
                            "innings": innings_number,
                            "batting_team": batting_team,
                            "batting_result": batting_result,
                            "over": over_number,
                            "ball_in_over": ball_in_over,
                            "phase": phase,
                            "batter": batter,
                            "non_striker": delivery.get("non_striker", ""),
                            "bowler": bowler,
                            "batter_runs": batter_run_value,
                            "extras": int(runs.get("extras", 0)),
                            "total_runs": total_run_value,
                            "wides": int(extras.get("wides", 0)),
                            "noballs": int(extras.get("noballs", 0)),
                            "byes": int(extras.get("byes", 0)),
                            "legbyes": int(extras.get("legbyes", 0)),
                            "penalty": int(extras.get("penalty", 0)),
                            "wicket_count": len(wickets),
                            "bowler_wickets": credited_bowler_wickets,
                            "wicket_kinds": "; ".join(wicket_kinds),
                            "players_out": "; ".join(players_out),
                            "winner": winner,
                            "toss_winner": toss_winner,
                            "toss_decision": toss_decision,
                        }
                    )

    return ball_rows, match_rows, batter_runs, bowler_wickets, phase_runs


def write_csv(path, rows, headers):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def percentage(value):
    return f"{value:.1f}%"


def build_summary(match_rows, ball_rows, batter_runs, bowler_wickets, phase_runs):
    decided_matches = [row for row in match_rows if row["winner"]]
    toss_winner_wins = sum(row["toss_winner_won_match"] for row in decided_matches)
    toss_loser_wins = len(decided_matches) - toss_winner_wins
    toss_summary = [
        {
            "Group": "Toss winners",
            "Matches": len(decided_matches),
            "Wins": toss_winner_wins,
            "Win Rate": toss_winner_wins / len(decided_matches) if decided_matches else 0,
        },
        {
            "Group": "Toss losers",
            "Matches": len(decided_matches),
            "Wins": toss_loser_wins,
            "Win Rate": toss_loser_wins / len(decided_matches) if decided_matches else 0,
        },
    ]

    innings_count = defaultdict(lambda: defaultdict(int))
    seen_team_match_phase = set()
    for row in ball_rows:
        if row["batting_result"] not in ("Winner", "Loser"):
            continue
        key = (row["match_id"], row["innings"], row["batting_result"], row["phase"])
        if key in seen_team_match_phase:
            continue
        seen_team_match_phase.add(key)
        innings_count[row["batting_result"]][row["phase"]] += 1

    phase_summary = []
    for phase, _, _ in PHASES:
        for result in ("Winner", "Loser"):
            innings = innings_count[result][phase]
            runs = phase_runs[result][phase]
            phase_summary.append(
                {
                    "Phase": phase,
                    "Team Result": result,
                    "Total Runs": runs,
                    "Innings": innings,
                    "Average Runs": runs / innings if innings else 0,
                }
            )

    top_batters = [
        {"Rank": rank, "Batter": name, "Runs": runs}
        for rank, (name, runs) in enumerate(batter_runs.most_common(5), start=1)
    ]
    top_bowlers = [
        {"Rank": rank, "Bowler": name, "Wickets": wickets}
        for rank, (name, wickets) in enumerate(bowler_wickets.most_common(5), start=1)
    ]

    phase_edges = {}
    for phase in [item[0] for item in PHASES]:
        win_avg = next(row["Average Runs"] for row in phase_summary if row["Phase"] == phase and row["Team Result"] == "Winner")
        lose_avg = next(row["Average Runs"] for row in phase_summary if row["Phase"] == phase and row["Team Result"] == "Loser")
        phase_edges[phase] = win_avg - lose_avg

    return toss_summary, phase_summary, top_batters, top_bowlers, phase_edges


def svg_bar_chart(title, labels, series, output_path, y_suffix=""):
    width = 900
    height = 520
    margin_left = 90
    margin_bottom = 80
    chart_width = width - margin_left - 50
    chart_height = height - 130
    max_value = max(value for _, values in series for value in values) or 1
    colors = ["#2563eb", "#f97316", "#16a34a"]
    group_width = chart_width / len(labels)
    bar_width = min(70, group_width / (len(series) + 1.2))

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#ffffff"/>',
        f'<text x="{margin_left}" y="42" font-family="Arial" font-size="28" font-weight="700" fill="#111827">{title}</text>',
        f'<line x1="{margin_left}" y1="{height - margin_bottom}" x2="{width - 50}" y2="{height - margin_bottom}" stroke="#374151" stroke-width="1.5"/>',
        f'<line x1="{margin_left}" y1="90" x2="{margin_left}" y2="{height - margin_bottom}" stroke="#374151" stroke-width="1.5"/>',
    ]

    for tick in range(0, 6):
        value = max_value * tick / 5
        y = height - margin_bottom - (value / max_value) * chart_height
        parts.append(f'<line x1="{margin_left}" y1="{y:.1f}" x2="{width - 50}" y2="{y:.1f}" stroke="#e5e7eb"/>')
        parts.append(f'<text x="{margin_left - 12}" y="{y + 5:.1f}" text-anchor="end" font-family="Arial" font-size="13" fill="#4b5563">{value:.0f}{y_suffix}</text>')

    for group_index, label in enumerate(labels):
        base_x = margin_left + group_index * group_width + group_width / 2
        total_bars = len(series)
        start_x = base_x - (total_bars * bar_width + (total_bars - 1) * 12) / 2
        for series_index, (series_name, values) in enumerate(series):
            value = values[group_index]
            bar_height = (value / max_value) * chart_height
            x = start_x + series_index * (bar_width + 12)
            y = height - margin_bottom - bar_height
            parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_width:.1f}" height="{bar_height:.1f}" rx="4" fill="{colors[series_index]}"/>')
            parts.append(f'<text x="{x + bar_width / 2:.1f}" y="{y - 8:.1f}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#111827">{value:.1f}{y_suffix}</text>')
        parts.append(f'<text x="{base_x:.1f}" y="{height - 38}" text-anchor="middle" font-family="Arial" font-size="15" fill="#111827">{label}</text>')

    legend_x = margin_left
    for index, (series_name, _) in enumerate(series):
        x = legend_x + index * 155
        parts.append(f'<rect x="{x}" y="62" width="16" height="16" fill="{colors[index]}"/>')
        parts.append(f'<text x="{x + 24}" y="75" font-family="Arial" font-size="14" fill="#111827">{series_name}</text>')

    parts.append("</svg>")
    output_path.write_text("\n".join(parts), encoding="utf-8")


def write_markdown_report(path, seasons, match_rows, toss_summary, phase_summary, top_batters, top_bowlers, phase_edges):
    strongest_phase = max(phase_edges.items(), key=lambda item: abs(item[1]))
    toss_winners = toss_summary[0]
    toss_losers = toss_summary[1]
    lines = [
        "# IPL CRUNCH '26 Submission Summary",
        "",
        f"Dataset used: latest five seasons available in the JSON folder, {min(seasons)}-{max(seasons)}.",
        f"Matches analysed: {len([row for row in match_rows if row['winner']])} completed matches.",
        "",
        "## Answer 1: Do toss winners win more matches?",
        "",
        f"Toss winners won {percentage(toss_winners['Win Rate'] * 100)} of completed matches; toss losers won {percentage(toss_losers['Win Rate'] * 100)}.",
        "",
        "## Answer 2: Which phase is most linked to winning?",
        "",
        f"The biggest winner-loser scoring gap was in the {strongest_phase[0].lower()}: winning teams averaged {abs(strongest_phase[1]):.1f} more runs than losing teams in that phase.",
        "",
        "## Top 5 Batters by Runs",
        "",
        "| Rank | Batter | Runs |",
        "|---:|---|---:|",
    ]
    lines.extend(f"| {row['Rank']} | {row['Batter']} | {row['Runs']} |" for row in top_batters)
    lines.extend(
        [
            "",
            "## Top 5 Bowlers by Wickets",
            "",
            "| Rank | Bowler | Wickets |",
            "|---:|---|---:|",
        ]
    )
    lines.extend(f"| {row['Rank']} | {row['Bowler']} | {row['Wickets']} |" for row in top_bowlers)
    lines.extend(
        [
            "",
            "## Surprising Finding",
            "",
            f"I expected the toss to decide more games, but the data showed only a small edge for toss winners while the {strongest_phase[0].lower()} scoring gap was much more visible.",
            "",
            "## Files to Upload",
            "",
            "- `charts/toss_win_rate.svg`",
            "- `charts/phase_runs.svg`",
            "- `summary/top_batters.csv`",
            "- `summary/top_bowlers.csv`",
            "- `summary/submission_summary.md`",
            "- `ipl_crunch_analysis.py` as proof of the Python work",
        ]
    )
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Build IPL Crunch hackathon CSVs, charts, and summary from Cricsheet JSON.")
    parser.add_argument("--input-dir", default=r"C:\Users\arka7\Downloads\ipl_json", help="Folder containing Cricsheet IPL JSON files.")
    parser.add_argument("--output-dir", default="ipl_crunch_26/outputs", help="Output folder for CSVs, charts, and summary.")
    parser.add_argument("--latest-seasons", type=int, default=5, help="Number of latest seasons to analyse.")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    csv_dir = output_dir / "csv"
    chart_dir = output_dir / "charts"
    summary_dir = output_dir / "summary"
    chart_dir.mkdir(parents=True, exist_ok=True)
    summary_dir.mkdir(parents=True, exist_ok=True)

    matches = load_matches(args.input_dir)
    selected_seasons = choose_seasons(matches, args.latest_seasons)
    ball_rows, match_rows, batter_runs, bowler_wickets, phase_runs = flatten_matches(matches, selected_seasons)
    toss_summary, phase_summary, top_batters, top_bowlers, phase_edges = build_summary(
        match_rows, ball_rows, batter_runs, bowler_wickets, phase_runs
    )

    write_csv(csv_dir / "ipl_ball_by_ball.csv", ball_rows, list(ball_rows[0].keys()))
    write_csv(csv_dir / "ipl_matches.csv", match_rows, list(match_rows[0].keys()))
    write_csv(summary_dir / "toss_summary.csv", toss_summary, ["Group", "Matches", "Wins", "Win Rate"])
    write_csv(summary_dir / "phase_summary.csv", phase_summary, ["Phase", "Team Result", "Total Runs", "Innings", "Average Runs"])
    write_csv(summary_dir / "top_batters.csv", top_batters, ["Rank", "Batter", "Runs"])
    write_csv(summary_dir / "top_bowlers.csv", top_bowlers, ["Rank", "Bowler", "Wickets"])

    svg_bar_chart(
        "Win Rate: Toss Winners vs Toss Losers",
        [row["Group"] for row in toss_summary],
        [("Win rate", [row["Win Rate"] * 100 for row in toss_summary])],
        chart_dir / "toss_win_rate.svg",
        "%",
    )
    svg_bar_chart(
        "Average Runs by Match Phase",
        [phase for phase, _, _ in PHASES],
        [
            ("Winning teams", [row["Average Runs"] for row in phase_summary if row["Team Result"] == "Winner"]),
            ("Losing teams", [row["Average Runs"] for row in phase_summary if row["Team Result"] == "Loser"]),
        ],
        chart_dir / "phase_runs.svg",
    )
    write_markdown_report(summary_dir / "submission_summary.md", selected_seasons, match_rows, toss_summary, phase_summary, top_batters, top_bowlers, phase_edges)

    print(f"Analysed seasons: {selected_seasons}")
    print(f"Completed matches: {len([row for row in match_rows if row['winner']])}")
    print(f"Ball rows: {len(ball_rows)}")
    print(f"Outputs written to: {output_dir.resolve()}")


if __name__ == "__main__":
    main()
