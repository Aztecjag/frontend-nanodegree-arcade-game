// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
 xmove = dt * 100 * this.speed;
    this.x = this.x + xmove;

    if (this.x > 700) {
        this.x = -100;
    }
    if (player.y === this.y && this.x + 42> player.x && this.x < player.x + 21) {
        player.x = 203;
        player.y = 362;
        frozen = 0;
        player.sprite = 'images/char-boy.png';
    }
}


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// Poky speed enemy
var PokyEnemy = function (x, y, level) {
    Enemy.call(this, x, y);
    this.speed = this.speed * level * 0.5;
};

PokyEnemy.prototype = Object.create(Enemy.prototype);
PokyEnemy.prototype.constructor = PokyEnemy;
PokyEnemy.prototype.speed = 1;

// Mid speed enemy

var MidEnemy = function (x, y, level) {
    Enemy.call(this, x, y);
    this.speed = this.speed * level * 0.5;
};

MidEnemy.prototype = Object.create(Enemy.prototype);
MidEnemy.prototype.constructor = MidEnemy;
MidEnemy.prototype.speed = 1.5;

// Swift Enemy
var SwiftEnemy = function (x, y, level) {
    Enemy.call(this, x, y);
    this.speed = this.speed * level * 0.4;
};

SwiftEnemy.prototype = Object.create(Enemy.prototype);
SwiftEnemy.prototype.constructor = SwiftEnemy;
SwiftEnemy.prototype.speed = 2.5;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';    
}

Player.prototype.update = function(dt) {
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



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
