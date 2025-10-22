/**
 * Local DFS Lineup Optimizer
 *
 * Optimizes DFS lineups entirely in the browser without requiring an API.
 * Uses greedy algorithms with randomness and stacking capabilities.
 */

const LineupOptimizer = {
    /**
     * Optimize lineups based on player pool and settings
     * @param {Array<Object>} playerPool - Available players
     * @param {Object} settings - Optimization settings
     * @returns {Array<Object>} - Optimized lineups
     */
    optimize(playerPool, settings) {
        const {
            positions,
            salaryCap = 50000,
            minSalary = 49000,
            numLineups = 1,
            maxExposure = 1.0,
            minExposure = 0,
            randomness = false,
            stacking = false,
            stackSize = 3
        } = settings;

        // Validate inputs
        if (!playerPool || playerPool.length === 0) {
            throw new Error('Player pool is empty');
        }

        // Initialize exposure tracking
        const exposure = {};
        playerPool.forEach(p => exposure[p.name] = 0);

        const lineups = [];

        // Generate lineups
        for (let i = 0; i < numLineups; i++) {
            try {
                const lineup = this.generateLineup(
                    playerPool,
                    positions,
                    salaryCap,
                    minSalary,
                    exposure,
                    numLineups,
                    maxExposure,
                    minExposure,
                    randomness,
                    stacking,
                    stackSize
                );

                if (lineup) {
                    lineups.push(lineup);

                    // Update exposure
                    lineup.players.forEach(player => {
                        exposure[player.name]++;
                    });
                }
            } catch (error) {
                console.warn(`Failed to generate lineup ${i + 1}:`, error.message);
            }
        }

        return lineups;
    },

    /**
     * Generate a single optimized lineup
     */
    generateLineup(
        playerPool,
        positions,
        salaryCap,
        minSalary,
        exposure,
        totalLineups,
        maxExposure,
        minExposure,
        randomness,
        useStacking,
        stackSize
    ) {
        const lineup = [];
        let remainingSalary = salaryCap;

        // Group players by position
        const playersByPosition = this.groupByPosition(playerPool, positions);

        // If stacking is enabled, build stack first
        if (useStacking && stackSize > 0) {
            const stack = this.buildStack(playerPool, stackSize, maxExposure, exposure, totalLineups);
            if (stack) {
                stack.forEach(player => {
                    lineup.push(player);
                    remainingSalary -= player.salary;
                });
            }
        }

        // Fill remaining positions
        const positionsCopy = [...positions];

        for (const position of positionsCopy) {
            // Skip if already filled by stack
            const alreadyFilled = lineup.some(p => p.position === position);
            if (alreadyFilled && position !== 'FLEX' && position !== 'UTIL') {
                continue;
            }

            // Get eligible players for this position
            let eligible = this.getEligiblePlayers(
                playersByPosition,
                position,
                lineup,
                remainingSalary,
                exposure,
                totalLineups,
                maxExposure
            );

            if (eligible.length === 0) {
                throw new Error(`No eligible players for position ${position}`);
            }

            // Apply randomness if enabled
            if (randomness) {
                eligible = this.applyRandomness(eligible);
            }

            // Select best player by value (projection / salary)
            eligible.sort((a, b) => this.calculateValue(b) - this.calculateValue(a));

            const selectedPlayer = eligible[0];
            lineup.push(selectedPlayer);
            remainingSalary -= selectedPlayer.salary;
        }

        // Validate lineup
        const totalSalary = lineup.reduce((sum, p) => sum + p.salary, 0);
        const totalProjection = lineup.reduce((sum, p) => sum + (p.projection || 0), 0);

        if (totalSalary > salaryCap) {
            throw new Error('Lineup exceeds salary cap');
        }

        if (totalSalary < minSalary) {
            throw new Error('Lineup does not meet minimum salary');
        }

        return {
            players: lineup,
            totalSalary,
            totalProjection
        };
    },

    /**
     * Group players by position eligibility
     */
    groupByPosition(playerPool, positions) {
        const grouped = {};

        positions.forEach(pos => {
            grouped[pos] = [];
        });

        playerPool.forEach(player => {
            // Handle multi-position eligibility
            const eligiblePositions = this.getPlayerPositions(player.position);

            eligiblePositions.forEach(pos => {
                if (grouped[pos]) {
                    grouped[pos].push(player);
                }
            });

            // Add to FLEX/UTIL if applicable
            if (grouped['FLEX'] && this.isFlexEligible(player.position)) {
                grouped['FLEX'].push(player);
            }
            if (grouped['UTIL']) {
                grouped['UTIL'].push(player);
            }
        });

        return grouped;
    },

    /**
     * Get player's eligible positions
     */
    getPlayerPositions(position) {
        // Handle position like "PG/SG" or "RB/WR"
        if (position.includes('/')) {
            return position.split('/');
        }
        return [position];
    },

    /**
     * Check if player is FLEX eligible
     */
    isFlexEligible(position) {
        const flexPositions = ['RB', 'WR', 'TE'];
        return flexPositions.includes(position);
    },

    /**
     * Get eligible players for a position
     */
    getEligiblePlayers(
        playersByPosition,
        position,
        currentLineup,
        remainingSalary,
        exposure,
        totalLineups,
        maxExposure
    ) {
        const positionPlayers = playersByPosition[position] || [];

        return positionPlayers.filter(player => {
            // Not already in lineup
            if (currentLineup.some(p => p.name === player.name)) {
                return false;
            }

            // Can afford
            if (player.salary > remainingSalary) {
                return false;
            }

            // Exposure check
            const currentExposure = exposure[player.name] / totalLineups;
            if (currentExposure >= maxExposure) {
                return false;
            }

            return true;
        });
    },

    /**
     * Calculate player value (projection per $1000 salary)
     */
    calculateValue(player) {
        const projection = player.projection || 0;
        const salary = player.salary || 1;
        return (projection / salary) * 1000;
    },

    /**
     * Apply randomness to player selection
     */
    applyRandomness(players, randomnessFactor = 0.3) {
        return players.map(player => ({
            ...player,
            adjustedProjection: player.projection * (1 + (Math.random() - 0.5) * randomnessFactor)
        })).sort((a, b) => b.adjustedProjection - a.adjustedProjection);
    },

    /**
     * Build a correlated stack
     */
    buildStack(playerPool, stackSize, maxExposure, exposure, totalLineups) {
        // Group players by team
        const teamGroups = {};
        playerPool.forEach(player => {
            if (!player.team) return;
            if (!teamGroups[player.team]) {
                teamGroups[player.team] = [];
            }
            teamGroups[player.team].push(player);
        });

        // Find best team stack
        let bestStack = null;
        let bestStackValue = 0;

        Object.entries(teamGroups).forEach(([team, players]) => {
            if (players.length < stackSize) return;

            // Filter by exposure
            const eligible = players.filter(p => {
                const exp = exposure[p.name] / totalLineups;
                return exp < maxExposure;
            });

            if (eligible.length < stackSize) return;

            // Sort by projection
            eligible.sort((a, b) => (b.projection || 0) - (a.projection || 0));

            // Take top N players
            const stack = eligible.slice(0, stackSize);
            const stackProjection = stack.reduce((sum, p) => sum + (p.projection || 0), 0);

            if (stackProjection > bestStackValue) {
                bestStackValue = stackProjection;
                bestStack = stack;
            }
        });

        return bestStack;
    },

    /**
     * Get position requirements for a sport/contest
     */
    getPositionRequirements(sport, contestType = 'classic') {
        const requirements = {
            nfl: {
                classic: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'],
                showdown: ['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']
            },
            nba: {
                classic: ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'],
                showdown: ['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']
            },
            mlb: {
                classic: ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'],
                showdown: ['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']
            },
            nhl: {
                classic: ['C', 'C', 'W', 'W', 'W', 'D', 'D', 'G', 'UTIL'],
                showdown: ['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']
            }
        };

        return requirements[sport]?.[contestType] || [];
    },

    /**
     * Validate lineup against position requirements
     */
    validateLineup(lineup, positions) {
        const errors = [];

        // Check position count
        if (lineup.players.length !== positions.length) {
            errors.push(`Lineup has ${lineup.players.length} players, expected ${positions.length}`);
        }

        // Check each position is filled
        const filledPositions = lineup.players.map(p => p.position);
        positions.forEach((requiredPos, index) => {
            if (!filledPositions[index]) {
                errors.push(`Position ${requiredPos} not filled`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Calculate lineup statistics
     */
    calculateStats(lineup) {
        const totalSalary = lineup.players.reduce((sum, p) => sum + p.salary, 0);
        const totalProjection = lineup.players.reduce((sum, p) => sum + (p.projection || 0), 0);
        const avgSalary = totalSalary / lineup.players.length;
        const avgProjection = totalProjection / lineup.players.length;

        // Team diversity
        const teams = new Set(lineup.players.map(p => p.team).filter(t => t));
        const teamCount = teams.size;

        return {
            totalSalary,
            totalProjection,
            avgSalary,
            avgProjection,
            teamCount,
            salaryRemaining: lineup.totalSalary ? (50000 - totalSalary) : 0
        };
    },

    /**
     * Optimize with advanced constraints
     */
    optimizeAdvanced(playerPool, settings, constraints = {}) {
        const {
            lockedPlayers = [],
            excludedPlayers = [],
            teamLimits = {},
            positionLimits = {}
        } = constraints;

        // Filter player pool
        let filteredPool = playerPool.filter(player => {
            // Exclude players
            if (excludedPlayers.includes(player.name)) {
                return false;
            }
            return true;
        });

        // Add locked players to every lineup
        const baseLineup = lockedPlayers.map(name => {
            return playerPool.find(p => p.name === name);
        }).filter(p => p);

        // Generate lineups with constraints
        // This would need more complex logic to handle all constraints
        return this.optimize(filteredPool, settings);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LineupOptimizer;
}
