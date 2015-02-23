var CanvasItem = function(x,y,sprite) {
    this.x = x || 0;
    this.y = y || 0;
    this.xInit = this.x;
    this.yInit = this.y;
    this.sprite = sprite || "";
    this.width = 0;
    this.height = 0;
    if (this.sprite) {
        this.width = Resources.get(this.sprite).width;
        this.height = Resources.get(this.sprite).height;
    }

    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x,this.y);
    };
} ;

// Enemies our player must avoid

var Enemy = function(x,y) {
    this.base = CanvasItem;
    this.base(x,y, 'images/enemy-bug.png');
    this.velocity = Math.floor(Math.random()*(121)+100);
};    

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if ( this.x <= ctx.canvas.width) {
           this.x += this.velocity*dt;
    } else {
           this.x = -this.width;
    }
    if (checkCollision(player, this)) {
            player.reset();
    }
};
Enemy.prototype.reset = function() {
    this.x = this.xInit;
    this.y = this.yInit;
    this.velocity = Math.floor(Math.random()*(121)+100);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y,xStep,yStep) {
    this.base = CanvasItem;
    this.base(x,y, 'images/char-boy.png');

    this.xStep = xStep || 0;
    this.yStep = yStep || 0;

    this.startTime = new Date()
    this.timer = this.startTime;
    this.totalTime = null;
    console.log("Player start time: " + this.timer);
}; 

Player.prototype.reset = function(checkTime) {
    this.totalTime = this.timer - this.startTime;
    this.startTime = new Date();
    this.timer = this.startTime;
    if (!checkTime) {
        this.x = this.xInit;
        this.y = this.yInit;
        pClock.reset();
        console.log("Starting over");
    } else {
        if (bestTime === 0 || this.totalTime < bestTime) bestTime = this.totalTime;
        bstClock.drawClock(bestTime);
        console.log("You win! Total time: " + formatTimeString(this.totalTime) + " - Best Time: " + formatTimeString(bestTime));
    }
};
Player.prototype.update = function(x,y) {
    if (this.y - this.yStep <= 0) {
        animate=false;
        this.reset(true);
    }
    this.timer = new Date();
};
Player.prototype.handleInput = function(kc) {
    switch (true) {
        case (kc === 'up'):
                if (this.y - this.yStep > 0) this.y -= this.yStep;
                break;
        case (kc === 'down'):
                if (this.y + this.height + this.yStep <= ctx.canvas.height) this.y += this.yStep;
                break;
        case (kc === 'left'):
                if (this.x - this.xStep >= 0) this.x -= this.xStep;
                break;
        case (kc === 'right'):
                if (this.x + this.width + this.xStep <= ctx.canvas.width) this.x += this.xStep;
                break;               
    }
};

var GameClock = function(x,y,lbl) {
    this.base = CanvasItem;
    this.base(x,y);
    this.startTime = new Date();
    this.lbl = lbl || "";
};
GameClock.prototype.drawClock = function (ms) {
    ctx.font = this.y + "px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, 0, 80,this.y + 10);
    ctx.fillStyle = "#000000";
    ctx.fillText(formatTimeString(ms),this.x,this.y);
};
GameClock.prototype.reset = function () {
    this.startTime = new Date();
};   

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player;
var bestTime = 0;
function buildAll() {
    console.log("got to buildAll");
    for (var i = 0;i < 4;i++) {
        var x = 0;
        var y = (83 * i) + 50;
        allEnemies.push(new Enemy(x,y));
    }
    player = new Player(0,382,101,83);
    pClock = new GameClock(120,30);
    bstClock = new GameClock(340,30);

    pClock.drawClock(0);
    bstClock.drawClock(0);
}


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

