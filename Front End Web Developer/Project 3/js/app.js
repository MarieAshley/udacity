// Enemies our player must avoid, ES5 Class Implementation
var Enemy = function() {
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';

    // Set enemy initial location
    this.x = 0;
    this.y = 0;

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
        this.sprite = 'images/char-horn-girl.png';

        // Sets player's initial location
        this.x = 0;
        this.y = 0;
    }
    update(dt) {
        this.x = this.x + (this.speed*dt);
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput() {}
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
// Place the player object in a variable called player
let player = [];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
