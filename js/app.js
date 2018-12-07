//We don't use the todate's date, however we create a past date,
//which allows to set the time (Minutes and Seconds) to zeors.
let startDate = new Date('2014-01-01 00:00:00');

//these sets the timer, gameStarted and levels to their initial value
let timerFunction;
let gameStarted = false;
let levels = "";

//This is the "Timer" which display the time of every one second.
function startTimer() {

    //Add one seconds to the Date.
    startDate.setSeconds(startDate.getSeconds() + 1);

    secTime = Math.floor(startDate / 1000) % 60;
    minTime = startDate.getMinutes();

    //Display the time
    document.querySelector("#startTimer").innerHTML = "Time " + (minTime < 10 ? "0" + minTime : minTime) + ":" + (secTime < 10 ? "0" + secTime : secTime);
}

//Stop the timer , this occurs when restart is clicked or when we finish the game.
function stopTimer() {
    //Reset the date to the begin Date.
    startDate = new Date('2014-01-01 00:00:00');
    clearTimeout(timerFunction);
}

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.startPos = 101;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (!gameStarted) {return;}

    if (this.x < this.startPos * 5) {
        this.x += this.speed * dt;
    }
    else {
        this.x = this.startPos * -1;
    }
    
    //console.log(this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
    this.centerYdiff = 15;
    this.moveX = 101;
    this.moveY = 83;
    this.x = 2 * this.moveX;
    this.y = 5 * this.moveY;
    this.keyTyped = '';
    this.sprite = 'images/char-boy.png';
}

// Update the player's position, required method for game
// These Player "update" funtion is used for collision detection. 
Player.prototype.update = function() {
    for (enemy of allEnemies){        
        if (this.y === enemy.y && (enemy.x + enemy.startPos/2 > this.x && enemy.x < this.x  + this.moveX/2)) {
               resetGame();                
        }
    }
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);   
};

//This "handleInput" function is used to detect the "UP, DOWN, LEFT ,RIGHT" keys and it is 
//used to contorl the Player movement. This method is used the Proxy mechanism to detect
//the keyboard keys. 
Player.prototype.handleInput = function(keyTyped) {

    const handler = {
        set(target, prop, value, receiver) {

          if (!gameStarted) {return false;}  
          
          if (value === 'up') {                                      
              if ((target['y'] + target['centerYdiff']) >= target['moveY']) {                  
                    target['y'] -= target['moveY'];
              }
              
              if ((target['y'] + target['centerYdiff']) < target['moveY']) { 
                winModal();
              }              
          }
          else if (value === 'down') {
                if ((target['y'] + target['moveY']) <= (target['moveY'] * 5) - target['centerYdiff']) {
                        target['y'] += target['moveY'];
                }
          }
          else if (value === 'left') {
            if (target['x'] >= target['moveX']) {
                target['x']  -= target['moveX'];
            }
          }
          else if (value === 'right') {
            if (target['x'] < target['moveX'] * 4) {
                target['x']  += target['moveX'];
            }
          }          
          return true;       
        }
      };

    const proxy = new Proxy(this, handler);
    proxy.keyTyped = keyTyped;          
}

//This is the starting function of the Game.
function startGame() {
    //Call the timer function which jumps at every one second.
    timerFunction = setInterval(startTimer, 1000);
    gameSetUp();
    document.querySelector('#start').remove();
    document.querySelector('#article-start').innerHTML = '<i id="start" class="fas fa-play game-start"></i><label for="start"> Start</label>';
    document.querySelector('#restart').remove();
    document.querySelector('#article-icons-restart').innerHTML = '<i id="restart" onclick="restartGame();" class="fas fa-redo replay"></i><label for="restart"> Restart</label>';    

    //This variable defines when the game is "pause" or "start".
    gameStarted = true;
}

//This function restart the Game, which initailsize all the variable and options to their initial values.
function restartGame() {
    stopTimer()
    resetGame();
    document.querySelector("#startTimer").innerHTML = "Time 00:00";
    document.querySelector('#start').remove();
    document.querySelector('#article-start').innerHTML = '<i id="start" onclick="startGame();" class="fas fa-play game-not-start"></i><label for="start"> Start</label>';
    document.querySelector('#restart').remove();
    document.querySelector('#article-icons-restart').innerHTML = '<i id="restart" class="fas fa-redo replay"></i><label for="restart"> Restart</label>';
    gameStarted = false;
}

//This function stop the timer.
function stopTimer() {
    //Reset the date to the begin Date.
    startDate = new Date('2014-01-01 00:00:00');
    clearTimeout(timerFunction);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [];

// Place the player object in a variable called player
const player = new Player();

//This fuctions setup the game. All the options speed, no of bugs, threshold , axes (x,y) are defined here.
//For more detail instruction please refer the README.md File.
function gameSetUp() {

    let noOfBugs;
    let firstRow = 83;
    let secondRow = firstRow * 2;
    let thirdRow = firstRow * 3;
    let yaxes;
    let treshold;
    let speedMax = 400;
    let speedMin = 100;
    allEnemies = [];

    player.moveX = 101;
    player.moveY = 83;
    player.x = 2 * player.moveX;
    player.y = (5 * player.moveY) - player.centerYdiff;

    // ************************************************************
    // *   Please note this part is where you can modify the
    // *   variables for each level.
    // *
    // *   For detail instruction on how to modify. Please refer
    // *   to the README.md file.
    // ************************************************************

    if (document.querySelector("#easy").checked) {
        levels = "Easy";
        noOfBugs = 4;
        treshold = 4;
        speedMax = 600;
        speedMin = 400;
        yaxes = [firstRow, firstRow, thirdRow, secondRow];
    }
    else if(document.querySelector("#medium").checked){
        levels = "Medium";
        noOfBugs = 6;
        treshold = 6;
        speedMax = 500;
        speedMin = 450;
        yaxes = [firstRow, secondRow, thirdRow, firstRow, firstRow, thirdRow];
    }
    else if(document.querySelector("#hard").checked){
        levels = "Hard";
        noOfBugs = 7;
        treshold = 6;
        speedMax = 550;
        speedMin = 400;
        yaxes = [firstRow, secondRow, thirdRow, firstRow, thirdRow, firstRow];
    }
    
    
    let xmax = -101;
    let xmin = xmax * treshold;

    let xaxes = 0;
    let speed = 0;    
    for (let i = 0; i < noOfBugs; i++) {
        xaxes = Math.floor(Math.random() * (xmax - xmin) + xmin);
        speed = Math.floor(Math.random() * (speedMax - speedMin) + speedMin);
        allEnemies[i] = new Enemy(xaxes, yaxes[i] - player.centerYdiff, speed);
    }  
}


/* This function does nothing but it could have been a good place to
    * handle game reset states - maybe a new game menu or a game over screen
    * those sorts of things. It's only called once by the init() method.
    */
function resetGame() {
    lastTime = Date.now();
    gameSetUp();       
}

// The function winModal() is to display the Modal when you win the Game
function winModal() {    
    let modal = document.querySelector("#modal");
    let modalOverlay = document.querySelector("#modal-overlay");
    let modalContent = document.querySelector("#modal-content");

    stopTimer();
    gameStarted = false;

    // The DOM classList() "remove()"" function is to remove the "close" class
    // which is defined in the main.css file, "opened" class will be
    // added to the "modal" and the "modal-overlay" span class.
    // It actually acts as a toggle method.

    modal.classList.remove("closed");
    modalOverlay.classList.remove("closed");
    modal.classList.add("opened");
    modalOverlay.classList.add("opened");
    
    const requiredTime = "Time required " + (minTime < 10 ? "0" + minTime : minTime) + ":" + (secTime < 10 ? "0" + secTime : secTime);
    //This is the Modal Content, we use the Template Literals to generate the content
    modalContent.innerHTML = `<p class="modalHeading">Congratualations! You Won!</p><p class="p3"><button onclick="winModal();" class="modal-close-button" id="close-button">Restart</button></p>`;
    modalContent.innerHTML = `<p class="modalHeading">Congratualations! You Won!</p><p class="p1">Level: ${levels}</p><p class="p2">${requiredTime}</p><p class="p3"><button onclick="winModal();" class="modal-close-button" id="close-button">Restart</button></p>`;

    let closeButton = document.querySelector("#close-button");


    closeButton.addEventListener("click", function() {
        modal.classList.remove("opened");
        modalOverlay.classList.remove("opened");
        modal.classList.add("closed");
        modalOverlay.classList.add("closed");
        restartGame();
    });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});