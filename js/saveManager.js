/**
 * Save Manager
 * Handles persistent game data using localStorage
 */

const SaveManager = {
    SAVE_KEY: 'sweetSuccessBakery_save',
    VERSION_KEY: 'sweetSuccessBakery_version',
    CURRENT_VERSION: 1,
    AUTO_SAVE_INTERVAL: 30000, // Auto-save every 30 seconds
    
    /**
     * Save game state to localStorage
     */
    save(gameState) {
        try {
            const saveData = {
                version: this.CURRENT_VERSION,
                timestamp: Date.now(),
                state: {
                    money: gameState.money,
                    totalMoneyEarned: gameState.totalMoneyEarned,
                    moneyPerSecond: gameState.moneyPerSecond,
                    totalBaked: gameState.totalBaked,
                    currentRecipe: gameState.currentRecipe,
                    recipes: gameState.recipes,
                    autoBakers: gameState.autoBakers,
                    autoBakerLevel: gameState.autoBakerLevel,
                    autoBakerCost: gameState.autoBakerCost,
                    upgrades: gameState.upgrades,
                    reputation: gameState.reputation,
                    customersServed: gameState.customersServed,
                    customerSatisfaction: gameState.customerSatisfaction,
                    level: gameState.level,
                    experience: gameState.experience,
                    milestones: gameState.milestones,
                    lastSaveTime: Date.now(),
                    lastPlayTime: gameState.lastPlayTime,
                    totalPlayTime: gameState.totalPlayTime,
                    gameStartTime: gameState.gameStartTime,
                }
            };
            
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION.toString());
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    },
    
    /**
     * Load game state from localStorage
     */
    load() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            
            if (!saveData) {
                console.log('No save data found');
                return null;
            }
            
            const parsed = JSON.parse(saveData);
            
            // Validate version
            if (parsed.version !== this.CURRENT_VERSION) {
                console.warn('Save version mismatch, may need migration');
            }
            
            return parsed.state;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    },
    
    /**
     * Get time since last save (in seconds)
     */
    getTimeSinceLastSave() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            
            if (!saveData) {
                return 0;
            }
            
            const parsed = JSON.parse(saveData);
            const lastSaveTime = parsed.state.lastSaveTime;
            const currentTime = Date.now();
            
            return (currentTime - lastSaveTime) / 1000;
        } catch (error) {
            console.error('Failed to get time since last save:', error);
            return 0;
        }
    },
    
    /**
     * Check if save data exists
     */
    hasSaveData() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },
    
    /**
     * Clear all save data
     */
    clearSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            localStorage.removeItem(this.VERSION_KEY);
            console.log('Save data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear save:', error);
            return false;
        }
    },
    
    /**
     * Export save data as JSON (for backup)
     */
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            
            if (!saveData) {
                console.warn('No save data to export');
                return null;
            }
            
            return saveData;
        } catch (error) {
            console.error('Failed to export save:', error);
            return null;
        }
    },
    
    /**
     * Import save data from JSON
     */
    importSave(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            
            // Validate basic structure
            if (!parsed.state || !parsed.timestamp) {
                throw new Error('Invalid save data format');
            }
            
            localStorage.setItem(this.SAVE_KEY, jsonString);
            localStorage.setItem(this.VERSION_KEY, parsed.version || this.CURRENT_VERSION);
            console.log('Save data imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    },
    
    /**
     * Get save file info (for debugging)
     */
    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            
            if (!saveData) {
                return null;
            }
            
            const parsed = JSON.parse(saveData);
            return {
                version: parsed.version,
                savedAt: new Date(parsed.timestamp).toLocaleString(),
                money: parsed.state.money,
                totalBaked: parsed.state.totalBaked,
                level: parsed.state.level,
            };
        } catch (error) {
            console.error('Failed to get save info:', error);
            return null;
        }
    },
    
    /**
     * Auto-save setup (call this from main game loop)
     */
    setupAutoSave(gameState) {
        setInterval(() => {
            this.save(gameState);
        }, this.AUTO_SAVE_INTERVAL);
    },
    
    /**
     * Restore game state from save data
     */
    restoreState(gameState, savedState) {
        if (!savedState) return;
        
        Object.assign(gameState, savedState);
        console.log('Game state restored from save');
    }
};

export default SaveManager;
