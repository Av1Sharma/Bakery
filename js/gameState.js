/**
 * Game State Management
 * Handles all game data and logic
 */

const GameState = {
    // ============================================
    // CURRENCY & MONEY
    // ============================================
    
    money: 0,
    totalMoneyEarned: 0,
    moneyPerSecond: 0,
    
    // ============================================
    // BAKING & PRODUCTION
    // ============================================
    
    totalBaked: 0,
    currentRecipe: null,
    recipes: {},
    
    // ============================================
    // UPGRADES & SHOP
    // ============================================
    
    autoBakers: 0,
    autoBakerLevel: 0,
    autoBakerCost: 50,
    autoBakerProductionBonus: 1,
    
    upgrades: {},
    
    // ============================================
    // CUSTOMER SYSTEM
    // ============================================
    
    reputation: 0,
    maxReputation: 100,
    customersServed: 0,
    customerSatisfaction: 100,
    
    // ============================================
    // PROGRESSION
    // ============================================
    
    level: 1,
    experience: 0,
    experiencePerLevel: 100,
    milestones: {},
    
    // ============================================
    // TIMESTAMPS & TRACKING
    // ============================================
    
    lastSaveTime: 0,
    lastPlayTime: 0,
    totalPlayTime: 0,
    gameStartTime: Date.now(),
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Initialize game state with default values
     */
    initialize() {
        this.money = 10; // Starting money for tutorial
        this.totalMoneyEarned = 10;
        this.lastSaveTime = Date.now();
        this.gameStartTime = Date.now();
        this.initializeRecipes();
        this.initializeUpgrades();
        this.initializeMilestones();
    },
    
    /**
     * Initialize available recipes
     */
    initializeRecipes() {
        this.recipes = {
            cookie: {
                id: 'cookie',
                name: 'Sugar Cookie',
                icon: '🍪',
                baseCost: 1,
                currentCost: 1,
                bakeTime: 2,
                baseProduction: 1,
                currentProduction: 1,
                unlocked: true,
                bakeCount: 0,
                totalProduction: 0,
                level: 0,
                upgradeCost: 10,
            },
            brownie: {
                id: 'brownie',
                name: 'Chocolate Brownie',
                icon: '🍫',
                baseCost: 5,
                currentCost: 5,
                bakeTime: 3,
                baseProduction: 2,
                currentProduction: 2,
                unlocked: false,
                bakeCount: 0,
                totalProduction: 0,
                level: 0,
                upgradeCost: 30,
            },
            croissant: {
                id: 'croissant',
                name: 'Butter Croissant',
                icon: '🥐',
                baseCost: 15,
                currentCost: 15,
                bakeTime: 4,
                baseProduction: 5,
                currentProduction: 5,
                unlocked: false,
                bakeCount: 0,
                totalProduction: 0,
                level: 0,
                upgradeCost: 75,
            },
            cake: {
                id: 'cake',
                name: 'Vanilla Cake',
                icon: '🎂',
                baseCost: 50,
                currentCost: 50,
                bakeTime: 6,
                baseProduction: 15,
                currentProduction: 15,
                unlocked: false,
                bakeCount: 0,
                totalProduction: 0,
                level: 0,
                upgradeCost: 200,
            },
            donut: {
                id: 'donut',
                name: 'Glazed Donut',
                icon: '🍩',
                baseCost: 8,
                currentCost: 8,
                bakeTime: 2,
                baseProduction: 3,
                currentProduction: 3,
                unlocked: false,
                bakeCount: 0,
                totalProduction: 0,
                level: 0,
                upgradeCost: 40,
            },
        };
    },
    
    /**
     * Initialize upgrade system
     */
    initializeUpgrades() {
        this.upgrades = {
            betterOven: {
                id: 'betterOven',
                name: 'Better Oven',
                icon: '🔥',
                level: 0,
                maxLevel: 10,
                baseCost: 100,
                currentCost: 100,
                description: '+5% production per level',
                bonus: 1.05,
                type: 'production',
            },
            moreShelves: {
                id: 'moreShelves',
                name: 'More Shelves',
                icon: '📦',
                level: 0,
                maxLevel: 10,
                baseCost: 150,
                currentCost: 150,
                description: '+10% capacity per level',
                bonus: 1.10,
                type: 'capacity',
            },
            marketingCampaign: {
                id: 'marketingCampaign',
                name: 'Marketing Campaign',
                icon: '📢',
                level: 0,
                maxLevel: 5,
                baseCost: 200,
                currentCost: 200,
                description: '+20% reputation gain per level',
                bonus: 1.20,
                type: 'reputation',
            },
        };
    },
    
    /**
     * Initialize milestones
     */
    initializeMilestones() {
        this.milestones = {
            firstBake: { id: 'firstBake', name: 'First Bake', completed: false, requirement: 1 },
            hundredBakes: { id: 'hundredBakes', name: '100 Bakes', completed: false, requirement: 100 },
            thousandDollars: { id: 'thousandDollars', name: '$1,000 Earned', completed: false, requirement: 1000 },
            allRecipesUnlocked: { id: 'allRecipesUnlocked', name: 'Master Baker', completed: false },
        };
    },
    
    /**
     * Perform a bake action
     */
    bake(recipe) {
        if (!recipe) {
            recipe = this.recipes.cookie;
        }
        
        if (!recipe.unlocked) {
            return false;
        }
        
        const earnings = recipe.currentProduction;
        this.money += earnings;
        this.totalMoneyEarned += earnings;
        this.totalBaked += 1;
        recipe.bakeCount += 1;
        recipe.totalProduction += earnings;
        
        this.checkMilestones();
        return true;
    },
    
    /**
     * Unlock a recipe
     */
    unlockRecipe(recipeId) {
        if (this.recipes[recipeId]) {
            this.recipes[recipeId].unlocked = true;
        }
    },
    
    /**
     * Purchase an upgrade
     */
    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        
        if (!upgrade || upgrade.level >= upgrade.maxLevel) {
            return false;
        }
        
        if (this.money < upgrade.currentCost) {
            return false;
        }
        
        this.money -= upgrade.currentCost;
        upgrade.level += 1;
        
        // Update cost for next level (10% increase per level)
        upgrade.currentCost = Math.ceil(upgrade.baseCost * Math.pow(1.1, upgrade.level));
        
        this.applyUpgradeBonus(upgrade);
        return true;
    },
    
    /**
     * Apply upgrade bonuses to recipes
     */
    applyUpgradeBonus(upgrade) {
        if (upgrade.type === 'production') {
            // Multiply all recipe production
            for (let recipeId in this.recipes) {
                const recipe = this.recipes[recipeId];
                recipe.currentProduction = Math.ceil(recipe.baseProduction * Math.pow(upgrade.bonus, upgrade.level));
            }
        }
    },
    
    /**
     * Hire auto-baker
     */
    hireAutoBaker() {
        if (this.money < this.autoBakerCost) {
            return false;
        }
        
        this.money -= this.autoBakerCost;
        this.autoBakers += 1;
        this.autoBakerLevel += 1;
        
        // Cost increases by 15% per baker
        this.autoBakerCost = Math.ceil(this.autoBakerCost * 1.15);
        
        this.recalculateMoneyPerSecond();
        return true;
    },
    
    /**
     * Recalculate passive income per second
     */
    recalculateMoneyPerSecond() {
        let production = this.autoBakers * 5; // Each auto-baker produces 5 per second
        
        // Add recipe bonuses
        for (let recipeId in this.recipes) {
            const recipe = this.recipes[recipeId];
            if (recipe.unlocked && recipe.level > 0) {
                production += recipe.currentProduction * recipe.level * 0.1;
            }
        }
        
        this.moneyPerSecond = production;
    },
    
    /**
     * Check and complete milestones
     */
    checkMilestones() {
        if (this.totalBaked >= 1 && !this.milestones.firstBake.completed) {
            this.completeMilestone('firstBake');
        }
        
        if (this.totalBaked >= 100 && !this.milestones.hundredBakes.completed) {
            this.completeMilestone('hundredBakes');
        }
        
        if (this.totalMoneyEarned >= 1000 && !this.milestones.thousandDollars.completed) {
            this.completeMilestone('thousandDollars');
        }
    },
    
    /**
     * Mark milestone as completed
     */
    completeMilestone(milestoneId) {
        if (this.milestones[milestoneId]) {
            this.milestones[milestoneId].completed = true;
            // Award bonus money for completing milestone
            this.money += 50;
            this.totalMoneyEarned += 50;
        }
    },
    
    /**
     * Add passive income for offline time
     */
    addOfflineIncome(secondsOffline) {
        const offlineEarnings = this.moneyPerSecond * secondsOffline;
        this.money += offlineEarnings;
        this.totalMoneyEarned += offlineEarnings;
        this.totalBaked += Math.floor(this.moneyPerSecond * secondsOffline / 5); // Rough estimate
    },
    
    /**
     * Get current game statistics
     */
    getStats() {
        return {
            money: this.money,
            totalMoneyEarned: this.totalMoneyEarned,
            moneyPerSecond: this.moneyPerSecond,
            totalBaked: this.totalBaked,
            reputation: this.reputation,
            autoBakers: this.autoBakers,
            level: this.level,
        };
    },
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        GameState.initialize();
    });
} else {
    GameState.initialize();
}

export default GameState;
