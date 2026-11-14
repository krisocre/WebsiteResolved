"""Render the original blog figures from the downloadable research files."""
import csv
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "research"
OUT.mkdir(parents=True, exist_ok=True)
PAPER, INK, MUTED, WINE, LINE = "#fcf9f4", "#332c2d", "#6d6065", "#642f40", "#ded0c7"
plt.rcParams.update({"font.family":"DejaVu Sans", "font.size":11, "text.color":INK,
    "axes.labelcolor":MUTED, "xtick.color":MUTED, "ytick.color":INK,
    "figure.facecolor":PAPER, "axes.facecolor":PAPER, "svg.hashsalt":"reputationresolved-research-v1"})


def save(fig, name):
    fig.savefig(OUT / f"{name}.svg", metadata={"Date":"2026-11-12", "Creator":"ReputationResolved"})
    fig.savefig(OUT / f"{name}.png", dpi=150, metadata={"Date":"2026-11-12", "Creator":"ReputationResolved"})
    plt.close(fig)


def clean_axes(ax):
    for side in ("top","right","left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(LINE)
    ax.tick_params(axis="both", length=0, pad=10)
    ax.set_axisbelow(True)


def rating_bars(groups, mobile=False):
    fig, ax = plt.subplots(figsize=(4.2,5.0) if mobile else (8,4.8), dpi=150)
    fig.subplots_adjust(left=.23 if mobile else .15, right=.91, top=.80, bottom=.17)
    values=[group["unchanged_percent"] for group in groups]
    ax.barh(range(len(groups)),values,color=WINE,height=.55)
    ax.set_yticks(range(len(groups)),[f'{group["review_count"]:,}' for group in groups])
    ax.invert_yaxis();ax.set_xlim(0,115);ax.set_xticks([0,25,50,75,100]);ax.xaxis.set_major_formatter(FuncFormatter(lambda value,_:f"{value:.0f}%"))
    ax.grid(axis="x",color=LINE,linewidth=.7)
    for i,value in enumerate(values):
        ax.text(value+2,i,f"{value:.1f}%",va="center",fontsize=10 if mobile else 11,fontweight="bold",color=WINE)
    clean_axes(ax);ax.set_ylabel("Reviews before removal",labelpad=13,fontsize=10)
    fig.text(.06,.94,"When the rounded score stays the same",fontsize=12 if mobile else 16,fontweight="bold")
    fig.text(.06,.885,"After one 1-star removal; no other changes",fontsize=9 if mobile else 11,color=MUTED)
    fig.text(.06,.055,"Share of modeled starting states, not a removal success rate.",fontsize=8 if mobile else 10,color=MUTED)
    save(fig,"rating-visibility"+("-mobile" if mobile else ""))


def same_start(mobile=False):
    counts=[10,50,100,500]
    fig,ax=plt.subplots(figsize=(4.2,4.8) if mobile else (8,4.8),dpi=150)
    fig.subplots_adjust(left=.23 if mobile else .16,right=.94,top=.78,bottom=.20)
    for i,count in enumerate(counts):
        total=44*count//10;after=(total-1)/(count-1)
        displayed=((20*(total-1)+(count-1))//(2*(count-1)))/10
        ax.plot([4.4,after],[i,i],color="#b9988c",linewidth=3)
        ax.scatter([4.4],[i],s=55,color="#d9c5ba",zorder=3)
        ax.scatter([after],[i],s=75,color=WINE,zorder=4)
        ax.text(4.92,i,f"4.4 → {displayed:.1f}",ha="right",va="center",fontsize=10 if mobile else 12,color=WINE,fontweight="bold")
    ax.set_yticks(range(4),[f"{count:,}" for count in counts]);ax.invert_yaxis()
    ax.set_xlim(4.36,4.95);ax.set_xticks([4.4,4.5,4.6,4.7,4.8]);ax.set_xlabel("Unrounded average",labelpad=12,fontsize=10)
    ax.set_ylabel("Starting reviews",labelpad=12,fontsize=10);ax.grid(axis="x",color=LINE,linewidth=.7);clean_axes(ax)
    fig.text(.06,.94,"The same removal, four profile sizes",fontsize=12 if mobile else 16,fontweight="bold")
    fig.text(.06,.855,"Every profile starts at 4.4. Right-hand labels\nshow the modeled one-decimal display.",fontsize=9 if mobile else 11,color=MUTED)
    fig.text(.06,.045,"Original model. No new reviews, edits, delays or other removals.",fontsize=8 if mobile else 10,color=MUTED)
    save(fig,"rating-same-start"+("-mobile" if mobile else ""))


def evidence_matrix(document,mobile=False):
    cases=document["cases"];routes=["More context","Assess policy fit","Dedicated report"]
    colors=["#87977e",WINE,"#b36a47"]
    fig,ax=plt.subplots(figsize=(4.2,6.5) if mobile else (8,6.5),dpi=150)
    fig.subplots_adjust(left=.58 if mobile else .39,right=.96,top=.78,bottom=.12)
    for y,case in enumerate(cases):
        ax.axhline(y+.5,color=LINE,linewidth=.6)
        x=routes.index(case["route"])
        ax.scatter([x],[y],s=90 if mobile else 150,color=colors[x],zorder=3)
    ax.set_yticks(range(len(cases)),[case["title"] for case in cases]);ax.tick_params(axis="y",labelsize=8.5 if mobile else 10)
    ax.set_xticks(range(3),["More\ncontext","Assess\npolicy fit","Dedicated\nreport"]);ax.xaxis.tick_top();ax.tick_params(axis="x",labelsize=8 if mobile else 10,pad=12)
    ax.set_xlim(-.5,2.5);ax.set_ylim(len(cases)-.5,-.5)
    for spine in ax.spines.values():spine.set_visible(False)
    ax.tick_params(length=0)
    fig.text(.06,.945,"A clue is the start of the assessment",fontsize=12 if mobile else 16,fontweight="bold")
    fig.text(.06,.89,"Twelve examples, with a next step for each",fontsize=9 if mobile else 11,color=MUTED)
    fig.text(.06,.045,"Illustrative cases; our coding. Not Google decisions or outcomes.",fontsize=7.5 if mobile else 10,color=MUTED)
    save(fig,"review-evidence-matrix"+("-mobile" if mobile else ""))


def main():
    summary=json.loads((ROOT/"data/rating-visibility-summary.json").read_text(encoding="utf-8"))
    evidence=json.loads((ROOT/"data/review-evidence-matrix.json").read_text(encoding="utf-8"))
    fields=["id","title","signal","supported","not_established","route","next_step","source_urls"]
    with (ROOT/"data/review-evidence-matrix.csv").open("w",encoding="utf-8",newline="") as output:
        writer=csv.DictWriter(output,fieldnames=fields);writer.writeheader()
        for case in evidence["cases"]:
            row={field:case[field] for field in fields if field!="source_urls"}
            row["source_urls"]=" | ".join(evidence["sources"][key] for key in case["source_ids"])
            writer.writerow(row)
    for mobile in (False,True):
        rating_bars(summary["groups"],mobile);same_start(mobile);evidence_matrix(evidence,mobile)
    print("Rendered six original research figures as standalone SVG and PNG files; exported twelve evidence cases.")


if __name__=="__main__":main()
