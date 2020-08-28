var osc;
var env;
var playing;
var playPauseBtn;
var interval;

var scale;

var timeA = 0.1;
var timeD = 0.2;
var timeS = 0.2;
var timeR = 0.4;
var timeNote = timeA + timeD + timeS + timeR;

var rangeA = 0.5;
var rangeR = 0.0;

var speed = 0.5; // higher = slower

var lastNoteIndex, lastNoteLength;

function setup() {
  var canvas = createCanvas(100, 100);

  pickRandomScale();

  noLoop();
  window.setTimeout(nextNote, speed * timeNote * 1000);

  playPauseBtn = createButton('play / pause');
  playPauseBtn.mousePressed(togglePlay);

  osc = new p5.Oscillator();
  env = new p5.Env();
  env.setRange(rangeA, rangeR);

  osc.amp(env);
  osc.setType('sine');
  playing = true;

  osc.start();
}

function togglePlay() {
  if (playing) {
    osc.stop();
    playing = false;
  } else {
    osc.start();
    playing = true;
  }
}

function nextNote() {
  lastNoteLength = getNextNoteLength(lastNoteLength, 0, lengthsNum, 1, 5);
  var length     = lengths[noteLengths[lastNoteLength]];
  lastNoteIndex  = getNextNote(lastNoteIndex, 0, scale.length, 1);
  var note       = notes[scale[lastNoteIndex]];

  osc.freq(note);
  env.setADSR(
    timeA * speed * length,
    timeD * speed * length,
    timeS * speed * length,
    timeR * speed * length
  );
  window.setTimeout(nextNote, speed * length * 1000);

  if (random(0, 10) > 1) {
    // randomly mute some notes
    env.play();
  }
}

function pickRandomScale() {
  var i = Math.floor(Math.random(0) * scales.length);
  scale = scales[i];
  lastNoteIndex  = floor(scale.length / 2);
  lastNoteLength = 1;
}

function getNextNote(oldNote, minimum, maximum, variance) {
  var delta = randomGaussian(oldNote, variance);
  return min(maximum, max(minimum, round(delta)));
}

function getNextNoteLength(oldLength, minimum, maximum, variance, chanceOfChange) {
  var returnValue = oldLength;

  if (random(0, chanceOfChange) < 1) {
    var delta = randomGaussian(oldLength, variance);
    returnValue = min(maximum, max(minimum, round(delta)));
  }

  return returnValue;
}
