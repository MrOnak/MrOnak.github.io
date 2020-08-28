var doDebug = false;
var scaleFactor = 1;
var delay = 100;
var activePalette;
var palettes = [
  [[0xE0, 0xE0, 0xE0, 0], [0xA0, 0xA0, 0xA0, 0], [0x00, 0x00, 0x00, 0]],
  [[0x0D, 0x0D, 0x34, 0], [0xAA, 0x54, 0x7F, 0], [0x00, 0xA4, 0xAF, 0]],
  [[0x60, 0x1F, 0x25, 0], [0xCC, 0x62, 0x00, 0], [0xB2, 0xA0, 0x00, 0]],
  [[0x83, 0xAD, 0x93, 0], [0x15, 0x77, 0x0F, 0], [0x23, 0x2F, 0x8A, 0]]
];
var palette = [
];
var minActiveNodes = 1;
var maxActiveNodes = 20;

var offsetX = 0;
var offsetY = 0;

var glyphsPerRow;
var glyphsPerCol;
var canvasWidth;
var canvasHeight;
var nodeStep = 20;
var glyphGap  = 20;
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
  ['A', 'E', 10, 10, 2, 2, true, 0],
  ['B', 'E', 10, 10, 2, 2, false, 0],
  ['C', 'E', 5, 5, 2, 0.5, true, 0],
  ['D', 'E', 5, 5, 2, 0.5, false, 0],
  ['E', 'E', 5, 5, 2, 1, true, 0],
  ['F', 'E', 5, 5, 2, 1, false, 0],
  ['G', 'S'],
  ['H', 'E', 10, 10, 2, 2, true, 1],
  ['I', 'E', 5, 5, 2, 0.5, true, 1],
  ['J', 'E', 5, 5, 2, 1, true, 1],
  ['K', 'E', 10, 10, 2, 2, true, 2],
  ['L', 'E', 5, 5, 2, 0.5, true, 2],
  ['M', 'E', 5, 5, 2, 1, true, 2],
  ['N', 'E', 10, 10, 1, 2, true, 2],
  ['O', 'E', 5, 5, 1, 0.5, true, 2],
  ['P', 'E', 5, 5, 1, 1, true, 2],
  ['Q', 'E', 10, 10, 1, 2, false, 2],
  ['R', 'E', 5, 5, 1, 0.5, false, 2],
  ['S', 'E', 5, 5, 1, 1, false, 2]
];
var glyphStartX = 50;
var glyphStartY = 50;
var glyphs = [];
var glyphX, glyphY;
var fadeSpeed = 2;
var opacity = 100 - fadeSpeed; // trick to actually draw the first glyph

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(RGB, 255, 255, 255, 100);

  activePalette = Math.floor(random(0, palettes.length));
  glyphsPerRow = Math.floor(canvasWidth / glyphStep) / scaleFactor;
  glyphsPerCol = Math.floor(canvasHeight / glyphStep) / scaleFactor;

  glyphX = glyphStartX;
  glyphY = glyphStartY;
  createPalette(100);
  nextGlyph();
  background(palette[0]);

  smooth();
  rectMode(RADIUS);
}

function draw() {
  scale(scaleFactor);
  createPalette(100);

  if (opacity == 0) {
    nextGlyph();

    // throw away first line of glyphs if canvas is full
    if (cropGlyphs()) {
      background(palette[0]);
      drawOldGlyphs();
      glyphX = glyphStartX;

    } else {
      glyphX += glyphStep;

      if (glyphX / glyphStep > glyphsPerRow) {
        glyphX = glyphStartX;

        if (glyphY / glyphStep < glyphsPerCol) {
          glyphY += glyphStep;
        }
      }
    }
  }

  // draw current glyph
  noStroke();
  fill(palette[0]);
  rect(glyphX, glyphY, glyphStep / 2, glyphStep / 2);
  createPalette(opacity);
  drawGlyph(glyphX, glyphY, glyphs[glyphs.length-1]);

  opacity = (opacity + fadeSpeed) % 100;
}

/**
 * returns true if glyphs where actually cropped
 */
function cropGlyphs() {
  var returnValue = false;

  if (glyphs.length > glyphsPerRow * glyphsPerCol) {
    returnValue = true;
    var newGlyphs = [];

    for (var i = glyphsPerRow; i < glyphs.length; i++) {
      newGlyphs.push(glyphs[i]);
    }

    glyphs = newGlyphs;
  }

  return returnValue;
}

function drawOldGlyphs() {
  var x = glyphStartX;
  var y = glyphStartY;
  // draw all old glyphs at full opacity
  for (var i = 0; i < glyphs.length - 1; i++) {
    drawGlyph(x, y, glyphs[i]);

    // advance x/y
    x += glyphStep;

    if (x / glyphStep > glyphsPerRow) {
      x = glyphStartX;
      y += glyphStep;
    }
  }
}

function nextGlyph() {
  glyphs.push(createGlyphCode());
}

/**
 * creates an opacity based variant of the active palette
 */
function createPalette(opacity) {
  for (var i in palettes[activePalette]) {
    palette[i] = color(palettes[activePalette][i][0], palettes[activePalette][i][1], palettes[activePalette][i][2], opacity);
  }
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  glyphsPerRow = Math.floor(canvasWidth / glyphStep) / scaleFactor;
  glyphsPerCol = Math.floor(canvasHeight / glyphStep) / scaleFactor;

  glyphs = [];
  glyphX = glyphStartX;
  glyphY = glyphStartY;
  createPalette(100);
  nextGlyph();
  resizeCanvas(canvasWidth, canvasHeight);
  document.body.style.background = rgbToHex(palettes[activePalette][0][0],
                                            palettes[activePalette][0][1],
                                            palettes[activePalette][0][2]);
}

function rgbToHex(r, g, b) {
  var returnValue = '#';
  returnValue += (r <= 16) ? '0' + r.toString(16) : r.toString(16);
  returnValue += (g <= 16) ? '0' + g.toString(16) : g.toString(16);
  returnValue += (b <= 16) ? '0' + b.toString(16) : b.toString(16);

  return returnValue;
}



function createGlyphCode() {
  var code = "";

  // determine number of active nodes (Gaussian random)
  var num = Math.floor(random(minActiveNodes, maxActiveNodes));

  // fetch coords for every node
  for (var n = 0; n < num; n++) {
    // move to node
    code += Math.floor(random(0, 9));
    // add a decoration
    code += glyphDecorations[Math.floor(random(0, glyphDecorations.length))][0];
  }

  if (doDebug) {console.log(code);}

  return code;
}



function drawGlyph(x, y, code) {
  var tokens = split(code, '');
  var nx, ny;

  // draw all nodes in their "off" state
  for (var i = 0; i < 10; i++) {
    nx = glyphCoords.x[i];
    ny = glyphCoords.y[i];
    drawEllipse(x + nx * nodeStep, y + ny * nodeStep, 5, 5, 1, 0.5, false, 2);
  }

  for (var i = 0; i < tokens.length; i += 2) {
    nx = glyphCoords.x[tokens[i]];
    ny = glyphCoords.y[tokens[i]];

    // draw decoration if any
    if (tokens.length > i
        && isNaN(parseInt(tokens[i+1], 10))) {
      drawDecoration(tokens[i+1], x + nx * nodeStep, y + ny * nodeStep);
    }
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
    case 'S':
      // no decoration
      break;
    case 'X':
    default:
      if (doDebug) {console.log("no decoration with code " + decoCode[1]);}
  }
}

function drawEllipse(x, y, width, height, strokeColor, weight, doFill, fillColor) {
  stroke(palette[strokeColor]);
  strokeWeight(weight);

  if (doFill == true) {
    fill(palette[fillColor]);
  } else {
    noFill();
  }

  ellipse(x, y, width, height);
}

function drawRectangle(x, y, width, height, strokeColor, weight, doFill, fillColor) {
  stroke(palette[strokeColor]);
  strokeWeight(weight);

  if (doFill == true) {
    fill(palette[fillColor]);
  } else {
    noFill();
  }

  rect(x, y, width, height);
}

function drawDecoLine(x, y, x1, y1, x2, y2, strokeColor, weight) {
  stroke(palette[strokeColor]);
  strokeWeight(weight);
  noFill();

  line(x + x1, y + y1, x + x2, y + y2);
}

function drawBezier(x, y, x1, y1, c1x, c1y, c2x, c2y, x2, y2, strokeColor, weight) {
  stroke(palette[strokeColor]);
  strokeWeight(weight);
  noFill();

  bezier(x + x1, y + y1, x + x1 + c1x, y + y1 + c1y, x + x2 + c2x, y + y2 + c2y, x + x2, y + y2);
}

function drawLine(x1, y1, x2, y2) {
  strokeWeight(2);
  stroke(palette[2]);
  line(x1, y1, x2, y2);
}
