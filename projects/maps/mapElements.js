
function drawRiver(outline) {

}

function drawRoad(outline) {

}

function drawCity(seed, outline) {
  randomSeed(seed);

  var width  = outline[1][0] - outline[0][0];
  var height = outline[1][1] - outline[0][1];
  var midX   = outline[0][0] + width / 2;
  var houseWidth = worldConf.city.houseWidthMin;
  var houseHeight,offsetX, offsetY, mapped;

  for (var x = 0; x < width / 2; x += houseWidth * offsetX) {
    houseWidth   = random(worldConf.city.houseWidthMin, worldConf.city.houseWidthMax);
    mapped       = map(x, outline[0][0], midX, 0, 1);
    houseHeight  = cos(mapped * 0.7);
    offsetX      = cos(mapped * 1.1)
    offsetY      = 1 - cos(mapped * 0.3);
    houseHeight += offsetY;

    house(outline[0][0] + x, outline[1][1] - height * houseHeight, outline[0][0] + x + houseWidth, outline[1][1] - height * offsetY);
    house(outline[1][0] - x - houseWidth, outline[1][1] - height * houseHeight, outline[1][0] - x, outline[1][1] - height * offsetY);
  }

  // city wall
  var wallTopOffsetX = width / 20;
  var wallHeight = height / 8;
  var wallBottomOffsetX = width / 10;
  beginShape();
  vertex(outline[0][0] - wallTopOffsetX, outline[1][1] - wallHeight);
  quadraticVertex(
    map(0.5, 0, 1, outline[0][0] - wallTopOffsetX, outline[1][0] + wallTopOffsetX), outline[1][1],
    outline[1][0] + wallTopOffsetX, outline[1][1] - wallHeight);
  vertex(outline[1][0] + wallBottomOffsetX, outline[1][1] + wallHeight);
  quadraticVertex(
    map(0.5, 0, 1, outline[1][0] + wallBottomOffsetX, outline[0][0] - wallBottomOffsetX), outline[1][1] + wallHeight * 2,
    outline[0][0] - wallBottomOffsetX, outline[1][1] + wallHeight);
  vertex(outline[0][0] - wallTopOffsetX, outline[1][1] - wallHeight);
  setColor(worldConf.house.wallStrokeColHSB, worldConf.house.wallStrokeWeight, worldConf.house.wallFillColHSB);
  endShape();
/*
  stroke(100, 100, 100, 100);
  noFill();
  rect(outline[0][0], outline[0][1], outline[1][0], outline[1][1]);
  */
}

function drawMountainRange(seed, outline) {
  randomSeed(seed);
  var minX = 100000;
  var minY = 100000;
  var maxX = -10000;
  var maxY = -10000;

  // determine bounding box
  for (var i = 0; i < outline.length; i++) {
    minX = min(minX, outline[i][0]);
    minY = min(minY, outline[i][1]);
    maxX = max(maxX, outline[i][0]);
    maxY = max(maxY, outline[i][1]);
  }

  var rowMinX, rowMaxX, rowWidth, rowMidX, scaleX;
  var colMinY, colMaxY, colHeight, colMidY, scaleY, varianceY;
  var height = maxY - minY;
  var midY   = minY + height / 2;
  var sizeX = random(worldConf.mountainRange.minSizeX, worldConf.mountainRange.maxSizeX);
  var sizeY = random(worldConf.mountainRange.minSizeY, worldConf.mountainRange.maxSizeY);

  for (var y = minY; y < maxY; y += sizeY * worldConf.mountainRange.yIncrement) {
    // find min and max X for this y
    rowMinX = -1;
    rowMaxX = -1;

    for (var x = minX; x < maxX; x++) {
      if (isInPolygon(x, y, outline)) {
        if (rowMinX == -1) {rowMinX = x;}
        rowMaxX = x;
      }
    }
    rowWidth = rowMaxX - rowMinX;
    rowMidX = rowMinX + rowWidth / 2;

    // draw mountains in this row
    for (var x = rowMinX; x < rowMidX + worldConf.mountainRange.minSizeX; x += sizeX * scaleX * worldConf.mountainRange.xIncrement) {
      //scaleX = abs(1 - worldConf.mountainRange.xScaleFactor * (abs(rowMidX - (x + sizeX / 2)) / (rowWidth / 2)));
      scaleX = cos((map(x, rowMinX, rowMaxX, 0, 1) - 0.5) * HALF_PI * worldConf.mountainRange.xScaleFactor);

      // left edge
      colMinY = -1;
      colMaxY = -1;

      for (var y1 = minY; y1 < maxY; y1++) {
        if (isInPolygon(x, y1, outline)) {
          if (colMinY == -1) {colMinY = y1;}
          colMaxY = y1;
        }
      }
      colHeight = colMaxY - colMinY;
      colMidY   = colMinY + colHeight / 2;
      scaleY    = min(scaleX, cos((map(y, colMinY, colMaxY, 0, 1) - 0.5) * HALF_PI * worldConf.mountainRange.yScaleFactor));
      varianceY = random(0, sizeY * scaleY * worldConf.mountainRange.varianceY);
      scaleX    = min(scaleX, scaleY);

      if (isInPolygon(x, y, outline)) {
        mountain(x - (sizeX * scaleX) / 2, y + varianceY - (sizeY * scaleY) / 2, x + (sizeX * scaleX) / 2, y + varianceY + (sizeY * scaleY) / 2);
      }

      // right edge
      colMinY = -1;
      colMaxY = -1;
      var x2 = rowMaxX - (x - rowMinX);

      for (var y1 = minY; y1 < maxY; y1++) {
        if (isInPolygon(x2, y1, outline)) {
          if (colMinY == -1) {colMinY = y1;}
          colMaxY = y1;
        }
      }
      colHeight = colMaxY - colMinY;
      colMidY   = colMinY + colHeight / 2;
      scaleX    = cos((map(x, rowMinX, rowMaxX, 0, 1) - 0.5) * HALF_PI * worldConf.mountainRange.xScaleFactor);
      scaleY    = min(scaleX, cos((map(y, colMinY, colMaxY, 0, 1) - 0.5) * HALF_PI * worldConf.mountainRange.yScaleFactor));
      varianceY = random(0, sizeY * scaleY * worldConf.mountainRange.varianceY);
      scaleX    = min(scaleX, scaleY);

      if (isInPolygon(x2, y, outline)) {
        mountain(x2 - (sizeX * scaleX) / 2, y + varianceY - (sizeY * scaleY) / 2, x2 + (sizeX * scaleX) / 2, y + varianceY + (sizeY * scaleY) / 2);
      }

      sizeX = random(worldConf.mountainRange.minSizeX, worldConf.mountainRange.maxSizeX);
    }

    sizeY = random(worldConf.mountainRange.minSizeY, worldConf.mountainRange.maxSizeY);
  }

  //debugPolygon(outline);
}

function drawLake(seed, outline) {
  randomSeed(seed);
  var minX = 100000;
  var minY = 100000;
  var maxX = -10000;
  var maxY = -10000;

  // randomize the outline
  //outline.push(outline[0]);
  //outline = makeMidpointPolygon(4, outline, 0.2, 0.1, 0.02, 0.7);

  // determine bounding box
  for (var i = 0; i < outline.length; i++) {
    minX = min(minX, outline[i][0]);
    minY = min(minY, outline[i][1]);
    maxX = max(maxX, outline[i][0]);
    maxY = max(maxY, outline[i][1]);
  }
  outline.push(outline[0]);

  setColor(worldConf.lake.strokeColHSB, worldConf.lake.strokeWeight, worldConf.lake.fillColHSB);
  rndSmoothPolygon((maxX - minX) / 2, (maxY - minY) / 2, outline, worldConf.lake.midpoint, worldConf.lake.midpointVariance);

  //debugPolygon(outline);
}

function drawSwamp(seed, outline) {
  randomSeed(seed);
  var rowMinX, rowMaxX, rowStartX, rowEndX;
  var minX = 100000;
  var minY = 100000;
  var maxX = -10000;
  var maxY = -10000;

  // randomize the outline
  //outline.push(outline[0]);
  //outline = makeMidpointPolygon(4, outline, 0.2, 0.1, 0.02, 0.7);

  // determine bounding box
  for (var i = 0; i < outline.length; i++) {
    minX = min(minX, outline[i][0]);
    minY = min(minY, outline[i][1]);
    maxX = max(maxX, outline[i][0]);
    maxY = max(maxY, outline[i][1]);
  }

  setColor(worldConf.swamp.strokeColHSB, worldConf.swamp.strokeWeight);

  // draw the row
  for (var y = minY; y < maxY; y += worldConf.swamp.lineGap) {
    // find min and max x values
    for (var x = minX; x < maxX; x++) {
      if (isInPolygon(x, y, outline)) {
        rowMinX = x;
        break;
      }
    }
    for (var x = maxX; x > minX; x--) {
      if (isInPolygon(x, y, outline)) {
        rowMaxX = x;
        break;
      }
    }

    rowStartX = rowMinX
              + random(-1 * worldConf.swamp.xVariance, worldConf.swamp.xVariance);

    while (rowStartX < rowMaxX) {
      rowEndX = min(
        rowMaxX - random(-1 * worldConf.swamp.xVariance, worldConf.swamp.xVariance),
        rowStartX + random(worldConf.swamp.lengthMin, worldConf.swamp.lengthMax)
      );
      line(rowStartX, y, rowEndX, y);
      rowStartX = rowEndX + worldConf.swamp.gapLength;
    }
  }

  //debugPolygon(outline);
}

function drawEvergreenForest(seed, outline) {
  randomSeed(seed);
  var offsetX, offsetY;
  var treeSize = worldConf.evergreenForest.treeSize;
  var minX = 100000;
  var minY = 100000;
  var maxX = -10000;
  var maxY = -10000;

  // randomize the outline
  //outline.push(outline[0]);
  //outline = makeMidpointPolygon(4, outline, 0.2, 0.2, 0.05, 0.7);

  // determine bounding box
  for (var i = 0; i < outline.length; i++) {
    minX = min(minX, outline[i][0]);
    minY = min(minY, outline[i][1]);
    maxX = max(maxX, outline[i][0]);
    maxY = max(maxY, outline[i][1]);
  }

  // rasterize the trees
  for (var y = minY + treeSize * worldConf.evergreenForest.yVariance; y < maxY; y += treeSize * worldConf.evergreenForest.yIncrement) {
    for (var x = minX + treeSize * worldConf.evergreenForest.xVariance; x < maxX; x += treeSize * worldConf.evergreenForest.xIncrement) {
      offsetX = random(treeSize * worldConf.evergreenForest.xOffsetVarianceMin,
                       treeSize * worldConf.evergreenForest.xOffsetVarianceMax);
      offsetY = random(treeSize * worldConf.evergreenForest.yOffsetVarianceMin,
                       treeSize * worldConf.evergreenForest.yOffsetVarianceMax);

      if (isInPolygon(x + offsetX, y + offsetY, outline)) {
        evergreenTree(x + offsetX, y + offsetY, treeSize);
      }
    }
  }

  //debugPolygon(outline);
}

function drawDeciduousForest(seed, outline) {
  randomSeed(seed);
  var offsetX, offsetY;
  var treeSize = worldConf.deciduousForest.treeSize;
  var minX = 100000;
  var minY = 100000;
  var maxX = -10000;
  var maxY = -10000;

  // randomize the outline
  //outline.push(outline[0]);
  //outline = makeMidpointPolygon(4, outline, 0.2, 0.2, 0.05, 0.7);

  // determine bounding box
  for (var i = 0; i < outline.length; i++) {
    minX = min(minX, outline[i][0]);
    minY = min(minY, outline[i][1]);
    maxX = max(maxX, outline[i][0]);
    maxY = max(maxY, outline[i][1]);
  }

  for (var y = minY + treeSize * worldConf.deciduousForest.yVariance; y < maxY; y += treeSize * worldConf.deciduousForest.yIncrement) {
    for (var x = minX + treeSize * worldConf.deciduousForest.xVariance; x < maxX; x += treeSize * worldConf.deciduousForest.xIncrement) {
      offsetX = random(treeSize * worldConf.deciduousForest.xOffsetVarianceMin,
                       treeSize * worldConf.deciduousForest.xOffsetVarianceMax);
      offsetY = random(treeSize * worldConf.deciduousForest.yOffsetVarianceMin,
                       treeSize * worldConf.deciduousForest.yOffsetVarianceMax);

      if (isInPolygon(x + offsetX, y + offsetY, outline)) {
        //seed = random(new Date().getTime() + seed);
        deciduousTree(x + offsetX, y + offsetY, treeSize);
      }
    }
  }

  //debugPolygon(outline);
}
