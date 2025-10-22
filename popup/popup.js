/**
 * SaberSim DFS Build Optimizer - Popup Script
 *
 * This script manages the Chrome extension popup UI and handles:
 * - API key configuration and storage
 * - User input for sport, contest, and build parameters
 * - Communication with SaberSim API via background service worker
 * - Display of optimized lineup results
 * - Export functionality for lineup data
 */

// DOM Elements
const elements = {
    apiKey: document.getElementById('api-key'),
    saveApiKey: document.getElementById('save-api-key'),
    apiStatus: document.getElementById('api-status'),

    sportSelect: document.getElementById('sport-select'),
    contestType: document.getElementById('contest-type'),
    siteSelect: document.getElementById('site-select'),

    salaryCap: document.getElementById('salary-cap'),
    numLineups: document.getElementById('num-lineups'),
    maxExposure: document.getElementById('max-exposure'),
    minExposure: document.getElementById('min-exposure'),
    minSalary: document.getElementById('min-salary'),
    randomness: document.getElementById('randomness'),
    stacking: document.getElementById('stacking'),
    stackSize: document.getElementById('stack-size'),
    stackSizeGroup: document.getElementById('stack-size-group'),

    optimizeBtn: document.getElementById('optimize-btn'),
    resetBtn: document.getElementById('reset-btn'),
    loading: document.getElementById('loading'),
    resultsSection: document.getElementById('results-section'),
    resultsContainer: document.getElementById('results-container'),
    errorMessage: document.getElementById('error-message'),
    exportCsv: document.getElementById('export-csv'),
    copyResults: document.getElementById('copy-results')
};

// Application State
let currentResults = null;

/**
 * Initialize the popup when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadSavedSettings();
    attachEventListeners();
});

/**
 * Load previously saved settings from Chrome storage
 */
async function loadSavedSettings() {
    try {
        const data = await chrome.storage.local.get([
            'apiKey',
            'sport',
            'contestType',
            'site',
            'salaryCap',
            'numLineups',
            'maxExposure',
            'minExposure',
            'minSalary',
            'randomness',
            'stacking',
            'stackSize'
        ]);

        // Restore API key status (but not the key itself for security)
        if (data.apiKey) {
            showStatus('API key is configured', 'success');
            elements.apiKey.placeholder = '********** (saved)';
        }

        // Restore form values
        if (data.sport) elements.sportSelect.value = data.sport;
        if (data.contestType) elements.contestType.value = data.contestType;
        if (data.site) elements.siteSelect.value = data.site;
        if (data.salaryCap) elements.salaryCap.value = data.salaryCap;
        if (data.numLineups) elements.numLineups.value = data.numLineups;
        if (data.maxExposure) elements.maxExposure.value = data.maxExposure;
        if (data.minExposure) elements.minExposure.value = data.minExposure;
        if (data.minSalary) elements.minSalary.value = data.minSalary;
        if (data.randomness !== undefined) elements.randomness.checked = data.randomness;
        if (data.stacking !== undefined) elements.stacking.checked = data.stacking;
        if (data.stackSize) elements.stackSize.value = data.stackSize;

        // Show stack size if stacking is enabled
        if (data.stacking) {
            elements.stackSizeGroup.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading saved settings:', error);
    }
}

/**
 * Attach event listeners to UI elements
 */
function attachEventListeners() {
    // API Key management
    elements.saveApiKey.addEventListener('click', saveApiKey);
    elements.apiKey.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveApiKey();
    });

    // Stacking toggle
    elements.stacking.addEventListener('change', (e) => {
        elements.stackSizeGroup.style.display = e.target.checked ? 'block' : 'none';
    });

    // Form changes - save to storage
    const formElements = [
        elements.sportSelect,
        elements.contestType,
        elements.siteSelect,
        elements.salaryCap,
        elements.numLineups,
        elements.maxExposure,
        elements.minExposure,
        elements.minSalary,
        elements.randomness,
        elements.stacking,
        elements.stackSize
    ];

    formElements.forEach(el => {
        el.addEventListener('change', saveFormSettings);
    });

    // Action buttons
    elements.optimizeBtn.addEventListener('click', optimizeLineups);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.exportCsv.addEventListener('click', exportToCSV);
    elements.copyResults.addEventListener('click', copyToClipboard);
}

/**
 * Save API key to Chrome storage
 */
async function saveApiKey() {
    const apiKey = elements.apiKey.value.trim();

    if (!apiKey) {
        showStatus('Please enter an API key', 'error');
        return;
    }

    try {
        await chrome.storage.local.set({ apiKey });
        showStatus('API key saved successfully!', 'success');
        elements.apiKey.value = '';
        elements.apiKey.placeholder = '********** (saved)';
    } catch (error) {
        showStatus('Failed to save API key: ' + error.message, 'error');
    }
}

/**
 * Save current form settings to storage
 */
async function saveFormSettings() {
    const settings = {
        sport: elements.sportSelect.value,
        contestType: elements.contestType.value,
        site: elements.siteSelect.value,
        salaryCap: elements.salaryCap.value,
        numLineups: elements.numLineups.value,
        maxExposure: elements.maxExposure.value,
        minExposure: elements.minExposure.value,
        minSalary: elements.minSalary.value,
        randomness: elements.randomness.checked,
        stacking: elements.stacking.checked,
        stackSize: elements.stackSize.value
    };

    try {
        await chrome.storage.local.set(settings);
    } catch (error) {
        console.error('Error saving form settings:', error);
    }
}

/**
 * Validate form inputs before optimization
 */
function validateForm() {
    const errors = [];

    if (!elements.sportSelect.value) {
        errors.push('Please select a sport');
    }

    if (!elements.contestType.value) {
        errors.push('Please select a contest type');
    }

    if (!elements.siteSelect.value) {
        errors.push('Please select a DFS site');
    }

    if (parseInt(elements.numLineups.value) < 1 || parseInt(elements.numLineups.value) > 150) {
        errors.push('Number of lineups must be between 1 and 150');
    }

    if (parseInt(elements.maxExposure.value) < 0 || parseInt(elements.maxExposure.value) > 100) {
        errors.push('Max exposure must be between 0 and 100');
    }

    if (parseInt(elements.minExposure.value) < 0 || parseInt(elements.minExposure.value) > 100) {
        errors.push('Min exposure must be between 0 and 100');
    }

    if (parseInt(elements.minExposure.value) > parseInt(elements.maxExposure.value)) {
        errors.push('Min exposure cannot be greater than max exposure');
    }

    return errors;
}

/**
 * Optimize lineups by calling SaberSim API via background worker
 */
async function optimizeLineups() {
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return;
    }

    // Check for API key
    const { apiKey } = await chrome.storage.local.get('apiKey');
    if (!apiKey) {
        showError('Please configure your SaberSim API key first');
        return;
    }

    // Show loading state
    elements.loading.style.display = 'block';
    elements.resultsSection.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.optimizeBtn.disabled = true;

    // Prepare request parameters
    const params = {
        sport: elements.sportSelect.value,
        contestType: elements.contestType.value,
        site: elements.siteSelect.value,
        salaryCap: parseInt(elements.salaryCap.value),
        numLineups: parseInt(elements.numLineups.value),
        maxExposure: parseInt(elements.maxExposure.value) / 100,
        minExposure: parseInt(elements.minExposure.value) / 100,
        minSalary: parseInt(elements.minSalary.value),
        randomness: elements.randomness.checked,
        stacking: elements.stacking.checked,
        stackSize: elements.stacking.checked ? parseInt(elements.stackSize.value) : null
    };

    try {
        // Send message to background worker
        const response = await chrome.runtime.sendMessage({
            action: 'optimizeLineups',
            params: params,
            apiKey: apiKey
        });

        if (response.success) {
            currentResults = response.data;
            displayResults(response.data);
        } else {
            throw new Error(response.error || 'Optimization failed');
        }
    } catch (error) {
        console.error('Optimization error:', error);
        showError('Optimization failed: ' + error.message);
    } finally {
        elements.loading.style.display = 'none';
        elements.optimizeBtn.disabled = false;
    }
}

/**
 * Display optimization results in the UI
 */
function displayResults(data) {
    elements.resultsContainer.innerHTML = '';

    // Check if data is in expected format
    if (!data || !data.lineups || data.lineups.length === 0) {
        showError('No lineups returned from optimization');
        return;
    }

    // Create lineup cards
    data.lineups.forEach((lineup, index) => {
        const card = createLineupCard(lineup, index + 1);
        elements.resultsContainer.appendChild(card);
    });

    elements.resultsSection.style.display = 'block';
}

/**
 * Create a lineup card element
 */
function createLineupCard(lineup, lineupNumber) {
    const card = document.createElement('div');
    card.className = 'lineup-card';

    const totalSalary = lineup.players.reduce((sum, p) => sum + (p.salary || 0), 0);
    const totalProjection = lineup.players.reduce((sum, p) => sum + (p.projection || 0), 0);

    card.innerHTML = `
        <div class="lineup-header">
            <span class="lineup-number">Lineup ${lineupNumber}</span>
            <div class="lineup-stats">
                <div class="stat">
                    <span class="stat-label">Salary</span>
                    <span class="stat-value">$${totalSalary.toLocaleString()}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Projection</span>
                    <span class="stat-value">${totalProjection.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div class="lineup-players">
            ${lineup.players.map(player => `
                <div class="player-row">
                    <span class="player-position">${player.position}</span>
                    <span class="player-name">${player.name}</span>
                    <span class="player-salary">$${(player.salary || 0).toLocaleString()}</span>
                    <span class="player-projection">${(player.projection || 0).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
    `;

    return card;
}

/**
 * Export results to CSV format
 */
function exportToCSV() {
    if (!currentResults || !currentResults.lineups) {
        showError('No results to export');
        return;
    }

    const csv = convertToCSV(currentResults.lineups);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sabersim-lineups-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('Lineups exported successfully!', 'success');
}

/**
 * Convert lineup data to CSV format
 */
function convertToCSV(lineups) {
    // Get all unique positions
    const positions = lineups[0]?.players.map(p => p.position) || [];

    // Create header row
    const headers = ['Lineup', ...positions, 'Total Salary', 'Total Projection'];
    let csv = headers.join(',') + '\n';

    // Add data rows
    lineups.forEach((lineup, index) => {
        const totalSalary = lineup.players.reduce((sum, p) => sum + (p.salary || 0), 0);
        const totalProjection = lineup.players.reduce((sum, p) => sum + (p.projection || 0), 0);

        const row = [
            index + 1,
            ...lineup.players.map(p => `"${p.name}"`),
            totalSalary,
            totalProjection.toFixed(2)
        ];

        csv += row.join(',') + '\n';
    });

    return csv;
}

/**
 * Copy results to clipboard
 */
async function copyToClipboard() {
    if (!currentResults || !currentResults.lineups) {
        showError('No results to copy');
        return;
    }

    const text = formatResultsAsText(currentResults.lineups);

    try {
        await navigator.clipboard.writeText(text);
        showStatus('Results copied to clipboard!', 'success');
    } catch (error) {
        showError('Failed to copy to clipboard: ' + error.message);
    }
}

/**
 * Format results as plain text
 */
function formatResultsAsText(lineups) {
    let text = 'SaberSim Optimized Lineups\n';
    text += '='.repeat(50) + '\n\n';

    lineups.forEach((lineup, index) => {
        const totalSalary = lineup.players.reduce((sum, p) => sum + (p.salary || 0), 0);
        const totalProjection = lineup.players.reduce((sum, p) => sum + (p.projection || 0), 0);

        text += `Lineup ${index + 1}\n`;
        text += `-`.repeat(50) + '\n';

        lineup.players.forEach(player => {
            text += `${player.position.padEnd(5)} ${player.name.padEnd(25)} $${(player.salary || 0).toLocaleString().padEnd(10)} ${(player.projection || 0).toFixed(2)}\n`;
        });

        text += `-`.repeat(50) + '\n';
        text += `Total: $${totalSalary.toLocaleString()} | Projection: ${totalProjection.toFixed(2)}\n\n`;
    });

    return text;
}

/**
 * Reset form to default values
 */
function resetForm() {
    elements.sportSelect.value = '';
    elements.contestType.value = '';
    elements.siteSelect.value = '';
    elements.salaryCap.value = '50000';
    elements.numLineups.value = '1';
    elements.maxExposure.value = '100';
    elements.minExposure.value = '0';
    elements.minSalary.value = '49000';
    elements.randomness.checked = false;
    elements.stacking.checked = false;
    elements.stackSize.value = '3';
    elements.stackSizeGroup.style.display = 'none';

    elements.resultsSection.style.display = 'none';
    elements.errorMessage.style.display = 'none';

    currentResults = null;
    saveFormSettings();
}

/**
 * Show status message in the API status area
 */
function showStatus(message, type = 'info') {
    elements.apiStatus.textContent = message;
    elements.apiStatus.className = `status-message ${type}`;
    elements.apiStatus.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.apiStatus.style.display = 'none';
    }, 5000);
}

/**
 * Show error message
 */
function showError(message) {
    elements.errorMessage.innerHTML = message;
    elements.errorMessage.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
        elements.errorMessage.style.display = 'none';
    }, 10000);
}
