const canvas = document.getElementById('jatek');
const ctx = canvas.getContext('2d');

let score = 0;

//labda program
let ball = {
    x:300,
    y:200,
    radius:8,
    dx: 4,
    dy: -4
};

//visszauto programja
let paddle = {
    width: 100,
    height: 10,
    x: 250,
    speed : 6,
    movingLeft: false,
    movingRight: false
};

//Bábúk(tégla) programja
const rows = 4;
const cols = 8;
const brickWidth = 60;
const brickHeight = 20;
const padding = 10;

let bricks = [];
for(let r = 0; r < rows; r++){
    bricks[r] = [];
    for(let c = 0; c < cols; c++){
        bricks[r][c] = { 
            x : c*(brickWidth + padding) + 30,
            y : r*(brickHeight + padding) + 30,
            visible: true
         };
    }
}

//iranyitas 
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
//rajzolás
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}
function drawBricks(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            if(bricks[r][c].visible){
                ctx.beginPath();
                ctx.rect(bricks[r][c].x, bricks[r][c].y, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//ütközés
function collisionDetection(){
    bricks.forEach(row => {
        row.forEach(brick => {
            if(brick.visible){
                if(ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight){
                    ball.dy *= -1;
                    brick.visible = false;
                    score++;
                    document.getElementById('score').textContent = `Pontszám: ${score}`;
                    if(score === rows * cols){
                        alert('Gratulálok! Nyertél!');
                        document.location.reload();
                    }
                }
            }
        });
    }
);
//frissítés
    function update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        collisionDetection();

        // labda mozgása
        ball.x += ball.dx;
        ball.y += ball.dy;

        // falakhoz való ütközés
        if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
            ball.dx *= -1;
        }
        if(ball.y - ball.radius < 0){
            ball.dy *= -1;
        }

        //uto ütközés
        if(ball.y + ball.radius > canvas.height - paddle.height - 10 && ball.x > paddle.x && ball.x < paddle.x + paddle.width){
            ball.dy *= -1;
        }
        //lefele esés
        if(ball.y + ball.radius > canvas.height){
            alert('Game Over! Próbáld újra!');
            document.location.reload();
        }
        //visszauto mozgása
        if(paddle.movingLeft && paddle.x > 0){
            paddle.x -= paddle.speed;
        }
        if(paddle.movingRight && paddle.x + paddle.width < canvas.width){
            paddle.x += paddle.speed;
        }
        requestAnimationFrame(update);
    }
}
update();

