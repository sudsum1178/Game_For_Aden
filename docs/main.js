// Game Configuration
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 700;
const FPS = 60;

// Colors
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#0064FF';
const YELLOW = '#FFFF00';
const PURPLE = '#C800C8';
const ORANGE = '#FFC800';

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game States
let gameRunning = true;
let gameOver = false;
let score = 0;
let wave = 1;

// Sprite Groups
let robot;
let monsters = [];
let animals = [];
let zaps = [];

// Game Variables
let spawnTimer = 0;
let frameCount = 0;

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        spawnZap();
    }
    if (e.key.toLowerCase() === 'r') {
        if (gameOver) initGame();
    }
    if (e.key.toLowerCase() === 'q') {
        gameRunning = false;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Robot Class
class Robot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.speed = 5;
        this.health = 100;
        this.zapCooldown = 0;
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x + this.width < SCREEN_WIDTH) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y + this.height < SCREEN_HEIGHT) {
            this.y += this.speed;
        }

        if (this.zapCooldown > 0) {
            this.zapCooldown--;
        }
    }

    canZap() {
        if (this.zapCooldown <= 0) {
            this.zapCooldown = 15;
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = BLUE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw robot eyes
        ctx.fillStyle = YELLOW;
        ctx.fillRect(this.x + 8, this.y + 10, 8, 8);
        ctx.fillRect(this.x + 24, this.y + 10, 8, 8);
    }
}

// Monster Class
class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.speed = 2;
        this.health = 20;
    }

    update() {
        if (Math.random() < 0.02) {
            this.speed = Math.random() * 3 + 1;
        }

        this.x += (Math.random() - 0.5) * this.speed * 2;
        this.y += (Math.random() - 0.5) * this.speed * 2;

        this.x = Math.max(0, Math.min(this.x, SCREEN_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, SCREEN_HEIGHT - this.height));
    }

    draw(ctx) {
        ctx.fillStyle = PURPLE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw glitch effect
        ctx.fillStyle = PURPLE;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        ctx.globalAlpha = 1.0;
    }
}

// Animal Class
class Animal {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.health = 50;
        this.fearTimer = 0;

        if (type === 'bunny') {
            this.color = GREEN;
        } else if (type === 'bird') {
            this.color = YELLOW;
        } else {
            this.color = ORANGE;
        }
    }

    update() {
        if (this.fearTimer > 0) {
            this.fearTimer--;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (this.fearTimer > 0) {
            ctx.strokeStyle = RED;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        }
    }
}

// Zap Class
class Zap {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.speed = 8;
        this.age = 0;
        this.maxAge = 120;
    }

    update() {
        this.x += this.speed;
        this.age++;
    }

    isAlive() {
        return this.age < this.maxAge && this.x < SCREEN_WIDTH;
    }

    draw(ctx) {
        ctx.fillStyle = YELLOW;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Lightning effect
        ctx.strokeStyle = YELLOW;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.stroke();
    }
}

// Initialize Game
function initGame() {
    gameOver = false;
    gameRunning = true;
    score = 0;
    wave = 1;
    spawnTimer = 0;

    robot = new Robot(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    monsters = [];
    animals = [];
    zaps = [];

    createAnimals(3);
    spawnMonsters(2);
}

// Create Animals
function createAnimals(count) {
    const types = ['bunny', 'bird', 'cat'];
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (SCREEN_WIDTH - 50) + 25;
        const y = Math.random() * (SCREEN_HEIGHT - 50) + 25;
        const type = types[Math.floor(Math.random() * types.length)];
        animals.push(new Animal(x, y, type));
    }
}

// Spawn Monsters
function spawnMonsters(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (SCREEN_WIDTH - 50) + 25;
        const y = Math.random() * (SCREEN_HEIGHT - 50) + 25;
        monsters.push(new Monster(x, y));
    }
}

// Spawn Zap
function spawnZap() {
    if (robot.canZap()) {
        zaps.push(new Zap(robot.x + robot.width, robot.y + robot.height / 2));
    }
}

// Collision Detection
function checkCollisions() {
    // Robot vs Monster
    for (let monster of monsters) {
        if (rectCollide(robot, monster)) {
            robot.health -= 2;
        }
    }

    // Zap vs Monster
    for (let i = zaps.length - 1; i >= 0; i--) {
        for (let j = monsters.length - 1; j >= 0; j--) {
            if (rectCollide(zaps[i], monsters[j])) {
                score += 10;
                monsters.splice(j, 1);
                zaps.splice(i, 1);
                break;
            }
        }
    }

    // Monster vs Animal
    for (let animal of animals) {
        for (let monster of monsters) {
            if (rectCollide(animal, monster)) {
                animal.health -= 1;
                animal.fearTimer = 10;
            }
        }
    }

    // Remove dead animals
    for (let i = animals.length - 1; i >= 0; i--) {
        if (animals[i].health <= 0) {
            score -= 50;
            animals.splice(i, 1);
        }
    }

    // Check game over
    if (robot.health <= 0 || animals.length === 0) {
        gameOver = true;
    }
}

// Collision Helper
function rectCollide(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Update Game
function update() {
    if (!gameOver) {
        robot.update();
        
        for (let monster of monsters) {
            monster.update();
        }
        
        for (let animal of animals) {
            animal.update();
        }
        
        for (let i = zaps.length - 1; i >= 0; i--) {
            zaps[i].update();
            if (!zaps[i].isAlive()) {
                zaps.splice(i, 1);
            }
        }

        spawnTimer++;
        if (spawnTimer > 120) {
            spawnMonsters(1);
            spawnTimer = 0;
        }

        checkCollisions();
    }
}

// Draw Game
function draw() {
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    robot.draw(ctx);
    
    for (let monster of monsters) {
        monster.draw(ctx);
    }
    
    for (let animal of animals) {
        animal.draw(ctx);
    }
    
    for (let zap of zaps) {
        zap.draw(ctx);
    }

    // Draw UI
    drawUI();
}

// Draw User Interface
function drawUI() {
    ctx.font = '24px Arial';
    ctx.fillStyle = robot.health < 30 ? RED : GREEN;
    ctx.fillText(`Health: ${robot.health}`, 10, 30);

    ctx.fillStyle = WHITE;
    ctx.fillText(`Score: ${score}`, 10, 60);

    ctx.fillStyle = GREEN;
    ctx.fillText(`Animals: ${animals.length}`, 10, 90);

    ctx.fillStyle = PURPLE;
    ctx.fillText(`Monsters: ${monsters.length}`, SCREEN_WIDTH - 300, 30);

    // Instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = WHITE;
    ctx.fillText('Arrows: Move | Space: ZAP! ⚡', SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT - 20);

    // Game Over Screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        ctx.font = 'bold 72px Arial';
        ctx.fillStyle = RED;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 100);

        ctx.font = '28px Arial';
        ctx.fillStyle = WHITE;
        ctx.fillText(`Final Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

        ctx.font = '20px Arial';
        ctx.fillStyle = YELLOW;
        ctx.fillText('Press R to Restart or Q to Quit', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100);

        ctx.textAlign = 'left';
    }
}

// Game Loop
function gameLoop() {
    update();
    draw();
    
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Start Game
initGame();
gameLoop();
