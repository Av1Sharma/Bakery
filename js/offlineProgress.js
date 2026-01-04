/**
 * Offline Progress & Idle Tick System
 * Handles game updates, offline earnings, and idle mechanics
 */

const OfflineProgress = {
    // Game loop configuration
    TICK_RATE: 1000, // Update every 1 second
    MAX_OFFLINE_TIME: 7 * 24 * 60 * 60, // Max 7 days of offline progress
    
    /**
     * Calculate offline earnings based on time passed
     */
    calculateOfflineEarnings(gameState, secondsOffline) {
        // Cap offline time
        const cappedSeconds = Math.min(secondsOffline, this.MAX_OFFLINE_TIME);
        
        // Calculate total passive income
        let totalIncome = 0;
        
        // Income from auto-bakers
        const autoBakerIncome = gameState.autoBakers * 5; // Each baker produces 5/sec
        
        // Income from recipe production (if any recipes are auto-producing)
        let recipeIncome = 0;
        for (let recipeId in gameState.recipes) {
            const recipe = gameState.recipes[recipeId];
            if (recipe.unlocked && recipe.level > 0) {
                recipeIncome += recipe.currentProduction * recipe.level * 0.1;
            }
        }
        
        totalIncome = autoBakerIncome + recipeIncome;
        
        // Calculate total earnings
        const totalEarnings = totalIncome * cappedSeconds;
        
        return {
            earnings: Math.floor(totalEarnings),
            secondsCalculated: cappedSeconds,
            autoBakerIncome: autoBakerIncome,
            recipeIncome: recipeIncome,
        };
    },
    
    /**
     * Apply offline progress to game state
     */
    applyOfflineProgress(gameState, secondsOffline) {
        if (secondsOffline <= 0) {
            return {
                moneyGained: 0,
                itemsBaked: 0,
            };
        }
        
        const earnings = this.calculateOfflineEarnings(gameState, secondsOffline);
        
        gameState.money += earnings.earnings;
        gameState.totalMoneyEarned += earnings.earnings;
        
        // Estimate items baked during offline time
        let itemsBaked = 0;
        if (earnings.autoBakerIncome > 0) {
            itemsBaked = Math.floor(earnings.autoBakerIncome * secondsOffline / 5);
        }
        gameState.totalBaked += itemsBaked;
        
        return {
            moneyGained: earnings.earnings,
            itemsBaked: itemsBaked,
        };
    },
    
    /**
     * Get offline progress summary
     */
    getOfflineProgressSummary(gameState, secondsOffline) {
        const earnings = this.calculateOfflineEarnings(gameState, secondsOffline);
        
        return {
            totalEarnings: earnings.earnings,
            autoBakerContribution: earnings.autoBakerIncome * earnings.secondsCalculated,
            recipeContribution: earnings.recipeIncome * earnings.secondsCalculated,
            timeOffline: earnings.secondsCalculated,
        };
    },
    
    /**
     * Game tick - called every second
     */
    tick(gameState) {
        // Apply passive income per tick
        const passiveIncome = gameState.moneyPerSecond;
        
        if (passiveIncome > 0) {
            gameState.money += passiveIncome;
            gameState.totalMoneyEarned += passiveIncome;
            
            // Update recipe production tracking
            for (let recipeId in gameState.recipes) {
                const recipe = gameState.recipes[recipeId];
                if (recipe.unlocked && recipe.level > 0) {
                    const thisRecipeIncome = recipe.currentProduction * recipe.level * 0.1;
                    if (thisRecipeIncome > 0) {
                        recipe.totalProduction += thisRecipeIncome;
                    }
                }
            }
        }
        
        return {
            incomeThisTick: passiveIncome,
            totalMoney: gameState.money,
        };
    },
    
    /**
     * Start the game loop
     */
    startGameLoop(gameState, onTick) {
        return setInterval(() => {
            const tickResult = this.tick(gameState);
            
            if (onTick && typeof onTick === 'function') {
                onTick(tickResult, gameState);
            }
        }, this.TICK_RATE);
    },
    
    /**
     * Calculate time needed for offline cap
     */
    getTimeUntilOfflineCap(secondsOffline) {
        return Math.max(0, this.MAX_OFFLINE_TIME - secondsOffline);
    },
    
    /**
     * Check if player is near offline cap
     */
    isNearOfflineCap(secondsOffline) {
        return secondsOffline > (this.MAX_OFFLINE_TIME * 0.9);
    },
    
    /**
     * Estimate money per hour
     */
    estimateMoneyPerHour(gameState) {
        return gameState.moneyPerSecond * 3600;
    },
    
    /**
     * Estimate items baked per hour
     */
    estimateItemsPerHour(gameState) {
        const itemsPerSecond = gameState.autoBakers * (5 / 5); // 1 item per baker per second
        return itemsPerSecond * 3600;
    },
    
    /**
     * Time to earn target amount of money
     */
    timeToEarnTarget(gameState, targetMoney) {
        if (gameState.moneyPerSecond <= 0) {
            return Infinity;
        }
        
        const secondsNeeded = targetMoney / gameState.moneyPerSecond;
        return secondsNeeded;
    },
};

export default OfflineProgress;
