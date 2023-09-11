let gameOverCard;
// Create a reference for the bird div
let bird;
// Create a reference for the game container
let gameContainer;
// Create a reference for the ground
let ground;
// Set the initial gap to normal
let gap = 500;

// Listen for when the page is completely loaded
document.addEventListener("DOMContentLoaded", () => {
    gameOverCard = document.querySelector(".game-over-card");
    gameOverCard.style.display = "none";
    // Get a reference to the bird div
    bird = document.querySelector(".bird");
    // Get a reference to the game container
    gameContainer = document.querySelector(".game-container");
    // Get a reference to the ground
    ground = document.querySelector(".ground-moving");
});

/**
 * Sets the difficulty of the game by setting the distance between the top and bottom obstacle
 * 
 * @param {*} difficulty 
 */
function setDifficulty(difficulty) {
    switch(difficulty) {
        case "easy":
            gap = 600;
            document.querySelector("#easy-btn").classList.add("difficulty-btn-selected");
            document.querySelector("#normal-btn").classList.remove("difficulty-btn-selected");
            document.querySelector("#hard-btn").classList.remove("difficulty-btn-selected");
            break;
        case "normal":
            gap = 500;
            document.querySelector("#easy-btn").classList.remove("difficulty-btn-selected");
            document.querySelector("#normal-btn").classList.add("difficulty-btn-selected");
            document.querySelector("#hard-btn").classList.remove("difficulty-btn-selected");
            break;
        case "hard":
            gap = 450;
            document.querySelector("#easy-btn").classList.remove("difficulty-btn-selected");
            document.querySelector("#normal-btn").classList.remove("difficulty-btn-selected");
            document.querySelector("#hard-btn").classList.add("difficulty-btn-selected");
            break;
    }
}

/**
 * Kicks off the game
 */
function startGame() {
    // Hide the start game button
    document.querySelector(".start-btn").style.display = "none";
    document.querySelector(".game-over-card").style.display = "none";
    let difficultyBtns = document.querySelectorAll(".difficulty-btn");
        difficultyBtns.forEach((btn) => {
            btn.style.display = "none";
        });

    // Set some variables we'll use
    let birdLeft = 220;
    let birdBottom = 100;
    let gravity = 3;
    let isGameOver = false;
    
    let obstaclesPassed = 0;
    let frontObstacleTimer = null;
    let rearObstacleTimer = null;

    /**
     * A function to update bird position from gravity
     */
    function applyGravity() {
        // Adjust the bird's position via gravity variable
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + "px";
        bird.style.left = birdLeft + "px";
    }

    // Create an interval to apply gravity
    let gameTimerId = setInterval(applyGravity, 20);

    /**
     *  Triggers a flap
     * @param {*} e
     */
    function control(e) {
        if (e.keyCode === 32) {
            flap();
        }
    }

    /**
     * Handles lifting the bird when it flaps its wings
     */
    function flap() {
        if (birdBottom < 500) {
            birdBottom += 50;
            bird.style.bottom = birdBottom + "px";
            // console.log(birdBottom);
        }
    }

    // Add the event listener
    document.addEventListener("keyup", control);

    /**
     *  Creates an obstacle
     */
    function generateObstacle() {
        // Define where the obstacle will start
        let obstacleLeft = 500;
        // Get a random height
        let randomHeight = Math.random() * 120;
        // Set the bottom of the obstacle with the random height
        let obstacleBottom = randomHeight;
        // Create the bottom obstacle
        const obstacle = document.createElement("div");
        // Create the top obstacle
        const topObstacle = document.createElement("div");
        // If the game is not over, style our obstacles
        if (!isGameOver) {
            obstacle.classList.add("obstacle");
            topObstacle.classList.add("topObstacle");
        }
        // Add the obstacles to the game container
        gameContainer.appendChild(obstacle);
        gameContainer.appendChild(topObstacle);

        // Position the obstacles
        obstacle.style.left = obstacleLeft + "px";
        topObstacle.style.left = obstacleLeft + "px";
        obstacle.style.bottom = obstacleBottom + "px";
        // Remember to add the gap for the top obstacle
        topObstacle.style.bottom = obstacleBottom + gap + "px";

        let obstacleCounted = false;

        /**
         * Move the obstacles
         */
        function moveObstacle() {
            // Move it 2 pixels to the left
            obstacleLeft -= 2;
            obstacle.style.left = obstacleLeft + "px";
            topObstacle.style.left = obstacleLeft + "px";

            // If the obstacle is off the screen
            if (obstacleLeft === -60) {
                clearInterval(timerId);
                gameContainer.removeChild(obstacle);
                gameContainer.removeChild(topObstacle);
            }
            // Check if the bird has hit the obstacles or the ground
            if ((
                    obstacleLeft > 200 &&
                    obstacleLeft < 280 &&
                    birdLeft === 220 &&
                    (birdBottom < obstacleBottom + 153 ||
                        birdBottom > obstacleBottom + gap - 200)) 
                    || birdBottom <= -5
            ) {
                if (!isGameOver) {
                    // Call for the game to end
                    gameOver();
                    // Stop the loop
                    clearInterval(timerId);
                }
            } 
            // If we've gone past to obstacle and haven't lost, add a point
            else if (obstacleLeft <= 200 && !isGameOver) {
                if (!obstacleCounted) {
                    obstaclesPassed++;
                    obstacleCounted = true;
                }
            }
        }

        // Create a loop to move the obstacles
        let timerId = setInterval(moveObstacle, 20);

        // Track references to the obstacles on screen
        if (rearObstacleTimer == null) {
            frontObstacleTimer = timerId;
            rearObstacleTimer = timerId;
        }
        else {
            frontObstacleTimer = rearObstacleTimer;
            rearObstacleTimer = timerId;
        }

        // If the game is not over...
        if (!isGameOver) {
            //  Generate an obstacle every 3 seconds
            setTimeout(generateObstacle, 3000);
        }
    }

    // Kick off generating the obstacles
    generateObstacle();

    /**
     * Execute logic for game over
     */
    function gameOver() {
        // Clear all timers
        clearInterval(gameTimerId);
        clearInterval(frontObstacleTimer);
        clearInterval(rearObstacleTimer);
        console.log("game over");
        console.log(obstaclesPassed);
        isGameOver = true;
        document.removeEventListener("keyup", control);
        ground.classList.add("ground");
        ground.classList.remove("ground-moving");
        document.querySelector("#score").innerHTML = obstaclesPassed;
        gameOverCard.style.display = "block";
        let difficultyBtns = document.querySelectorAll(".difficulty-btn");
        difficultyBtns.forEach((btn) => {
            btn.style.display = "inline-block";
        });
    }
}

function tryAgain() {
    // Reset the ground
    ground.classList.remove("ground");
    ground.classList.add("ground-moving");

    // Remove any obstacle divs
    let obstacles = document.querySelectorAll(".obstacle");
    let topObstacles = document.querySelectorAll(".topObstacle");
    obstacles.forEach((obstacle) => {
        gameContainer.removeChild(obstacle);
    });
    topObstacles.forEach((obstacle) => {
        gameContainer.removeChild(obstacle);
    });

    // Reset values
    obstaclesPassed = 0;
    frontObstacleTimer = null;
    rearObstacleTimer = null;

    startGame();
}


