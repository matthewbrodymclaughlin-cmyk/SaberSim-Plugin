/**
 * SaberSim DFS Build Optimizer - Background Service Worker
 *
 * This service worker handles:
 * - API communication with SaberSim
 * - Build optimization requests
 * - Error handling and retry logic
 * - Response formatting
 */

// SaberSim API Configuration
const SABERSIM_CONFIG = {
    // Base API URL (adjust based on actual SaberSim API endpoints)
    baseUrl: 'https://api.sabersim.com',

    // API Endpoints (these are placeholders - adjust based on actual API documentation)
    endpoints: {
        optimize: '/v1/optimize',
        projections: '/v1/projections',
        contests: '/v1/contests',
        validate: '/v1/validate'
    },

    // Request timeout in milliseconds
    timeout: 60000
};

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'optimizeLineups') {
        handleOptimizeRequest(request.params, request.apiKey)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        // Return true to indicate async response
        return true;
    }

    if (request.action === 'validateApiKey') {
        validateApiKey(request.apiKey)
            .then(valid => sendResponse({ success: true, valid }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }
});

/**
 * Handle lineup optimization request
 */
async function handleOptimizeRequest(params, apiKey) {
    if (!apiKey) {
        throw new Error('API key is required');
    }

    // Build request payload based on SaberSim API specification
    const payload = buildOptimizationPayload(params);

    // Make API request
    const response = await makeApiRequest(
        SABERSIM_CONFIG.endpoints.optimize,
        'POST',
        payload,
        apiKey
    );

    // Parse and format response
    return formatOptimizationResponse(response, params);
}

/**
 * Build optimization request payload
 */
function buildOptimizationPayload(params) {
    /**
     * Note: This payload structure is a template based on common DFS optimizer APIs.
     * You'll need to adjust this based on the actual SaberSim API documentation.
     *
     * Common parameters typically include:
     * - sport: The sport being optimized (nfl, nba, mlb, etc.)
     * - site: DFS platform (draftkings, fanduel, yahoo)
     * - contest_type: Type of contest (classic, showdown, etc.)
     * - num_lineups: Number of lineups to generate
     * - salary_cap: Maximum salary allowed
     * - min_salary: Minimum salary to use
     * - max_exposure: Maximum player exposure across lineups
     * - min_exposure: Minimum player exposure
     * - use_randomness: Enable randomness in optimization
     * - stacking: Stacking rules and preferences
     */

    const payload = {
        sport: params.sport,
        site: params.site,
        contest_type: params.contestType,
        settings: {
            num_lineups: params.numLineups,
            salary_cap: params.salaryCap,
            min_salary: params.minSalary,
            max_exposure: params.maxExposure,
            min_exposure: params.minExposure,
            use_randomness: params.randomness
        }
    };

    // Add stacking rules if enabled
    if (params.stacking && params.stackSize) {
        payload.settings.stacking = {
            enabled: true,
            stack_size: params.stackSize,
            // Additional stacking rules can be added here
            // For example: primary_stack_teams, bring_back_rules, etc.
        };
    }

    return payload;
}

/**
 * Make API request to SaberSim
 */
async function makeApiRequest(endpoint, method = 'GET', body = null, apiKey = null) {
    const url = `${SABERSIM_CONFIG.baseUrl}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    // Add authentication header (adjust based on SaberSim's auth method)
    if (apiKey) {
        // Common auth methods:
        // - Bearer token: 'Authorization': `Bearer ${apiKey}`
        // - API key header: 'X-API-Key': apiKey
        // Adjust based on actual SaberSim API documentation
        headers['Authorization'] = `Bearer ${apiKey}`;
        // Alternative: headers['X-API-Key'] = apiKey;
    }

    const options = {
        method,
        headers,
        mode: 'cors',
        credentials: 'omit'
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), SABERSIM_CONFIG.timeout)
        );

        // Race between fetch and timeout
        const response = await Promise.race([
            fetch(url, options),
            timeoutPromise
        ]);

        // Check response status
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                errorData.error ||
                `API request failed with status ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);

        // Provide more helpful error messages
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Unable to reach SaberSim API. Please check your internet connection.');
        }

        if (error.message.includes('timeout')) {
            throw new Error('Request timeout: The optimization is taking too long. Please try with fewer lineups.');
        }

        throw error;
    }
}

/**
 * Format optimization response from SaberSim API
 */
function formatOptimizationResponse(apiResponse, params) {
    /**
     * This function formats the SaberSim API response into a consistent structure
     * that the popup can display.
     *
     * Note: The actual response structure from SaberSim may vary.
     * Adjust this based on the actual API response format.
     */

    // Handle case where API returns lineups directly
    if (apiResponse.lineups && Array.isArray(apiResponse.lineups)) {
        return {
            lineups: apiResponse.lineups.map(lineup => formatLineup(lineup, params)),
            metadata: {
                sport: params.sport,
                site: params.site,
                contestType: params.contestType,
                generatedAt: new Date().toISOString(),
                totalLineups: apiResponse.lineups.length
            }
        };
    }

    // Handle case where API returns different structure
    // This is a fallback/example - adjust based on actual API
    if (apiResponse.data && apiResponse.data.lineups) {
        return {
            lineups: apiResponse.data.lineups.map(lineup => formatLineup(lineup, params)),
            metadata: {
                sport: params.sport,
                site: params.site,
                contestType: params.contestType,
                generatedAt: new Date().toISOString(),
                totalLineups: apiResponse.data.lineups.length
            }
        };
    }

    // If response doesn't match expected format, throw error
    throw new Error('Unexpected API response format');
}

/**
 * Format a single lineup
 */
function formatLineup(lineup, params) {
    /**
     * Format a lineup into a consistent structure
     *
     * Expected output format:
     * {
     *   players: [
     *     { position: 'QB', name: 'Player Name', salary: 7500, projection: 23.5, team: 'KC', opponent: 'LV' },
     *     ...
     *   ],
     *   totalSalary: 49800,
     *   totalProjection: 145.6
     * }
     */

    // Handle different possible lineup formats from the API
    let players = [];

    if (Array.isArray(lineup)) {
        // If lineup is directly an array of players
        players = lineup;
    } else if (lineup.players && Array.isArray(lineup.players)) {
        // If lineup has a players property
        players = lineup.players;
    } else if (lineup.roster && Array.isArray(lineup.roster)) {
        // Alternative naming
        players = lineup.roster;
    }

    // Format each player
    const formattedPlayers = players.map(player => ({
        position: player.position || player.pos || 'FLEX',
        name: player.name || player.player_name || 'Unknown',
        salary: player.salary || player.cost || 0,
        projection: player.projection || player.fpts || player.projected_points || 0,
        team: player.team || player.team_abbr || '',
        opponent: player.opponent || player.opp || '',
        // Additional optional fields
        ownership: player.ownership || null,
        value: player.value || null
    }));

    // Calculate totals
    const totalSalary = formattedPlayers.reduce((sum, p) => sum + p.salary, 0);
    const totalProjection = formattedPlayers.reduce((sum, p) => sum + p.projection, 0);

    return {
        players: formattedPlayers,
        totalSalary,
        totalProjection,
        // Include original lineup data if available
        originalData: lineup
    };
}

/**
 * Validate API key
 */
async function validateApiKey(apiKey) {
    try {
        // Make a lightweight API call to validate the key
        // Adjust endpoint based on actual SaberSim API
        await makeApiRequest(SABERSIM_CONFIG.endpoints.validate, 'GET', null, apiKey);
        return true;
    } catch (error) {
        console.error('API key validation failed:', error);
        return false;
    }
}

/**
 * Generate mock data for testing (when API is not available)
 * Remove this function when integrating with real API
 */
function generateMockData(params) {
    const positions = getPositionsForSport(params.sport, params.contestType);
    const mockPlayers = [
        'Patrick Mahomes', 'Josh Allen', 'Jalen Hurts',
        'Christian McCaffrey', 'Austin Ekeler', 'Derrick Henry',
        'Tyreek Hill', 'Justin Jefferson', 'CeeDee Lamb',
        'Travis Kelce', 'Mark Andrews', 'George Kittle'
    ];

    const lineups = [];

    for (let i = 0; i < params.numLineups; i++) {
        const players = positions.map((pos, idx) => ({
            position: pos,
            name: mockPlayers[idx % mockPlayers.length] + (i > 0 ? ` ${i}` : ''),
            salary: Math.floor(Math.random() * 5000) + 5000,
            projection: (Math.random() * 20 + 10).toFixed(2),
            team: ['KC', 'BUF', 'PHI', 'SF', 'DAL'][Math.floor(Math.random() * 5)],
            opponent: ['LV', 'MIA', 'NYG', 'ARI', 'WAS'][Math.floor(Math.random() * 5)]
        }));

        lineups.push({ players });
    }

    return {
        lineups,
        metadata: {
            sport: params.sport,
            site: params.site,
            contestType: params.contestType,
            generatedAt: new Date().toISOString(),
            totalLineups: lineups.length
        }
    };
}

/**
 * Get positions for a given sport and contest type
 */
function getPositionsForSport(sport, contestType) {
    const positionMap = {
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

    return positionMap[sport]?.[contestType] || ['FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX'];
}

console.log('SaberSim DFS Optimizer background service worker loaded');
