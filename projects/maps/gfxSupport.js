
function setColor(strokeHSBA, weight, fillHSBA) {
  if (weight > 0) {
    strokeWeight(weight);
    stroke(strokeHSBA.h, strokeHSBA.s, strokeHSBA.b, strokeHSBA.a);
  } else {
    noStroke();
  }

  if (fillHSBA !== undefined) {
    fill(fillHSBA.h, fillHSBA.s, fillHSBA.b, fillHSBA.a);
  } else {
    noFill();
  }
}

/**
 * returns an array of [x,y] of midpoint displacement
 */
function makeMidpointPolygon(iterations, outline, varianceX, amplitude, varianceY, amplitudeDampening) {
  var result  = [];
  var normal, dist;
  var px, py, mp, amp;

  for (var i = 0; i < iterations; i++) {
    result = [];

    for (var j = 1; j < outline.length; j++) {
      result.push(outline[j-1]);
      //normal vector & distance
      normal = HALF_PI + atan2(outline[j][1] - outline[j-1][1], outline[j][0] - outline[j-1][0]);
      dist   = sqrt((outline[j][0] - outline[j-1][0])*(outline[j][0] - outline[j-1][0]) + (outline[j][1] - outline[j-1][1])*(outline[j][1] - outline[j-1][1]))
      // find midpoint on the line
      mp     = 0.5 + random(-1 * varianceX, varianceX);
      px     = lerp(outline[j][0], outline[j-1][0], mp);
      py     = lerp(outline[j][1], outline[j-1][1], mp);
      // find amplitude
      amp    = dist * (amplitude + random(-1 * varianceY, varianceY));
      if (random(0, 1) > 0.5) {amp = -1 * amp};

      result.push([px + amp * Math.cos(normal), py + amp * Math.sin(normal)]);
    }
    result.push(outline[outline.length-1]);
    outline = result;
    amplitude = amplitude * amplitudeDampening;
    //debugPolygon(outline);
  }

  return outline;
}
