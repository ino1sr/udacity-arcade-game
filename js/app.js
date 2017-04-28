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

// Rect class which defines objects' hitboxes
var Rect = function (x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
};

//　Move the hitbox according to the object's move
Rect.prototype.moveBy = function(x, y) {
    return new Rect(this.x1 + x,
                    this.y1 + y,
                    this.x2 + x,
                    this.y2 + y);
};

// Check if the hitboxes overlap
Rect.prototype.overlaps = function(other) {
    return (this.x1 < other.x2 && this.x2 > other.x1 &&
            this.y1 < other.y2 && this.y2 > other.y1);
};

// Enemy class
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomSpeed();
    this.hitbox = new Rect(13, 77, 101, 143);
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

// Player class
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.hitbox = new Rect(18, 63, 84, 139);
};

Player.prototype.update = function() {
    // Make sure the player doesn't go off the canvas.
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.y < -15) {
        this.y = -15;
    }
    if (this.y > 400) {
        this.y = 400;
    }
};

// Check if the player collides with enemy
Player.prototype.hit = function(obj) {
    var a = this.hitbox.moveBy(this.x, this.y);
    var b = obj.hitbox.moveBy(obj.x, obj.y);

    return a.overlaps(b);
};

Player.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x -= 101;
            break;
        case 'up':
            this.y -= 83;
            break;
        case 'right':
            this.x += 101;
            break;
        case 'down':
            this.y += 83;
            break;
        default:
            break;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(-100, 62), new Enemy(-75, 145), new Enemy(-150, 228)];
var player = new Player(200, 400);

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
