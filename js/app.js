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
    if (this.x > 750) {
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
    this.heart = 'images/Heart.png';
    this.lostHeart = 'images/Heart-lost.png';
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.hitbox = new Rect(18, 63, 84, 139);
    this.maxLives = 4;
    this.currentLives = this.maxLives;
};

Player.prototype.update = function() {
    // Make sure the player doesn't go off the canvas.
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > 606) {
        this.x = 606;
    }
    if (this.y < 68) {
        this.y = 68;
    }
    if (this.y > 566) {
        this.y = 566;
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
    this.currentLives--;
};

Player.prototype.setPreviousPosition = function() {
    this.previousX = this.x;
    this.previousY = this.y;
}

Player.prototype.stay = function() {
    this.x = this.previousX;
    this.y = this.previousY;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Life counter
    var x = 0;
    var space = 35;
    for (var i = 0; i < this.currentLives; i++) {
        ctx.drawImage(Resources.get(this.heart), x, 0, 30, 50);
        x += space;
    }
    for (var j = 0; j < (this.maxLives - this.currentLives); j++) {
        ctx.drawImage(Resources.get(this.lostHeart), x, 0, 30, 50)
        x += space;
    }
};

Player.prototype.handleInput = function(key) {
    this.setPreviousPosition();

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
        case 'space':
            this.currentLives = this.maxLives;
            break;
        default:
            break;
    }
};

// Rock class
var Rock = function(row, col) {
    this.sprite = 'images/Rock.png';
    this.x = row * 101;
    this.y = (col * 83) - 21;
    this.hitbox = new Rect(7, 70, 95, 150);
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
                new Enemy(-100, 145),
                new Enemy(-75, 228),
                new Enemy(-150, 394),
                new Enemy(-100, 477)
                ];
var allRocks = [
                new Rock(0, 1),
                new Rock(2, 1),
                new Rock(6, 1),
                new Rock(1, 4),
                new Rock(4, 4),
                new Rock(5, 4),
                new Rock(0, 7),
                new Rock(1, 7),
                new Rock(5, 7)
                ];
var player = new Player(303, 566);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
