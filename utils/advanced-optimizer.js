/**
 * Advanced DFS Lineup Optimizer
 *
 * Professional-grade optimization with:
 * - Lineup pool filters (locks, excludes, groups)
 * - Simulation-based diversity
 * - Player correlations (game theory)
 * - Advanced stacking (primary, secondary, bring-back)
 * - Granular salary controls
 * - Position-specific exposure rules
 */

const AdvancedOptimizer = {
    /**
     * Optimize with advanced settings
     * @param {Array<Object>} playerPool - Available players
     * @param {Object} settings - Advanced optimization settings
     * @returns {Array<Object>} - Optimized lineups
     */
    async optimizeAdvanced(playerPool, settings) {
        const {
            positions,
            salaryCap = 50000,
            numLineups = 1,

            // Salary Parameters
            salaryParams = {},

            // Filters
            filters = {},

            // Sim Diversity
            diversity = {},

            // Correlation
            correlation = {},

            // Stacking
            stacking = {},

            // Exposure
            exposure = {}
        } = settings;

        // Apply filters to player pool
        let filteredPool = this.applyFilters(playerPool, filters);

        // Initialize tracking
        const lineupTracker = {
            exposureCount: {},
            playerPairings: {},
            teamUsage: {},
            salaryDistribution: [],
            correlationScores: []
        };

        // Initialize exposure tracking
        filteredPool.forEach(p => {
            lineupTracker.exposureCount[p.name] = 0;
        });

        const lineups = [];

        // Generate lineups with diversity
        for (let i = 0; i < numLineups; i++) {
            try {
                const lineup = await this.generateAdvancedLineup(
                    filteredPool,
                    positions,
                    salaryCap,
                    salaryParams,
                    filters,
                    diversity,
                    correlation,
                    stacking,
                    exposure,
                    lineupTracker,
                    lineups,
                    numLineups,
                    i
                );

                if (lineup) {
                    lineups.push(lineup);
                    this.updateTracking(lineup, lineupTracker);
                }
            } catch (error) {
                console.warn(`Failed to generate lineup ${i + 1}:`, error.message);
            }
        }

        // Sort by projection
        lineups.sort((a, b) => b.totalProjection - a.totalProjection);

        return lineups;
    },

    /**
     * Apply filters to player pool
     */
    applyFilters(playerPool, filters) {
        const {
            lockedPlayers = [],
            excludedPlayers = [],
            minProjection = 0,
            maxProjection = Infinity,
            minOwnership = 0,
            maxOwnership = 100,
            teams = [],
            excludeTeams = [],
            onlyExposedPlayers = false,
            playerGroups = {}
        } = filters;

        return playerPool.filter(player => {
            // Excluded players
            if (excludedPlayers.includes(player.name)) {
                return false;
            }

            // Projection range
            if (player.projection < minProjection || player.projection > maxProjection) {
                return false;
            }

            // Ownership range
            if (player.ownership) {
                if (player.ownership < minOwnership || player.ownership > maxOwnership) {
                    return false;
                }
            }

            // Team filters
            if (teams.length > 0 && !teams.includes(player.team)) {
                return false;
            }

            if (excludeTeams.length > 0 && excludeTeams.includes(player.team)) {
                return false;
            }

            return true;
        });
    },

    /**
     * Generate single lineup with advanced features
     */
    async generateAdvancedLineup(
        playerPool,
        positions,
        salaryCap,
        salaryParams,
        filters,
        diversity,
        correlation,
        stacking,
        exposure,
        tracker,
        existingLineups,
        totalLineups,
        lineupIndex
    ) {
        const lineup = [];
        let remainingSalary = salaryCap;

        // Handle locked players first
        const lockedPlayers = this.getLockedPlayers(playerPool, filters.lockedPlayers || []);
        lockedPlayers.forEach(player => {
            lineup.push(player);
            remainingSalary -= player.salary;
        });

        // Build primary stack
        if (stacking.primaryStack?.enabled) {
            const primaryStack = this.buildPrimaryStack(
                playerPool,
                lineup,
                stacking.primaryStack,
                tracker,
                totalLineups
            );

            primaryStack.forEach(player => {
                if (!lineup.some(p => p.name === player.name)) {
                    lineup.push(player);
                    remainingSalary -= player.salary;
                }
            });
        }

        // Build bring-back stack
        if (stacking.bringBack?.enabled) {
            const bringBack = this.buildBringBackStack(
                playerPool,
                lineup,
                stacking.bringBack,
                tracker,
                totalLineups
            );

            bringBack.forEach(player => {
                if (!lineup.some(p => p.name === player.name)) {
                    lineup.push(player);
                    remainingSalary -= player.salary;
                }
            });
        }

        // Build secondary stack
        if (stacking.secondaryStack?.enabled) {
            const secondaryStack = this.buildSecondaryStack(
                playerPool,
                lineup,
                stacking.secondaryStack,
                tracker,
                totalLineups
            );

            secondaryStack.forEach(player => {
                if (!lineup.some(p => p.name === player.name)) {
                    lineup.push(player);
                    remainingSalary -= player.salary;
                }
            });
        }

        // Fill remaining positions with diversity
        const positionsFilled = lineup.map(p => p.position);
        const remainingPositions = positions.filter((pos, idx) => !positionsFilled.includes(pos));

        for (const position of remainingPositions) {
            const eligible = this.getEligiblePlayersAdvanced(
                playerPool,
                position,
                lineup,
                remainingSalary,
                salaryParams,
                exposure,
                tracker,
                totalLineups
            );

            if (eligible.length === 0) {
                throw new Error(`No eligible players for position ${position}`);
            }

            // Apply correlation scoring
            const scoredPlayers = this.applyCorrelationScoring(
                eligible,
                lineup,
                correlation
            );

            // Apply diversity
            const diversifiedPlayer = this.applyDiversity(
                scoredPlayers,
                existingLineups,
                diversity,
                lineupIndex,
                totalLineups
            );

            lineup.push(diversifiedPlayer);
            remainingSalary -= diversifiedPlayer.salary;
        }

        // Validate lineup
        const isValid = this.validateAdvancedLineup(
            lineup,
            positions,
            salaryCap,
            salaryParams
        );

        if (!isValid.valid) {
            throw new Error(`Invalid lineup: ${isValid.errors.join(', ')}`);
        }

        // Calculate stats
        const stats = this.calculateAdvancedStats(lineup, correlation);

        return {
            players: lineup,
            ...stats
        };
    },

    /**
     * Get locked players
     */
    getLockedPlayers(playerPool, lockedNames) {
        return lockedNames.map(name => {
            return playerPool.find(p => p.name === name);
        }).filter(p => p);
    },

    /**
     * Build primary stack (main correlation)
     */
    buildPrimaryStack(playerPool, currentLineup, stackSettings, tracker, totalLineups) {
        const {
            positions = ['QB', 'WR', 'WR'],
            minStackSize = 2,
            maxStackSize = 4,
            exposure: stackExposure = 1.0,
            preferredTeams = []
        } = stackSettings;

        // Group by team
        const teamGroups = {};
        playerPool.forEach(player => {
            if (!player.team) return;
            if (currentLineup.some(p => p.name === player.name)) return;

            if (!teamGroups[player.team]) {
                teamGroups[player.team] = [];
            }
            teamGroups[player.team].push(player);
        });

        // Score each potential stack
        let bestStack = null;
        let bestScore = -Infinity;

        Object.entries(teamGroups).forEach(([team, players]) => {
            // Check exposure
            const teamExposure = (tracker.teamUsage[team] || 0) / totalLineups;
            if (teamExposure >= stackExposure) return;

            // Filter by position requirements
            const stackPlayers = [];
            positions.forEach(pos => {
                const eligible = players.filter(p =>
                    p.position === pos &&
                    !stackPlayers.some(sp => sp.name === p.name)
                );

                if (eligible.length > 0) {
                    // Sort by projection
                    eligible.sort((a, b) => (b.projection || 0) - (a.projection || 0));
                    stackPlayers.push(eligible[0]);
                }
            });

            if (stackPlayers.length >= minStackSize && stackPlayers.length <= maxStackSize) {
                // Calculate stack score
                const totalProj = stackPlayers.reduce((sum, p) => sum + (p.projection || 0), 0);
                const avgSalary = stackPlayers.reduce((sum, p) => sum + p.salary, 0) / stackPlayers.length;
                const value = totalProj / (avgSalary / 1000);

                // Bonus for preferred teams
                const teamBonus = preferredTeams.includes(team) ? 5 : 0;

                const score = value + teamBonus;

                if (score > bestScore) {
                    bestScore = score;
                    bestStack = stackPlayers;
                }
            }
        });

        return bestStack || [];
    },

    /**
     * Build bring-back stack (opponent players)
     */
    buildBringBackStack(playerPool, currentLineup, bringBackSettings, tracker, totalLineups) {
        const {
            positions = ['WR'],
            minPlayers = 1,
            maxPlayers = 2,
            exposure: bringBackExposure = 0.8
        } = bringBackSettings;

        // Find opponent team from primary stack
        const primaryTeams = new Set(currentLineup.map(p => p.team));
        if (primaryTeams.size === 0) return [];

        const primaryTeam = Array.from(primaryTeams)[0];

        // Find players from opponent
        const opponents = currentLineup
            .filter(p => p.opponent)
            .map(p => p.opponent);

        if (opponents.length === 0) return [];

        const opponentTeam = opponents[0];

        // Get opponent players
        const opponentPlayers = playerPool.filter(p =>
            p.team === opponentTeam &&
            !currentLineup.some(lp => lp.name === p.name)
        );

        // Filter by position
        const eligible = opponentPlayers.filter(p => positions.includes(p.position));

        // Sort by projection
        eligible.sort((a, b) => (b.projection || 0) - (a.projection || 0));

        // Check exposure
        const validPlayers = eligible.filter(p => {
            const exp = (tracker.exposureCount[p.name] || 0) / totalLineups;
            return exp < bringBackExposure;
        });

        return validPlayers.slice(0, maxPlayers);
    },

    /**
     * Build secondary stack (another game/team)
     */
    buildSecondaryStack(playerPool, currentLineup, secondarySettings, tracker, totalLineups) {
        const {
            positions = ['RB'],
            minPlayers = 1,
            maxPlayers = 2,
            exposure: secondaryExposure = 0.6,
            avoidPrimaryTeams = true
        } = secondarySettings;

        const primaryTeams = new Set(currentLineup.map(p => p.team));

        // Filter players
        let eligible = playerPool.filter(p =>
            !currentLineup.some(lp => lp.name === p.name) &&
            positions.includes(p.position)
        );

        // Avoid primary teams if specified
        if (avoidPrimaryTeams) {
            eligible = eligible.filter(p => !primaryTeams.has(p.team));
        }

        // Check exposure
        eligible = eligible.filter(p => {
            const exp = (tracker.exposureCount[p.name] || 0) / totalLineups;
            return exp < secondaryExposure;
        });

        // Sort by value
        eligible.sort((a, b) => {
            const valueA = (a.projection || 0) / (a.salary / 1000);
            const valueB = (b.projection || 0) / (b.salary / 1000);
            return valueB - valueA;
        });

        return eligible.slice(0, maxPlayers);
    },

    /**
     * Get eligible players with advanced constraints
     */
    getEligiblePlayersAdvanced(
        playerPool,
        position,
        currentLineup,
        remainingSalary,
        salaryParams,
        exposure,
        tracker,
        totalLineups
    ) {
        const {
            minSalaryAtPosition = {},
            maxSalaryAtPosition = {},
            minRemainingPlayers = 1
        } = salaryParams;

        const positionPlayers = playerPool.filter(player => {
            // Position match
            if (!this.isPositionMatch(player.position, position)) {
                return false;
            }

            // Not in lineup
            if (currentLineup.some(p => p.name === player.name)) {
                return false;
            }

            // Salary constraints
            if (player.salary > remainingSalary) {
                return false;
            }

            // Position-specific salary
            if (minSalaryAtPosition[position] && player.salary < minSalaryAtPosition[position]) {
                return false;
            }

            if (maxSalaryAtPosition[position] && player.salary > maxSalaryAtPosition[position]) {
                return false;
            }

            // Exposure check
            const playerExposure = (tracker.exposureCount[player.name] || 0) / totalLineups;
            const maxExp = exposure.global?.maxExposure || 1.0;
            const minExp = exposure.global?.minExposure || 0;

            // Position-specific exposure
            const posMaxExp = exposure.byPosition?.[position]?.max || maxExp;
            const posMinExp = exposure.byPosition?.[position]?.min || minExp;

            if (playerExposure >= posMaxExp) {
                return false;
            }

            return true;
        });

        return positionPlayers;
    },

    /**
     * Apply correlation scoring to players
     */
    applyCorrelationScoring(players, currentLineup, correlationSettings) {
        const {
            enabled = false,
            correlationMatrix = {},
            gameStackBonus = 2.0,
            opponentPenalty = -1.0,
            samePositionPenalty = -0.5
        } = correlationSettings;

        if (!enabled) {
            return players;
        }

        return players.map(player => {
            let correlationScore = player.projection || 0;

            currentLineup.forEach(lineupPlayer => {
                // Check correlation matrix
                const matrixKey = `${lineupPlayer.name}-${player.name}`;
                const reverseKey = `${player.name}-${lineupPlayer.name}`;

                if (correlationMatrix[matrixKey]) {
                    correlationScore *= (1 + correlationMatrix[matrixKey]);
                } else if (correlationMatrix[reverseKey]) {
                    correlationScore *= (1 + correlationMatrix[reverseKey]);
                }

                // Same team bonus (game stack)
                if (player.team === lineupPlayer.team) {
                    correlationScore *= gameStackBonus;
                }

                // Opponent team bonus (bring-back)
                if (player.team === lineupPlayer.opponent) {
                    correlationScore *= (1 + Math.abs(opponentPenalty) * 0.5);
                }

                // Same position penalty
                if (player.position === lineupPlayer.position) {
                    correlationScore *= (1 + samePositionPenalty);
                }
            });

            return {
                ...player,
                correlationScore,
                originalProjection: player.projection
            };
        }).sort((a, b) => b.correlationScore - a.correlationScore);
    },

    /**
     * Apply diversity to player selection
     */
    applyDiversity(players, existingLineups, diversitySettings, lineupIndex, totalLineups) {
        const {
            enabled = true,
            method = 'simulation', // 'simulation', 'ownership', 'randomness'
            diversityFactor = 0.3,
            ownershipFade = true,
            chalkThreshold = 20
        } = diversitySettings;

        if (!enabled || existingLineups.length === 0) {
            return players[0]; // Return top player
        }

        if (method === 'simulation') {
            // Simulation-based diversity
            return this.simulationDiversity(players, existingLineups, diversityFactor);
        } else if (method === 'ownership') {
            // Ownership-based diversity
            return this.ownershipDiversity(players, ownershipFade, chalkThreshold);
        } else {
            // Randomness-based
            return this.randomnessDiversity(players, diversityFactor);
        }
    },

    /**
     * Simulation-based diversity (avoid duplicating lineups)
     */
    simulationDiversity(players, existingLineups, diversityFactor) {
        // Calculate how often each player appears in existing lineups
        const playerFrequency = {};
        existingLineups.forEach(lineup => {
            lineup.players.forEach(player => {
                playerFrequency[player.name] = (playerFrequency[player.name] || 0) + 1;
            });
        });

        // Penalize frequently used players
        const adjustedPlayers = players.map(player => {
            const frequency = playerFrequency[player.name] || 0;
            const penalty = frequency * diversityFactor;
            const adjustedScore = (player.correlationScore || player.projection) - penalty;

            return {
                ...player,
                adjustedScore,
                frequency
            };
        });

        // Sort by adjusted score
        adjustedPlayers.sort((a, b) => b.adjustedScore - a.adjustedScore);

        // Add some randomness to top options
        const topN = Math.min(5, adjustedPlayers.length);
        const randomIndex = Math.floor(Math.random() * topN);

        return adjustedPlayers[randomIndex];
    },

    /**
     * Ownership-based diversity (fade chalk)
     */
    ownershipDiversity(players, ownershipFade, chalkThreshold) {
        if (!ownershipFade) {
            return players[0];
        }

        // Find low-owned player among top values
        const lowOwnedPlayers = players.filter(p =>
            (p.ownership || 0) < chalkThreshold
        );

        if (lowOwnedPlayers.length > 0) {
            // 70% chance to pick low-owned, 30% chalk
            if (Math.random() < 0.7) {
                return lowOwnedPlayers[0];
            }
        }

        return players[0];
    },

    /**
     * Randomness-based diversity
     */
    randomnessDiversity(players, diversityFactor) {
        const topN = Math.min(Math.ceil(players.length * diversityFactor), players.length);
        const randomIndex = Math.floor(Math.random() * topN);
        return players[randomIndex];
    },

    /**
     * Position matching logic
     */
    isPositionMatch(playerPosition, requiredPosition) {
        // Direct match
        if (playerPosition === requiredPosition) return true;

        // FLEX eligibility
        if (requiredPosition === 'FLEX') {
            return ['RB', 'WR', 'TE'].includes(playerPosition);
        }

        // UTIL eligibility
        if (requiredPosition === 'UTIL') {
            return true;
        }

        // Multi-position (e.g., "PG/SG")
        if (playerPosition.includes('/')) {
            return playerPosition.split('/').includes(requiredPosition);
        }

        // G (Guard) eligibility
        if (requiredPosition === 'G') {
            return ['PG', 'SG'].includes(playerPosition);
        }

        // F (Forward) eligibility
        if (requiredPosition === 'F') {
            return ['SF', 'PF'].includes(playerPosition);
        }

        return false;
    },

    /**
     * Validate lineup with advanced rules
     */
    validateAdvancedLineup(lineup, positions, salaryCap, salaryParams) {
        const errors = [];

        // Basic validation
        const totalSalary = lineup.reduce((sum, p) => sum + p.salary, 0);

        if (totalSalary > salaryCap) {
            errors.push(`Exceeds salary cap: $${totalSalary} > $${salaryCap}`);
        }

        if (salaryParams.minTotalSalary && totalSalary < salaryParams.minTotalSalary) {
            errors.push(`Below minimum salary: $${totalSalary} < $${salaryParams.minTotalSalary}`);
        }

        // Position count
        if (lineup.length !== positions.length) {
            errors.push(`Wrong number of players: ${lineup.length} vs ${positions.length}`);
        }

        // Team limits
        if (salaryParams.maxPlayersFromTeam) {
            const teamCounts = {};
            lineup.forEach(p => {
                teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
            });

            Object.entries(teamCounts).forEach(([team, count]) => {
                if (count > salaryParams.maxPlayersFromTeam) {
                    errors.push(`Too many players from ${team}: ${count}`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Calculate advanced lineup statistics
     */
    calculateAdvancedStats(lineup, correlationSettings) {
        const totalSalary = lineup.reduce((sum, p) => sum + p.salary, 0);
        const totalProjection = lineup.reduce((sum, p) => sum + (p.projection || 0), 0);

        // Team diversity
        const teams = new Set(lineup.map(p => p.team));
        const teamCount = teams.size;

        // Stacking info
        const teamCounts = {};
        lineup.forEach(p => {
            teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
        });

        const maxStack = Math.max(...Object.values(teamCounts));
        const primaryStackTeam = Object.entries(teamCounts).find(([, count]) => count === maxStack)?.[0];

        // Ownership
        const avgOwnership = lineup.reduce((sum, p) => sum + (p.ownership || 0), 0) / lineup.length;

        // Correlation score
        let correlationScore = 0;
        if (correlationSettings.enabled) {
            lineup.forEach((p1, i) => {
                lineup.slice(i + 1).forEach(p2 => {
                    if (p1.team === p2.team) {
                        correlationScore += 1;
                    }
                    if (p1.team === p2.opponent) {
                        correlationScore += 0.5;
                    }
                });
            });
        }

        return {
            totalSalary,
            totalProjection,
            avgProjection: totalProjection / lineup.length,
            teamCount,
            maxStack,
            primaryStackTeam,
            avgOwnership,
            correlationScore,
            salaryRemaining: salaryCap - totalSalary
        };
    },

    /**
     * Update tracking after lineup generation
     */
    updateTracking(lineup, tracker) {
        // Update exposure
        lineup.players.forEach(player => {
            tracker.exposureCount[player.name] = (tracker.exposureCount[player.name] || 0) + 1;
        });

        // Update team usage
        lineup.players.forEach(player => {
            if (player.team) {
                tracker.teamUsage[player.team] = (tracker.teamUsage[player.team] || 0) + 1;
            }
        });

        // Update pairings
        lineup.players.forEach((p1, i) => {
            lineup.players.slice(i + 1).forEach(p2 => {
                const pairKey = [p1.name, p2.name].sort().join('-');
                tracker.playerPairings[pairKey] = (tracker.playerPairings[pairKey] || 0) + 1;
            });
        });

        // Update salary distribution
        tracker.salaryDistribution.push(lineup.totalSalary);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedOptimizer;
}
