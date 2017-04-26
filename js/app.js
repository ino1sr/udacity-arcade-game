// Pick a randomized speed for enemies
function randomSpeed() {
    var rand = Math.floor(Math.random()*4) + 1;
    var speed = 240 / rand;
    return speed;
}

// Generate a random int within a and b inclusive
function randomIntWithinRange(a, b) {
    var range = a - b;
    var random = Math.random() * range;
    return a - Math.round(random);
}

// Enemy class
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Update the enemy's position and speed
    // when it goes off to the right side of the canvas.
    if (this.x > 550) {
        this.x = randomIntWithinRange(-100, -200);
        this.speed = randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
}

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function() {

};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(-100, 62), new Enemy(-75, 145), new Enemy(-150, 228)];
var player = new Player(200, 380);

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
