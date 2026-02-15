import pygame
import random
import math
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 700
FPS = 60

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 100, 255)
YELLOW = (255, 255, 0)
PURPLE = (200, 0, 200)

class Robot(pygame.sprite.Sprite):
    """Super Robot Hero - protecting animals from monsters"""
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((40, 50))
        self.image.fill(BLUE)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = 5
        self.health = 100
        self.score = 0
        self.zap_cooldown = 0
        
    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] and self.rect.right < SCREEN_WIDTH:
            self.rect.x += self.speed
        if keys[pygame.K_UP] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN] and self.rect.bottom < SCREEN_HEIGHT:
            self.rect.y += self.speed
            
        # Update zap cooldown
        if self.zap_cooldown > 0:
            self.zap_cooldown -= 1
            
    def zap(self):
        """Attack mode"""
        if self.zap_cooldown <= 0:
            self.zap_cooldown = 15  # Cooldown frames
            return True
        return False


class Monster(pygame.sprite.Sprite):
    """Evil Glitch Monster"""
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((35, 35))
        self.image.fill(PURPLE)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = 2
        self.health = 20
        self.angry = False
        
    def update(self):
        # Move randomly or chase
        if random.random() < 0.02:
            self.speed = random.randint(1, 4)
            
        self.rect.x += random.randint(-self.speed, self.speed)
        self.rect.y += random.randint(-self.speed, self.speed)
        
        # Keep on screen
        self.rect.x = max(0, min(self.rect.x, SCREEN_WIDTH - 35))
        self.rect.y = max(0, min(self.rect.y, SCREEN_HEIGHT - 35))


class Animal(pygame.sprite.Sprite):
    """Friendly Animal to protect"""
    def __init__(self, x, y, animal_type):
        super().__init__()
        self.type = animal_type
        
        if animal_type == "bunny":
            color = GREEN
        elif animal_type == "bird":
            color = YELLOW
        else:  # cat
            color = (255, 200, 0)
            
        self.image = pygame.Surface((30, 30))
        self.image.fill(color)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.health = 50
        self.fear_timer = 0
        
    def update(self):
        # Simple idle animation
        if self.fear_timer > 0:
            self.fear_timer -= 1


class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Super Robot Hero - Protect the Animals!")
        self.clock = pygame.time.Clock()
        self.running = True
        self.game_over = False
        self.score = 0
        self.wave = 1
        
        # Sprite groups
        self.all_sprites = pygame.sprite.Group()
        self.monsters = pygame.sprite.Group()
        self.animals = pygame.sprite.Group()
        self.zaps = pygame.sprite.Group()
        
        # Create robot
        self.robot = Robot(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        self.all_sprites.add(self.robot)
        
        # Create initial animals
        self.create_animals(3)
        
        # Spawn first monsters
        self.spawn_monsters(2)
        self.spawn_timer = 0
        
    def create_animals(self, count):
        """Create friendly animals"""
        animal_types = ["bunny", "bird", "cat"]
        for _ in range(count):
            x = random.randint(50, SCREEN_WIDTH - 50)
            y = random.randint(50, SCREEN_HEIGHT - 50)
            animal = Animal(x, y, random.choice(animal_types))
            self.all_sprites.add(animal)
            self.animals.add(animal)
            
    def spawn_monsters(self, count):
        """Spawn evil glitch monsters"""
        for _ in range(count):
            x = random.randint(50, SCREEN_WIDTH - 50)
            y = random.randint(50, SCREEN_HEIGHT - 50)
            monster = Monster(x, y)
            self.all_sprites.add(monster)
            self.monsters.add(monster)
            
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.spawn_zap()
                if event.key == pygame.K_r and self.game_over:
                    self.__init__()  # Restart
                    
    def spawn_zap(self):
        """Create a zap attack"""
        if self.robot.zap():
            zap = Zap(self.robot.rect.centerx, self.robot.rect.centery)
            self.all_sprites.add(zap)
            self.zaps.add(zap)
            
    def update(self):
        if not self.game_over:
            self.all_sprites.update()
            
            # Spawning monsters over time
            self.spawn_timer += 1
            if self.spawn_timer > 120:  # Spawn every 2 seconds
                self.spawn_monsters(1)
                self.spawn_timer = 0
                
            # Check collision: robot vs monster
            collisions = pygame.sprite.spritecollide(self.robot, self.monsters, False)
            for monster in collisions:
                self.robot.health -= 2
                
            # Check collision: zap vs monster
            for zap in self.zaps:
                monsters_hit = pygame.sprite.spritecollide(zap, self.monsters, True)
                for monster in monsters_hit:
                    self.score += 10
                    zap.kill()
                    
            # Check collision: monster vs animal
            for animal in self.animals:
                collisions = pygame.sprite.spritecollide(animal, self.monsters, False)
                for monster in collisions:
                    animal.health -= 1
                    animal.fear_timer = 10
                    
            # Remove dead animals and lost animals
            for animal in self.animals:
                if animal.health <= 0:
                    self.score -= 50
                    animal.kill()
                    
            # Check game over
            if self.robot.health <= 0 or len(self.animals) == 0:
                self.game_over = True
                
    def draw(self):
        self.screen.fill(BLACK)
        
        # Draw all sprites
        self.all_sprites.draw(self.screen)
        
        # Draw UI
        font = pygame.font.Font(None, 36)
        
        # Health bar
        health_text = font.render(f"Health: {self.robot.health}", True, RED if self.robot.health < 30 else GREEN)
        self.screen.blit(health_text, (10, 10))
        
        # Score
        score_text = font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 50))
        
        # Animals saved
        animals_text = font.render(f"Animals: {len(self.animals)}", True, GREEN)
        self.screen.blit(animals_text, (10, 90))
        
        # Monsters count
        monsters_text = font.render(f"Monsters: {len(self.monsters)}", True, PURPLE)
        self.screen.blit(monsters_text, (SCREEN_WIDTH - 300, 10))
        
        # Instructions
        small_font = pygame.font.Font(None, 24)
        instructions = small_font.render("Arrows: Move | Space: ZAP! ⚡", True, WHITE)
        self.screen.blit(instructions, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT - 30))
        
        # Game Over screen
        if self.game_over:
            overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
            overlay.set_alpha(200)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            big_font = pygame.font.Font(None, 72)
            game_over_text = big_font.render("GAME OVER", True, RED)
            game_over_rect = game_over_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 100))
            self.screen.blit(game_over_text, game_over_rect)
            
            final_score = font.render(f"Final Score: {self.score}", True, WHITE)
            final_score_rect = final_score.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
            self.screen.blit(final_score, final_score_rect)
            
            restart_text = small_font.render("Press R to Restart or Q to Quit", True, YELLOW)
            restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 100))
            self.screen.blit(restart_text, restart_rect)
            
        pygame.display.flip()
        
    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
            
        pygame.quit()
        sys.exit()


class Zap(pygame.sprite.Sprite):
    """Lightning Zap projectile"""
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((10, 10))
        self.image.fill(YELLOW)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = 8
        self.age = 0
        self.max_age = 120  # Frames before disappearing
        
    def update(self):
        # Move forward
        self.rect.x += self.speed
        self.age += 1
        
        # Fade out and disappear
        if self.age > self.max_age or self.rect.x > SCREEN_WIDTH:
            self.kill()


if __name__ == "__main__":
    game = Game()
    game.run()
