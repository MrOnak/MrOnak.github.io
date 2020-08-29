var rows = 33;
var cols = 26;

var mouseIsOver = false;
var paused = false;

var mousePos = {x: 0, y: 0};
DrawConstants dc;

Character[][] objects = new Character[rows][cols];

void setup() {
  createCanvas(800, 1000);
  colorMode(HSB, 360, 100, 100, 1.0);
  rectMode(RADIUS);

  dc = DrawConstants.getInstance();

  // predefine rotations and offsets
  for (int y = 0; y < rows; y++) {
    for (int x = 0; x < cols; x++) {
      objects[y][x] = new Character(
        random(0, HALF_PI),
        new PVector(random(0, 1), random(0, 1)),
        (int) random(0, 360),
        100
      );
    }
  }
}

void draw() {
  float xDistance;
  float yDistance;
  float mDistance = 0; // mouse position related distance
  PVector posVec = new PVector();
  PVector offset = new PVector();
  PVector xRef = new PVector();
  PVector yRef = new PVector();

  if (!paused) {
    clear();
    background(1, 0, 100, 1.0);

    fill(0, 0, 0, 0.0);

    for (int y = 0; y < rows; y++) {
      for (int x = 0; x < cols; x++) {
        posVec.set(15 + 30 * x, 15 + 30 * y);
        xRef.set(0, posVec.y);
        yRef.set(posVec.x, 0);

        if (mouseIsOver) {
          mDistance = min(200, PVector.dist(posVec, mousePos)) / 200;
          mDistance = 1 - mDistance * mDistance;
        }
        xDistance = PVector.dist(xRef, posVec);
        yDistance = PVector.dist(posVec, yRef);

        offset = objects[y][x].getRelativeOffset(yDistance / 500 + mDistance);

        pushMatrix();

        translate(25 + x * 30 + offset.x * 10, 15 + y * 30 + offset.y * 10);

        // convert vertical distance to radiance
        yDistance = (yDistance / 1000);
        //yDistance = yDistance * yDistance * yDistance;

        rotate(objects[y][x].getRelativeRotation(yDistance + mDistance));
        scale(1 + mDistance * 0.1);

        rect(0, 0, 10, 10);

        popMatrix();
      }
    }
  }
}


void mouseMoved() {
  mousePos.x =  (mouseX / dc.getZoomFactor()) - dc.getOffsetX();
  mousePos.y =  (mouseY / dc.getZoomFactor()) - dc.getOffsetY();
}

void mouseEntered() {
  mouseIsOver = true;
}

void mouseExited() {
  mouseIsOver = false;
}

void keyReleased() {
  switch (key) {
    case 'p':
      paused = !paused;
      break;
  }
}
