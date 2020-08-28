function isInPolygon(x, y, outline) {
  var returnValue = false;

  var i, j;
  for (var i = 0, j = outline.length-1; i < outline.length; j = i++) {
    if ( ((outline[i][1] > y) != (outline[j][1] > y))
      && (x < (outline[j][0] - outline[i][0]) * (y - outline[i][1]) / (outline[j][1] - outline[i][1]) + outline[i][0]) ) {

       returnValue = !returnValue;
     }
  }

  return returnValue;
}

function debugPolygon(outline) {
  beginShape();
  for (var i = 0; i < outline.length; i++) {
    vertex(outline[i][0], outline[i][1]);
  }
  stroke(100, 100, 100, 40);
  strokeWeight(1);
  noFill();
  endShape(CLOSE);
}

function drawPolygon(outline) {
  beginShape();
  for (var i = 0; i < outline.length; i++) {
    vertex(outline[i][0], outline[i][1]);
  }
  endShape();
}

/**
 * draws a polygon with bezier vertexes (2 control points) where the two control points
 * on one point of the polygon are 180° apart, quaranteeing smooth curves
 *
 * @param centerX x-coordinate of the polygons' center (doesn't have to be the actual enter, its just used for angle calculations for the control points)
 * @param centerY y-coordinate of the polygons' center
 * @param outline array of [x, y] coordinates of polygon points
 * @param midpoint can be a float or an array of float with equal length to the elements in outline. where the control point lies between two points on the outline: 0 <= midpoint <= 1.0
 * @param midpointVariance randomization of the midpoint parameter
 */
function rndSmoothPolygon(centerX, centerY, outline, midpoint, midpointVariance) {
  var cx1, cx2, cy1, cy2;
  var mp;
  var angles = [];
  var pointAngle, dist;

  beginShape();
  vertex(outline[0][0], outline[0][1]);

  pointAngle = atan2(outline[1][1] - outline[0][1], outline[1][0] - outline[0][0]);
  angles[0] = random(pointAngle - QUARTER_PI, pointAngle + QUARTER_PI);

  for (var i = 1; i < outline.length; i++) {
    if (isNaN(midpoint)) {
      mp = midpoint[i] + random(-1 * midpointVariance, midpointVariance);
    } else {
      mp = midpoint + random(-1 * midpointVariance, midpointVariance);
    }

    // distance between the two polygon points
    dist  = sqrt((outline[i][0] - outline[i-1][0])*(outline[i][0] - outline[i-1][0]) + (outline[i][1] - outline[i-1][1])*(outline[i][1] - outline[i-1][1]));
    pointAngle = atan2(outline[i][1] - outline[i-1][1], outline[i][0] - outline[i-1][0]);
    angles[i] = random(pointAngle - QUARTER_PI, pointAngle + QUARTER_PI);
    angles[outline.length-1] = angles[0]; // ensure last angle equals angles[0]

    // extend control points from their outline point
    cx1 = outline[i-1][0] + mp * dist * cos(angles[i-1]);
    cy1 = outline[i-1][1] + mp * dist * sin(angles[i-1]);
    cx2 = outline[i][0] + mp * dist * cos(angles[i] + PI);
    cy2 = outline[i][1] + mp * dist * sin(angles[i] + PI);

    bezierVertex(cx1, cy1, cx2, cy2, outline[i][0], outline[i][1]);
  }
  endShape();
}

/**
 * draws a polygon with quadratic vertexes (1 control point)
 *
 * @param centerX x-coordinate of the polygons' center (doesn't have to be the actual enter, its just used for angle calculations for the control points)
 * @param centerY y-coordinate of the polygons' center
 * @param outline array of [x, y] coordinates of polygon points
 * @param fluffyness can be a float or an array of float with equal length to the elements in outline. how much the control points are outside (> 1.0) or inside (< 1.0) of the direct connection between points on the outline
 * @param fluffVariance randomization of the fluffyness parameter
 * @param midpoint can be a float or an array of float with equal length to the elements in outline. where the control point lies between two points on the outline: 0 <= midpoint <= 1.0
 * @param midpointVariance randomization of the midpoint parameter
 * @param isStable if true, all randomized values are calculated only once and the same values applied to every vertex
 */
function rndQuadraticPolygon(centerX, centerY, outline, fluffyness, fluffVariance, midpoint, midpointVariance, isStable) {
  var cx, cy;
  var fluff, mp;
  var angle, dist;

  var mpVariance, fluffVariance;

  if (isStable === true) {
    mpVariance = random(-1 * midpointVariance, midpointVariance);
    fVariance  = random(-1 * fluffVariance, fluffVariance);
  }

  beginShape();
  vertex(outline[0][0], outline[0][1]);

  for (var i = 1; i < outline.length; i++) {
    if (isNaN(midpoint)) {
      if (isStable === true) {
        mp = midpoint[i] + mpVariance;
      } else {
        mp = midpoint[i] + random(-1 * midpointVariance, midpointVariance);
      }
    } else {
      if (isStable === true) {
        mp = midpoint + mpVariance;
      } else {
        mp = midpoint + random(-1 * midpointVariance, midpointVariance);
      }
    }

    if (isNaN(fluffyness)) {
      if (isStable === true) {
        fluff = fluffyness[i] + fVariance;
      } else {
        fluff = fluffyness[i] + random(-1 * fluffVariance, fluffVariance);
      }
    } else {
      if (isStable === true) {
        fluff = fluffyness + fVariance;
      } else {
        fluff = fluffyness + random(-1 * fluffVariance, fluffVariance);
      }
    }

    // calculate base control point
    cx = lerp(outline[i-1][0], outline[i][0], mp);
    cy = lerp(outline[i-1][1], outline[i][1], mp);
    // extend control point from the center
    angle = atan2(cy - centerY, cx - centerX);
    dist  = fluff * sqrt((centerX - cx)*(centerX - cx) + (centerY - cy)*(centerY - cy));
    cx = centerX + dist * cos(angle);
    cy = centerY + dist * sin(angle);

    quadraticVertex(cx, cy, outline[i][0], outline[i][1]);
  }
  endShape();
}
