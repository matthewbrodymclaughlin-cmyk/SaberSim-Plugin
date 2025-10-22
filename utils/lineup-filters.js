/**
 * Lineup Pool Filters Manager
 *
 * Manages player locks, excludes, groups, and constraints
 */

const LineupFilters = {
    /**
     * Initialize filters from storage
     */
    async init() {
        const data = await chrome.storage.local.get(['lineupFilters']);
        return data.lineupFilters || this.getDefaultFilters();
    },

    /**
     * Get default filter settings
     */
    getDefaultFilters() {
        return {
            locked: [],
            excluded: [],
            groups: [],
            constraints: {
                minProjection: 0,
                maxProjection: Infinity,
                minOwnership: 0,
                maxOwnership: 100,
                minSalary: 0,
                maxSalary: Infinity
            },
            teamFilters: {
                include: [],
                exclude: []
            },
            positionConstraints: {}
        };
    },

    /**
     * Lock a player (must be in every lineup)
     */
    lockPlayer(playerName, filters) {
        if (!filters.locked.includes(playerName)) {
            filters.locked.push(playerName);
        }
        // Remove from excluded if present
        filters.excluded = filters.excluded.filter(name => name !== playerName);
        return filters;
    },

    /**
     * Unlock a player
     */
    unlockPlayer(playerName, filters) {
        filters.locked = filters.locked.filter(name => name !== playerName);
        return filters;
    },

    /**
     * Exclude a player (cannot be in any lineup)
     */
    excludePlayer(playerName, filters) {
        if (!filters.excluded.includes(playerName)) {
            filters.excluded.push(playerName);
        }
        // Remove from locked if present
        filters.locked = filters.locked.filter(name => name !== playerName);
        return filters;
    },

    /**
     * Remove exclusion
     */
    includePlayer(playerName, filters) {
        filters.excluded = filters.excluded.filter(name => name !== playerName);
        return filters;
    },

    /**
     * Create a player group (min/max from group)
     */
    createGroup(groupName, playerNames, min = 0, max = playerNames.length, filters) {
        const group = {
            id: Date.now().toString(),
            name: groupName,
            players: playerNames,
            min,
            max
        };

        filters.groups.push(group);
        return filters;
    },

    /**
     * Remove a group
     */
    removeGroup(groupId, filters) {
        filters.groups = filters.groups.filter(g => g.id !== groupId);
        return filters;
    },

    /**
     * Update group constraints
     */
    updateGroup(groupId, updates, filters) {
        const group = filters.groups.find(g => g.id === groupId);
        if (group) {
            Object.assign(group, updates);
        }
        return filters;
    },

    /**
     * Set projection range filter
     */
    setProjectionRange(min, max, filters) {
        filters.constraints.minProjection = min;
        filters.constraints.maxProjection = max;
        return filters;
    },

    /**
     * Set ownership range filter
     */
    setOwnershipRange(min, max, filters) {
        filters.constraints.minOwnership = min;
        filters.constraints.maxOwnership = max;
        return filters;
    },

    /**
     * Set salary range filter
     */
    setSalaryRange(min, max, filters) {
        filters.constraints.minSalary = min;
        filters.constraints.maxSalary = max;
        return filters;
    },

    /**
     * Include only specific teams
     */
    includeTeams(teams, filters) {
        filters.teamFilters.include = teams;
        return filters;
    },

    /**
     * Exclude specific teams
     */
    excludeTeams(teams, filters) {
        filters.teamFilters.exclude = teams;
        return filters;
    },

    /**
     * Set position-specific constraints
     */
    setPositionConstraint(position, constraint, filters) {
        filters.positionConstraints[position] = constraint;
        return filters;
    },

    /**
     * Apply filters to player pool
     */
    applyFilters(playerPool, filters) {
        return playerPool.filter(player => {
            // Excluded players
            if (filters.excluded.includes(player.name)) {
                return false;
            }

            // Projection range
            if (player.projection < filters.constraints.minProjection ||
                player.projection > filters.constraints.maxProjection) {
                return false;
            }

            // Ownership range
            if (player.ownership !== undefined) {
                if (player.ownership < filters.constraints.minOwnership ||
                    player.ownership > filters.constraints.maxOwnership) {
                    return false;
                }
            }

            // Salary range
            if (player.salary < filters.constraints.minSalary ||
                player.salary > filters.constraints.maxSalary) {
                return false;
            }

            // Team filters
            if (filters.teamFilters.include.length > 0) {
                if (!filters.teamFilters.include.includes(player.team)) {
                    return false;
                }
            }

            if (filters.teamFilters.exclude.length > 0) {
                if (filters.teamFilters.exclude.includes(player.team)) {
                    return false;
                }
            }

            // Position constraints
            if (filters.positionConstraints[player.position]) {
                const constraint = filters.positionConstraints[player.position];
                if (constraint.minSalary && player.salary < constraint.minSalary) {
                    return false;
                }
                if (constraint.maxSalary && player.salary > constraint.maxSalary) {
                    return false;
                }
            }

            return true;
        });
    },

    /**
     * Validate group constraints in lineup
     */
    validateGroups(lineup, filters) {
        const errors = [];

        filters.groups.forEach(group => {
            const playersInLineup = lineup.filter(p =>
                group.players.includes(p.name)
            ).length;

            if (playersInLineup < group.min) {
                errors.push(`Group "${group.name}" requires at least ${group.min} players, got ${playersInLineup}`);
            }

            if (playersInLineup > group.max) {
                errors.push(`Group "${group.name}" allows max ${group.max} players, got ${playersInLineup}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Get locked players that must be in lineup
     */
    getLockedPlayers(playerPool, filters) {
        return filters.locked.map(name => {
            return playerPool.find(p => p.name === name);
        }).filter(p => p);
    },

    /**
     * Save filters to storage
     */
    async save(filters) {
        await chrome.storage.local.set({ lineupFilters: filters });
    },

    /**
     * Load filters from storage
     */
    async load() {
        const data = await chrome.storage.local.get(['lineupFilters']);
        return data.lineupFilters || this.getDefaultFilters();
    },

    /**
     * Reset filters to defaults
     */
    reset() {
        return this.getDefaultFilters();
    },

    /**
     * Get filter summary for display
     */
    getSummary(filters) {
        return {
            lockedCount: filters.locked.length,
            excludedCount: filters.excluded.length,
            groupsCount: filters.groups.length,
            hasProjectionFilter: filters.constraints.minProjection > 0 ||
                                 filters.constraints.maxProjection < Infinity,
            hasOwnershipFilter: filters.constraints.minOwnership > 0 ||
                                filters.constraints.maxOwnership < 100,
            hasSalaryFilter: filters.constraints.minSalary > 0 ||
                             filters.constraints.maxSalary < Infinity,
            hasTeamFilter: filters.teamFilters.include.length > 0 ||
                           filters.teamFilters.exclude.length > 0
        };
    },

    /**
     * Export filters as JSON
     */
    export(filters) {
        return JSON.stringify(filters, null, 2);
    },

    /**
     * Import filters from JSON
     */
    import(jsonString) {
        try {
            const filters = JSON.parse(jsonString);
            return filters;
        } catch (error) {
            console.error('Failed to import filters:', error);
            return this.getDefaultFilters();
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LineupFilters;
}
