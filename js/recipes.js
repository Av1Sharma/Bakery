/**
 * Recipe System
 * Manages recipes, ingredients, and baking mechanics
 */

const Recipes = {
    /**
     * Get all available recipes
     */
    getAllRecipes(gameState) {
        return gameState.recipes;
    },
    
    /**
     * Get unlocked recipes only
     */
    getUnlockedRecipes(gameState) {
        return Object.values(gameState.recipes).filter(recipe => recipe.unlocked);
    },
    
    /**
     * Get locked recipes
     */
    getLockedRecipes(gameState) {
        return Object.values(gameState.recipes).filter(recipe => !recipe.unlocked);
    },
    
    /**
     * Get recipe by ID
     */
    getRecipe(gameState, recipeId) {
        return gameState.recipes[recipeId];
    },
    
    /**
     * Bake a recipe
     */
    bakeRecipe(gameState, recipeId) {
        const recipe = gameState.recipes[recipeId];
        
        if (!recipe) {
            console.error(`Recipe not found: ${recipeId}`);
            return false;
        }
        
        if (!recipe.unlocked) {
            console.warn(`Recipe locked: ${recipe.name}`);
            return false;
        }
        
        // Calculate earnings based on production
        const earnings = recipe.currentProduction;
        
        gameState.money += earnings;
        gameState.totalMoneyEarned += earnings;
        gameState.totalBaked += 1;
        recipe.bakeCount += 1;
        recipe.totalProduction += earnings;
        
        return true;
    },
    
    /**
     * Upgrade recipe (increase production)
     */
    upgradeRecipe(gameState, recipeId) {
        const recipe = gameState.recipes[recipeId];
        
        if (!recipe) {
            console.error(`Recipe not found: ${recipeId}`);
            return false;
        }
        
        if (!recipe.unlocked) {
            console.warn(`Cannot upgrade locked recipe: ${recipe.name}`);
            return false;
        }
        
        const upgradeCost = recipe.upgradeCost;
        
        if (gameState.money < upgradeCost) {
            console.warn(`Not enough money to upgrade ${recipe.name}`);
            return false;
        }
        
        gameState.money -= upgradeCost;
        recipe.level += 1;
        
        // Increase production by 20% per level
        recipe.currentProduction = Math.ceil(
            recipe.baseProduction * Math.pow(1.2, recipe.level)
        );
        
        // Increase upgrade cost
        recipe.upgradeCost = Math.ceil(recipe.upgradeCost * 1.15);
        
        return true;
    },
    
    /**
     * Get recipe production info
     */
    getProductionInfo(recipe) {
        return {
            baseProduction: recipe.baseProduction,
            currentProduction: recipe.currentProduction,
            level: recipe.level,
            bakeCount: recipe.bakeCount,
            totalProduced: recipe.totalProduction,
        };
    },
    
    /**
     * Calculate recipe profitability
     */
    getRecipeProfitability(recipe) {
        if (recipe.bakeCount === 0) {
            return 0;
        }
        
        const profit = recipe.totalProduction / recipe.bakeCount;
        return profit;
    },
    
    /**
     * Get best performing recipe
     */
    getBestRecipe(gameState) {
        let bestRecipe = null;
        let bestProfit = 0;
        
        for (let recipeId in gameState.recipes) {
            const recipe = gameState.recipes[recipeId];
            if (recipe.unlocked) {
                const profit = this.getRecipeProfitability(recipe);
                if (profit > bestProfit) {
                    bestProfit = profit;
                    bestRecipe = recipe;
                }
            }
        }
        
        return bestRecipe || gameState.recipes.cookie;
    },
    
    /**
     * Calculate time to unlock recipe
     */
    getTimeToUnlock(gameState, recipeId, unlockRule) {
        const recipe = gameState.recipes[recipeId];
        
        if (!recipe || recipe.unlocked) {
            return 0;
        }
        
        const bakesNeeded = Math.max(
            0,
            unlockRule.requirement - gameState.totalBaked
        );
        
        const moneyNeeded = Math.max(
            0,
            unlockRule.requiredMoney - gameState.money
        );
        
        // Estimate time assuming 1 bake per click
        // This is approximate - actual time depends on gameplay
        const estimatedSeconds = bakesNeeded + (moneyNeeded / gameState.moneyPerSecond);
        
        return estimatedSeconds;
    },
    
    /**
     * Get recipe unlock requirements
     */
    getUnlockRequirements() {
        return {
            brownie: { 
                requirement: 20, 
                requiredMoney: 50,
                description: 'Bake 20 cookies and earn $50'
            },
            croissant: { 
                requirement: 50, 
                requiredMoney: 150,
                description: 'Bake 50 items and earn $150'
            },
            cake: { 
                requirement: 100, 
                requiredMoney: 500,
                description: 'Bake 100 items and earn $500'
            },
            donut: { 
                requirement: 30, 
                requiredMoney: 75,
                description: 'Bake 30 items and earn $75'
            },
        };
    },
    
    /**
     * Get recipe stats
     */
    getRecipeStats(gameState) {
        const stats = {
            totalRecipes: Object.keys(gameState.recipes).length,
            unlockedCount: this.getUnlockedRecipes(gameState).length,
            lockedCount: this.getLockedRecipes(gameState).length,
            totalBaked: gameState.totalBaked,
            averageProduction: 0,
        };
        
        const unlockedRecipes = this.getUnlockedRecipes(gameState);
        if (unlockedRecipes.length > 0) {
            const totalProduction = unlockedRecipes.reduce(
                (sum, recipe) => sum + recipe.currentProduction,
                0
            );
            stats.averageProduction = totalProduction / unlockedRecipes.length;
        }
        
        return stats;
    },
    
    /**
     * Check if recipe should auto-unlock
     */
    checkAutoUnlock(gameState, recipeId) {
        const recipe = gameState.recipes[recipeId];
        if (!recipe || recipe.unlocked) return false;
        
        const requirements = this.getUnlockRequirements()[recipeId];
        if (!requirements) return false;
        
        return (
            gameState.totalBaked >= requirements.requirement &&
            gameState.money >= requirements.requiredMoney
        );
    },
    
    /**
     * Get recipe display info for UI
     */
    getDisplayInfo(recipe, formatter) {
        return {
            name: recipe.name,
            icon: recipe.icon,
            production: formatter.formatNumber(recipe.currentProduction),
            productionPerSecond: (recipe.currentProduction / 5).toFixed(2),
            level: recipe.level,
            upgradeCost: formatter.formatCurrency(recipe.upgradeCost),
            bakeCount: formatter.formatNumber(recipe.bakeCount),
            totalProduced: formatter.formatCurrency(recipe.totalProduction),
        };
    },
};

export default Recipes;
