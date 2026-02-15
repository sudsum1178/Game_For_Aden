# Super Robot Hero - Game Development Guide

## Project Overview
A Pygame-based arcade game where players control a robot protecting friendly animals from evil glitch monsters.

## Core Game Features
- Robot hero with movement and attack mechanics
- Random monster spawning system
- Friendly animals (bunnies, birds, cats) to protect
- Lightning zap attack system (⚡)
- Health and scoring system
- Game over detection

## Architecture
- **Robot Class**: Player-controlled character with movement, health, and zap ability
- **Monster Class**: Enemy sprites with random movement behavior
- **Animal Class**: Friendly NPCs to protect with different types
- **Zap Class**: Projectile system for attacks
- **Game Class**: Main game loop and state management

## Key Gameplay Mechanics
1. **Movement**: Arrow keys control robot position
2. **Combat**: Space bar for zap attacks with cooldown
3. **Collision Detection**: Robot vs Monster, Zap vs Monster, Monster vs Animal
4. **Score System**: +10 for monster kills, -50 for dead animals
5. **Win/Lose Conditions**: Health <= 0 or all animals dead

## Development Tasks
- [x] Create base game structure with Pygame
- [x] Implement Robot sprite and controls
- [x] Implement Monster sprite with random movement
- [x] Add Animal sprites (3 types)
- [x] Create zap attack system
- [x] Implement collision detection
- [x] Add UI (health, score, instructions)
- [x] Add game over screen
- [ ] Add sound effects
- [ ] Add particle effects for zaps
- [ ] Implement difficulty progression
- [ ] Add power-ups
- [ ] Create sprite graphics/animations
- [ ] Add GitHub repository

## How to Run
```bash
pip install -r requirements.txt
python src/main.py
```

## Testing Checklist
- [ ] Robot moves smoothly with arrow keys
- [ ] Zap attacks work with space key
- [ ] Monsters spawn and move randomly
- [ ] Collisions damage robot health
- [ ] Animals take damage from monsters
- [ ] Zaps destroy monsters correctly
- [ ] Score updates properly
- [ ] Game over triggers correctly
- [ ] Restart works (R key)

