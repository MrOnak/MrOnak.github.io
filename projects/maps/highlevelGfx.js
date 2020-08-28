function house(x1, y1, x2, y2) {
  var width = x2 - x1;
  var height = y2 - y1;
  var midX = x1 + width / 2;
  var windowWidth  = round(random(worldConf.house.windowMinWidth, worldConf.house.windowMaxWidth));
  var windowHeight = round(random(worldConf.house.windowMinHeight, worldConf.house.windowMaxHeight));
  var windowGapX   = round(random(worldConf.house.windowMinGapX, worldConf.house.windowMaxGapX));
  var windowGapY   = round(random(worldConf.house.windowMinGapY, worldConf.house.windowMaxGapY));
  var floors       = floor((height - windowGapY) / (windowHeight + windowGapY));
  // wall
  setColor(worldConf.house.wallStrokeColHSB, worldConf.house.wallStrokeWeight, worldConf.house.wallFillColHSB);
  rect(x1, y1, x2, y2);
  // wall shadows
  setColor(worldConf.house.wallStrokeColHSB, 0,
    {
      h: worldConf.house.wallFillColHSB.h,
      s: worldConf.house.wallFillColHSB.s,
      b: 0.6 * worldConf.house.wallFillColHSB.b,
      a: worldConf.house.wallFillColHSB.a
    }
  );
  rect(x1 + 1, y1, x2, y1 + height * 0.05);
  rect(x2 - width * 0.2, y1, x2, y2);

  // roof
  setColor(worldConf.house.roofStrokeColHSB, worldConf.house.roofStrokeWeight, worldConf.house.roofFillColHSB);
  var roof = [];
  var overhang   = randomGaussian(width * worldConf.house.roofOverhangMean, width * worldConf.house.roofOverhangDeviation);
  var roofHeight = abs(randomGaussian(height * worldConf.house.roofHeightMean, height * worldConf.house.roofHeightDeviation));

  roof.push([x1 - overhang, y1]);
  roof.push([midX, y1 - roofHeight]);
  roof.push([x2 + overhang, y1]);
  rndQuadraticPolygon(midX, y1 - roofHeight / 2, roof,
    worldConf.house.roofCurvatureMean,
    worldConf.house.roofCurvatureDeviation,
    worldConf.house.roofCurvatureMidpointMean,
    worldConf.house.roofCurvatureMidpointDeviation,
    true
  );
  line(roof[0][0], roof[0][1], roof[2][0], roof[2][1]);

  // windows
  setColor(worldConf.house.windowStrokeColHSB, worldConf.house.windowStrokeWeight, worldConf.house.windowFillColHSB);
  for (var f = 0; f < floors; f++) {
    var y = y1 + windowGapY + f * (windowGapY + windowHeight);

    rect(midX - windowWidth / 2, y, midX + windowWidth / 2, y + windowHeight);

    for (var x = windowWidth / 2 + windowGapX; x < floor(x2 - windowGapX) - midX; x += windowGapX + windowWidth) {
      rect(midX + x, y, midX + (x + windowWidth), y + windowHeight);
      rect(midX - x, y, midX - (x + windowWidth), y + windowHeight);
    }
  }

}

/**
 * draws a mountain inside the given bounding box
 */
function mountain(x1, y1, x2, y2) {
  var ridgeLine = []; // the ridge
  var shadow = [];    // polygon that will be in shadow
  var area = [];      // the whole projected 'surface' of the mountain
  var width = x2 - x1;
  var height = y2 - y1;
  var mpIterations = worldConf.mountain.midpointIterations;
  var vp = min(width, height) * worldConf.mountain.pointVariance;
  var vn = -1 * vp;

  ridgeLine.push([x1 + random(vn, vp), y1 + height * 0.8 + random(vn, vp)]);
  ridgeLine.push([x1 + width * 0.5 + random(vn, vp), y1 + random(vn, vp)]);
  ridgeLine.push([x1 + width * 0.7 + random(vn, vp), y1 + height * 0.25 + random(vn, vp)]);
  ridgeLine.push([x1 + width + random(vn, vp), y1 + height * 0.8 + random(vn, vp)]);
  ridgeLine = makeMidpointPolygon(mpIterations, ridgeLine,
    worldConf.mountain.ridgeMPVarianceX,
    worldConf.mountain.ridgeMPAmplitude,
    worldConf.mountain.ridgeMPVarianceY,
    worldConf.mountain.ridgeMPAmplitudeDampening);

  // makeMidpointPolygon(iterations, outline, varianceX, amplitude, varianceY, amplitudeDampening)
  // extend ridgeline for shadow
  shadow.push(ridgeLine[ridgeLine.length - 1]);
  shadow.push([x1 + width * 0.8 + random(vn, vp), y2 + random(vn, vp)]);
  shadow.push([x1 + width * 0.6 + random(vn, vp), y2 - height * 0.1 + random(vn, vp)]);
  shadow.push([x1 + width * 0.5, y1 + height * 0.1]);
  shadow.push(ridgeLine[pow(2, mpIterations)]);
  shadow = makeMidpointPolygon(mpIterations, shadow,
    worldConf.mountain.shadowMPVarianceX,
    worldConf.mountain.shadowMPAmplitude,
    worldConf.mountain.shadowMPVarianceY,
    worldConf.mountain.shadowMPAmplitudeDampening);
  // append the relevant part of the ridgeline for the shadowLine
  for (var i = pow(2, mpIterations) + 1; i < ridgeLine.length - 1; i++) {
    shadow.push(ridgeLine[i]);
  }
  // create the surface polygon
  area.push(shadow[pow(2, mpIterations + 1)]);
  area.push([x1 + width * 0.3, y2 + height * 0.2]);
  area.push(ridgeLine[0]);
  area = makeMidpointPolygon(mpIterations, area,
    worldConf.mountain.areaMPVarianceX,
    worldConf.mountain.areaMPAmplitude,
    worldConf.mountain.areaMPVarianceY,
    worldConf.mountain.areaMPAmplitudeDampening);
  // copy the ridge
  for (var i = 1; i < ridgeLine.length; i++) {
    area.push(ridgeLine[i]);
  }
  // copy the bottom part of the shadowLine
  for (var i = 0; i < pow(2, mpIterations + 1); i++) {
    area.push(shadow[i]);
  }

  // paint the area with background color
  setColor(null, 0, worldConf.backgroundColHSB);
  drawPolygon(area);
  // paint the shadow
  setColor(null, worldConf.mountain.shadowStrokeWeight, worldConf.mountain.shadowFillCol);
  drawPolygon(shadow);
  // paint the ridge
  setColor(worldConf.mountain.ridgeStrokeCol, worldConf.mountain.ridgeStrokeWeight);
  drawPolygon(ridgeLine);

  //debugPolygon([[x1, y1], [x2, y1], [x2, y2], [x1, y2]]);
  //debugPolygon(area);
}
