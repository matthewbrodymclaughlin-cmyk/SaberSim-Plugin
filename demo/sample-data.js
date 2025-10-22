/**
 * Sample NFL Week Data for Demo
 *
 * This represents what you'd get from:
 * - DraftKings player pool export
 * - Vegas betting lines
 * - Projection sources
 */

const SampleNFLData = {
    // This week's slate info
    slateInfo: {
        week: 12,
        sport: 'NFL',
        date: '2024-11-24',
        site: 'DraftKings',
        salaryCap: 50000,
        contestType: 'classic'
    },

    // Game lines from Vegas
    games: [
        {
            game: 'KC @ LV',
            awayTeam: 'KC',
            homeTeam: 'LV',
            spread: -7.5,  // KC favored
            total: 52.5,
            awayImplied: 30.0,
            homeImplied: 22.5,
            kickoff: '4:25 PM ET'
        },
        {
            game: 'BUF @ MIA',
            awayTeam: 'BUF',
            homeTeam: 'MIA',
            spread: -3,
            total: 48.5,
            awayImplied: 25.75,
            homeImplied: 22.75,
            kickoff: '1:00 PM ET'
        },
        {
            game: 'DET @ GB',
            awayTeam: 'DET',
            homeTeam: 'GB',
            spread: -2.5,
            total: 47.5,
            awayImplied: 25.0,
            homeImplied: 22.5,
            kickoff: '1:00 PM ET'
        },
        {
            game: 'SF @ ARI',
            awayTeam: 'SF',
            homeTeam: 'ARI',
            spread: -6,
            total: 45.5,
            awayImplied: 25.75,
            homeImplied: 19.75,
            kickoff: '4:05 PM ET'
        },
        {
            game: 'PHI @ DAL',
            awayTeam: 'PHI',
            homeTeam: 'DAL',
            spread: -7,
            total: 46.5,
            awayImplied: 26.75,
            homeImplied: 19.75,
            kickoff: '4:25 PM ET'
        }
    ],

    // Player pool (DraftKings export format)
    players: [
        // QUARTERBACKS
        {
            id: 'DK-12345',
            name: 'Patrick Mahomes',
            position: 'QB',
            team: 'KC',
            opponent: 'LV',
            salary: 8500,
            projection: 26.5,
            ownership: 35,
            vegasProps: {
                passingYards: 295.5,
                passingTDs: 2.5,
                interceptions: 0.5
            }
        },
        {
            id: 'DK-12346',
            name: 'Josh Allen',
            position: 'QB',
            team: 'BUF',
            opponent: 'MIA',
            salary: 8200,
            projection: 25.8,
            ownership: 28,
            vegasProps: {
                passingYards: 265.5,
                passingTDs: 2.5,
                rushingYards: 45.5
            }
        },
        {
            id: 'DK-12347',
            name: 'Jalen Hurts',
            position: 'QB',
            team: 'PHI',
            opponent: 'DAL',
            salary: 7800,
            projection: 24.2,
            ownership: 22,
            vegasProps: {
                passingYards: 245.5,
                passingTDs: 2.5,
                rushingYards: 55.5
            }
        },
        {
            id: 'DK-12348',
            name: 'Jared Goff',
            position: 'QB',
            team: 'DET',
            opponent: 'GB',
            salary: 7200,
            projection: 22.5,
            ownership: 15,
            vegasProps: {
                passingYards: 275.5,
                passingTDs: 2.5
            }
        },
        {
            id: 'DK-12349',
            name: 'Brock Purdy',
            position: 'QB',
            team: 'SF',
            opponent: 'ARI',
            salary: 6800,
            projection: 21.2,
            ownership: 12,
            vegasProps: {
                passingYards: 255.5,
                passingTDs: 2.5
            }
        },

        // RUNNING BACKS
        {
            id: 'DK-22345',
            name: 'Christian McCaffrey',
            position: 'RB',
            team: 'SF',
            opponent: 'ARI',
            salary: 9000,
            projection: 24.2,
            ownership: 28,
            vegasProps: {
                rushingYards: 85.5,
                receivingYards: 45.5,
                totalTDs: 0.5
            }
        },
        {
            id: 'DK-22346',
            name: 'Bijan Robinson',
            position: 'RB',
            team: 'ATL',
            opponent: 'NO',
            salary: 7500,
            projection: 18.5,
            ownership: 22,
            vegasProps: {
                rushingYards: 95.5,
                receivingYards: 35.5
            }
        },
        {
            id: 'DK-22347',
            name: 'Derrick Henry',
            position: 'RB',
            team: 'BAL',
            opponent: 'CIN',
            salary: 7800,
            projection: 19.8,
            ownership: 25,
            vegasProps: {
                rushingYards: 105.5,
                totalTDs: 0.5
            }
        },
        {
            id: 'DK-22348',
            name: 'Jahmyr Gibbs',
            position: 'RB',
            team: 'DET',
            opponent: 'GB',
            salary: 6800,
            projection: 17.8,
            ownership: 18,
            vegasProps: {
                rushingYards: 75.5,
                receivingYards: 35.5
            }
        },
        {
            id: 'DK-22349',
            name: 'Rhamondre Stevenson',
            position: 'RB',
            team: 'NE',
            opponent: 'NYJ',
            salary: 6200,
            projection: 15.2,
            ownership: 14,
            vegasProps: {
                rushingYards: 85.5,
                receivingYards: 25.5
            }
        },
        {
            id: 'DK-22350',
            name: 'Isiah Pacheco',
            position: 'RB',
            team: 'KC',
            opponent: 'LV',
            salary: 5800,
            projection: 14.5,
            ownership: 12,
            vegasProps: {
                rushingYards: 75.5
            }
        },

        // WIDE RECEIVERS
        {
            id: 'DK-32345',
            name: 'Tyreek Hill',
            position: 'WR',
            team: 'MIA',
            opponent: 'BUF',
            salary: 8200,
            projection: 22.1,
            ownership: 32,
            vegasProps: {
                receivingYards: 95.5,
                receptions: 7.5,
                TDs: 0.5
            }
        },
        {
            id: 'DK-32346',
            name: 'Justin Jefferson',
            position: 'WR',
            team: 'MIN',
            opponent: 'CHI',
            salary: 8000,
            projection: 21.5,
            ownership: 28,
            vegasProps: {
                receivingYards: 88.5,
                receptions: 7.5
            }
        },
        {
            id: 'DK-32347',
            name: 'CeeDee Lamb',
            position: 'WR',
            team: 'DAL',
            opponent: 'PHI',
            salary: 7800,
            projection: 20.8,
            ownership: 24,
            vegasProps: {
                receivingYards: 85.5,
                receptions: 8.5
            }
        },
        {
            id: 'DK-32348',
            name: 'Rashee Rice',
            position: 'WR',
            team: 'KC',
            opponent: 'LV',
            salary: 5800,
            projection: 16.2,
            ownership: 18,
            vegasProps: {
                receivingYards: 68.5,
                receptions: 6.5
            }
        },
        {
            id: 'DK-32349',
            name: 'Davante Adams',
            position: 'WR',
            team: 'LV',
            opponent: 'KC',
            salary: 6800,
            projection: 17.5,
            ownership: 16,
            vegasProps: {
                receivingYards: 72.5,
                receptions: 6.5
            }
        },
        {
            id: 'DK-32350',
            name: 'AJ Brown',
            position: 'WR',
            team: 'PHI',
            opponent: 'DAL',
            salary: 7400,
            projection: 19.2,
            ownership: 22,
            vegasProps: {
                receivingYards: 78.5,
                receptions: 6.5
            }
        },
        {
            id: 'DK-32351',
            name: 'DeVonta Smith',
            position: 'WR',
            team: 'PHI',
            opponent: 'DAL',
            salary: 6400,
            projection: 16.8,
            ownership: 14,
            vegasProps: {
                receivingYards: 65.5,
                receptions: 6.5
            }
        },
        {
            id: 'DK-32352',
            name: 'Amon-Ra St. Brown',
            position: 'WR',
            team: 'DET',
            opponent: 'GB',
            salary: 7600,
            projection: 19.5,
            ownership: 26,
            vegasProps: {
                receivingYards: 82.5,
                receptions: 8.5
            }
        },

        // TIGHT ENDS
        {
            id: 'DK-42345',
            name: 'Travis Kelce',
            position: 'TE',
            team: 'KC',
            opponent: 'LV',
            salary: 7200,
            projection: 19.8,
            ownership: 24,
            vegasProps: {
                receivingYards: 78.5,
                receptions: 7.5,
                TDs: 0.5
            }
        },
        {
            id: 'DK-42346',
            name: 'Mark Andrews',
            position: 'TE',
            team: 'BAL',
            opponent: 'CIN',
            salary: 6400,
            projection: 16.5,
            ownership: 18,
            vegasProps: {
                receivingYards: 65.5,
                receptions: 5.5
            }
        },
        {
            id: 'DK-42347',
            name: 'Sam LaPorta',
            position: 'TE',
            team: 'DET',
            opponent: 'GB',
            salary: 5200,
            projection: 14.5,
            ownership: 12,
            vegasProps: {
                receivingYards: 55.5,
                receptions: 5.5
            }
        },
        {
            id: 'DK-42348',
            name: 'George Kittle',
            position: 'TE',
            team: 'SF',
            opponent: 'ARI',
            salary: 5800,
            projection: 15.2,
            ownership: 14,
            vegasProps: {
                receivingYards: 58.5,
                receptions: 5.5
            }
        },

        // DEFENSE
        {
            id: 'DK-52345',
            name: 'San Francisco',
            position: 'DST',
            team: 'SF',
            opponent: 'ARI',
            salary: 3600,
            projection: 9.6,
            ownership: 8
        },
        {
            id: 'DK-52346',
            name: 'Kansas City',
            position: 'DST',
            team: 'KC',
            opponent: 'LV',
            salary: 3400,
            projection: 8.8,
            ownership: 6
        },
        {
            id: 'DK-52347',
            name: 'Detroit',
            position: 'DST',
            team: 'DET',
            opponent: 'GB',
            salary: 3200,
            projection: 8.2,
            ownership: 5
        },
        {
            id: 'DK-52348',
            name: 'Buffalo',
            position: 'DST',
            team: 'BUF',
            opponent: 'MIA',
            salary: 3000,
            projection: 7.5,
            ownership: 4
        }
    ]
};

// Sample optimization settings for GPP
const GPPSettings = {
    positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'],
    salaryCap: 50000,
    numLineups: 20,

    salaryParams: {
        minTotalSalary: 49000,
        minSalaryAtPosition: {
            'QB': 6500,
            'RB': 5000,
            'WR': 4500
        },
        maxPlayersFromTeam: 4
    },

    filters: {
        lockedPlayers: [],  // Add your locks
        excludedPlayers: [],  // Add your excludes
        constraints: {
            minProjection: 8.0,
            maxOwnership: 35  // Fade very chalky plays
        }
    },

    diversity: {
        enabled: true,
        method: 'simulation',
        diversityFactor: 0.3
    },

    correlation: {
        enabled: true,
        gameStackBonus: 2.0,
        opponentPenalty: -0.5
    },

    stacking: {
        primaryStack: {
            enabled: true,
            positions: ['QB', 'WR', 'WR'],  // or ['QB', 'TE', 'WR']
            minStackSize: 2,
            maxStackSize: 3,
            exposure: 0.6,
            preferredTeams: ['KC', 'BUF', 'PHI']
        },
        bringBack: {
            enabled: true,
            positions: ['WR'],
            minPlayers: 0,
            maxPlayers: 1,
            exposure: 0.3
        },
        secondaryStack: {
            enabled: true,
            positions: ['RB', 'DST'],
            minPlayers: 0,
            maxPlayers: 2,
            exposure: 0.4,
            avoidPrimaryTeams: true
        }
    },

    exposure: {
        global: {
            maxExposure: 0.5,
            minExposure: 0.0
        },
        byPosition: {
            'QB': { max: 0.6 },
            'RB': { max: 0.4 },
            'WR': { max: 0.5 },
            'TE': { max: 0.5 },
            'DST': { max: 0.3 }
        }
    }
};

// Sample optimization settings for Cash
const CashSettings = {
    positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST'],
    salaryCap: 50000,
    numLineups: 3,

    salaryParams: {
        minTotalSalary: 49500,
        minSalaryAtPosition: {
            'QB': 7000,
            'RB': 6000
        }
    },

    filters: {
        lockedPlayers: ['Patrick Mahomes', 'Christian McCaffrey'],
        excludedPlayers: [],
        constraints: {
            minProjection: 10.0
        }
    },

    diversity: {
        enabled: false  // Want similar lineups for cash
    },

    correlation: {
        enabled: true,
        gameStackBonus: 2.0
    },

    stacking: {
        primaryStack: {
            enabled: true,
            positions: ['QB', 'WR', 'TE'],
            exposure: 1.0,  // Every lineup
            preferredTeams: ['KC']
        }
    },

    exposure: {
        global: {
            maxExposure: 1.0,
            minExposure: 0.8  // Heavy core plays
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SampleNFLData,
        GPPSettings,
        CashSettings
    };
}
