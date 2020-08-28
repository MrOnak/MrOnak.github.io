var canvasWidth;
var canvasHeight;
var softness = 3;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB, 360, 100, 100, 100);

  smooth();
  rectMode(CORNERS);
  ellipseMode(RADIUS);

  noLoop();
}

function draw() {
  background(worldConf.backgroundColHSB.h, worldConf.backgroundColHSB.s, worldConf.backgroundColHSB.b, worldConf.backgroundColHSB.a);

  drawEvergreenForest(random(new Date().getTime()), [[100, 100], [500, 50], [700, 150], [600, 300], [400, 550], [300, 600], [350, 400], [150, 250]]);
  // deciduous forest with a "hole" in the polygon
  drawDeciduousForest(random(new Date().getTime()), [[620, 300], [720, 150], [900, 200], [950, 450], [800, 500], [750, 350], [850, 350], [800, 250], [750, 350], [800, 500], [500, 450]]);
  drawSwamp(random(new Date().getTime()), [[70, 250], [140, 250], [250, 400], [150, 450], [50, 400]]);
  drawLake(random(new Date().getTime()), [[500, 500], [530, 520], [550, 550], [550, 580], [530, 600], [450, 580], [460, 540]]);
  drawMountainRange(random(new Date().getTime()), [[600, 500], [700, 550], [750, 700], [730, 750], [650, 830], [620, 750], [500, 650], [570, 600]]);
  drawCity(random(new Date().getTime()), [[50, 500], [140, 530]]);

  //house(50, 700, 65, 730);
}

function mouseClicked() {
  draw();
}
