# Sample Optimizer Output

## Scenario: NFL Week 12 Main Slate - GPP Tournament

### Input Data
- **20 lineups requested**
- **Player Pool**: 28 players across 5 games
- **Vegas Data**: Integrated (high totals = KC@LV 52.5, BUF@MIA 48.5)
- **Settings**: GPP mode with primary + bring-back + secondary stacks

---

## Optimization Summary

```
✓ Successfully generated 20 lineups in 4.2 seconds

Lineup Statistics:
- Average Projection: 144.3 points
- Average Salary: $49,712
- Average Ownership: 18.6%
- Salary Range: $49,100 - $49,900
- Team Diversity: 5.8 teams per lineup (avg)

Stacking Summary:
- Primary Stacks: 12/20 lineups (60%)
  * KC: 7 lineups
  * BUF: 3 lineups
  * PHI: 2 lineups

- Bring-Back: 6/20 lineups (30%)
  * LV WR vs KC: 4
  * MIA WR vs BUF: 2

- Secondary Stacks: 8/20 lineups (40%)
  * SF RB+DST: 5
  * DET RB+DST: 3
```

---

## Top 5 Lineups

### Lineup 1: $49,800 | 146.8 Proj | 17.2% Own

```
POS  PLAYER              TEAM  SALARY   PROJ   OWN%   VEGAS PROPS
QB   Patrick Mahomes     KC    $8,500   26.5   35%    295.5 yds, 2.5 TD
RB   Christian McCaffrey SF    $9,000   24.2   28%    130.5 yds, 0.5 TD
RB   Jahmyr Gibbs        DET   $6,800   17.8   18%    110.5 yds
WR   Travis Kelce        KC    $7,200   19.8   24%    78.5 yds, 0.5 TD
WR   Rashee Rice         KC    $5,800   16.2   18%    68.5 yds
WR   AJ Brown            PHI   $7,400   19.2   22%    78.5 yds
TE   Sam LaPorta         DET   $5,200   14.5   12%    55.5 yds
FLX  Amon-Ra St. Brown   DET   $7,600   19.5   26%    82.5 yds
DST  San Francisco       SF    $3,600    9.6    8%    vs ARI

STACK: KC Primary (Mahomes + Kelce + Rice)
SECONDARY: DET (Gibbs + St. Brown + LaPorta)
TEAMS: 4 (KC, SF, DET, PHI)
GAME SCRIPT: KC high total (52.5), SF favored (-6)
```

---

### Lineup 2: $49,700 | 145.9 Proj | 18.8% Own

```
POS  PLAYER              TEAM  SALARY   PROJ   OWN%
QB   Josh Allen          BUF   $8,200   25.8   28%
RB   Christian McCaffrey SF    $9,000   24.2   28%
RB   Derrick Henry       BAL   $7,800   19.8   25%
WR   Tyreek Hill         MIA   $8,200   22.1   32%
WR   Amon-Ra St. Brown   DET   $7,600   19.5   26%
WR   DeVonta Smith       PHI   $6,400   16.8   14%
TE   George Kittle       SF    $5,800   15.2   14%
FLX  Rashee Rice         KC    $5,800   16.2   18%
DST  San Francisco       SF    $3,600    9.6    8%

STACK: BUF Primary (Allen only)
BRING-BACK: MIA vs BUF (Tyreek Hill)
SECONDARY: SF (CMC + Kittle + DST)
TEAMS: 7 (BUF, SF, BAL, MIA, DET, PHI, KC)
GAME SCRIPT: Potential shootout BUF@MIA (48.5 total)
```

---

### Lineup 3: $49,600 | 145.2 Proj | 16.4% Own

```
POS  PLAYER              TEAM  SALARY   PROJ   OWN%
QB   Jalen Hurts         PHI   $7,800   24.2   22%
RB   Christian McCaffrey SF    $9,000   24.2   28%
RB   Bijan Robinson      ATL   $7,500   18.5   22%
WR   Justin Jefferson    MIN   $8,000   21.5   28%
WR   AJ Brown            PHI   $7,400   19.2   22%
WR   DeVonta Smith       PHI   $6,400   16.8   14%
TE   Travis Kelce        KC    $7,200   19.8   24%
FLX  CeeDee Lamb         DAL   $7,800   20.8   24%
DST  Kansas City         KC    $3,400    8.8    6%

STACK: PHI Primary (Hurts + AJ Brown + DeVonta Smith)
BRING-BACK: DAL vs PHI (CeeDee Lamb)
TEAMS: 6 (PHI, SF, ATL, MIN, KC, DAL)
GAME SCRIPT: PHI favored (-7), bring-back game theory
```

---

### Lineup 4: $49,500 | 144.8 Proj | 19.2% Own

```
POS  PLAYER              TEAM  SALARY   PROJ   OWN%
QB   Patrick Mahomes     KC    $8,500   26.5   35%
RB   Derrick Henry       BAL   $7,800   19.8   25%
RB   Jahmyr Gibbs        DET   $6,800   17.8   18%
WR   Tyreek Hill         MIA   $8,200   22.1   32%
WR   Rashee Rice         KC    $5,800   16.2   18%
WR   Davante Adams       LV    $6,800   17.5   16%
TE   Mark Andrews        BAL   $6,400   16.5   18%
FLX  Rhamondre Stevenson NE    $6,200   15.2   14%
DST  Detroit             DET   $3,200    8.2    5%

STACK: KC Primary (Mahomes + Rice)
BRING-BACK: LV vs KC (Davante Adams)
SECONDARY: DET (Gibbs + DST)
TEAMS: 6 (KC, BAL, DET, MIA, LV, NE)
GAME SCRIPT: KC vs LV shootout potential
```

---

### Lineup 5: $49,900 | 144.5 Proj | 21.5% Own

```
POS  PLAYER              TEAM  SALARY   PROJ   OWN%
QB   Jared Goff          DET   $7,200   22.5   15%
RB   Christian McCaffrey SF    $9,000   24.2   28%
RB   Bijan Robinson      ATL   $7,500   18.5   22%
WR   Justin Jefferson    MIN   $8,000   21.5   28%
WR   Amon-Ra St. Brown   DET   $7,600   19.5   26%
WR   AJ Brown            PHI   $7,400   19.2   22%
TE   Sam LaPorta         DET   $5,200   14.5   12%
FLX  Tyreek Hill         MIA   $8,200   22.1   32%
DST  Buffalo             BUF   $3,000    7.5    4%

STACK: DET Primary (Goff + St. Brown + LaPorta)
SECONDARY: SF (CMC + DST)
TEAMS: 6 (DET, SF, ATL, MIN, PHI, MIA, BUF)
GAME SCRIPT: DET@GB high total (47.5), lower ownership QB
```

---

## Player Exposure Report

### Quarterbacks
```
Player              Lineups  Exposure  Avg Salary  Proj  Own%
Patrick Mahomes     12/20    60%       $8,500      26.5  35%
Josh Allen          5/20     25%       $8,200      25.8  28%
Jalen Hurts         2/20     10%       $7,800      24.2  22%
Jared Goff          1/20      5%       $7,200      22.5  15%
```

**Analysis**: Heavy on Mahomes (60%) as expected in KC's high-total game. Good diversification with Allen secondary option.

### Running Backs
```
Player              Lineups  Exposure  Avg Salary  Proj  Own%
Christian McCaffrey 16/20    80%       $9,000      24.2  28%
Jahmyr Gibbs        7/20     35%       $6,800      17.8  18%
Derrick Henry       7/20     35%       $7,800      19.8  25%
Bijan Robinson      5/20     25%       $7,500      18.5  22%
Rhamondre Stevenson 3/20     15%       $6,200      15.2  14%
Isiah Pacheco       2/20     10%       $5,800      14.5  12%
```

**Analysis**: Very heavy CMC (80%) - he's the best play. Good mix of mid-tier RBs for balance.

### Wide Receivers
```
Player              Lineups  Exposure  Avg Salary  Proj  Own%
Rashee Rice         10/20    50%       $5,800      16.2  18%
Amon-Ra St. Brown   9/20     45%       $7,600      19.5  26%
AJ Brown            8/20     40%       $7,400      19.2  22%
Tyreek Hill         7/20     35%       $8,200      22.1  32%
Justin Jefferson    6/20     30%       $8,000      21.5  28%
DeVonta Smith       5/20     25%       $6,400      16.8  14%
CeeDee Lamb         4/20     20%       $7,800      20.8  24%
Davante Adams       3/20     15%       $6,800      17.5  16%
```

**Analysis**: Rashee Rice high exposure (50%) - value play in KC stack. Good spread across top WRs.

### Tight Ends
```
Player              Lineups  Exposure  Avg Salary  Proj  Own%
Travis Kelce        9/20     45%       $7,200      19.8  24%
Sam LaPorta         6/20     30%       $5,200      14.5  12%
George Kittle       3/20     15%       $5,800      15.2  14%
Mark Andrews        2/20     10%       $6,400      16.5  18%
```

**Analysis**: Kelce high (45%) for KC stacks. LaPorta good value option.

### Defense
```
Player              Lineups  Exposure  Avg Salary  Proj  Own%
San Francisco       11/20    55%       $3,600       9.6   8%
Detroit             5/20     25%       $3,200       8.2   5%
Kansas City         3/20     15%       $3,400       8.8   6%
Buffalo             1/20      5%       $3,000       7.5   4%
```

**Analysis**: SF DST very popular (55%) - great matchup vs ARI, pairs with CMC.

---

## Stacking Breakdown

### Primary Stacks Used

```
Stack                     Lineups  Positions          Avg Proj
KC (Mahomes/Kelce/Rice)   7/20     QB+TE+WR          62.5
BUF (Allen)               3/20     QB only           25.8
PHI (Hurts/Brown/Smith)   2/20     QB+WR+WR          60.2
DET (Goff/ARSB/LaPorta)   1/20     QB+WR+TE          56.5
```

**Analysis**:
- 65% of lineups have full 3-player primary stack
- KC most popular (7 lineups) due to highest game total
- Good diversity prevents over-concentration

### Bring-Back Stacks

```
Opponent Stack            Lineups  Player(s)         Logic
LV vs KC                  4/20     Davante Adams     If KC scores, LV throws
MIA vs BUF                2/20     Tyreek Hill       Shootout potential
DAL vs PHI                2/20     CeeDee Lamb       PHI scoring = DAL passing
```

**Analysis**: Bring-backs in 40% of lineups (8/20). Good game theory application.

### Secondary Stacks

```
Stack                     Lineups  Positions          Logic
SF (CMC + DST)            5/20     RB+DST            Positive game script
DET (Gibbs + DST)         3/20     RB+DST            Home favorite
```

**Analysis**: Secondary stacks in 40% (8/20), all using RB+DST pairing.

---

## Salary Distribution

```
Salary Range     Lineups  Percentage
$49,900-50,000   3/20     15%
$49,700-49,899   8/20     40%
$49,500-49,699   6/20     30%
$49,100-49,499   3/20     15%

Average Salary: $49,712
Median Salary:  $49,700
```

**Analysis**: Good salary usage, most lineups in $49,700-49,900 range. No cap space wasted.

---

## Ownership Analysis

```
Lineup Ownership Buckets:
15-17%: 3 lineups  (Low own - contrarian)
17-19%: 8 lineups  (Mid own - balanced)
19-21%: 7 lineups  (Higher own - chalkier)
21-23%: 2 lineups  (Chalk - safer)

Average Lineup Ownership: 18.6%
```

**Analysis**: Good spread. Mix of contrarian + balanced lineups. No super-chalky lineups >25%.

---

## Correlation Scores

```
Top Correlated Lineups:
1. Lineup 1: Score 8.5 (KC 3-stack + DET 3-stack)
2. Lineup 3: Score 7.8 (PHI 3-stack + bring-back)
3. Lineup 5: Score 7.2 (DET 3-stack)

Lowest Correlation:
18. Lineup 18: Score 3.2 (spread across 8 teams)
```

**Analysis**: High variance in correlation. Some super-stacked (GPP upside), some spread (safer).

---

## Game Theory Insights

### Lineup 1 (Highest Projection)
- **Stacks**: KC primary (Mahomes/Kelce/Rice) + DET secondary
- **Theory**: KC blowout of LV = passing TDs. DET favored over GB.
- **Risk**: If KC runs up score, they may run ball late
- **Upside**: Mahomes 3+ TDs with multiple receivers = massive ceiling

### Lineup 2 (Bring-Back Heavy)
- **Stacks**: BUF primary + MIA bring-back (Tyreek)
- **Theory**: BUF@MIA shootout. If Allen scores, Tua throws to Tyreek.
- **Risk**: Game script goes one-sided
- **Upside**: True shootout hits all offensive players

### Lineup 5 (Contrarian QB)
- **Stacks**: DET primary with Goff (15% owned)
- **Theory**: DET vs GB high total, but Goff low owned vs Mahomes/Allen
- **Risk**: Goff underperforms compared to elite QBs
- **Upside**: If Goff has big game, lineup very unique

---

## Recommendations

### For GPPs (Based on These Lineups)

**Enter Lineups 1-15** (75% of pool)
- Best balance of projection, correlation, and ownership
- Mix of popular + contrarian plays
- Good stacking diversity

**Consider Lineups 16-20** for "Hail Mary" entries
- Lower projected but very unique
- Could hit big if chalk busts

### Adjustments to Consider

**If You Want More Chalk:**
- Lock: Mahomes, CMC, Tyreek Hill
- Increase min exposure for studs
- Result: Safer but needs perfection

**If You Want More Contrarian:**
- Exclude: Mahomes (35% owned)
- Lock: Goff or Purdy (15% owned)
- Lower max ownership to 20%
- Result: Higher variance, higher upside

**If News Breaks:**
- Player ruled out? Re-run optimizer
- Line moves (e.g., total drops to 45)? Adjust
- Weather concerns? Exclude outdoor games

---

## Upload Instructions

### To DraftKings:
1. Save lineups as `nfl_week12_lineups.csv`
2. Go to contest
3. Click "Upload Lineups"
4. Select file
5. Review (should see all 20 lineups)
6. Submit entries

### Format Example:
```csv
QB,RB,RB,WR,WR,WR,TE,FLEX,DST
DK-12345,DK-22345,DK-22348,DK-42345,DK-32348,DK-32350,DK-42347,DK-32352,DK-52345
DK-12346,DK-22345,DK-22347,DK-32345,DK-32352,DK-32351,DK-42348,DK-32348,DK-52345
...
```

---

## Expected Results

**If Lineups Hit:**
```
Best Case (everything hits):
- Lineup 1 scores 180+ points
- Multiple lineups cash (150+)
- At least 1 lineup top 1%

Realistic Case:
- 2-3 lineups cash (145-155)
- 1 lineup hits big (165+)
- ROI positive

Worst Case:
- Chalk busts (Mahomes/CMC poor games)
- 0-1 lineups cash
- Loss
```

**Keys to Success:**
1. Mahomes needs 25+ (he's in 60% of lineups)
2. CMC needs 20+ (he's in 80%!)
3. At least one stack hits big
4. Low-owned DST scores well (leverage)

---

**Good luck! 🏆**

*Note: This is a demonstration. Actual results depend on real player performance, which is unpredictable.*
