let gameStarted = false;
let gameOver = false;
let player;
let fallingObjects = [];
let score = 0;
let highScore = 0; // Track the highest score
let speedMultiplier = 1; // Initial speed multiplier
let spawnRate = 40; // Initial spawn rate

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  noLoop();

  player = new Player(width / 2, height - 60, 50);
}

function draw() {
  if (gameOver) {
    displayGameOver();
    return;
  }

  if (gameStarted) {
    background(30);

    // Display score
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);

    // Update player
    player.update();
    player.show();

    // Spawn falling objects
    if (frameCount % Math.round(spawnRate / speedMultiplier) === 0) {
      spawnFallingObject();
    }

    // Update falling objects
    for (let obj of fallingObjects) {
      obj.update();
      obj.show();

      if (obj.hits(player)) {
        gameOver = true;
      }
    }

    // Remove off-screen objects
    fallingObjects = fallingObjects.filter(obj => !obj.offScreen());

    // Update score and difficulty
    score++;
    if (score % 10 === 0) {
      speedMultiplier += 0.02; // Gradual increase in object speed
      spawnRate = max(spawnRate - 2, 20); // Gradual decrease in spawn rate
    }
  }
}

function spawnFallingObject() {
  let size = random(20, 40);
  let type = random() < 0.4 ? "tracking" : "normal"; // 40% chance of tracking
  fallingObjects.push(new FallingObject(random(width), -size, size, type));
}

// Display game over screen
function displayGameOver() {
  noLoop();

  // Update the high score if the current score is greater
  if (score > highScore) {
    highScore = score;
  }

  // Update the score and high score in the restart menu
  document.getElementById("final-score").innerText = `Your Score: ${score}`;
  document.getElementById("high-score").innerText = `High Score: ${highScore}`;

  document.getElementById("restart-menu").style.display = "";
  document.getElementById("game-menu").style.display = "none";
}

// Start game
document.getElementById("start-game").addEventListener("click", () => {
  document.getElementById("game-menu").style.display = "none";
  document.getElementById("restart-menu").style.display = "none";
  gameStarted = true;
  loop();
});

// Restart game
document.getElementById("restart-game").addEventListener("click", () => {
  document.getElementById("restart-menu").style.display = "none";
  resetGame();
});

// Reset game
function resetGame() {
  gameStarted = true;
  gameOver = false;
  fallingObjects = [];
  player = new Player(width / 2, height - 60, 50);
  score = 0;
  speedMultiplier = 1;
  spawnRate = 40;
  loop();
}

// Player class
class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseSpeed = 10; // Player's movement speed
  }

  update() {
    let speed = this.baseSpeed;

    if (keyIsDown(LEFT_ARROW)) {
      this.x -= speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += speed;
    }
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }

  show() {
    fill(0, 0, 255);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }
}

// Falling object class
class FallingObject {
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.speed = random(3, 6); // Falling speed range
  }

  update() {
    this.y += this.speed * speedMultiplier;

    // Tracking behavior
    if (this.type === "tracking") {
      this.x += constrain(player.x - this.x, -2, 2);
    }
  }

  show() {
    fill(this.type === "tracking" ? [255, 255, 0] : [255, 0, 0]);
    ellipse(this.x, this.y, this.size);
  }

  offScreen() {
    return this.y > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.size / 2;
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
