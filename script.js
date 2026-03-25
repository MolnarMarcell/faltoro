const canvas = document.getElementById('jatek');
const ctx = canvas.getContext('2d');

// ===== CANVAS MÉRET =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== SCORE =====
let score = 0;

// ===== LABDA =====
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 4,
    dy: -4
};

// ===== PADDLE =====
let paddle = {
    width: 120,
    height: 12,
    x: canvas.width / 2 - 60,
    speed: 8,
    movingLeft: false,
    movingRight: false
};

// ===== TÉGLÁK =====
const rows = 4;
const cols = 8;
const brickWidth = 80;
const brickHeight = 25;
const padding = 15;

let bricks = [];

function createBricks() {
    bricks = [];
    const totalWidth = cols * (brickWidth + padding) - padding;
    const startX = (canvas.width - totalWidth) / 2;
    const totalHeight = rows * (brickHeight + padding) - padding;
    const startY = 50; // fixed top margin
    for(let r = 0; r < rows; r++){
        bricks[r] = [];
        for(let c = 0; c < cols; c++){
            bricks[r][c] = { 
                x : startX + c*(brickWidth + padding),
                y : startY + r*(brickHeight + padding),
                visible: true
            };
        }
    }
}
createBricks();

// ===== IRÁNYÍTÁS =====
document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft'){
        paddle.movingLeft = true;
    }
    if(e.key === 'ArrowRight'){
        paddle.movingRight = true;
    }
});

document.addEventListener('keyup', function(e){
    if(e.key === 'ArrowLeft'){
        paddle.movingLeft = false;
    }
    if(e.key === 'ArrowRight'){
        paddle.movingRight = false;
    }
});

// ===== RAJZOLÁS =====
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = '#0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0ff';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    ctx.fillStyle = '#0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0ff';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawBricks(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            if(bricks[r][c].visible){
                ctx.beginPath();
                ctx.rect(bricks[r][c].x, bricks[r][c].y, brickWidth, brickHeight);
                ctx.fillStyle = '#ff00ff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff00ff';
                ctx.fill();
                ctx.closePath();
                ctx.shadowBlur = 0;
            }
        }
    }
}

// ===== ÜTKÖZÉS =====
function collisionDetection(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let brick = bricks[r][c];
            if(brick.visible){
                if(
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ){
                    ball.dy *= -1;
                    brick.visible = false;
                    score++;

                    document.getElementById('score').textContent = "Pont: " + score;

                    if(score === rows * cols){
                        alert('Gratulálok! Nyertél!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// ===== FRISSÍTÉS =====
function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();

    // labda mozgás
    ball.x += ball.dx;
    ball.y += ball.dy;

    // fal ütközés
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx *= -1;
    }

    if(ball.y - ball.radius < 0){
        ball.dy *= -1;
    }

    // paddle ütközés
    if(
        ball.y + ball.radius > canvas.height - paddle.height - 10 &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ){
        ball.dy = -Math.abs(ball.dy);

        // kis irányítás (realistább)
        let hitPoint = ball.x - (paddle.x + paddle.width / 2);
        ball.dx = hitPoint * 0.1;
    }

    // paddle mozgás
    if(paddle.movingLeft && paddle.x > 0){
        paddle.x -= paddle.speed;
    }
    if(paddle.movingRight && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.speed;
    }

    requestAnimationFrame(update);
}

update();

if (ball.y - ball.radius > canvas.height){
    alert('Vesztettél! Próbáld újra!');
    document.location.reload();
}

// ===== RESIZE FIX =====
window.addEventListener("resize", () => {
    resizeCanvas();

    paddle.x = canvas.width / 2 - paddle.width / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    createBricks();
});