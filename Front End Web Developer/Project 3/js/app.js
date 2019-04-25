// Enemies our player must avoid, ES5 Class Implementation
var Enemy = function(x, y, speed) {
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';

    // Set enemy initial location
    this.initialX = x;
    this.x = x;
    this.y = y;

    // Set enemy speed
    this.speed = speed;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Movement is multiplied by the dt parameter to ensure the game runs at the same speed for all computers.
    this.x = this.x + (this.speed*dt);

    // Handles player and enemy collison
    let delta = 50;
    if ((this.x < player.x + delta && this.x > player.x - delta)
     && (this.y < player.y + delta && this.y > player.y - delta)) {
        console.log("Collided with Player!");
        player.resetPlayer();
    }

    // resets enemy location if off board
    if (this.x > 600) {
        this.x = this.initialX;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class, ES6 implementation
class Player {
    constructor() {
        // The image/sprite for our character
        this.sprite = 'images/char-boy.png';

        // Sets player's initial location
        this.x = 200;
        this.y = 400;
    }

    update(movement=[0,0]) {

        let newX = this.x + movement[0];
        let newY = this.y + movement[1];

        // Ensures player does not move off screen
        if (newY < 0) {
            console.log("Player won!")
            this.resetPlayer();
        } else if (!(newX < 0 || newX > 400 || newY > 400)) {
            this.x = newX;
            this.y = newY;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    resetPlayer() {

        // Player moves back to starting position if they hit the water
        this.x = 200;
        this.y = 400;
    }

    handleInput(allowedKeys) {

        // Moves the player
        switch (allowedKeys) {
            case "left":
                this.update([-50,0]);
                break;
            case "up":
                this.update([0,-50]);
                break;
            case "right":
                this.update([50,0]);
                break;
            case "down":
                this.update([0,50]);
                break;
        }
    }
}

let numEnemies = Math.floor(Math.random() * 3) + 2; // Random number of enemies, 2 to 4.
let allEnemies = [];
for (let i = 0; i < numEnemies; i++) {
    let startX = Math.floor(Math.random() * -250); // Random X Start off screen
    let startY = Math.floor(Math.random() * 250); // Random Y start
    let speed = Math.floor(Math.random() * 250) + 50; // Random speed not less than 50
    allEnemies.push(new Enemy(startX, startY, speed));
}

let player = new Player();

// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
