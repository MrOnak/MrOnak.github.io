var doDebug = false;
var scaleFactor = 1;
var delay = 50;

var glyphsPerRow;
var glyphsPerCol;
var nodeStep = 20;
var glyphGap  = 30;
var glyphStep = 3 * nodeStep + glyphGap;
var glyphCoords = {
  x: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
  y: [-1, -1, -1, 0, 0, 0, 1, 1, 1]
};
/**
 * first parameter is the decoration 'id', after that:
 * E = ellipse
 * R = rectangle
 *     parameters:
 *       width
 *       height
 *       stroke color
 *       stroke weight
 *       fill/nofill (1,0)
 *       fill color
 * L = line
 *     parameters:
 *       x1 relative offset
 *       y1 relative offset
 *       x2 relative offset
 *       y2 relative offset
 *       stroke color
 *       stroke weight
 * B = bezier curve
 *     parameters:
 *       x1 first anchor point relative offset
 *       y1 first anchor point relative offset
 *       c1x first control point relative offset
 *       c1y first control point relative offset
 *       c2x second control point relative offset
 *       c2y second control point relative offset
 *       x2 second anchor point relative offset
 *       y2 second anchor point relative offset
 *       stroke coloe
 *       stroke weight
 */
var glyphDecorations = [
  ['A', 'E', 10, 10, 0x00, 2, false, 0x00],
  ['B', 'E',  5,  5, 0x00, 0.5, true, 0x00],
  ['C', 'R', 10, 10, 0x00, 2, false, 0x00],
  ['D', 'R', 5, 5, 0x00, 2, true, 0x00],
  ['E', 'R', 5, 5, 0x00, 2, false, 0x00],
  ['F', 'R', 5, 5, 0x00, 1, true, 0x00],
  ['G', 'L', -5, 0, 5, 0, 0x00, 2],
  ['H', 'L', 0, -5, 0, 5, 0x00, 2],
  ['I', 'E', 5, 5, 0x00, 0.5, false, 0x00],
  ['J', 'B', 0, 0, 10, 0, -10, 0, 20, 20, 0x00, 2],
  ['K', 'B', 0, 0, 20, 0, 0, -20, 20, 20, 0x00, 2],
  ['L', 'B', 0, 0, -10, -10, 10, 10, -20, 20, 0x00, 2]
];
var glyphStartX = 50;
var glyphStartY = 50;
var glyphs = [];
var glyphX, glyphY;
var canvasWidth, canvasHeight;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  glyphsPerRow = Math.floor(canvasWidth / glyphStep) / scaleFactor;
  glyphsPerCol = Math.floor(canvasHeight / glyphStep) / scaleFactor;
  background(0xE0);
  smooth();
  noLoop();
  rectMode(RADIUS);

  window.setInterval(nextGlyph, delay);
}

function draw() {
  scale(scaleFactor);
  background(0xE0);
  glyphX = glyphStartX;
  glyphY = glyphStartY;

  // throw away first line of glyphs if canvas is full
  cropGlyphs();

  // draw all glyphs
  for (var i = 0; i < glyphs.length; i++) {
    drawGlyph(glyphX, glyphY, glyphs[i]);

    // advance x/y
    glyphX = glyphX + glyphStep;

    if (glyphX > canvasWidth / scaleFactor) {
      glyphX = 50;
      glyphY += glyphStep;
    }
  }
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  glyphsPerRow = Math.floor(canvasWidth / glyphStep) / scaleFactor;
  glyphsPerCol = Math.floor(canvasHeight / glyphStep) / scaleFactor;

  resizeCanvas(canvasWidth, canvasHeight);
}

function cropGlyphs() {
  if (glyphs.length > glyphsPerRow * glyphsPerCol) {
    var newGlyphs = [];

    for (var i = glyphsPerRow; i < glyphs.length; i++) {
      newGlyphs.push(glyphs[i]);
    }

    glyphs = newGlyphs;
  }
}

function nextGlyph() {
  glyphs.push(createGlyphCode());
  redraw();
}



function drawGlyph(x, y, code) {
  var tokens = split(code, '');
  //console.log(code, tokens);

  var nx1 = glyphCoords.x[tokens[0]];
  var ny1 = glyphCoords.y[tokens[0]];
  var nx2, ny2;

  for (var i = 1; i < tokens.length; i++) {
    nx2 = glyphCoords.x[tokens[i]];
    ny2 = glyphCoords.y[tokens[i]];

    drawLine(x + nx1 * nodeStep, y + ny1 * nodeStep, x + nx2 * nodeStep, y + ny2 * nodeStep);

    // draw decoration if any
    if (tokens.length > i
        && isNaN(parseInt(tokens[i], 10))) {
      drawDecoration(tokens[i], x + nx1 * nodeStep, y + ny1 * nodeStep);
      i++;
    }

    nx1 = nx2;
    ny1 = ny2;
  }
}

function drawDecoration(id, x, y) {
  var decoCode = ['X', 'X'];
  // find decoration code
  for (var i = 0; i < glyphDecorations.length; i++) {
    if (glyphDecorations[i][0] == id) {
      decoCode = glyphDecorations[i];
      break;
    }
  }

  switch (decoCode[1]) {
    case 'E':
      drawEllipse(x, y, decoCode[2], decoCode[3], decoCode[4], decoCode[5], decoCode[6], decoCode[7]);
      break;
    case 'R':
      drawRectangle(x, y, decoCode[2], decoCode[3], decoCode[4], decoCode[5], decoCode[6], decoCode[7]);
      break;
    case 'L':
      drawDecoLine(x, y, decoCode[2], decoCode[3], decoCode[4], decoCode[5], decoCode[6], decoCode[7]);
      break;
    case 'B':
      drawBezier(x, y, decoCode[2], decoCode[3], decoCode[4], decoCode[5], decoCode[6], decoCode[7], decoCode[8], decoCode[9], decoCode[10], decoCode[11]);
      break;
    case 'X':
    default:
      console.log("no decoration with code " + decoCode[1]);
  }
}

function drawEllipse(x, y, width, height, strokeColor, weight, doFill, fillColor) {
  stroke(strokeColor);
  strokeWeight(weight);

  if (doFill == true) {
    fill(fillColor);
  } else {
    noFill();
  }

  ellipse(x, y, width, height);
}

function drawRectangle(x, y, width, height, strokeColor, weight, doFill, fillColor) {
  stroke(strokeColor);
  strokeWeight(weight);

  if (doFill == true) {
    fill(fillColor);
  } else {
    noFill();
  }

  rect(x, y, width, height);
}

function drawDecoLine(x, y, x1, y1, x2, y2, strokeColor, weight) {
  stroke(strokeColor);
  strokeWeight(weight);
  noFill();

  line(x + x1, y + y1, x + x2, y + y2);
}

function drawBezier(x, y, x1, y1, c1x, c1y, c2x, c2y, x2, y2, strokeColor, weight) {
  stroke(strokeColor);
  strokeWeight(weight);
  noFill();

  bezier(x + x1, y + y1, x + x1 + c1x, y + y1 + c1y, x + x2 + c2x, y + y2 + c2y, x + x2, y + y2);
}

function drawLine(x1, y1, x2, y2) {
  strokeWeight(2);
  stroke(0x00);
  line(x1, y1, x2, y2);
}

function createGlyphCode() {
  var code = "";

  // determine number of active nodes (Gaussian random)
  var num = Math.floor(random(1, 6));
  num = (num == 1) ? 0 : num;

  // fetch coords for every node
  for (var n = 0; n < num; n++) {
    code += Math.floor(random(0, 9));

    // see if we add a decoration
    if (Math.floor(random(0, 5)) == 0) {
      code += glyphDecorations[Math.floor(random(0, glyphDecorations.length))][0];
    }
  }

  if (doDebug) {console.log(code);}

  return code;
}
