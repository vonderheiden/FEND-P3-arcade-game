// Rev 2015-06-29
// Create an object to include board constants and default values.
//TODO: Improvement Idea - Consider include the 'use strict'; tag in your function definitions to enable the strict mode
var gameBoard = {
    PLAYER_SPRITES: ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png'],
    BOARD_WIDTH: 505,
    BOARD_HEIGHT: 606,
    BLOCK_WIDTH: 101,
    BLOCK_HEIGHT: 83,
    Y_OFFSET: 70,
    ENEMY_SPEED_MAX: 200,
    ENEMY_SPEED_MIN: 100,
    ROCK_SPEED: 200
};
// Enemies our player must avoid
 // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Default maximum and minimum speeds
    this.maxSpeed = gameBoard.ENEMY_SPEED_MAX;
    this.minSpeed = gameBoard.ENEMY_SPEED_MIN;
    // Use average as default speed of the enemy
    this.speed = this.maxSpeed - this.minSpeed;
    // Set the enemy in a default position.
    this.returnToStart();
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Check if the enemy has collided with player
    this.checkForCollisionWithPlayer();
    // Check if the enemy has collided with a rock
    this.checkForCollisionWithRock();
    // If the enemy is off the board, return it to the start.
    // Otherwise move forward based on the enemy's speed.
    if (this.x > gameBoard.BOARD_WIDTH) {
        this.returnToStart();
    } else {
        this.x = this.x + dt * this.speed;
    }
};
// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Set the enemy's speed with a random speed between min and max
Enemy.prototype.setRandomSpeed = function(min, max) {
    // Use min and max if provided, otherwise use defaults
    var minimum = min || this.minSpeed;
    var maximum = max || this.maxSpeed;
    this.speed = Math.floor(Math.random() * (maximum - minimum) + minimum);
};

// Set a random row for the enemy to appear on
Enemy.prototype.setRandomRow = function() {
    var row = Math.floor(Math.random() * 3);
    this.y = gameBoard.Y_OFFSET + gameBoard.BLOCK_HEIGHT * row;
};

// Check for collision with player
Enemy.prototype.checkForCollisionWithPlayer = function() {
// Check if the enemy's bounds overlap with the player. Player dies when collusion detected
    if (this.x < player.x + 80 &&
        this.x + 80 > player.x &&
        this.y < player.y + gameBoard.BLOCK_HEIGHT &&
        gameBoard.BLOCK_HEIGHT + this.y > player.y) {
        player.death();
    }
};
// Check for collision with rock
Enemy.prototype.checkForCollisionWithRock = function() {
// Check if the enemy's bounds overlap with the rock
// Only need to check if there is currently a rock on screen
    if (player.rock !== null) {
        if (this.x < player.rock.x + 80 &&
            this.x + 80 > player.rock.x &&
            this.y < player.rock.y + gameBoard.BLOCK_HEIGHT &&
            gameBoard.BLOCK_HEIGHT + this.y > player.rock.y) {
            // collision detected!
            // The rock can only hit one enemy
            // so remove it on collision
            player.rock = null;

            // return the enemy to starting point.
            this.returnToStart();
        }
    }
};

// Return the enemy to a starting point
Enemy.prototype.returnToStart = function() {
    this.x = -gameBoard.BLOCK_WIDTH;
    this.setRandomRow();
    this.setRandomSpeed();
};
//TODO: Improvement Idea - Consider using object inheritance

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player class
// Player can move within board area
// Collision with an enemy resets player to starting position
// Player can throw rocks to kill enemies
// User can toggle through different character sprite options
// Default player sprite settings
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.currentSpriteNumber = 0;
    this.lives = 2;
    this.rock = null;
    this.changeToRandomCharacter();
    this.returnToStart();
};

// Update the player's position
Player.prototype.update = function(dt) {
    // Check if the player has won
    if (this.hasWonTheGame()) {
        this.wonGame();
    }
    if (this.rock !== null) {
        this.rock.update(dt);
    }
};
// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (this.rock !== null) {
        this.rock.render();
    }
};
// Handle input for player movement
Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        this.y = this.y - gameBoard.BLOCK_HEIGHT;
    } else if (key == 'left') {
        // Ensure player will still be on the board
        if (this.x - gameBoard.BLOCK_WIDTH >= 0) {
            this.x = this.x - gameBoard.BLOCK_WIDTH;
        }
    } else if (key == 'right') {
        // Ensure player will still be on the board
        if (this.x + gameBoard.BLOCK_WIDTH < gameBoard.BOARD_WIDTH) {
            this.x = this.x + gameBoard.BLOCK_WIDTH;
        }
    } else if (key == 'down') {
        // Ensure player will still be on the board
        if (this.y + gameBoard.BLOCK_HEIGHT < gameBoard.BOARD_HEIGHT -
            gameBoard.BLOCK_HEIGHT - gameBoard.Y_OFFSET) {
            this.y = this.y + gameBoard.BLOCK_HEIGHT;
        }
    } else if (key == 'c') {
        // Change the player sprite image
        this.changeCharacter();
    } else if (key == 'space') {
        // Throw a rock
        this.throwRock();
    }
};
// Check if the player has won the game.
// Return false if the player hasn't won.
Player.prototype.hasWonTheGame = function() {
    // Default win is if the player is in the water
    return (this.y <= 0) ? true : false;
};
// Action to take when player wins
Player.prototype.wonGame = function() {
    // Let user know they won the game
    scoreboard.message = "Congrats - You Won!";
    this.gameOver();
};
// Action to take when player loses
Player.prototype.lostGame = function() {
    // Let user know they lost the game
    scoreboard.message = "Sorry, You Lost. Try Again.";
    this.gameOver();
};
// Game Over Sequence
Player.prototype.gameOver = function() {
    // Return player to start
    this.returnToStart();
    // Clear all the enemies
    allEnemies = [];
    // Remove the key input listener to
    // prevent player from moving after gameover.
    document.removeEventListener('keyup', passKeyUpValue);
};
// Action to take on player's death
Player.prototype.death = function() {
    // Take away a life
    this.lives--;

    scoreboard.message = "Ready? * * * Get to the Water. * * * Lives: " + this.lives;
    // Return player to the start
    this.returnToStart();

    if (this.lives < 1) {
        this.lostGame();
    }
};

// Return player to starting position
Player.prototype.returnToStart = function() {
    // x position: left side of player is 2 block widths over.
    this.x = gameBoard.BLOCK_WIDTH * 2;
    // y position: top side of player is 4 blocks down + an offset.
    this.y = gameBoard.BLOCK_HEIGHT * 4 + gameBoard.Y_OFFSET;
};
// Change the player's sprite image
Player.prototype.changeCharacter = function(spriteNumber) {
    if (spriteNumber !== null) {
        this.currentSpriteNumber = spriteNumber;
    } else {
        this.currentSpriteNumber = this.currentSpriteNumber + 1;
    }
    if (this.currentSpriteNumber >= gameBoard.PLAYER_SPRITES.length) {
        this.currentSpriteNumber = 0;
    }
    this.sprite = gameBoard.PLAYER_SPRITES[this.currentSpriteNumber];
};
// Select a random sprite for player
Player.prototype.changeToRandomCharacter = function() {
    var spriteNumber = Math.floor(Math.random() *
        gameBoard.PLAYER_SPRITES.length);

    this.changeCharacter(spriteNumber);
};
// Have the player throw a rock
Player.prototype.throwRock = function() {
    if (this.rock === null) {
        this.rock = new Rock();
    }
};
// A Rock our player can throw
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.x = player.x;
    this.y = player.y - 40;
};
// Update the rock's position
Rock.prototype.update = function(dt) {
    if (this.y < 0) {
        player.rock = null;
    } else {
        this.y = this.y - dt * gameBoard.ROCK_SPEED;
    }
};
// Draw the rock on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Scoreboard class to display game instructions and remaining lives
var Scoreboard = function() {
    this.message = "Cross The Street To Reach The Water. Use &#x25B2,  &#x25BC,  &#x25C0 or &#x25B6 Keyboard Arrows To Move The Player. Lives: " + player.lives;
};
// Update the scoreboard
Scoreboard.prototype.update = function() {
    scoreboardItem.innerHTML = this.message +
    "<br>Press 'C' to change character, Press 'Spacebar' to throw a rock" +
    "<br>Reload the page to start over.";
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Create enemies
var allEnemies = [];
var totalEnemies = 5;
for (var i = 0; i < totalEnemies; i++) {
    var enemy = new Enemy();
    enemy.setRandomSpeed();
    enemy.setRandomRow();
    allEnemies.push(enemy);
}
// Create Player
var player = new Player();
// Create Scoreboard
var scoreboard = new Scoreboard();
// Added a function to allow for
// call to document.removeEventListener
var passKeyUpValue = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c',
        32: 'space'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};
// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', passKeyUpValue);