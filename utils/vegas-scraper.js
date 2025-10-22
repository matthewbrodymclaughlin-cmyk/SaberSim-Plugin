/**
 * Vegas Betting Data Scraper
 *
 * Scrapes Vegas lines, props, and odds from betting sites
 * Integrates with SaberSim projections for enhanced optimization
 */

const VegasScraper = {
    /**
     * Scrape Vegas data from multiple sources
     * @param {string} sport - Sport to scrape (nfl, nba, mlb, nhl)
     * @param {Array<string>} sources - Betting sites to scrape
     * @returns {Promise<Object>} - Vegas data
     */
    async scrapeVegasData(sport, sources = ['draftkings', 'fanduel', 'prizepicks']) {
        const vegasData = {
            games: [],
            playerProps: [],
            teamTotals: {},
            lastUpdated: new Date().toISOString()
        };

        for (const source of sources) {
            try {
                const data = await this.scrapeSource(source, sport);
                this.mergeData(vegasData, data);
            } catch (error) {
                console.warn(`Failed to scrape ${source}:`, error.message);
            }
        }

        return vegasData;
    },

    /**
     * Scrape specific betting site
     */
    async scrapeSource(source, sport) {
        switch (source.toLowerCase()) {
            case 'draftkings':
                return await this.scrapeDraftKings(sport);
            case 'fanduel':
                return await this.scrapeFanDuel(sport);
            case 'prizepicks':
                return await this.scrapePrizePicks(sport);
            case 'underdog':
                return await this.scrapeUnderdog(sport);
            default:
                throw new Error(`Unknown source: ${source}`);
        }
    },

    /**
     * Scrape DraftKings Sportsbook
     */
    async scrapeDraftKings(sport) {
        const url = this.getDraftKingsUrl(sport);

        try {
            // Use content script to scrape
            const data = await this.scrapeUrl(url, {
                gameSelector: '.sportsbook-event-accordion__wrapper',
                lineSelector: '.sportsbook-outcome-cell__line',
                oddsSelector: '.sportsbook-odds',
                playerPropSelector: '.sportsbook-player-accordion'
            });

            return this.parseDraftKingsData(data, sport);
        } catch (error) {
            console.error('DraftKings scraping error:', error);
            return { games: [], playerProps: [] };
        }
    },

    /**
     * Scrape FanDuel Sportsbook
     */
    async scrapeFanDuel(sport) {
        const url = this.getFanDuelUrl(sport);

        try {
            const data = await this.scrapeUrl(url, {
                gameSelector: '[data-test-id="event-row"]',
                lineSelector: '[data-test-id="market-line"]',
                oddsSelector: '[data-test-id="odds"]',
                playerPropSelector: '[data-test-id="player-prop"]'
            });

            return this.parseFanDuelData(data, sport);
        } catch (error) {
            console.error('FanDuel scraping error:', error);
            return { games: [], playerProps: [] };
        }
    },

    /**
     * Scrape PrizePicks props
     */
    async scrapePrizePicks(sport) {
        const url = this.getPrizePicksUrl(sport);

        try {
            const data = await this.scrapeUrl(url, {
                propSelector: '.projection',
                playerSelector: '.player-name',
                lineSelector: '.line-score',
                statTypeSelector: '.stat-type'
            });

            return this.parsePrizePicksData(data, sport);
        } catch (error) {
            console.error('PrizePicks scraping error:', error);
            return { playerProps: [] };
        }
    },

    /**
     * Scrape Underdog Fantasy props
     */
    async scrapeUnderdog(sport) {
        const url = this.getUnderdogUrl(sport);

        try {
            const data = await this.scrapeUrl(url, {
                propSelector: '.pick-cell',
                playerSelector: '.player-info',
                lineSelector: '.line',
                statSelector: '.stat-type'
            });

            return this.parseUnderdogData(data, sport);
        } catch (error) {
            console.error('Underdog scraping error:', error);
            return { playerProps: [] };
        }
    },

    /**
     * Generic URL scraper using content script
     */
    async scrapeUrl(url, selectors) {
        // Send message to content script to scrape
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs[0]) {
                    reject(new Error('No active tab'));
                    return;
                }

                // Inject content script if needed
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: this.scrapePageContent,
                    args: [selectors]
                }, (results) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(results[0].result);
                    }
                });
            });
        });
    },

    /**
     * Function injected into page to scrape content
     */
    scrapePageContent(selectors) {
        const data = {
            games: [],
            playerProps: [],
            rawHTML: []
        };

        // Scrape games
        if (selectors.gameSelector) {
            const gameElements = document.querySelectorAll(selectors.gameSelector);
            gameElements.forEach(el => {
                data.games.push({
                    html: el.innerHTML,
                    text: el.textContent
                });
            });
        }

        // Scrape player props
        if (selectors.playerPropSelector) {
            const propElements = document.querySelectorAll(selectors.playerPropSelector);
            propElements.forEach(el => {
                data.playerProps.push({
                    html: el.innerHTML,
                    text: el.textContent
                });
            });
        }

        // Scrape lines and odds
        if (selectors.lineSelector) {
            const lineElements = document.querySelectorAll(selectors.lineSelector);
            lineElements.forEach(el => {
                data.rawHTML.push({
                    type: 'line',
                    html: el.innerHTML,
                    text: el.textContent
                });
            });
        }

        return data;
    },

    /**
     * Parse DraftKings scraped data
     */
    parseDraftKingsData(data, sport) {
        const games = [];
        const playerProps = [];

        // Parse game lines
        data.games.forEach(game => {
            const parsed = this.parseGameInfo(game.text, sport);
            if (parsed) {
                games.push(parsed);
            }
        });

        // Parse player props
        data.playerProps.forEach(prop => {
            const parsed = this.parsePlayerProp(prop.text, sport);
            if (parsed) {
                playerProps.push(parsed);
            }
        });

        return { games, playerProps };
    },

    /**
     * Parse FanDuel scraped data
     */
    parseFanDuelData(data, sport) {
        // Similar to DraftKings but with FanDuel-specific parsing
        const games = [];
        const playerProps = [];

        data.games.forEach(game => {
            const parsed = this.parseGameInfo(game.text, sport);
            if (parsed) games.push(parsed);
        });

        data.playerProps.forEach(prop => {
            const parsed = this.parsePlayerProp(prop.text, sport);
            if (parsed) playerProps.push(parsed);
        });

        return { games, playerProps };
    },

    /**
     * Parse PrizePicks data
     */
    parsePrizePicksData(data, sport) {
        const playerProps = [];

        data.playerProps.forEach(prop => {
            const parsed = this.parsePrizeProp(prop.text, sport);
            if (parsed) playerProps.push(parsed);
        });

        return { games: [], playerProps };
    },

    /**
     * Parse Underdog data
     */
    parseUnderdogData(data, sport) {
        const playerProps = [];

        data.playerProps.forEach(prop => {
            const parsed = this.parseUnderdogProp(prop.text, sport);
            if (parsed) playerProps.push(parsed);
        });

        return { games: [], playerProps };
    },

    /**
     * Parse game information (spread, total, moneyline)
     */
    parseGameInfo(text, sport) {
        // Extract team names
        const teamPattern = /([A-Z]{2,3})\s+(?:@|vs)\s+([A-Z]{2,3})/i;
        const teamMatch = text.match(teamPattern);

        if (!teamMatch) return null;

        const awayTeam = teamMatch[1];
        const homeTeam = teamMatch[2];

        // Extract spread
        const spreadPattern = /([-+]?\d+\.?\d*)\s*\(([-+]\d+)\)/;
        const spreadMatch = text.match(spreadPattern);

        // Extract total
        const totalPattern = /[Oo]\s*([\d\.]+)/;
        const totalMatch = text.match(totalPattern);

        // Extract moneyline
        const moneylinePattern = /([-+]\d+)\s+(?:ML|Win)/i;
        const moneylineMatches = text.match(new RegExp(moneylinePattern, 'g'));

        return {
            awayTeam,
            homeTeam,
            spread: spreadMatch ? parseFloat(spreadMatch[1]) : null,
            spreadOdds: spreadMatch ? parseInt(spreadMatch[2]) : null,
            total: totalMatch ? parseFloat(totalMatch[1]) : null,
            awayMoneyline: moneylineMatches ? parseInt(moneylineMatches[0]) : null,
            homeMoneyline: moneylineMatches ? parseInt(moneylineMatches[1]) : null,
            impliedTotal: {
                away: null,
                home: null
            }
        };
    },

    /**
     * Parse player prop (points, yards, etc.)
     */
    parsePlayerProp(text, sport) {
        // Extract player name
        const namePattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)/;
        const nameMatch = text.match(namePattern);

        if (!nameMatch) return null;

        const playerName = nameMatch[1];

        // Extract stat type and line
        const statPatterns = {
            points: /(\d+\.?\d*)\s+(?:Points|PTS)/i,
            rebounds: /(\d+\.?\d*)\s+(?:Rebounds|REB)/i,
            assists: /(\d+\.?\d*)\s+(?:Assists|AST)/i,
            passingYards: /(\d+\.?\d*)\s+(?:Passing\s+Yards|Pass\s+Yds)/i,
            rushingYards: /(\d+\.?\d*)\s+(?:Rushing\s+Yards|Rush\s+Yds)/i,
            receivingYards: /(\d+\.?\d*)\s+(?:Receiving\s+Yards|Rec\s+Yds)/i,
            touchdowns: /(\d+\.?\d*)\s+(?:Touchdowns|TDs?)/i
        };

        const props = [];

        Object.entries(statPatterns).forEach(([statType, pattern]) => {
            const match = text.match(pattern);
            if (match) {
                props.push({
                    player: playerName,
                    statType,
                    line: parseFloat(match[1]),
                    source: 'vegas',
                    timestamp: new Date().toISOString()
                });
            }
        });

        return props;
    },

    /**
     * Parse PrizePicks specific prop format
     */
    parsePrizeProp(text, sport) {
        // PrizePicks format: "Patrick Mahomes 1.5 TDs"
        const pattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+([\d\.]+)\s+([A-Za-z\s]+)/i;
        const match = text.match(pattern);

        if (!match) return null;

        return {
            player: match[1],
            line: parseFloat(match[2]),
            statType: this.normalizeStatType(match[3]),
            source: 'prizepicks',
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Parse Underdog specific prop format
     */
    parseUnderdogProp(text, sport) {
        // Similar to PrizePicks
        return this.parsePrizeProp(text, sport);
    },

    /**
     * Normalize stat type names
     */
    normalizeStatType(statName) {
        const normalized = statName.toLowerCase().trim();

        const mappings = {
            'pts': 'points',
            'points': 'points',
            'reb': 'rebounds',
            'rebounds': 'rebounds',
            'ast': 'assists',
            'assists': 'assists',
            'pass yds': 'passingYards',
            'passing yards': 'passingYards',
            'rush yds': 'rushingYards',
            'rushing yards': 'rushingYards',
            'rec yds': 'receivingYards',
            'receiving yards': 'receivingYards',
            'td': 'touchdowns',
            'tds': 'touchdowns',
            'touchdowns': 'touchdowns'
        };

        return mappings[normalized] || normalized;
    },

    /**
     * Calculate implied team totals from spread and total
     */
    calculateImpliedTotals(game) {
        if (!game.spread || !game.total) {
            return game;
        }

        // Implied total = (Total - Spread) / 2 for favorite
        // Implied total = (Total + Spread) / 2 for underdog
        const favTotal = (game.total - Math.abs(game.spread)) / 2;
        const dogTotal = (game.total + Math.abs(game.spread)) / 2;

        if (game.spread < 0) {
            // Home team is favorite
            game.impliedTotal.home = favTotal;
            game.impliedTotal.away = dogTotal;
        } else {
            // Away team is favorite
            game.impliedTotal.away = favTotal;
            game.impliedTotal.home = dogTotal;
        }

        return game;
    },

    /**
     * Merge data from multiple sources
     */
    mergeData(existingData, newData) {
        // Merge games
        newData.games.forEach(game => {
            const existing = existingData.games.find(g =>
                (g.awayTeam === game.awayTeam && g.homeTeam === game.homeTeam)
            );

            if (existing) {
                // Average the lines from multiple sources
                if (game.spread) existing.spread = (existing.spread + game.spread) / 2;
                if (game.total) existing.total = (existing.total + game.total) / 2;
            } else {
                existingData.games.push(game);
            }
        });

        // Merge player props
        newData.playerProps.forEach(prop => {
            if (Array.isArray(prop)) {
                prop.forEach(p => existingData.playerProps.push(p));
            } else {
                existingData.playerProps.push(prop);
            }
        });
    },

    /**
     * Get URLs for betting sites
     */
    getDraftKingsUrl(sport) {
        const sportMap = {
            nfl: 'https://sportsbook.draftkings.com/leagues/football/nfl',
            nba: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
            mlb: 'https://sportsbook.draftkings.com/leagues/baseball/mlb',
            nhl: 'https://sportsbook.draftkings.com/leagues/hockey/nhl'
        };
        return sportMap[sport.toLowerCase()];
    },

    getFanDuelUrl(sport) {
        const sportMap = {
            nfl: 'https://sportsbook.fanduel.com/navigation/nfl',
            nba: 'https://sportsbook.fanduel.com/navigation/nba',
            mlb: 'https://sportsbook.fanduel.com/navigation/mlb',
            nhl: 'https://sportsbook.fanduel.com/navigation/nhl'
        };
        return sportMap[sport.toLowerCase()];
    },

    getPrizePicksUrl(sport) {
        return `https://app.prizepicks.com/board`;
    },

    getUnderdogUrl(sport) {
        return `https://underdogfantasy.com/pick-em`;
    },

    /**
     * Enhance player projections with Vegas data
     */
    enhanceProjections(players, vegasData) {
        return players.map(player => {
            // Find player props from Vegas
            const playerProps = vegasData.playerProps.filter(prop =>
                this.matchPlayerName(prop.player, player.name)
            );

            if (playerProps.length === 0) {
                return player;
            }

            // Calculate average prop line
            const propsByType = {};
            playerProps.forEach(prop => {
                if (!propsByType[prop.statType]) {
                    propsByType[prop.statType] = [];
                }
                propsByType[prop.statType].push(prop.line);
            });

            const vegasLines = {};
            Object.entries(propsByType).forEach(([statType, lines]) => {
                vegasLines[statType] = lines.reduce((a, b) => a + b, 0) / lines.length;
            });

            // Adjust projection based on Vegas line
            const adjustedProjection = this.adjustProjectionWithVegas(
                player,
                vegasLines,
                player.projection
            );

            return {
                ...player,
                vegasLines,
                originalProjection: player.projection,
                projection: adjustedProjection,
                vegasAdjusted: true
            };
        });
    },

    /**
     * Adjust projection based on Vegas lines
     */
    adjustProjectionWithVegas(player, vegasLines, originalProjection) {
        // Weight: 60% SaberSim, 40% Vegas
        const saberSimWeight = 0.6;
        const vegasWeight = 0.4;

        // Convert Vegas lines to projection estimate
        // This is sport-specific logic
        let vegasProjection = originalProjection;

        // Example for NFL: Use passing/rushing/receiving yards + TDs
        if (player.position === 'QB' && vegasLines.passingYards) {
            // Rough conversion: Passing yards / 25 + TDs * 4
            vegasProjection = (vegasLines.passingYards / 25) +
                             ((vegasLines.touchdowns || 2) * 4);
        } else if (['RB', 'WR', 'TE'].includes(player.position)) {
            // Rushing + Receiving yards / 10 + TDs * 6
            const totalYards = (vegasLines.rushingYards || 0) +
                              (vegasLines.receivingYards || 0);
            vegasProjection = (totalYards / 10) +
                             ((vegasLines.touchdowns || 0.5) * 6);
        }

        // Weighted average
        const adjustedProjection = (originalProjection * saberSimWeight) +
                                   (vegasProjection * vegasWeight);

        return adjustedProjection;
    },

    /**
     * Match player names (fuzzy matching)
     */
    matchPlayerName(name1, name2) {
        const normalize = (name) => name.toLowerCase().replace(/[^a-z]/g, '');
        return normalize(name1) === normalize(name2);
    },

    /**
     * Save Vegas data to storage
     */
    async saveVegasData(vegasData) {
        await chrome.storage.local.set({
            vegasData,
            vegasDataTimestamp: Date.now()
        });
    },

    /**
     * Load Vegas data from storage
     */
    async loadVegasData() {
        const data = await chrome.storage.local.get(['vegasData', 'vegasDataTimestamp']);

        // Check if data is stale (older than 1 hour)
        if (data.vegasDataTimestamp) {
            const age = Date.now() - data.vegasDataTimestamp;
            if (age > 3600000) {
                return null; // Stale data
            }
        }

        return data.vegasData || null;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VegasScraper;
}
