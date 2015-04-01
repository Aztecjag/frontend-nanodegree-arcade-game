/* Create a new object to use as base for
 * all objects which we'll be putting on our
 * canvas. Every object has, at minimum,
 * a position, an image, and a render function which
 * should not differ between different types (player, enemy, any pickups/blockers, etc.) 
 */ 
var Resources;
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
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};

// Enemies our player must avoid
var Enemy = function(x,y) {
    this.base = CanvasItem;
    this.base(x,y,'images/enemy-bug.png');
    this.velocity = Math.floor(Math.random()*(121)+100);// This makes enemy speed random. 
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if ( this.x <= ctx.canvas.width) {
        this.x += this.velocity*dt;
    } else {
        this.x = -this.width;
    }
    if (checkCollision(player,this)) {
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
var animate;
var Player = function(x,y,xStep,yStep) {
    this.base = CanvasItem;
    this.base(x,y,'images/char-boy.png');
    
    this.xStep = xStep || 0;//Number of pixels to move per keystroke in both x and y directions.
    this.yStep = yStep || 0;
    
    // One timer will track the total time per round and the other timer will track the best time.
    this.startTime = new Date();
    this.timer = this.startTime;
    this.totalTime = null;
    console.log("Start time: " + this.timer);
};

Player.prototype.reset = function(checkTime) {// This sends the player back to the beginning and updates the best time when the player reaches the top. 
    this.totalTime = this.timer - this.startTime;// It also resets the timer in milliseconds.
    this.startTime = new Date();
    this.timer = this.startTime;
    if (!checkTime) {
        this.x = this.xInit;
        this.y = this.yInit;
        pClock.reset();
        console.log("Restarting");
    } else {
        if (bestTime === 0 || this.totalTime < bestTime) bestTime = this.totalTime;
        bstClock.drawClock(bestTime);
        console.log("You won! Total time: " + formatTimeString(this.totalTime) + " - Best Time: " + formatTimeString(bestTime));    
    }
    
};
Player.prototype.update = function() {
    /* this is called every time main is called in engine.js.
     * simply update the timer to the new system time.
     * When game ends, start time will be subtracted from this.timer value
     */
    if (this.y - this.yStep <= 0) {// Player wins!
        animate=false;// Global variable set in engine.js to control animation
        this.reset(true);
    }
    this.timer = new Date();
};
Player.prototype.handleInput = function(kc) {
    switch (true) {
        case (kc === 'up'):
            if (this.y - this.yStep > 0) this.y -= this.yStep;//y = 0 is top
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

/* -------------------------------------------
 * a "GameClock" is a CanvasItem that can be implemented
 * to display a timer at any given x/y coordinate. * 
 -------------------------------------------- */
var GameClock = function(x,y,lbl) {
    this.base = CanvasItem;
    this.base(x,y);
    this.startTime = new Date();
    this.lbl = lbl || "";
};
GameClock.prototype.drawClock = function (ms) {// ms is number of milliseconds. Clock will display in 00:00 format
    ctx.font = this.y + "px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, 0, 80,this.y + 10);
    ctx.fillStyle = "#000000";
    ctx.fillText(formatTimeString(ms),this.x,this.y);
};
GameClock.prototype.reset = function () {
    this.startTime = new Date();
};
// Game clock ends


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player;
var ctx;
var pClock;
var bstClock;
var bestTime = 0;// this is time in milliseconds
function buildAll() {
    console.log("got to buildAll");
    for (var i = 0;i < 4;i++) {
        var x = 0;
        var y = (83 * i) + 50;// 50 and 83 values the same as used in engine.js to position game blocks
        allEnemies.push(new Enemy(x,y));
    }
    player = new Player(0,382,101,83);// 101 is width of all blocks, 83 is defined in engine.js as the default y step size when adding the blocks.
    
    pClock = new GameClock(120,30);// This clock shows the current time.
    bstClock = new GameClock(340,30);// This clock shows the best time.
    
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

// Listen for clicks on "New Game" button, call "reset" in engine.js
var reset;
window.onload = function () {
    document.getElementById("newGame").addEventListener("click", function() {
        console.log("New Game selected");
        reset();// game reset in engine.js
    },false);

};

// Allows the user to change the player 
var changeChar = function() {
    console.log("Player selected: " + this.value);
    player.sprite="images/" + this.value;
    this.blur();
    player.render();// redraws player
};

var radios = document.getElementsByName('gameChar');

for(var i = radios.length; i--; ) {
    radios[i].onclick = changeChar;
}
// Player change ends


function checkCollision(pl,en) {
    return !( en.x > (pl.x + pl.width - 20) || 
            (en.x + en.width) <  (pl.x + 20) || 
             en.y != pl.y);
}

function formatTimeString(thisTime) {
    // see http://stackoverflow.com/questions/5588465/javascript-parse-time-minutesseconds-from-miliseconds
    var thisMins = Math.round((thisTime/1000/60) << 0);
    var thisSecs = Math.round((thisTime/1000) % 60);
    
    if (thisMins < 10) thisMins = "0" + thisMins.toString(); 
    if (thisSecs < 10) thisSecs = "0" + thisSecs.toString();
    
    return (thisMins + ":" + thisSecs);
}
