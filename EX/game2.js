let cv = document.getElementById("game2");
let draw = cv.getContext("2d");
// . located . //
let X = cv.width / (Math.floor(Math.random() * Math.random() * 10) + 3);
let Y = cv.height - 35;
// move move move //
let movex = 10; //px//
let movey = -10; //px//
let widthpaddle = 132;
let heightpaddle = 15;
let xpaddle = (cv.width - widthpaddle) / 2;
let ypaddle = cv.height - heightpaddle; //****************** ??
// Draw Paddle //
function drawpaddle() {
  draw.beginPath();
  draw.roundRect(xpaddle, ypaddle, widthpaddle, heightpaddle, 30);
  draw.fillStyle = "#333"; // #333
  draw.fill();
  draw.closePath();
}
// Draw ball //
let radius = 9;
function drawBall() {
  const gradient = draw.createLinearGradient(X - radius, Y, X + radius, Y);
  // Thêm các điểm màu
  // gradient.addColorStop(0, "red"); // Màu bắt đầu
  // gradient.addColorStop(0.5, "yellow"); // Màu giữa
  // gradient.addColorStop(1, "blue"); // Màu kết thúc
  // gradient; //#333
  draw.beginPath();
  draw.arc(X, Y, radius, 0, Math.PI * 2);
  draw.fillStyle = "#333";
  draw.fill();
  draw.closePath();
}
// Bricks //
let rowCount = 5,
  brickWidth = 54,
  brickHeight = 18,
  brickPadding = 12,
  topOffset = 40,
  columnCount = 14,
  leftOffset = 20,
  score = 0;
// Bricks Array //
let bricks = [];
for (let c = 0; c < columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
// Draw Bricks //
function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + leftOffset;
        let brickY = r * (brickHeight + brickPadding) + topOffset;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        draw.beginPath();
        draw.roundRect(brickX, brickY, brickWidth, brickHeight, 0);
        draw.fillStyle = "#333";
        draw.fill();
        draw.closePath();
      }
    }
  }
}
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
  var relativeX = e.clientX - cv.offsetLeft;
  if (relativeX > 66 && relativeX < cv.width - 66) {
    //paddle left right //
    xpaddle = relativeX - widthpaddle / 2;
  }
}
// check ball hit bricks //
function hitDetection() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          X > b.x &&
          X < b.x + brickWidth &&
          Y > b.y &&
          Y < b.y + brickHeight
        ) {
          movey = -movey;
          b.status = 0;
          score++;
          if (score === columnCount * rowCount) {
            alert("You Win");
            document.location.reload();
          }
        }
      }
    }
  }
}
// Track score //
function trackScore() {
  draw.font = "bold 16px sans-serif";
  draw.fillStyle = "#333";
  draw.fillText("Score:" + score, 8, 24); // Score //
}
// Main //
function init() {
  draw.clearRect(0, 0, cv.width, cv.height);
  drawpaddle();
  drawBricks();
  drawBall();
  hitDetection();
  trackScore();
  if (X + movex > cv.width - radius || X + movex < radius) {
    movex = -movex;
  }
  if (Y + movey < radius) {
    movey = -movey;
  } else if (Y + movey + 15 > cv.height - radius) {
    if (X > xpaddle && X < xpaddle + widthpaddle) {
      movey = -movey;
    } else if (Y + movey > cv.height - radius ) {
      alert("Game Over");
      document.location.reload();
    }
  }
  if (Y + movey > cv.height - radius || Y + movey < radius) {
    movey = -movey;
  }
  X += movex;
  Y += movey;
}
setInterval(init, 20);