// Pick a randomized speed for enemies
function randomSpeed() {
    var rand = Math.floor(Math.random() * 4) + 1;
    var speed = 360 / rand;
    return speed;
}

// Generate a random int within a and b inclusive
function randomIntWithinRange(a, b) {
    var range = a - b;
    var random = Math.random() * range;
    return a - Math.round(random);
}

// Pick a random element from an array
function randomElement(arr) {
    var idx = randomIntWithinRange(0, arr.length - 1);
    return arr[idx];
}

// Rect class which defines object's hitbox
var Rect = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
};

//　Move the hitbox according to the object's move
Rect.prototype.moveBy = function(x, y) {
    return new Rect(
        this.x1 + x,
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
var Enemy = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.speed = randomSpeed();
    this.direction = dir;

    switch (this.direction) {
        case 'right':
            this.sprite = 'images/enemy-bug.png';
            this.hitbox = new Rect(13, 77, 101, 143);
            break;
        case 'left':
            this.sprite = 'images/enemy-bug-reversed.png';
            this.hitbox = new Rect(0, 77, 88, 143);
            break;
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    switch (this.direction) {
        case 'right':
            this.x += this.speed * dt;
            break;
        case 'left':
            this.x -= this.speed * dt;
            break;
    }

    // Update the enemy's position and speed
    // when it goes outside the canvas
    if (this.x > 750) {
        this.x = randomIntWithinRange(-100, -200);
        this.speed = randomSpeed();
    } else if (this.x < -120) {
        this.x = randomIntWithinRange(750, 850);
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
    this.score = 0;
    this.isStarted = false;
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

// Check if the player collides with an object
Player.prototype.hit = function(obj) {
    var a = this.hitbox.moveBy(this.x, this.y);
    var b = obj.hitbox.moveBy(obj.x, obj.y);

    return a.overlaps(b);
};

// Reset the player's position and lives after collision with an enemy
Player.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.currentLives--;
};

// Set the player's previous position
Player.prototype.setPreviousPosition = function() {
    this.previousX = this.x;
    this.previousY = this.y;
};

// Keep the player from running onto an obstacle
Player.prototype.stay = function() {
    this.x = this.previousX;
    this.y = this.previousY;
};

// Update score when the player gets a gem
Player.prototype.scoreUpdate = function(gem) {
    this.score += gem.gemType.point;
};

// Draw the player and the counters on the screen
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

    // Score counter
    var scoreText = 'Score: ' + this.score;
    ctx.fillStyle = '#222';
    ctx.textAlign = 'right';
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText(scoreText, 707, 40);
};

// Make the player move or start a game according to the key pressed
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
            if (!this.isStarted) {
                this.isStarted = true;
            } else if (this.currentLives === 0 || this.score >= 500) {
                this.currentLives = this.maxLives;
                this.score = 0;
            }
            break;
        default:
            break;
    }
};

// Rock class
var Rock = function(col, row) {
    this.sprite = 'images/Rock.png';
    this.x = col * 101;
    this.y = (row * 83) - 21;
    this.hitbox = new Rect(7, 70, 95, 150);
};

// Draw the rock on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem class
var Gem = function(col, row) {
    this.gemType = { point: 10, sprite: 'images/GemGreen-small.png' };
    this.x = col * 101;
    this.y = (row * 83) - 21;
    this.hitbox = new Rect(16, 73, 86, 150);
};

// Define gem types
var gemTypes = [
    { point: 10, sprite: 'images/GemGreen-small.png' },
    { point: 20, sprite: 'images/GemBlue-small.png' },
    { point: 50, sprite: 'images/GemOrange-small.png' }
];

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gemType.sprite), this.x, this.y);
};

// Make gems pop up randomly on the specified rows
Gem.prototype.randomPopUp = function() {
    var gemPopRows = [2, 3, 5, 6];
    var gemPopCols = [0, 1, 2, 3, 4, 5, 6];

    var randomRow = randomElement(gemPopRows);
    var randomCol = randomElement(gemPopCols);

    this.x = randomCol * 101;
    this.y = (randomRow * 83) - 21;

    this.gemType = randomElement(gemTypes);
};

// Instantiate objects
var allEnemies = [
    new Enemy(-100, 145, 'right'),
    new Enemy(775, 228, 'left'),
    new Enemy(-150, 394, 'right'),
    new Enemy(800, 477, 'left')
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
var gem = new Gem(1, 2);
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
