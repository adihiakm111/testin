const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menu = document.getElementById("menu");
const restartMenu = document.getElementById("restartMenu");
const finalScore = document.getElementById("finalScore");

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.6;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Load images
const dinoImg = new Image();
dinoImg.src = "dino.png";

const cactusImg = new Image();
cactusImg.src = "cactus.png";

// Game variables
let dino, ground, cactus, score, gameOver, speedIncrease, gameStarted;

// Reset everything
function initGame() {
  dino = {
    x: 50,
    y: 0,
    width: 60,
    height: 60,
    vy: 0,
    gravity: 1.3,
    jumpPower: -20,
    grounded: false,
    crouching: false,
  };
  ground = { y: canvas.height - 100, height: 100 };
  cactus = { x: canvas.width, y: ground.y - 50, width: 50, height: 50, speed: 6 };
  score = 0;
  gameOver = false;
  speedIncrease = 0.002;
  gameStarted = true;
  canvas.style.display = "block";
  menu.style.display = "none";
  restartMenu.style.display = "none";
}

// Movement functions
function jump() {
  if (dino.grounded && !dino.crouching) {
    dino.vy = dino.jumpPower;
    dino.grounded = false;
  }
}

function crouch(start) {
  dino.crouching = start;
  dino.height = start ? 35 : 60;
}

// Game update
function update() {
  if (!gameStarted || gameOver) return;

  cactus.speed += speedIncrease / 100;

  // Gravity
  dino.vy += dino.gravity;
  dino.y += dino.vy;

  // Ground collision
  if (dino.y + dino.height >= ground.y) {
    dino.y = ground.y - dino.height;
    dino.vy = 0;
    dino.grounded = true;
  }

  // Move cactus
  cactus.x -= cactus.speed;
  if (cactus.x + cactus.width < 0) {
    cactus.x = canvas.width + Math.random() * 200;
    score++;
    // Slightly increase difficulty
    cactus.speed += 0.15;
  }

  // Collision
  if (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height &&
    dino.y + dino.height > cactus.y
  ) {
    gameOver = true;
    setTimeout(() => showRestart(), 600);
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#6d4c41";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);

  // Cactus
  if (cactusImg.complete) {
    ctx.drawImage(cactusImg, cactus.x, cactus.y, cactus.width, cactus.height);
  }

  // Dino
  if (dinoImg.complete) {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  }

  // Score
  ctx.fillStyle = "#222";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

// Restart menu
function showRestart() {
  canvas.style.display = "none";
  restartMenu.style.display = "block";
  finalScore.textContent = "Your Score: " + score;
}

// Event listeners
startBtn.addEventListener("click", () => {
  initGame();
  gameLoop();
});

restartBtn.addEventListener("click", () => {
  initGame();
  gameLoop();
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) jump();
  if (e.button === 2) {
    e.preventDefault();
    crouch(true);
    setTimeout(() => crouch(false), 400);
  }
});
window.addEventListener("contextmenu", e => e.preventDefault());

// Mobile Controls
let lastTap = 0;
canvas.addEventListener("touchstart", e => {
  const currentTime = new Date().getTime();
  const tapGap = currentTime - lastTap;

  if (tapGap < 300 && tapGap > 0) {
    crouch(true);
    setTimeout(() => crouch(false), 400);
  } else {
    jump();
  }
  lastTap = currentTime;
});
