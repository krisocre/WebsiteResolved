"""ReputationResolved rating visibility model, v1.0 (2026-11-12).

Run with Python 3: python rating-visibility-model.py
Writes the CSV and summary JSON beside this file. Standard library only.

These are feasible mathematical states, not businesses or customer results.
Google documents an arithmetic average; one-decimal half-up presentation is
our modelling assumption, not a verified specification of Google's interface.
"""
import csv
import json
from pathlib import Path

SIZES = (10, 25, 50, 100, 250, 500, 1000)
VERSION = "1.0"
DATE = "2026-11-12"


def display_tenths(points, count):
    """Nearest tenth, ties rounded up, using exact integer arithmetic."""
    return (20 * points + count) // (2 * count)


def generate():
    rows, summary = [], []
    for count in SIZES:
        group = []
        for points in range(4 * count, 49 * count // 10 + 1):
            remaining_count, remaining_points = count - 1, points - 1
            if not remaining_count <= remaining_points <= 5 * remaining_count:
                continue  # A one-star rating must be possible in this profile.
            before = display_tenths(points, count)
            after = display_tenths(remaining_points, remaining_count)
            row = {
                "review_count_before": count,
                "star_points_before": points,
                "removed_rating": 1,
                "review_count_after": remaining_count,
                "star_points_after": remaining_points,
                "mean_before": f"{points / count:.6f}",
                "mean_after": f"{remaining_points / remaining_count:.6f}",
                "display_before": f"{before / 10:.1f}",
                "display_after": f"{after / 10:.1f}",
                "display_unchanged": before == after,
            }
            rows.append(row)
            group.append(row)
        unchanged = sum(row["display_unchanged"] for row in group)
        summary.append({
            "review_count": count,
            "feasible_states": len(group),
            "unchanged_states": unchanged,
            "changed_states": len(group) - unchanged,
            "unchanged_percent": round(100 * unchanged / len(group), 6),
        })
    assert len(rows) == 1744
    assert [(r["feasible_states"], r["unchanged_states"]) for r in summary] == [
        (7, 0), (22, 0), (46, 13), (91, 64), (226, 195), (451, 424), (901, 874)
    ]
    assert all(float(row["mean_after"]) > float(row["mean_before"]) for row in rows)
    return rows, summary


def main():
    destination = Path(__file__).resolve().parent
    rows, groups = generate()
    with (destination / "rating-visibility-scenarios.csv").open("w", newline="", encoding="utf-8") as output:
        writer = csv.DictWriter(output, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    document = {
        "title": "One-star removal and one-decimal score visibility",
        "creator": "ReputationResolved",
        "version": VERSION,
        "date": DATE,
        "data_kind": "Exhaustive mathematical enumeration within specified bounds; not observations",
        "source_for_average": "https://support.google.com/business/answer/4801187?hl=en",
        "assumptions": [
            "One one-star rating is removed; no other rating changes.",
            "Review counts are 10, 25, 50, 100, 250, 500 and 1000.",
            "Integer starting star-point totals imply unrounded means from 4.0 to at most 4.9.",
            "Remaining ratings must be feasible on the integer one-to-five-star scale.",
            "The model rounds to one decimal with half-up ties; Google's exact presentation is not asserted.",
            "Each feasible point total receives one row; this is not a probability distribution of businesses.",
            "Rounded mean columns are descriptive; integer point/count columns reproduce exact calculations.",
            "No pooled percentage, customer success rate, ranking effect, timing or revenue is estimated.",
        ],
        "scenario_count": len(rows),
        "groups": groups,
    }
    (destination / "rating-visibility-summary.json").write_text(json.dumps(document, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(rows):,} feasible states in {len(groups)} review-count groups.")


if __name__ == "__main__":
    main()
