# How to Run the Optimizer for This Week's Games

## Step-by-Step Guide

### Method 1: Full Workflow (With CSV Import)

#### **Step 1: Get This Week's Player Pool**

1. **Go to DraftKings or FanDuel**
   - Navigate to this week's main slate
   - For NFL: Sunday main slate
   - For NBA: Tonight's games
   - For MLB: Today's games

2. **Export Player Pool**
   - **DraftKings**:
     - Click "Download Players List"
     - Save as `dk_players_week_X.csv`
   - **FanDuel**:
     - Click "Export CSV"
     - Save as `fd_players_week_X.csv`

#### **Step 2: Get Projections (Optional but Recommended)**

Choose one:

**Option A: Use DFS Site Projections** (Free)
- Included in the CSV you just downloaded
- Basic but serviceable

**Option B: Add Better Projections** ($)
- **FantasyPros** ($19.99/mo): Download their DFS projections
- **RotoGrinders** ($29/mo): Export projections
- **Establish The Run** ($24.99/mo): Get projections CSV
- **4for4** ($24.95/mo): Download weekly projections

**Option C: Build Your Own** (Free)
- Scrape player stats
- Create simple model (e.g., last 3 games average)
- Export as CSV with columns: Name, Position, Projection

#### **Step 3: Scrape Vegas Data** (Optional but Powerful)

1. **Open Vegas Betting Sites in Chrome**
   - DraftKings Sportsbook: https://sportsbook.draftkings.com/leagues/football/nfl
   - FanDuel Sportsbook: https://sportsbook.fanduel.com/navigation/nfl
   - PrizePicks: https://app.prizepicks.com/board

2. **Use Extension to Scrape**
   - Click the extension icon
   - Click "Scrape Vegas Data"
   - Select sources: DraftKings + FanDuel + PrizePicks
   - Wait 10-30 seconds
   - Extension captures all lines and props

**What You Get:**
```
Game Lines:
- KC -7.5 vs LV, O/U 52.5
- BUF -3 vs MIA, O/U 48.5

Player Props:
- Mahomes: 295.5 pass yds, 2.5 TDs
- Allen: 265.5 pass yds, 2.5 TDs
- CMC: 115.5 rush+rec yds, 0.5 TDs
```

#### **Step 4: Load Extension**

1. **Open Chrome** → Go to `chrome://extensions/`
2. **Enable Developer Mode** (top-right toggle)
3. **Click "Load Unpacked"**
4. **Select** the `SaberSim-Plugin` folder
5. **Pin Extension** (puzzle icon → pin)

#### **Step 5: Import Data**

1. **Click Extension Icon**
2. **Choose Mode**: Select "Import CSV (No API Required)"
3. **Import Player Pool**:
   - Click "Choose File"
   - Select your DK/FD CSV
   - Click "Import Players"
   - Should see: "✓ Imported 250 players from DraftKings"

4. **Import Projections** (if using separate file):
   - Click "Import Projections"
   - Select your projections CSV
   - Extension will merge with player pool

5. **Vegas Data** (if scraped):
   - Should auto-load from scraping step
   - Or click "Import Vegas Data" and select saved JSON

#### **Step 6: Configure Optimization**

##### **Basic Settings**
```
Sport: NFL
Contest Type: Classic
Site: DraftKings
Salary Cap: 50000
Number of Lineups: 20
```

##### **Advanced Settings** (Click "Show Advanced")

**For GPP Tournaments:**
```javascript
Filters:
  ☐ Lock: [Your core plays]
  ☐ Exclude: [Injured/bad matchups]
  ☑ Max Ownership: 25% (fade chalk)

Stacking:
  ☑ Primary Stack
    Positions: QB, WR, WR
    Exposure: 60%
    Teams: KC, BUF, MIA

  ☑ Bring-Back
    Positions: WR
    Max Players: 1
    Exposure: 30%

  ☑ Secondary Stack
    Positions: RB, DST
    Exposure: 40%

Diversity:
  ☑ Enabled
  Method: Simulation
  Factor: 0.3 (moderate diversity)

Exposure:
  QB Max: 60%
  RB Max: 40%
  WR Max: 50%
  DST Max: 30%

Salary:
  Min Total: 49000
  QB Min: 6500
  Max from Team: 4
```

**For Cash Games (50/50):**
```javascript
Filters:
  ☑ Lock: [All your core plays]

Stacking:
  ☑ Primary Stack only
    Exposure: 100%

Diversity:
  ☐ Disabled

Exposure:
  All positions: 80-100% (heavy core)

Salary:
  Min Total: 49500
```

#### **Step 7: Optimize**

1. **Click "Optimize Lineups"**
2. **Wait 5-15 seconds** (depending on # of lineups)
3. **Review Results**:
   ```
   Lineup 1: $49,800 | 145.2 proj
   - QB: Mahomes $8500 | 26.5
   - RB: CMC $9000 | 24.2
   - RB: Bijan $7500 | 18.5
   ... (full lineup shown)
   ```

4. **Check Lineup Quality**:
   - Projections look reasonable?
   - Good mix of teams?
   - Stacks make sense?
   - Exposure spread properly?

#### **Step 8: Export**

1. **Click "Export for DraftKings"** (or FanDuel)
2. **Save CSV**: `my_lineups_week_X.csv`
3. **Review in Excel/Google Sheets** (optional)

#### **Step 9: Upload to DFS Site**

**DraftKings:**
1. Go to your contest
2. Click "Bulk Upload"
3. Select the CSV file
4. Review lineups
5. Click "Submit Entries"

**FanDuel:**
1. Navigate to contest
2. Click "Upload Lineups"
3. Select CSV
4. Confirm

#### **Step 10: Monitor & Adjust**

**Before Lock:**
- Check injury news
- Update any late scratches
- Re-optimize if needed
- Lock in your entries

**During Games:**
- Track scoring
- Identify winning lineup patterns
- Take notes for next week

---

## Method 2: Demo Mode (Test Without Real Data)

Want to test the extension first? Use the built-in demo data:

1. **Load Extension**
2. **Click "Load Demo Data"**
3. **Extension loads sample players**:
   ```
   Sample NFL slate with:
   - 50 players across all positions
   - Sample projections
   - Sample salaries
   - Mock Vegas data
   ```

4. **Configure and Run**
5. **See how it works** before using real data

---

## Troubleshooting

### "No players imported"
- Check CSV format (must be DK/FD export)
- Ensure CSV isn't empty
- Try re-exporting from DFS site

### "Vegas scraping failed"
- Check you're on the betting site when clicking scrape
- Try one source at a time
- May need to disable ad blockers

### "Optimization failed"
- Loosen salary constraints
- Remove some filters
- Try fewer lineups first (5-10)

### "Lineups look weird"
- Check projections are reasonable
- Verify salary cap is correct
- Review filter settings

### "Can't upload to DK/FD"
- Check CSV format matches site requirements
- Ensure player IDs are correct
- Try re-exporting with site's format

---

## Tips for Success

### 1. **Start Small**
- First time: Generate 5-10 lineups
- Review them manually
- Make sure they make sense
- Then scale to 20-150

### 2. **Use Multiple Data Sources**
- Combine DFS site projections
- Add Vegas data
- Include news/injury reports
- Blend multiple projection sources

### 3. **Iterate**
- Generate lineups
- Review
- Adjust settings
- Re-generate
- Repeat until happy

### 4. **Track Results**
- Export lineups
- Save projections
- Track actual scores
- Learn what settings work

### 5. **Stay Updated**
- Check injury reports before lock
- Monitor Vegas line moves
- Be ready to re-optimize

---

## Weekly Workflow Example

### **Thursday**
- Download player pool
- Get initial projections
- Test optimizer with demo settings

### **Friday-Saturday**
- Scrape Vegas data
- Generate practice lineups
- Review and refine settings
- Identify core plays

### **Sunday Morning** (NFL)
- Check injury reports
- Update for late news
- Re-scrape Vegas (lines may have moved)
- Generate final 20-150 lineups
- Export to CSV

### **Sunday 12:45pm ET**
- Final injury check
- Upload lineups to DK/FD
- Submit entries
- Lock and load!

### **Sunday During Games**
- Track lineups
- See which stacks hit
- Learn for next week

### **Monday**
- Review results
- Analyze what worked
- Adjust strategy

---

## Current Week NFL Example (Template)

**Week X Main Slate**

**Step 1: Identify Game Environment**
```
High Totals (Vegas 48+):
- KC vs LV (52.5) ← Target for stacks
- BUF vs MIA (48.5)
- DET vs GB (47.5)

Low Totals (under 42):
- NYJ vs NE (38.5) ← Avoid
```

**Step 2: Core Plays** (Your research + projections)
```
QB Tier 1: Mahomes, Allen, Hurts
QB Tier 2: Goff, Stroud, Purdy

RB Tier 1: CMC, Bijan, Henry
RB Tier 2: Gibbs, Jacobs, Stevenson

WR Tier 1: Tyreek, Jefferson, Lamb
WR Tier 2: Kelce, Andrews, LaPorta
```

**Step 3: Primary Stacks**
```
Stack 1: Mahomes + Kelce + Rice (KC pass)
Stack 2: Allen + Diggs + Davis (BUF pass)
Stack 3: Hurts + Brown + Smith (PHI pass)
```

**Step 4: Bring-Backs**
```
vs KC: Adams (LV WR)
vs BUF: Waddle (MIA WR)
vs PHI: Lamb (DAL WR)
```

**Step 5: Secondary Stacks**
```
SF: CMC + SF DST
DET: Gibbs + DET DST
```

**Step 6: Filters**
```
Lock: [Your must-plays based on research]
Exclude: [Injured, terrible matchups]
Max Own: 30% (fade very chalky plays)
```

**Step 7: Generate**
```
20 GPP lineups with:
- 60% have primary stack
- 30% have bring-back
- 40% have secondary stack
- Diversity factor 0.3
```

---

## What You Should See

### **Good Lineup Output:**
```
Lineup 1: $49,800 | Proj 145.2 | Own 18.5%
QB  Mahomes       $8500  26.5   35%
RB  CMC           $9000  24.2   28%
RB  Bijan         $7500  18.5   22%
WR  Tyreek        $8200  22.1   32%
WR  Kelce (stack) $7200  19.8   24%
WR  Rice (stack)  $5800  16.2   18%
TE  LaPorta       $5200  14.5   12%
FLX Gibbs         $6800  17.8   15%
DST SF            $3600   9.6    8%

Stack: KC (Mahomes+Kelce+Rice)
Bring-Back: None
Secondary: SF (Gibbs+SF DST)
Team Count: 6 teams
```

### **Lineup Pool Overview:**
```
20 Lineups Generated

QB Exposure:
- Mahomes: 12/20 (60%)
- Allen: 5/20 (25%)
- Hurts: 3/20 (15%)

RB Exposure:
- CMC: 8/20 (40%)
- Bijan: 7/20 (35%)
- Gibbs: 5/20 (25%)

Primary Stacks:
- KC: 12 lineups
- BUF: 5 lineups
- PHI: 3 lineups

Avg Projection: 143.8
Avg Salary: $49,650
Avg Ownership: 16.2%
```

---

## Need Help?

**If you get stuck:**
1. Read `ADVANCED_FEATURES.md` for detailed docs
2. Try `QUICK_START_NO_API.md` for simple workflow
3. Use demo mode first to test
4. Start with basic settings, add advanced features gradually

**Common first-time issues:**
- CSV format not recognized → Re-export from DK/FD
- Projections missing → Use DFS site projections first
- Vegas scraping fails → Skip Vegas first time, add later
- Too complex → Start with just 5 lineups, basic settings

---

**Ready to win your DFS contests!** 🏆

Let me know which sport/slate you want to run and I can give you more specific guidance!
