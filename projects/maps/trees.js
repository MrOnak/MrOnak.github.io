
function evergreenTree(x, y, treeSize) {
  var startX, startY, endX, endY;
  var stemLength   = randomGaussian(treeSize, worldConf.evergreenTree.stemLengthDeviation);
  var stemAngle    = 3 * HALF_PI + random(-1 * worldConf.evergreenTree.stemAngleDeviation, worldConf.evergreenTree.stemAngleDeviation);
  var stemSegments = round(random(2, 5));
  var segLength    = stemLength / 4;
  var segCoverage  = randomGaussian(worldConf.evergreenTree.foilageCoverage, worldConf.evergreenTree.foilageCoverageDeviation);
  var segHeight    = randomGaussian(worldConf.evergreenTree.foilageHeight, worldConf.evergreenTree.foilageHeightDeviation);
  var fH = worldConf.evergreenTree.foilageFillColHSB.h + round(randomGaussian(0, worldConf.evergreenTree.foilagHueDeviation));

  startX = x;
  startY = y;
  endX = startX + segLength * Math.cos(stemAngle);
  endY = startY + segLength * Math.sin(stemAngle);
  // draw the stem segment
  setColor(worldConf.evergreenTree.stemStrokeColHSB, worldConf.evergreenTree.stemStrokeWeight);
  line(startX, startY, endX, endY);

  // foilage colors
  setColor(worldConf.evergreenTree.foilageStrokeColHSB, worldConf.evergreenTree.foilageStrokeWeight,
    {h: fH,
     s: worldConf.evergreenTree.foilageFillColHSB.s,
     b: worldConf.evergreenTree.foilageFillColHSB.b,
     a: worldConf.evergreenTree.foilageFillColHSB.a});

  // draw foilage segments
  for (var i = 0; i < stemSegments; i++) {
    var outline = [];
    outline.push([endX - segLength * segCoverage, endY + segLength * segHeight]);
    outline.push([endX, endY - segLength]);
    outline.push([endX + segLength * segCoverage, endY + segLength * segHeight]);
    outline.push(outline[0]);

    rndQuadraticPolygon(
      endX, endY,
      outline,
      worldConf.evergreenTree.foilageFluffyness, worldConf.evergreenTree.foilageFluffynessVariance,
      worldConf.evergreenTree.foilageMidpoint, worldConf.evergreenTree.foilageMidpointVariance
    );

    startX = endX;
    startY = endY;
    endX = startX + segLength * Math.cos(stemAngle);
    endY = startY + segLength * Math.sin(stemAngle);
    segLength    *= worldConf.evergreenTree.stemSegmentShortening;
  }
}

function deciduousTree(x, y, treeSize) {
  var startX = x;
  var startY = y;
  var endX, endY;

  var circumference = 0.3 * treeSize;
  var nodes         = random([5, 6, 7]);
  var angularOffset = random(-1 * HALF_PI, HALF_PI);
  var angle         = TWO_PI / nodes;
  var deviation     = 0;
  var stemLength    = randomGaussian(treeSize / 2, worldConf.deciduousTree.stemLengthDeviation);
  var stemAngle     = 3 * HALF_PI + random(-1 * worldConf.deciduousTree.stemAngleDeviation, worldConf.deciduousTree.stemAngleDeviation);
  var lengthDeviation;
  var angularDeviation;
  var outline = [];

  var fH = 121 + round(randomGaussian(0, worldConf.deciduousTree.foilagHueDeviation));

  // draw the stem
  endX = startX + stemLength * Math.cos(stemAngle);
  endY = startY + stemLength * Math.sin(stemAngle);
  setColor(worldConf.deciduousTree.stemStrokeColHSB, worldConf.deciduousTree.stemStrokeWeight);
  line(startX, startY, endX, endY);

  // calculate branches
  for (var i = 0; i < nodes; i++) {
    lengthDeviation = round(
        random(-1 * (treeSize / worldConf.deciduousTree.nodeDistanceDeviationMin),
                    treeSize / worldConf.deciduousTree.nodeDistanceDeviationMax));
    angularDeviation = random(-1 * worldConf.deciduousTree.foilageAngleVariance, worldConf.deciduousTree.foilageAngleVariance);

    outline.push([
      endX + (circumference + lengthDeviation) * Math.cos(i * angle + angularOffset + angularDeviation),
      endY + (circumference + lengthDeviation) * Math.sin(i * angle + angularOffset + angularDeviation)
    ]);
  }
  // add first node to the end as well to close the bezier curve
  outline.push(outline[0]);

  setColor(worldConf.deciduousTree.foilageStrokeColHSB, worldConf.deciduousTree.foilageStrokeWeight,
    {h: fH,
     s: worldConf.deciduousTree.foilageFillColHSB.s,
     b: worldConf.deciduousTree.foilageFillColHSB.b,
     a: worldConf.deciduousTree.foilageFillColHSB.a});

  rndQuadraticPolygon(
    endX, endY,
    outline,
    worldConf.deciduousTree.foilageFluffyness, worldConf.deciduousTree.foilageFluffynessVariance,
    worldConf.deciduousTree.foilageMidpoint, worldConf.deciduousTree.foilageMidpointVariance
  );
}
