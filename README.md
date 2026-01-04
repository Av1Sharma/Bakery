# 🧁 Sweet Success Bakery - Idle Game

A relaxing browser-based idle clicker game where you build and manage your own bakery empire!

## 🎮 Game Features

### Phase 1: Core Engine ✅
- **Game State Management**: Track all game data, progress, and statistics
- **Save/Load System**: Persistent game data using localStorage
- **Idle Tick System**: Offline progress and passive income
- **Number Formatting**: K, M, B, T suffixes for large numbers

### Phase 2: Baking Mechanics (In Progress)
- **Recipe System**: Unlock and bake different treats
- **Ingredient Management**: Track and manage resources
- **Auto-Bakers**: Hire staff for passive income
- **Recipe Upgrades**: Increase production of each recipe

### Future Phases
- Customer System with orders and satisfaction
- Business Management with shop upgrades
- Progression & Content with achievements
- UI/UX Polish and animations
- Sound Effects and effects
- Performance optimization

## 📁 Project Structure

```
Bakery/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Game styles with bakery theme
├── js/
│   ├── gameState.js       # Game state management
│   ├── saveManager.js     # Save/load system
│   ├── formatter.js       # Number formatting utilities
│   ├── offlineProgress.js # Idle tick system
│   ├── game.js            # Main game engine
│   └── recipes.js         # Recipe system
├── README.md              # This file
└── .git/                  # Git repository
```

## 🚀 Getting Started

### Installation
1. Clone the repository
2. Open `index.html` in a modern web browser
3. Start baking! 🍪

### Browser Requirements
- Modern browser with ES6 module support
- localStorage enabled
- JavaScript enabled

## 🎯 Core Systems

### Game State (`gameState.js`)
Manages all game data including:
- Currency and money
- Baking and production
- Upgrades and shop items
- Customer system
- Progression and milestones

### Save Manager (`saveManager.js`)
Features:
- Auto-save every 30 seconds
- Manual save/load functionality
- Save data export/import (for backup)
- Version control for migrations

### Number Formatter (`formatter.js`)
Utilities for displaying large numbers:
```javascript
formatter.formatNumber(1234567)    // "1.2M"
formatter.formatCurrency(50000)    // "$50K"
formatter.formatTime(3661)         // "1h 1m 1s"
formatter.parseFormatted("1.5K")  // 1500
```

### Offline Progress (`offlineProgress.js`)
- Calculates earnings from time away
- Game loop management (1 second ticks)
- Passive income from auto-bakers
- Max 7 days offline cap

### Main Game Engine (`game.js`)
Orchestrates all systems:
- Game initialization
- UI updates
- Event handling
- Auto-save setup
- Win conditions and unlocks

### Recipe System (`recipes.js`)
Recipe mechanics:
- Recipe unlock requirements
- Production calculations
- Recipe upgrades
- Profitability analysis

## 💰 Game Balance

### Starting Resources
- **Starting Money**: $10
- **Cookie Production**: $1 per bake

### Unlock Requirements
- **Brownie**: 20 bakes + $50
- **Donut**: 30 bakes + $75
- **Croissant**: 50 bakes + $150
- **Cake**: 100 bakes + $500

### Auto-Baker Costs
- **First Baker**: $50
- **Cost multiplier**: 1.15x per baker

## 🎨 Styling

The game features:
- Warm bakery-themed color palette
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Accessible UI elements

## 🔧 Development

### Running the Game
Simply open `index.html` in your browser. The game will:
1. Check for saved data
2. Calculate offline earnings if applicable
3. Initialize the UI
4. Start the game loop

### Console Commands (for testing)
```javascript
// Access the game object
game

// View game stats
game.getStats()

// Add money (for testing)
game.addMoney(1000)

// Hire auto-baker
game.hireAutoBaker()

// Purchase upgrade
game.purchaseUpgrade('betterOven')

// View save data
game.exportSaveData()

// Reset game (with confirmation)
game.resetGame()
```

## 📊 Save Data Structure

Save data includes:
```javascript
{
  version: 1,
  timestamp: 1234567890,
  state: {
    money: 1000,
    totalMoneyEarned: 5000,
    totalBaked: 150,
    recipes: {...},
    upgrades: {...},
    // ... more data
  }
}
```

## 🐛 Known Issues & TODO

### Current Phase 1 Todos
- [ ] Add more CSS animations
- [ ] Implement recipe UI rendering
- [ ] Add upgrade UI rendering
- [ ] Create customer system foundation
- [ ] Add sound effects framework

### Future Improvements
- [ ] Mobile-optimized controls
- [ ] Prestige/rebirth system
- [ ] Multiple bakery locations
- [ ] Multiplayer features (future)
- [ ] Mod support

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1200px
- **Desktop**: > 1200px

## 🎓 Learning Resources

This project demonstrates:
- Modern JavaScript (ES6+ modules)
- Game state management patterns
- localStorage and data persistence
- Game loop architecture
- UI update patterns
- Number formatting algorithms

## 📝 License

This project is open source. Feel free to use it as a learning resource or starting point for your own game!

## 🙏 Credits

- Inspiration: Cookie Clicker, Clicker Heroes, other idle games
- Fonts: Google Fonts (Outfit, Pacifico)
- Emojis: Unicode emoji set

---

**Happy Baking! 🧁**

Last Updated: January 3, 2026
Version: 1.0.0-alpha
