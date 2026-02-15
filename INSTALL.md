# Installation Guide - Windows 

This guide will help you set up and run Super Robot Hero on Windows.

## Prerequisites

- **Python 3.8 or higher** - Download from https://www.python.org/downloads/
- **pip** - Included with Python

### Step 1: Verify Python Installation

Open Command Prompt and check your Python version:

```cmd
python --version
```

You should see `Python 3.x.x` (version 3.8 or higher)

### Step 2: Clone or Download the Repository

**Option A: Using Git** (if you have Git installed):
```cmd
git clone https://github.com/YOUR_USERNAME/Game_For_Aden.git
cd Game_For_Aden
```

**Option B: Download as ZIP**:
1. Click the green "Code" button on GitHub
2. Select "Download ZIP"
3. Extract the ZIP file
4. Open Command Prompt and navigate to the folder

### Step 3: Install Dependencies

Navigate to the game directory and install pygame:

```cmd
cd Game_For_Aden
pip install -r requirements.txt
```

**If pygame fails to install**, try:
```cmd
pip install pygame --upgrade
```

**On Windows with Python 3.14+**, you may need to use a pre-built wheel:
```cmd
pip install pygame --only-binary :all:
```

### Step 4: Run the Game

```cmd
python src/main.py
```

The game window should open!

## Controls

- **Arrow Keys** ← → ↑ ↓ - Move your robot
- **Space** - ZAP! Attack monsters with lightning
- **R** - Restart after game over
- **Q** - Quit the game (or close the window)

## Troubleshooting

### "pygame module not found"
Try installing pygame in a specific way:
```cmd
python -m pip install pygame
```

### "Python command not found"
Make sure Python is added to your PATH. During installation, check the box that says "Add Python to PATH"

### Game runs very slowly
Close other applications to free up system resources.

### Game window doesn't appear
Try running with:
```cmd
python -u src/main.py
```

## Success! 🎉

You should now see the game running with:
- Your blue robot in the center
- Friendly animals (green, yellow, and orange sprites)
- Purple monsters spawning
- A health bar, score display, and instructions at the top

Start protecting those animals! 🐰⚡

## Getting Help

If you encounter issues:
1. Check that Python version is 3.8+
2. Verify pygame is installed: `python -c "import pygame; print('OK')"`
3. Make sure you're in the correct directory
4. Check the issues page on GitHub

Enjoy the game! 🚀
