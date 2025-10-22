# Advanced DFS Optimization Features

## Overview

SaberSim DFS Build Optimizer Pro includes professional-grade features that go beyond basic lineup optimization:

- **Vegas Data Integration** - Scrape and integrate betting lines, props, and odds
- **Advanced Stacking** - Primary, secondary, and bring-back stacks with exposure controls
- **Sim Diversity** - Simulation-based lineup diversity to avoid duplicates
- **Player Correlations** - Game theory and correlation scoring
- **Lineup Pool Filters** - Lock, exclude, and group players
- **Granular Salary Controls** - Position-specific salary constraints
- **Exposure Management** - Global and position-specific exposure rules

---

## 1. Vegas Data Scraping & Integration

### What It Does

Scrapes Vegas betting data from multiple sources and uses it to enhance SaberSim projections.

### Data Sources

- **DraftKings Sportsbook** - Game lines, spreads, totals, player props
- **FanDuel Sportsbook** - Game lines, spreads, totals, player props
- **PrizePicks** - Player prop lines (points, yards, TDs, etc.)
- **Underdog Fantasy** - Player prop lines

### How It Works

1. **Scrape Vegas Lines**
   ```
   Game Lines:
   - Spread: KC -7.5
   - Total: O/U 52.5
   - Moneyline: KC -350, LV +280
   ```

2. **Calculate Implied Totals**
   ```
   KC implied total: (52.5 + 7.5) / 2 = 30 points
   LV implied total: (52.5 - 7.5) / 2 = 22.5 points
   ```

3. **Scrape Player Props**
   ```
   Patrick Mahomes:
   - Passing Yards: 295.5
   - Passing TDs: 2.5
   - Interceptions: 0.5
   ```

4. **Adjust Projections**
   ```
   Weighted average:
   60% SaberSim projection + 40% Vegas-implied projection
   ```

### Usage

```javascript
// Scrape Vegas data
const vegasData = await VegasScraper.scrapeVegasData('nfl', [
    'draftkings',
    'fanduel',
    'prizepicks'
]);

// Enhance player projections
const enhancedPlayers = VegasScraper.enhanceProjections(
    players,
    vegasData
);

// Now optimize with enhanced projections
const lineups = await AdvancedOptimizer.optimizeAdvanced(
    enhancedPlayers,
    settings
);
```

### Benefits

✅ **More Accurate Projections** - Vegas sharps have strong info
✅ **Game Environment** - High totals = more fantasy points
✅ **Props as Floor/Ceiling** - Player prop lines indicate range
✅ **Injury/News Adjustment** - Vegas reacts fast to news

### Example Impact

**Without Vegas Data:**
```
Patrick Mahomes: 24.5 SaberSim projection
```

**With Vegas Data:**
```
Vegas Props:
- 295.5 passing yards
- 2.5 passing TDs

Vegas-Implied Projection: 26.8
Adjusted: (24.5 * 0.6) + (26.8 * 0.4) = 25.4

Result: +0.9 points vs SaberSim alone
```

---

## 2. Advanced Stacking

### Primary Stack

The main correlated stack (usually QB + pass catchers).

**Configuration:**
```javascript
stacking: {
    primaryStack: {
        enabled: true,
        positions: ['QB', 'WR', 'WR'],  // Or ['QB', 'WR', 'TE']
        minStackSize: 2,
        maxStackSize: 4,
        exposure: 0.6,  // In 60% of lineups max
        preferredTeams: ['KC', 'BUF', 'MIA']
    }
}
```

**Example:**
```
Primary Stack (KC):
- Patrick Mahomes (QB)
- Travis Kelce (TE)
- Rashee Rice (WR)
```

### Secondary Stack

Additional stack from a different game.

**Configuration:**
```javascript
secondaryStack: {
    enabled: true,
    positions: ['RB', 'DST'],  // Running game stack
    minPlayers: 1,
    maxPlayers: 2,
    exposure: 0.4,  // Lower exposure
    avoidPrimaryTeams: true  // Different game
}
```

**Example:**
```
Primary Stack: KC passing game
Secondary Stack: SF running game (CMC + SF DST)
```

### Bring-Back Stack

Players from the opponent team (game theory).

**Configuration:**
```javascript
bringBack: {
    enabled: true,
    positions: ['WR', 'TE'],
    minPlayers: 1,
    maxPlayers: 2,
    exposure: 0.3
}
```

**Example:**
```
Primary Stack: KC offense (Mahomes + Kelce + Rice)
Bring-Back: LV offense (Davante Adams)

Theory: If KC scores a lot, LV has to throw to keep up
```

### Exposure By Stack Type

```javascript
stacking: {
    primaryStack: { exposure: 0.6 },     // 60% of lineups
    secondaryStack: { exposure: 0.4 },   // 40% of lineups
    bringBack: { exposure: 0.3 }         // 30% of lineups
}
```

This creates **diversity across your lineup pool**:
- Some lineups with just primary stack
- Some with primary + secondary
- Some with primary + bring-back
- Some with all three

---

## 3. Lineup Pool Filters

### Lock Players

**Must** be in every lineup.

```javascript
filters: {
    lockedPlayers: ['Patrick Mahomes', 'Christian McCaffrey']
}
```

Use cases:
- Core plays you love
- "Chalk" plays everyone will have
- Research-backed convictions

### Exclude Players

**Cannot** be in any lineup.

```javascript
filters: {
    excludedPlayers: ['Injured Player', 'Suspended Player']
}
```

Use cases:
- Injury concerns
- Poor matchups
- Too much ownership

### Player Groups

Min/max players from a group.

```javascript
filters: {
    groups: [
        {
            name: "Chiefs Pass Catchers",
            players: ['Travis Kelce', 'Rashee Rice', 'Marquise Brown'],
            min: 1,  // At least one
            max: 2   // But not all three
        },
        {
            name: "Expensive RBs",
            players: ['CMC', 'Bijan Robinson', 'Derrick Henry'],
            min: 1,
            max: 1   // Exactly one expensive RB
        }
    ]
}
```

### Projection Range Filter

```javascript
filters: {
    constraints: {
        minProjection: 8.0,   // No super low projections
        maxProjection: 30.0
    }
}
```

### Ownership Range Filter

```javascript
filters: {
    constraints: {
        minOwnership: 0,
        maxOwnership: 25  // Fade chalky plays over 25%
    }
}
```

### Salary Range Filter

```javascript
filters: {
    constraints: {
        minSalary: 4500,  // No minimum salary players
        maxSalary: 9500   // Cap max salary
    }
}
```

### Team Filters

```javascript
filters: {
    teamFilters: {
        include: ['KC', 'BUF', 'MIA'],  // Only these teams
        exclude: ['NYJ', 'NE']          // Never these teams
    }
}
```

---

## 4. Sim Diversity

### What It Does

Creates unique lineups by avoiding player combinations that appear frequently.

### Methods

#### Simulation-Based (Recommended)

Tracks player frequency across generated lineups and penalizes overused players.

```javascript
diversity: {
    enabled: true,
    method: 'simulation',
    diversityFactor: 0.3  // Higher = more diversity
}
```

**How it works:**
```
Lineup 1: Mahomes (used 1x)
Lineup 2: Mahomes (used 2x) - penalty applied
Lineup 3: Allen (used 1x) - no penalty, more likely selected
```

#### Ownership-Based

Fades high-ownership "chalk" plays.

```javascript
diversity: {
    enabled: true,
    method: 'ownership',
    ownershipFade: true,
    chalkThreshold: 20  // Fade players over 20% projected ownership
}
```

#### Randomness-Based

Adds randomness to projections.

```javascript
diversity: {
    enabled: true,
    method: 'randomness',
    diversityFactor: 0.2  // ±20% variance
}
```

### Why It Matters

**Without Sim Diversity:**
```
All 20 lineups have: Mahomes, CMC, Tyreek Hill
Very little differentiation
```

**With Sim Diversity:**
```
8 lineups: Mahomes
7 lineups: Allen
5 lineups: Hurts

10 lineups: CMC
6 lineups: Bijan
4 lineups: Henry

Much better coverage!
```

---

## 5. Correlation Scoring

### What It Does

Scores players based on correlation with existing lineup players.

### Configuration

```javascript
correlation: {
    enabled: true,
    gameStackBonus: 2.0,         // Same team bonus
    opponentPenalty: -1.0,       // Opponent penalty (negative correlation)
    samePositionPenalty: -0.5,   // Same position penalty
    correlationMatrix: {
        'Mahomes-Kelce': 0.8,    // Custom correlation
        'Allen-Diggs': 0.7
    }
}
```

### How It Works

```javascript
Current Lineup: [Mahomes (QB)]

Scoring Kelce (TE):
Base projection: 15.0
Same team as Mahomes: +2.0 bonus
Correlated with Mahomes: +0.8 custom
Total score: 17.8 (more likely to be selected)

Scoring Mark Andrews (TE):
Base projection: 14.5
Different team: No bonus
Same position as no one: No penalty
Total score: 14.5

Result: Kelce more likely selected due to correlation
```

### Positive Correlations

- QB + WR/TE (same team)
- RB + DST (same team, game script)
- QB + Opponent WR (bring-back, shootout)

### Negative Correlations

- RB + Opponent RB (game script)
- DST + Opponent QB (obvious)

---

## 6. Granular Salary Controls

### Position-Specific Salary Constraints

```javascript
salaryParams: {
    minSalaryAtPosition: {
        'QB': 6500,  // No cheap QBs
        'RB': 5000,
        'WR': 4500
    },
    maxSalaryAtPosition: {
        'DST': 3500  // Cap DST spending
    }
}
```

### Minimum Total Salary

```javascript
salaryParams: {
    minTotalSalary: 49500  // Must use at least $49,500
}
```

### Max Players Per Team

```javascript
salaryParams: {
    maxPlayersFromTeam: 4  // No more than 4 from one team
}
```

---

## 7. Exposure Management

### Global Exposure

```javascript
exposure: {
    global: {
        maxExposure: 0.5,  // No player in more than 50% of lineups
        minExposure: 0.1   // Core plays must be in at least 10%
    }
}
```

### Position-Specific Exposure

```javascript
exposure: {
    byPosition: {
        'QB': {
            min: 0.2,  // Each QB in at least 20%
            max: 0.6   // No QB in more than 60%
        },
        'RB': {
            min: 0,
            max: 0.4   // More RB diversity
        },
        'DST': {
            min: 0,
            max: 0.3   // Spread DST usage thin
        }
    }
}
```

### Why It Matters

**Poor Exposure:**
```
50 lineups, all with Patrick Mahomes
If Mahomes busts, you're toast
```

**Good Exposure:**
```
50 lineups:
- 25 with Mahomes (50%)
- 15 with Allen (30%)
- 10 with Hurts (20%)

Diversified QB exposure = better risk management
```

---

## Complete Example

```javascript
const settings = {
    // Basic settings
    positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'],
    salaryCap: 50000,
    numLineups: 20,

    // Salary parameters
    salaryParams: {
        minTotalSalary: 49000,
        minSalaryAtPosition: {
            'QB': 6500,
            'RB': 5000
        },
        maxPlayersFromTeam: 4
    },

    // Filters
    filters: {
        lockedPlayers: ['Patrick Mahomes'],
        excludedPlayers: ['Injured Player'],
        constraints: {
            minProjection: 8.0,
            maxOwnership: 30
        }
    },

    // Sim diversity
    diversity: {
        enabled: true,
        method: 'simulation',
        diversityFactor: 0.3
    },

    // Correlation
    correlation: {
        enabled: true,
        gameStackBonus: 2.0,
        opponentPenalty: -0.5
    },

    // Stacking
    stacking: {
        primaryStack: {
            enabled: true,
            positions: ['QB', 'WR', 'TE'],
            exposure: 0.6
        },
        bringBack: {
            enabled: true,
            positions: ['WR'],
            maxPlayers: 1,
            exposure: 0.3
        },
        secondaryStack: {
            enabled: true,
            positions: ['RB', 'DST'],
            maxPlayers: 2,
            exposure: 0.4
        }
    },

    // Exposure
    exposure: {
        global: {
            maxExposure: 0.5,
            minExposure: 0.1
        },
        byPosition: {
            'QB': { max: 0.6 },
            'RB': { max: 0.4 },
            'DST': { max: 0.3 }
        }
    }
};

// Optimize
const lineups = await AdvancedOptimizer.optimizeAdvanced(
    playerPool,
    settings
);
```

---

## Tips & Best Practices

### For Cash Games (50/50, Double-Ups)

```javascript
{
    diversity: { enabled: false },  // Want similar lineups
    exposure: {
        global: { maxExposure: 1.0, minExposure: 0.8 }  // Heavy core plays
    },
    stacking: {
        primaryStack: { exposure: 1.0 }  // Every lineup has same stack
    }
}
```

### For GPPs (Tournaments)

```javascript
{
    diversity: { enabled: true, diversityFactor: 0.4 },  // High diversity
    exposure: {
        global: { maxExposure: 0.3 }  // Spread exposure thin
    },
    stacking: {
        primaryStack: { exposure: 0.5 },    // Varied stacks
        bringBack: { exposure: 0.4 },
        secondaryStack: { exposure: 0.3 }
    },
    filters: {
        constraints: {
            maxOwnership: 25  // Fade chalk
        }
    }
}
```

### For Large-Field GPPs (Milly Maker)

```javascript
{
    diversity: {
        enabled: true,
        method: 'ownership',  // Fade chalk
        chalkThreshold: 15    // Very contrarian
    },
    correlation: {
        enabled: true,
        gameStackBonus: 3.0  // Aggressive stacking
    },
    numLineups: 150  // Max lineups
}
```

---

## Troubleshooting

### "No eligible players for position"

- Loosen salary constraints
- Remove some filters
- Increase player pool

### "Too many players from same team"

- Adjust `maxPlayersFromTeam`
- Enable `secondaryStack` with `avoidPrimaryTeams: true`

### "Lineups look too similar"

- Increase `diversityFactor`
- Lower max exposure values
- Enable multiple stack types

### "Lineups are too random/bad"

- Decrease `diversityFactor`
- Disable randomness diversity
- Increase min exposure for core plays

---

## Performance

- **20 lineups**: ~2-5 seconds
- **100 lineups**: ~10-20 seconds
- **150 lineups**: ~20-30 seconds

Optimization speed depends on:
- Player pool size
- Number of filters/constraints
- Diversity settings
- Correlation calculations

---

## Future Enhancements

- [ ] Machine learning for correlation matrix
- [ ] Historical lineup performance tracking
- [ ] Ownership projection integration
- [ ] Contest-specific optimization (field size, payout structure)
- [ ] Late swap optimizer
- [ ] Multi-entry optimization (unique lineup generation)

---

**Ready to build winning lineups with professional-grade optimization!** 🏆
