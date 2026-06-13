//====================================================
// RUNNER CON ESTADOS
//====================================================

let imgs = [];
let estadio;

let salto;
let logo;

let sonido;
//let musica;
let boo;

let estado = "juego";

// animación
let index = 0;
let lastChange = 0;
let interval = 80;

// personaje
let y = 270;

let velocity = 0;

let gravity = 0.7;

let jumpForce = -12;

let ground = 270;

let isJumping = false;

// obstáculo
let obsX = 750;
let obsY = 365;

let legW = 10;
let legH = 75;

let topW = 40;
let topH = 10;

let obsSpeed = 6;

// marcador
let score = 0;

let highScore = 0;

let newobs = 1;

//====================================================
function preload() {

  for (let i = 0; i <= 15; i++) {

    imgs[i] = loadImage(`assets/${i}.png`);
  }

  estadio = loadImage(`assets/estadio_.png`);
  logo = loadImage(`assets/logo.png`);
  salto = loadImage(`assets/salto.png`);
  sonido = loadSound(`assets/estadio.mp3`);
  boo = loadSound(`assets/boo.mp3`);
  //musica = loadSound(`assets/sunny.mp3`);
}

//====================================================
function setup() {

  createCanvas(720, 480);

  textFont("Arial");

  userStartAudio();

  // música fondo
  //musica.setLoop(true);

  //musica.play();
}

//====================================================
function draw() {

  dibujaEscenario();

  if (estado == "juego") {

    actualizaJuego();

    revisaColision();
  }

  if (estado == "gameover") {

    pantallaGameOver();
  }
}

//====================================================
function dibujaEscenario() {

  background(130, 206, 250);
  image(estadio, 0, 30);
  image(logo, 30, 322);
  image(logo, 280, 322);
  image(logo, 530, 322);

  noStroke();

  //================================================
  // piso
  //================================================

  fill(170, 40, 30);

  rect(0, 380, 720, 100);

  fill(255);

  rect(0, 400, 720, 4);

  rect(0, 450, 720, 4);

  //================================================
  // personaje
  //================================================

  if (isJumping) {

    image(salto, 50, y);

  } else {

    image(imgs[index], 50, y);
  }

  //================================================
  // obstáculo
  //================================================

  fill(30, 30, 120);

  rect(obsX, obsY, legW, legH);

  rect(
    obsX,
    obsY + legH - 5,
    topW,
    topH
  );

  //================================================
  // marcador
  //================================================

  fill(220, 0, 0);

  rect(520, 305, 100, 70);

  fill(0);

  rect(530, 315, 80, 40);

  // score
  fill(0, 255, 0);

  textSize(30);

  textAlign(CENTER, CENTER);

  text(score, 570, 335);

  // récord
  //fill(255);
  //textSize(18);
  //text("RECORD", 570, 285);
  //fill(255, 220, 0);
  //text(highScore, 570, 300);


  // restaurar alignment
  textAlign(LEFT, BASELINE);
}

//====================================================
function actualizaJuego() {

  //================================================
  // física
  //================================================

  velocity += gravity;

  y += velocity;

  if (y >= ground) {

    y = ground;

    velocity = 0;

    isJumping = false;
  }

  //================================================
  // animación
  //================================================

  if (!isJumping) {

    if (millis() - lastChange > interval) {

      index = (index + 1) % 8;

      lastChange = millis();
    }
  }

  //================================================
  // movimiento obstáculo
  //================================================

  obsX -= obsSpeed;

  //================================================
  // score
  //================================================

  if (obsX < 50 && newobs == 1) {

    score++;

    newobs = 0;
  }

  //================================================
  // reset obstáculo
  //================================================

  if (obsX < -topW) {

    obsX = width + random(100, 300);

    newobs = 1;
  }
}

//====================================================
function revisaColision() {

  let px = 130;

  let py = y + 30;

  let pw = 55;

  let ph = 100;

  let hit =

    collideRect(
      px, py, pw, ph,
      obsX, obsY, legW, legH
    ) ||

    collideRect(
      px, py, pw, ph,
      obsX,
      obsY + legH,
      topW,
      topH
    );

  if (hit) {

    // actualizar récord
    if (score > highScore) {

      highScore = score;
    }

    // sonido game over
    sonido.stop();
    boo.play();
    sonido.play();
    estado = "gameover";
  }
}

//====================================================
function pantallaGameOver() {

  fill(0, 0, 0, 180);

  rect(0, 0, width, height);

  fill(255);

  textAlign(CENTER, CENTER);

  textSize(70);

  text("GAME OVER", width / 2, 140);

  //================================================
  // score final
  //================================================

  textSize(30);

  text(
    "PUNTAJE: " + score,
    width / 2,
    210
  );

  text(
    "RÉCORD: " + highScore,
    width / 2,
    250
  );

  //================================================
  // botón
  //================================================

  fill(0, 200, 0);

  rect(260, 320, 200, 60, 10);

  fill(0);

  textSize(24);

  text(
    "Jugar de nuevo",
    360,
    350
  );

  // restaurar alignment
  textAlign(LEFT, BASELINE);
}

//====================================================
//function mousePressed() {
//
//  if (estado == "gameover") {
//
//    if (
//      mouseX > 260 &&
//      mouseX < 460 &&
//      mouseY > 320 &&
//      mouseY < 380
//    ) {
//
//      boo.stop();
//      reiniciaJuego();
//    }
//  }
//}

function mousePressed() {

  if (estado == "gameover") {

    if (
      mouseX > 260 &&
      mouseX < 460 &&
      mouseY > 320 &&
      mouseY < 380
    ) {

      boo.stop();
      reiniciaJuego();
    }

  } else {

    saltar();
  }
}



//====================================================
//function keyPressed() {
//
//  if (
//    estado == "juego" &&
//    keyCode === UP_ARROW &&
//    !isJumping
//  ) {
//
//    velocity = jumpForce;
//
//    isJumping = true;
//  }
//}


function keyPressed() {

  if (keyCode === UP_ARROW) {

    saltar();
  }
}




//====================================================
function reiniciaJuego() {

  estado = "juego";

  // personaje
  y = ground;

  velocity = 0;

  isJumping = false;

  // obstáculo
  obsX = width + random(100, 300);

  // marcador
  score = 0;

  newobs = 1;

  // animación
  index = 0;
}

//====================================================
function collideRect(
  x1, y1, w1, h1,
  x2, y2, w2, h2
) {

  return (

    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}



function saltar() {

  if (
    estado == "juego" &&
    !isJumping
  ) {

    velocity = jumpForce;
    isJumping = true;
  }
}

//====================================================
function touchStarted() {

  saltar();

  return false;
}