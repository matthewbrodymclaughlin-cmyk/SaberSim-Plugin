/**
 * Storage Utility Module
 *
 * Provides helper functions for managing Chrome storage
 * with error handling and data validation
 */

const StorageManager = {
    /**
     * Save data to Chrome local storage
     * @param {Object} data - Key-value pairs to save
     * @returns {Promise<boolean>} - Success status
     */
    async save(data) {
        try {
            await chrome.storage.local.set(data);
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    /**
     * Get data from Chrome local storage
     * @param {string|Array<string>} keys - Key(s) to retrieve
     * @returns {Promise<Object>} - Retrieved data
     */
    async get(keys) {
        try {
            return await chrome.storage.local.get(keys);
        } catch (error) {
            console.error('Storage get error:', error);
            return {};
        }
    },

    /**
     * Remove data from Chrome local storage
     * @param {string|Array<string>} keys - Key(s) to remove
     * @returns {Promise<boolean>} - Success status
     */
    async remove(keys) {
        try {
            await chrome.storage.local.remove(keys);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    /**
     * Clear all data from Chrome local storage
     * @returns {Promise<boolean>} - Success status
     */
    async clear() {
        try {
            await chrome.storage.local.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    /**
     * Save user preferences
     * @param {Object} preferences - User preferences object
     * @returns {Promise<boolean>} - Success status
     */
    async savePreferences(preferences) {
        const validatedPrefs = this.validatePreferences(preferences);
        return await this.save({ preferences: validatedPrefs });
    },

    /**
     * Get user preferences
     * @returns {Promise<Object>} - User preferences
     */
    async getPreferences() {
        const data = await this.get('preferences');
        return data.preferences || this.getDefaultPreferences();
    },

    /**
     * Save API configuration
     * @param {string} apiKey - SaberSim API key
     * @param {string} baseUrl - Optional custom API base URL
     * @returns {Promise<boolean>} - Success status
     */
    async saveApiConfig(apiKey, baseUrl = null) {
        const config = { apiKey };
        if (baseUrl) {
            config.apiBaseUrl = baseUrl;
        }
        return await this.save(config);
    },

    /**
     * Get API configuration
     * @returns {Promise<Object>} - API configuration
     */
    async getApiConfig() {
        const data = await this.get(['apiKey', 'apiBaseUrl']);
        return {
            apiKey: data.apiKey || null,
            apiBaseUrl: data.apiBaseUrl || 'https://api.sabersim.com'
        };
    },

    /**
     * Save last optimization results
     * @param {Object} results - Optimization results
     * @returns {Promise<boolean>} - Success status
     */
    async saveLastResults(results) {
        const dataToSave = {
            lastResults: results,
            lastResultsTimestamp: new Date().toISOString()
        };
        return await this.save(dataToSave);
    },

    /**
     * Get last optimization results
     * @returns {Promise<Object|null>} - Last results or null
     */
    async getLastResults() {
        const data = await this.get(['lastResults', 'lastResultsTimestamp']);
        if (!data.lastResults) {
            return null;
        }
        return {
            results: data.lastResults,
            timestamp: data.lastResultsTimestamp
        };
    },

    /**
     * Validate preferences object
     * @param {Object} preferences - Preferences to validate
     * @returns {Object} - Validated preferences
     */
    validatePreferences(preferences) {
        const defaults = this.getDefaultPreferences();
        return {
            sport: preferences.sport || defaults.sport,
            contestType: preferences.contestType || defaults.contestType,
            site: preferences.site || defaults.site,
            salaryCap: this.validateNumber(preferences.salaryCap, 0, 100000, defaults.salaryCap),
            numLineups: this.validateNumber(preferences.numLineups, 1, 150, defaults.numLineups),
            maxExposure: this.validateNumber(preferences.maxExposure, 0, 100, defaults.maxExposure),
            minExposure: this.validateNumber(preferences.minExposure, 0, 100, defaults.minExposure),
            minSalary: this.validateNumber(preferences.minSalary, 0, 100000, defaults.minSalary),
            randomness: Boolean(preferences.randomness),
            stacking: Boolean(preferences.stacking),
            stackSize: this.validateNumber(preferences.stackSize, 2, 5, defaults.stackSize)
        };
    },

    /**
     * Validate a number within a range
     * @param {*} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} defaultValue - Default value if invalid
     * @returns {number} - Validated number
     */
    validateNumber(value, min, max, defaultValue) {
        const num = Number(value);
        if (isNaN(num) || num < min || num > max) {
            return defaultValue;
        }
        return num;
    },

    /**
     * Get default preferences
     * @returns {Object} - Default preferences
     */
    getDefaultPreferences() {
        return {
            sport: '',
            contestType: '',
            site: '',
            salaryCap: 50000,
            numLineups: 1,
            maxExposure: 100,
            minExposure: 0,
            minSalary: 49000,
            randomness: false,
            stacking: false,
            stackSize: 3
        };
    },

    /**
     * Export all storage data (for backup)
     * @returns {Promise<Object>} - All storage data
     */
    async exportAll() {
        try {
            return await chrome.storage.local.get(null);
        } catch (error) {
            console.error('Storage export error:', error);
            return {};
        }
    },

    /**
     * Import storage data (from backup)
     * @param {Object} data - Data to import
     * @returns {Promise<boolean>} - Success status
     */
    async importAll(data) {
        try {
            await chrome.storage.local.clear();
            await chrome.storage.local.set(data);
            return true;
        } catch (error) {
            console.error('Storage import error:', error);
            return false;
        }
    },

    /**
     * Get storage usage information
     * @returns {Promise<Object>} - Storage usage stats
     */
    async getStorageInfo() {
        try {
            const bytesInUse = await chrome.storage.local.getBytesInUse();
            const quota = chrome.storage.local.QUOTA_BYTES;
            return {
                bytesInUse,
                quota,
                percentUsed: ((bytesInUse / quota) * 100).toFixed(2)
            };
        } catch (error) {
            console.error('Storage info error:', error);
            return null;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
