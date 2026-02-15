# Super Robot Hero 🤖

A fun arcade-style game where you play as a Super Robot Hero protecting friendly animals from evil glitch monsters!

## Features

✨ **Super Robot Hero** - Control a powerful robot to defend animals
🐰 **Friendly Animals** - Protect bunnies, birds, and cats from harm
👾 **Evil Glitch Monsters** - Random monsters appear and attack
⚡ **Zap Attack** - Use lightning attacks to eliminate monsters
📊 **Score System** - Earn points by defeating monsters, lose points when animals get hurt

## Gameplay

- **Objective**: Protect all the friendly animals from evil glitch monsters
- **Controls**:
  - `Arrow Keys` - Move the robot around
  - `Space` - ZAP! Attack nearby monsters with lightning ⚡
  - `R` - Restart after game over
  - `Q` - Quit the game

## How to Play

1. **Start the game** - Your robot appears with 3 friendly animals
2. **Monsters spawn** - Evil glitch monsters appear randomly
3. **Defend** - Use your zap attack to destroy monsters before they hurt animals
4. **Survive** - Protect all animals while maintaining your robot's health
5. **Score points** - Earn 10 points per monster defeated
6. **Game Over** - When your health drops to 0 or all animals are gone

## Installation

### Requirements
- Python 3.8 or higher
- Pygame 2.5.2

### Setup

1. Clone or download this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Game

```bash
python src/main.py
```

## Game Mechanics

- **Robot Health**: Starts at 100. Touching monsters reduces health.
- **Animal Protection**: Each animal has health. Monsters touching animals harms them.
- **Zap Attack**: Press Space to attack. Has a cooldown to balance gameplay.
- **Monster Spawning**: New monsters appear gradually to increase difficulty.
- **Score**: Track your performance with the scoring system.

## Project Structure

```
Game_For_Aden/
├── src/
│   └── main.py           # Main game logic
├── assets/
│   ├── images/           # Game sprites (placeholder)
│   └── sounds/           # Sound effects (placeholder)
├── README.md             # This file
├── requirements.txt      # Python dependencies
└── LICENSE              # MIT License
```

## Future Enhancements

- [ ] Add sound effects and music
- [ ] Implement different game levels
- [ ] Add power-ups for the robot
- [ ] Multiple animal types with unique behaviors
- [ ] Boss battles
- [ ] Difficulty settings
- [ ] High score leaderboard
- [ ] Mobile/touch controls

## License

MIT License - Feel free to use and modify this game!

## Credits

Created as a fun arcade game project. Inspired by classic arcade defenders.

---

**Have fun protecting the animals! 🐰🚀**
