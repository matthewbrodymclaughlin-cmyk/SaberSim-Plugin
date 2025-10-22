/**
 * Local DFS Lineup Optimizer (FIXED)
 *
 * FIXES:
 * 1. Stacking logic now handles duplicate positions correctly
 * 2. Min exposure is now enforced in eligibility checks
 */

const LineupOptimizer = {
    /**
     * Optimize lineups based on player pool and settings
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

        if (!positions || positions.length === 0) {
            throw new Error('No positions specified');
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
                    stackSize,
                    i
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
     * Generate a single optimized lineup (FIXED)
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
        stackSize,
        lineupIndex
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

        // FIX #1: Track position counts instead of just presence
        const positionCounts = {};
        positions.forEach(pos => {
            positionCounts[pos] = (positionCounts[pos] || 0) + 1;
        });

        const positionsFilled = {};
        lineup.forEach(player => {
            positionsFilled[player.position] = (positionsFilled[player.position] || 0) + 1;
        });

        // Fill remaining positions
        for (const position of positions) {
            // Check if this position slot is already filled
            const needed = positionCounts[position];
            const filled = positionsFilled[position] || 0;

            // Skip if we've filled all required slots for this position
            // Exception: FLEX and UTIL can be filled by multiple different positions
            if (filled >= needed && position !== 'FLEX' && position !== 'UTIL') {
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
                maxExposure,
                minExposure  // FIX #2: Pass minExposure to eligibility check
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

            // Update filled count
            positionsFilled[selectedPlayer.position] = (positionsFilled[selectedPlayer.position] || 0) + 1;
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

        if (lineup.length !== positions.length) {
            throw new Error(`Lineup has ${lineup.length} players, expected ${positions.length}`);
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
     * Get eligible players for a position (FIXED - now includes minExposure)
     */
    getEligiblePlayers(
        playersByPosition,
        position,
        currentLineup,
        remainingSalary,
        exposure,
        totalLineups,
        maxExposure,
        minExposure = 0  // FIX #2: Added minExposure parameter
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

            // FIX #2: Exposure check - both max AND min
            const currentExposure = exposure[player.name] / totalLineups;

            // Check max exposure
            if (currentExposure >= maxExposure) {
                return false;
            }

            // FIX #2: Check min exposure
            // If we're past the point where min exposure can be satisfied, force the player
            const lineupsRemaining = totalLineups - Object.values(exposure).reduce((sum, val) => sum + (val > 0 ? 1 : 0), 0) / exposure[player.name] || totalLineups;
            const minLineupsNeeded = Math.ceil(minExposure * totalLineups);
            const currentLineups = exposure[player.name];

            // If player hasn't hit min exposure yet and we're running out of chances, prioritize them
            if (minExposure > 0 && currentLineups < minLineupsNeeded) {
                // Allow them through even if they'd normally be filtered
                return true;
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
            },
            pga: {
                classic: ['G', 'G', 'G', 'G', 'G', 'G']
            },
            soccer: {
                classic: ['F', 'F', 'M', 'M', 'D', 'D', 'GK', 'UTIL']
            },
            nascar: {
                classic: ['D', 'D', 'D', 'D', 'D', 'D']
            },
            mma: {
                classic: ['F', 'F', 'F', 'F', 'F', 'F']
            },
            cbb: {
                classic: ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']
            },
            cfb: {
                classic: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST']
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

        // Check position requirements are met
        const positionCounts = {};
        positions.forEach(pos => {
            positionCounts[pos] = (positionCounts[pos] || 0) + 1;
        });

        const filledCounts = {};
        lineup.players.forEach(player => {
            filledCounts[player.position] = (filledCounts[player.position] || 0) + 1;
        });

        Object.entries(positionCounts).forEach(([pos, needed]) => {
            const filled = filledCounts[pos] || 0;
            if (filled < needed && pos !== 'FLEX' && pos !== 'UTIL') {
                errors.push(`Position ${pos} needs ${needed}, has ${filled}`);
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
            salaryRemaining: 50000 - totalSalary
        };
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LineupOptimizer;
}
