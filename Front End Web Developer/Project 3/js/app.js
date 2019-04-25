// Enemies our player must avoid, ES5 Class Implementation
var Enemy = function() {
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';

    // Set enemy initial location
    this.x = 0;
    this.y = 50;

    // Set enemy speed
    this.speed = 0;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Movement is multiplied by the dt parameter to ensure the game runs at the same speed for all computers.
    this.x = this.x + (this.speed*dt);

    // Handles player and enemy collison
    if (this.x === player.x && this.y === player.y) {
        console.log("Collided with Player!");
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
        if (!(newX < 0 || newY < 0 || newX > 400 || newY > 400)) {
            this.x = newX;
            this.y = newY;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

        // If the player reaches the water the game should be reset by moving the player back to the initial location (you can write a separate reset Player method to handle that)
    }
}

let allEnemies = [new Enemy()];
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
