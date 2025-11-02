const ball = document.getElementById("ball");
const container = document.getElementById("container");
const body = document.body;
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let position = 0;
let direction = null;
let speed = 3;
let animationId = null;

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `linear-gradient(135deg, hsl(${hue}, 70%, 80%), hsl(${(hue + 40) % 360}, 60%, 70%))`;
}

function changeBackground() {
  body.style.background = getRandomColor();
}

function updatePosition() {
  const containerWidth = container.clientWidth;
  const ballWidth = ball.offsetWidth;
  const maxPos = containerWidth - ballWidth;

  if (direction === "right") {
    position += speed;
    if (position > maxPos) {
      const overflow = position - maxPos;
      position = -ballWidth + overflow;
      changeBackground();
    }
  } else if (direction === "left") {
    position -= speed;
    if (position < -ballWidth) {
      const overflow = -position - ballWidth;
      position = maxPos - overflow;
      changeBackground();
    }
  }

  ball.style.left = position + "px";
  animationId = requestAnimationFrame(updatePosition);
}

function startMove(dir) {
  direction = dir;
  if (!animationId) updatePosition();
}

function stopMove() {
  cancelAnimationFrame(animationId);
  animationId = null;
}

rightBtn.addEventListener("mouseenter", () => startMove("right"));
rightBtn.addEventListener("mouseleave", stopMove);

leftBtn.addEventListener("mouseenter", () => startMove("left"));
leftBtn.addEventListener("mouseleave", stopMove);
