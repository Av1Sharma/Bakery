/**
 * Main Game Engine
 * Orchestrates all game systems
 */

import GameState from './gameState.js';
import SaveManager from './saveManager.js';
import Formatter from './formatter.js';
import OfflineProgress from './offlineProgress.js';

class BakeryGame {
    constructor() {
        this.gameState = GameState;
        this.saveManager = SaveManager;
        this.formatter = Formatter;
        this.offlineProgress = OfflineProgress;
        
        this.gameLoopId = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize the game
     */
    initialize() {
        console.log('🧁 Initializing Sweet Success Bakery...');
        
        // Check for saved data
        const savedState = this.saveManager.load();
        
        if (savedState) {
            // Restore from save
            this.saveManager.restoreState(this.gameState, savedState);
            
            // Calculate offline progress
            const timeSinceLastSave = this.saveManager.getTimeSinceLastSave() / 1000;
            if (timeSinceLastSave > 0) {
                const offlineResult = this.offlineProgress.applyOfflineProgress(
                    this.gameState,
                    timeSinceLastSave
                );
                console.log(`⏰ Welcome back! Earned $${offlineResult.moneyGained} while offline!`);
            }
        } else {
            // New game
            this.gameState.initialize();
            console.log('Starting new game!');
        }
        
        // Recalculate stats
        this.gameState.recalculateMoneyPerSecond();
        
        // Setup UI
        this.setupUI();
        
        // Start game loop
        this.startGameLoop();
        
        // Setup auto-save
        this.saveManager.setupAutoSave(this.gameState);
        
        // Setup window events
        this.setupWindowEvents();
        
        this.isInitialized = true;
        console.log('✅ Game initialized successfully!');
    }
    
    /**
     * Setup user interface
     */
    setupUI() {
        // Get DOM elements
        this.elements = {
            moneyDisplay: document.getElementById('money-display'),
            reputationDisplay: document.getElementById('reputation-display'),
            totalBakedDisplay: document.getElementById('total-baked-display'),
            bakeButton: document.getElementById('bake-button'),
            clickValue: document.getElementById('click-value'),
        };
        
        // Validate elements exist
        for (let [key, element] of Object.entries(this.elements)) {
            if (!element && key !== 'clickValue') {
                console.warn(`Element not found: ${key}`);
            }
        }
        
        // Setup event listeners
        if (this.elements.bakeButton) {
            this.elements.bakeButton.addEventListener('click', () => {
                this.handleBake();
            });
        }
        
        // Initial UI update
        this.updateUI();
    }
    
    /**
     * Handle bake button click
     */
    handleBake() {
        const recipe = this.gameState.currentRecipe || this.gameState.recipes.cookie;
        
        if (this.gameState.bake(recipe)) {
            this.updateUI();
            this.showBakeAnimation();
            
            // Check for new recipe unlocks
            this.checkRecipeUnlocks();
        }
    }
    
    /**
     * Update all UI elements
     */
    updateUI() {
        if (this.elements.moneyDisplay) {
            this.elements.moneyDisplay.textContent = 
                this.formatter.formatCurrency(this.gameState.money);
        }
        
        if (this.elements.reputationDisplay) {
            this.elements.reputationDisplay.textContent = 
                this.gameState.reputation.toFixed(0);
        }
        
        if (this.elements.totalBakedDisplay) {
            this.elements.totalBakedDisplay.textContent = 
                this.formatter.formatNumber(this.gameState.totalBaked);
        }
        
        if (this.elements.clickValue) {
            const recipe = this.gameState.currentRecipe || this.gameState.recipes.cookie;
            this.elements.clickValue.textContent = 
                this.formatter.formatNumber(recipe.currentProduction);
        }
    }
    
    /**
     * Show bake animation
     */
    showBakeAnimation() {
        if (this.elements.bakeButton) {
            this.elements.bakeButton.style.animation = 'none';
            
            // Trigger reflow to restart animation
            void this.elements.bakeButton.offsetWidth;
            
            this.elements.bakeButton.style.animation = 'pulse 0.3s ease-in-out';
            
            setTimeout(() => {
                this.elements.bakeButton.style.animation = '';
            }, 300);
        }
    }
    
    /**
     * Check if new recipes should unlock
     */
    checkRecipeUnlocks() {
        const unlockRules = {
            brownie: { requirement: 20, requiredMoney: 50 },
            croissant: { requirement: 50, requiredMoney: 150 },
            cake: { requirement: 100, requiredMoney: 500 },
            donut: { requirement: 30, requiredMoney: 75 },
        };
        
        for (let [recipeId, rule] of Object.entries(unlockRules)) {
            const recipe = this.gameState.recipes[recipeId];
            
            if (!recipe.unlocked && 
                this.gameState.totalBaked >= rule.requirement &&
                this.gameState.money >= rule.requiredMoney) {
                
                this.gameState.unlockRecipe(recipeId);
                console.log(`🔓 Unlocked: ${recipe.name}!`);
                this.updateUI();
            }
        }
    }
    
    /**
     * Start the game loop
     */
    startGameLoop() {
        this.gameLoopId = this.offlineProgress.startGameLoop(
            this.gameState,
            (tickResult, gameState) => {
                // Update UI when money changes significantly
                if (tickResult.incomeThisTick > 0) {
                    this.updateUI();
                }
            }
        );
    }
    
    /**
     * Setup window events (save on close, etc)
     */
    setupWindowEvents() {
        window.addEventListener('beforeunload', () => {
            this.saveManager.save(this.gameState);
            console.log('Game saved before unload');
        });
        
        // Also save every 10 seconds as backup
        setInterval(() => {
            this.saveManager.save(this.gameState);
        }, 10000);
    }
    
    /**
     * Add money directly (for testing/rewards)
     */
    addMoney(amount) {
        this.gameState.money += amount;
        this.gameState.totalMoneyEarned += amount;
        this.updateUI();
    }
    
    /**
     * Hire auto-baker
     */
    hireAutoBaker() {
        if (this.gameState.hireAutoBaker()) {
            this.gameState.recalculateMoneyPerSecond();
            this.updateUI();
            console.log(`📚 Hired auto-baker #${this.gameState.autoBakers}`);
            return true;
        }
        console.log('Not enough money to hire auto-baker');
        return false;
    }
    
    /**
     * Purchase upgrade
     */
    purchaseUpgrade(upgradeId) {
        if (this.gameState.purchaseUpgrade(upgradeId)) {
            this.gameState.recalculateMoneyPerSecond();
            this.updateUI();
            console.log(`⬆️ Upgraded: ${this.gameState.upgrades[upgradeId].name}`);
            return true;
        }
        return false;
    }
    
    /**
     * Get game stats
     */
    getStats() {
        return {
            ...this.gameState.getStats(),
            timePlayedSeconds: (Date.now() - this.gameState.gameStartTime) / 1000,
            offlineCap: this.offlineProgress.MAX_OFFLINE_TIME,
        };
    }
    
    /**
     * Hard reset game (for testing)
     */
    resetGame() {
        if (confirm('Are you sure? This will delete all progress!')) {
            this.saveManager.clearSave();
            this.gameState.initialize();
            this.updateUI();
            console.log('Game reset!');
        }
    }
    
    /**
     * Export save data
     */
    exportSaveData() {
        return this.saveManager.exportSave();
    }
    
    /**
     * Import save data
     */
    importSaveData(jsonString) {
        if (this.saveManager.importSave(jsonString)) {
            const savedState = this.saveManager.load();
            this.saveManager.restoreState(this.gameState, savedState);
            this.updateUI();
            return true;
        }
        return false;
    }
}

// Create global game instance and initialize
const game = new BakeryGame();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        game.initialize();
    });
} else {
    game.initialize();
}

// Make game available globally for debugging
window.game = game;

export default game;
