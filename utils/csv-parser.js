/**
 * CSV Parser and Generator Utility
 *
 * Handles parsing CSV files from DFS sites and SaberSim,
 * and generating CSV files for lineup uploads
 */

const CSVParser = {
    /**
     * Parse CSV file to JSON
     * @param {File} file - CSV file object
     * @returns {Promise<Array>} - Array of player objects
     */
    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const data = this.parseCSV(csv);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },

    /**
     * Parse CSV string to array of objects
     * @param {string} csv - CSV content
     * @returns {Array<Object>} - Array of parsed objects
     */
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            throw new Error('Empty CSV file');
        }

        // Parse header
        const headers = this.parseCSVLine(lines[0]);

        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length !== headers.length && values.length > 0) {
                console.warn(`Line ${i + 1} has ${values.length} values, expected ${headers.length}`);
            }

            if (values.length > 0) {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = values[index] ? values[index].trim() : '';
                });
                data.push(obj);
            }
        }

        return data;
    },

    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line
     * @returns {Array<string>} - Array of values
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote mode
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of value
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        // Add last value
        values.push(current);

        return values;
    },

    /**
     * Parse DraftKings player pool CSV
     * @param {string} csv - CSV content
     * @returns {Array<Object>} - Standardized player objects
     */
    parseDraftKingsCSV(csv) {
        const data = this.parseCSV(csv);

        return data.map(row => ({
            id: row['ID'] || row['id'],
            name: row['Name'] || row['name'],
            position: row['Position'] || row['Roster Position'],
            team: row['TeamAbbrev'] || row['Team'],
            opponent: row['Opponent'] || '',
            salary: parseInt(row['Salary']) || 0,
            projection: parseFloat(row['AvgPointsPerGame'] || row['FPPG'] || row['Points'] || 0),
            game: row['Game Info'] || '',
            // Store original row for reference
            _original: row
        }));
    },

    /**
     * Parse FanDuel player pool CSV
     * @param {string} csv - CSV content
     * @returns {Array<Object>} - Standardized player objects
     */
    parseFanDuelCSV(csv) {
        const data = this.parseCSV(csv);

        return data.map(row => ({
            id: row['Id'] || row['ID'],
            name: row['Nickname'] || row['Name'],
            position: row['Position'],
            team: row['Team'],
            opponent: row['Opponent'] || '',
            salary: parseInt(row['Salary']) || 0,
            projection: parseFloat(row['FPPG'] || row['Points'] || 0),
            game: row['Game'] || '',
            _original: row
        }));
    },

    /**
     * Auto-detect CSV format and parse accordingly
     * @param {string} csv - CSV content
     * @returns {Object} - {format: string, players: Array}
     */
    autoDetectAndParse(csv) {
        const lines = csv.split('\n');
        const header = lines[0].toLowerCase();

        if (header.includes('roster position') || header.includes('teamabbrev')) {
            return {
                format: 'draftkings',
                players: this.parseDraftKingsCSV(csv)
            };
        } else if (header.includes('nickname') || header.includes('fppg')) {
            return {
                format: 'fanduel',
                players: this.parseFanDuelCSV(csv)
            };
        } else {
            // Generic parser
            return {
                format: 'generic',
                players: this.parseCSV(csv)
            };
        }
    },

    /**
     * Generate lineup CSV for DraftKings
     * @param {Array<Object>} lineups - Array of lineup objects
     * @returns {string} - CSV string
     */
    generateDraftKingsCSV(lineups) {
        // Get positions from first lineup
        const positions = lineups[0]?.players.map(p => p.position) || [];

        // Create header
        const headers = positions.join(',');
        let csv = headers + '\n';

        // Add each lineup
        lineups.forEach(lineup => {
            const row = lineup.players.map(player => {
                // Use player ID if available, otherwise name
                return player.id || player.name;
            });
            csv += row.join(',') + '\n';
        });

        return csv;
    },

    /**
     * Generate lineup CSV for FanDuel
     * @param {Array<Object>} lineups - Array of lineup objects
     * @returns {string} - CSV string
     */
    generateFanDuelCSV(lineups) {
        // FanDuel format: PG,PG,SG,SG,SF,SF,PF,PF,C
        const positions = lineups[0]?.players.map(p => p.position) || [];

        const headers = positions.join(',');
        let csv = headers + '\n';

        lineups.forEach(lineup => {
            const row = lineup.players.map(player => player.id || player.name);
            csv += row.join(',') + '\n';
        });

        return csv;
    },

    /**
     * Generate detailed lineup CSV with stats
     * @param {Array<Object>} lineups - Array of lineup objects
     * @returns {string} - CSV string with player details
     */
    generateDetailedCSV(lineups) {
        const headers = ['Lineup', 'Position', 'Name', 'Team', 'Opponent', 'Salary', 'Projection'];
        let csv = headers.join(',') + '\n';

        lineups.forEach((lineup, lineupIndex) => {
            lineup.players.forEach(player => {
                const row = [
                    lineupIndex + 1,
                    player.position,
                    `"${player.name}"`,
                    player.team || '',
                    player.opponent || '',
                    player.salary || 0,
                    (player.projection || 0).toFixed(2)
                ];
                csv += row.join(',') + '\n';
            });
        });

        return csv;
    },

    /**
     * Validate player pool data
     * @param {Array<Object>} players - Player data
     * @returns {Object} - {valid: boolean, errors: Array}
     */
    validatePlayerPool(players) {
        const errors = [];

        if (!Array.isArray(players) || players.length === 0) {
            errors.push('No players found in CSV');
            return { valid: false, errors };
        }

        // Check required fields
        const requiredFields = ['name', 'position', 'salary'];
        const missingFields = requiredFields.filter(field => {
            return !players.every(p => p.hasOwnProperty(field));
        });

        if (missingFields.length > 0) {
            errors.push(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate data types
        players.forEach((player, index) => {
            if (!player.name || player.name.trim() === '') {
                errors.push(`Player at row ${index + 2} has no name`);
            }
            if (isNaN(player.salary) || player.salary < 0) {
                errors.push(`Invalid salary for ${player.name}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Add custom projections to player pool
     * @param {Array<Object>} players - Player data
     * @param {Object} projections - {playerName: projectionValue}
     * @returns {Array<Object>} - Updated player data
     */
    applyCustomProjections(players, projections) {
        return players.map(player => ({
            ...player,
            projection: projections[player.name] !== undefined
                ? projections[player.name]
                : player.projection,
            customProjection: projections[player.name] !== undefined
        }));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVParser;
}
