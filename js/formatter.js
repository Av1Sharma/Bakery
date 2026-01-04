/**
 * Number Formatter
 * Formats large numbers with K, M, B, T suffixes
 */

const Formatter = {
    /**
     * Format number with appropriate suffix
     * Examples: 1234 -> "1.2K", 1234567 -> "1.2M"
     */
    formatNumber(num) {
        if (typeof num !== 'number') {
            return '0';
        }
        
        // Handle negative numbers
        const isNegative = num < 0;
        num = Math.abs(num);
        
        // Define suffixes and their thresholds
        const suffixes = [
            { threshold: 1e12, suffix: 'T' },
            { threshold: 1e9, suffix: 'B' },
            { threshold: 1e6, suffix: 'M' },
            { threshold: 1e3, suffix: 'K' },
        ];
        
        // Find appropriate suffix
        for (let { threshold, suffix } of suffixes) {
            if (num >= threshold) {
                const scaled = num / threshold;
                const formatted = scaled > 100 
                    ? Math.floor(scaled) 
                    : scaled.toFixed(1);
                
                return (isNegative ? '-' : '') + formatted + suffix;
            }
        }
        
        // Return full number if less than 1K
        return (isNegative ? '-' : '') + Math.floor(num);
    },
    
    /**
     * Format currency with $ symbol
     */
    formatCurrency(num) {
        return '$' + this.formatNumber(num);
    },
    
    /**
     * Format percentage
     */
    formatPercent(num, decimals = 1) {
        return (num * 100).toFixed(decimals) + '%';
    },
    
    /**
     * Format time duration (seconds to readable format)
     * Examples: 3661 -> "1h 1m 1s"
     */
    formatTime(seconds) {
        if (seconds < 0) {
            return '0s';
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        const parts = [];
        if (hours > 0) parts.push(hours + 'h');
        if (minutes > 0) parts.push(minutes + 'm');
        if (secs > 0 || parts.length === 0) parts.push(secs + 's');
        
        return parts.join(' ');
    },
    
    /**
     * Format large numbers with commas (for exact display)
     * Examples: 1234567 -> "1,234,567"
     */
    formatExact(num) {
        if (typeof num !== 'number') {
            return '0';
        }
        
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Format number with specific decimal places
     */
    formatDecimal(num, decimals = 2) {
        if (typeof num !== 'number') {
            return '0';
        }
        
        return num.toFixed(decimals);
    },
    
    /**
     * Parse a formatted number back to actual number
     * Examples: "1.2K" -> 1200, "1.5M" -> 1500000
     */
    parseFormatted(str) {
        const suffixMultipliers = {
            'K': 1e3,
            'M': 1e6,
            'B': 1e9,
            'T': 1e12,
        };
        
        // Remove any non-alphanumeric characters except decimal point
        const cleanStr = str.trim().toUpperCase();
        
        // Extract number and suffix
        const match = cleanStr.match(/^([\d.]+)([KMBT]?)$/);
        
        if (!match) {
            return 0;
        }
        
        let num = parseFloat(match[1]);
        const suffix = match[2];
        
        if (suffix && suffixMultipliers[suffix]) {
            num *= suffixMultipliers[suffix];
        }
        
        return num;
    },
    
    /**
     * Get appropriate unit for a number
     */
    getUnit(num) {
        if (num >= 1e12) return 'T';
        if (num >= 1e9) return 'B';
        if (num >= 1e6) return 'M';
        if (num >= 1e3) return 'K';
        return '';
    },
    
    /**
     * Format money with detailed breakdown
     * Examples: 1500 -> "$1.5K", with tooltip showing "$1,500"
     */
    formatMoneyDetailed(num) {
        return {
            short: this.formatCurrency(num),
            long: '$' + this.formatExact(num),
            exact: Math.floor(num)
        };
    },
    
    /**
     * Format production rate per second
     */
    formatProductionRate(numPerSecond) {
        const numPerMinute = numPerSecond * 60;
        const numPerHour = numPerMinute * 60;
        
        if (numPerHour >= 1) {
            return this.formatNumber(numPerHour) + '/h';
        } else if (numPerMinute >= 1) {
            return this.formatNumber(numPerMinute) + '/m';
        } else {
            return numPerSecond.toFixed(2) + '/s';
        }
    },
};

export default Formatter;
