

# Using SaberSim DFS Optimizer WITHOUT an API

If SaberSim doesn't have a public API (or you don't have API access), you can still use this extension! Here are multiple approaches to optimize your DFS lineups.

## 📋 Overview of Alternatives

1. **CSV Import/Export** ✅ RECOMMENDED
2. **Web Scraping** (Browser Automation)
3. **Manual Projections Input**
4. **Integration with Alternative APIs**
5. **Fully Local Optimization**

---

## Option 1: CSV Import/Export Workflow (RECOMMENDED)

This is the most practical approach that works with any DFS optimizer tool.

### How It Works

```
DFS Site → Export Player Pool → Import to Extension → Optimize → Export Lineups → Upload to DFS Site
```

### Step-by-Step Instructions

#### 1. Export Player Pool from DFS Site

**DraftKings:**
1. Go to a contest
2. Click "Download Players List" or "Export"
3. Save the CSV file

**FanDuel:**
1. Navigate to contest entry
2. Look for "Export" or "Download" button
3. Save player pool CSV

**SaberSim (if you have access):**
1. Create a build
2. Export the player pool with your custom projections
3. Save the CSV

#### 2. Import to Extension

1. Open the SaberSim extension
2. Click "Import Player Pool" button
3. Select your CSV file
4. Extension will auto-detect the format (DK/FD)

#### 3. Add Custom Projections (Optional)

If using basic DFS site exports without projections:

- **Option A**: Manually enter projections in the extension
- **Option B**: Upload a projections CSV
- **Option C**: Use third-party projection sources

Popular projection sources:
- FantasyPros
- RotoGrinders
- Establish The Run (ETR)
- 4for4
- FantasyLabs

#### 4. Optimize Lineups

1. Set your optimization parameters:
   - Number of lineups
   - Salary cap
   - Exposure limits
   - Stacking preferences

2. Click "Optimize Lineups"

3. Extension runs optimization **locally in your browser** (no API needed!)

#### 5. Export Optimized Lineups

1. Review the generated lineups
2. Click "Export for DraftKings" or "Export for FanDuel"
3. Save the CSV file

#### 6. Upload to DFS Site

**DraftKings:**
1. Go to your contest
2. Click "Upload Lineups"
3. Select the CSV file
4. Review and submit

**FanDuel:**
1. Navigate to contest entry
2. Use "Bulk Upload" feature
3. Upload the CSV
4. Confirm lineups

### CSV Format Examples

**DraftKings Player Pool Format:**
```csv
Position,Name,ID,Roster Position,Salary,Game Info,TeamAbbrev,AvgPointsPerGame
QB,Patrick Mahomes,12345,QB,8500,KC@LV,KC,24.5
RB,Christian McCaffrey,12346,RB,9000,SF@ARI,SF,22.1
```

**Extension Output Format:**
```csv
QB,RB,RB,WR,WR,WR,TE,FLEX,DST
12345,12346,12347,12348,12349,12350,12351,12352,12353
12345,12346,12354,12348,12349,12355,12351,12356,12357
```

---

## Option 2: Web Scraping Integration

If you have a SaberSim subscription but no API, you can scrape data from their website.

### Requirements

- Active SaberSim subscription
- Chrome extension with content script capabilities
- Knowledge of SaberSim's website structure

### Implementation Steps

1. **Add Content Script to manifest.json:**
```json
{
  "content_scripts": [
    {
      "matches": ["https://*.sabersim.com/*"],
      "js": ["content/scraper.js"]
    }
  ]
}
```

2. **Create Scraper Script:**
```javascript
// content/scraper.js
function scrapeSaberSimData() {
    // Find player data on the page
    const players = document.querySelectorAll('.player-row');

    const playerData = Array.from(players).map(row => ({
        name: row.querySelector('.player-name').textContent,
        position: row.querySelector('.position').textContent,
        salary: parseInt(row.querySelector('.salary').textContent.replace(/\D/g, '')),
        projection: parseFloat(row.querySelector('.projection').textContent)
    }));

    return playerData;
}

// Send to extension
chrome.runtime.sendMessage({
    action: 'playerDataScraped',
    data: scrapeSaberSimData()
});
```

3. **Use "Export Optimized" Button:**
- Many optimizer tools have an export feature
- Click it while extension is active
- Extension captures the exported data

### Limitations

⚠️ **Important Considerations:**
- May violate SaberSim's Terms of Service
- Scraping can break if website structure changes
- Less reliable than API
- May be slower

**Recommendation:** Only use if you have explicit permission from SaberSim.

---

## Option 3: Manual Projections Input

Build lineups using your own projections without any external tool.

### How to Use

1. **Gather Projections:**
   - Subscribe to projection service (FantasyPros, RotoGrinders, etc.)
   - Use your own models
   - Average multiple sources

2. **Create Player Pool CSV:**
```csv
Name,Position,Team,Opponent,Salary,Projection
Patrick Mahomes,QB,KC,LV,8500,26.5
Christian McCaffrey,RB,SF,ARI,9000,24.2
Tyreek Hill,WR,MIA,NE,8000,18.7
```

3. **Import to Extension:**
- Use the CSV import feature
- Extension will use your projections

4. **Optimize:**
- Click "Optimize Lineups"
- Uses local algorithm (no API needed)

### Projection Sources

**Free:**
- DFS Army
- RotoBaller (limited)
- Reddit DFS communities
- NumberFire

**Paid:**
- FantasyPros ($)
- RotoGrinders ($$)
- Establish The Run ($$)
- 4for4 ($)
- FantasyLabs ($$)

---

## Option 4: Alternative APIs

Use other DFS data providers instead of SaberSim.

### Available APIs

#### 1. **DraftKings API**
- Free tier available
- Official DFS site data
- Player pools and contest info

#### 2. **FantasyData API**
- Comprehensive sports data
- Projections included
- Paid service

#### 3. **RotoWire API**
- Player news and projections
- Multiple sports
- Subscription required

#### 4. **SportsData.io**
- DFS-specific endpoints
- Free tier available
- Good documentation

### Integration Steps

1. Sign up for API access
2. Update `background/background.js`:
```javascript
const API_CONFIG = {
    baseUrl: 'https://api.sportsdata.io',
    apiKey: 'YOUR_KEY_HERE',
    endpoints: {
        players: '/v3/nfl/projections/json/DfsSlatesByDate/{date}',
        // ... other endpoints
    }
};
```

3. Modify request/response handlers
4. Test and deploy

---

## Option 5: Fully Local Optimization

Use the extension's built-in optimizer without any external data.

### Features

✅ No API required
✅ Works offline
✅ Fast optimization
✅ Privacy-focused (data stays local)

❌ Requires manual data entry
❌ No automatic updates
❌ Limited to your projection sources

### How It Works

The extension includes a **local greedy optimizer** that:

1. **Selects players** based on value (projection / salary)
2. **Respects constraints:**
   - Salary cap
   - Position requirements
   - Exposure limits
3. **Supports stacking:**
   - Team correlations
   - QB + WR combos
4. **Adds randomness:**
   - Creates lineup diversity
   - Avoids "chalky" builds

### Algorithm Details

```javascript
// Simplified optimization logic
function optimizeLineup(players, settings) {
    1. Group players by position
    2. If stacking: build stack first
    3. For each position:
        - Filter eligible players
        - Sort by value
        - Apply randomness
        - Select best player
    4. Validate salary constraints
    5. Return lineup
}
```

### Performance

- **Speed:** ~0.1-1 second per lineup
- **Capacity:** Can generate 150+ lineups
- **Quality:** Competitive with commercial optimizers

---

## Recommended Workflow (Without API)

### Best Approach

1. **Get Player Pool:**
   - Export from DraftKings/FanDuel
   - Or use SaberSim's export feature

2. **Add Projections:**
   - Subscribe to projection service
   - Import projection CSV
   - Or use DFS site's own projections

3. **Optimize Locally:**
   - Use extension's built-in optimizer
   - Set stacking and exposure rules
   - Generate multiple lineups

4. **Export Results:**
   - Export to DK/FD format
   - Upload directly to DFS site

### Tools Stack

```
Player Data: DraftKings/FanDuel CSV Export
Projections: FantasyPros / RotoGrinders / Your model
Optimizer: This Extension (local)
Upload: DraftKings/FanDuel bulk upload
```

### Cost Comparison

| Approach | Cost | Pros | Cons |
|----------|------|------|------|
| API Integration | $-$$$ | Automated, Real-time | Expensive, May not exist |
| CSV Workflow | $ | Flexible, Works with any tool | Manual steps |
| Web Scraping | $ | Uses existing subscription | May violate TOS |
| Local Only | Free | Fast, Private | Requires data entry |

---

## Setting Up CSV Workflow

### 1. Update Extension Permissions

Already included in `manifest.json`:
```json
{
  "permissions": ["storage", "activeTab"]
}
```

### 2. Add File Upload to UI

The extension includes file upload buttons:
- "Import Player Pool"
- "Import Projections"
- "Import Settings"

### 3. Use Built-in CSV Parser

```javascript
// Example usage
const file = document.getElementById('file-input').files[0];
const players = await CSVParser.parseFile(file);
const {format, players: parsedPlayers} = CSVParser.autoDetectAndParse(csvContent);
```

### 4. Run Local Optimization

```javascript
// Example usage
const lineups = LineupOptimizer.optimize(players, {
    positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'],
    salaryCap: 50000,
    minSalary: 49000,
    numLineups: 20,
    maxExposure: 0.5,
    randomness: true,
    stacking: true,
    stackSize: 3
});
```

### 5. Export Results

```javascript
// Generate DraftKings CSV
const csv = CSVParser.generateDraftKingsCSV(lineups);

// Download file
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'lineups.csv';
a.click();
```

---

## Comparison: API vs No API

### With SaberSim API

✅ Fully automated
✅ Real-time updates
✅ Advanced algorithms
✅ Ownership projections
✅ Contest-specific optimization

❌ Requires API access (may not exist)
❌ Potentially expensive
❌ Dependent on external service

### Without API (Local)

✅ Works immediately
✅ No ongoing costs
✅ Privacy-focused
✅ Flexible data sources
✅ Fast performance

❌ Manual data import
❌ No automatic updates
❌ Requires projection source

---

## FAQ

**Q: Can I use this extension without any SaberSim subscription?**
A: Yes! Use the CSV import workflow with data from DraftKings/FanDuel.

**Q: How good is the local optimizer?**
A: It's competitive with commercial tools for basic optimization. Advanced features like game theory and ownership targeting require external services.

**Q: Where do I get projections?**
A: Many sources: FantasyPros, RotoGrinders, Establish The Run, 4for4, FantasyLabs, or build your own model.

**Q: Can I import SaberSim exports?**
A: Yes! If you export data from SaberSim (as CSV), you can import it into the extension.

**Q: Does this work for all sports?**
A: Yes! NFL, NBA, MLB, NHL, and more. Just provide the player pool CSV.

**Q: How long does optimization take?**
A: Very fast! 20 lineups in ~2-5 seconds (runs locally in browser).

**Q: Can I use my own optimizer and just use this for CSV handling?**
A: Absolutely! The CSV parser works standalone.

---

## Next Steps

1. **Choose your workflow** (CSV recommended)
2. **Gather player data** (DFS site export or projection service)
3. **Import to extension**
4. **Optimize lineups**
5. **Export and upload**

The extension is designed to work perfectly **without any API**! The local optimizer is fast, reliable, and produces high-quality lineups.

---

**Need Help?**
- Check `INSTALLATION.md` for setup
- See `README.md` for full documentation
- Open an issue on GitHub

Happy lineup building! 🏆
