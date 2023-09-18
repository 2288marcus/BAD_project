let mic, fft, osc, polySynth;

let gamePlaying = false;
let firstNote = true;

let randomMidi;
let randomFreq;
let randomNote;

let dominantFreq;
let isMatched;

let timer;

let cupCounter = 0;
let matchedNotes = [];

let matchStatusBar = document.querySelector(".matchStatus");

function setup() {
  let cup = createCanvas(60, 60);
  console.log("cup:", cup);

  console.log(document.querySelector(".canvas-container"));
  console.log(cup);
  // document.querySelector('.canvas-container').appendChild(cup.canvas)
  cup.parent(document.querySelector(".canvas-container"));

  // cup.parent(document.querySelector("#canvas"));

  background("#FFFFFF");

  mic = new p5.AudioIn();
  console.log("mic:", mic);

  fft = new p5.FFT();
  fft.setInput(mic, 2048);

  cup.touchStarted(playOscillator);
  cup.touchEnded(stopOscillator);

  osc = new p5.Oscillator("sine");
  polySynth = new p5.PolySynth();

  disableMic();
}

function draw() {
  background("#FFFFFF");

  dominantFreq = getDominantFrequency();

  const midi = freqToMidi(dominantFreq);

  const noteName = midiToNote(midi);

  const frequency = midiToFreq(midi);

  if (dominantFreq) {
    isMatched = matchFreq(dominantFreq, randomFreq);
  }

  document.querySelector(".hz").innerText =
    "Dominant Frequency: " +
    (dominantFreq ? dominantFreq.toFixed(2) + " Hz" : "No signal");
  document.querySelector(".notePlay").innerText =
    "Note: " + (noteName ? noteName : "Unknown");
}

function playOscillator() {
  if (firstNote) {
    // disableMic();
    genRandomNote();
    timer = callTimer();
    console.log("Start the game, 1 st round and gen new!");
    firstNote = false;
  }

  console.log(
    "play the note :",
    randomNote,
    "frq:",
    randomFreq,
    ",game status:",
    gamePlaying
  );

  stopMic();

  osc.freq(randomFreq, 0.1, 0.2);
  osc.start();
}

function stopOscillator() {
  osc.stop();
}

function startMic() {
  mic.start();
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~start mic");

  checkGamePlaying();
}

function stopMic() {
  mic.stop();

  console.log("///////call stopMic");

  matchStatusBar.innerText = "Ready?...";
  matchStatusBar.style.fontSize = "3rem";

  document.querySelector(".listen").style.backgroundColor = "#4caf50";
}

function disableMic() {
  mic.stop();

  matchStatusBar.innerText = "Touch and Listen to the Glass!";
  matchStatusBar.style.fontSize = "1.25rem";
  // matchStatusBar.style.backgroundColor = '#FFFFFF';

  document.querySelector(".listen").style.backgroundColor = "#515751";
}

function getDominantFrequency() {
  const spectrum = fft.analyze(); // Get the frequency spectrum (Returns an array of amplitude values (between 0 and 255) across the frequency spectrum)
  // console.log('spectrum:', spectrum);

  // Find the index of the highest magnitude in the spectrum
  let maxIndex = 0;
  let maxValue = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > maxValue) {
      maxValue = spectrum[i];
      maxIndex = i;
    }
  }

  // Convert the index to a frequency value
  const convertedFreq = indexToFreq(
    maxIndex,
    getAudioContext().sampleRate,
    fft.bins
  );

  // console.log('#maxIndex:', maxIndex, 'sample rate:', getAudioContext().sampleRate, 'fftBins:', fft.bins)
  // console.log('FFT:', fft)

  return convertedFreq;
}

function freqToMidi(frequency) {
  return p5.prototype.freqToMidi(frequency);
}

function midiToNote(midi) {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;

  return notes[noteIndex] + octave;
}

function midiToFreq(midi) {
  return p5.prototype.midiToFreq(midi);
}

function indexToFreq(index, sampleRate, fftBins) {
  const binWidth = sampleRate / fftBins;

  // console.log('#bin width:', binWidth);
  console.log("*domFreq*:", (index * binWidth) / 2);

  return (index * binWidth) / 2;
}

function genRandomNote() {
  randomMidi = Math.floor(Math.random() * (84 - 48)) + 48;
  randomNote = midiToNote(randomMidi);
  randomFreq = midiToFreq(randomMidi);

  return randomNote;
}

document.querySelector("#randomLor").addEventListener("click", () => {
  genRandomNote();
  document.querySelector("#randNote").innerText = randomNote;
  document.querySelector("#randFreq").innerText = randomFreq.toFixed(2);
});

function matchFreq(dominantFreq, randomFreq) {
  // dominantFreq = randomFreq;

  let bufferRange = 0.02;

  let thresholdRange = 0.05;
  let lowerThresholdBound = randomFreq * (1 - thresholdRange);
  let upperThresholdBound = randomFreq * (1 + thresholdRange);

  let distance = Math.abs(dominantFreq - randomFreq);

  if (
    dominantFreq >= lowerThresholdBound &&
    dominantFreq <= upperThresholdBound
  ) {
    if (distance <= bufferRange * randomFreq) {
      console.log("!!!!!!!!!");
      matched();
      console.log("~~~~~~~~~~~~~");
      return "Perfect !!";
    } else {
      return "Good try ~";
    }
  } else {
    return "Poor...";
  }
}

function matched() {
  //TODO cup falls

  disableMic();
  console.log("mic disable ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  cupCounter += 1;
  if (cupCounter === 1) {
    document.querySelector("#cup-counter").innerText = `Cup: \n ${cupCounter}`;
  } else {
    document.querySelector("#cup-counter").innerText = `Cups: \n ${cupCounter}`;
  }

  matchedNotes.push(randomNote);

  document.querySelector("#match-note").innerText = randomNote;
  document.querySelector("#match-note").classList.add("fade");

  setTimeout(() => {
    document.querySelector("#match-note").classList.remove("fade");
  }, 3000);

  matchStatusBar.innerText = "You are perfect!";
  matchStatusBar.style.fontSize = "2rem";

  setTimeout(() => {
    matchStatusBar.innerText = "Touch and Listen to the Glass!";
    matchStatusBar.style.fontSize = "1.25rem";
  }, 3000);

  genRandomNote();
}

function checkGamePlaying() {
  if (gamePlaying) {
    matchFreq(dominantFreq, randomFreq);

    if (isMatched === "Perfect !!") {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", isMatched);
      // document.querySelector(".matchStatus").innerText = "Perfect !!";
      return;
    }

    // matchStatusBar.style.backgroundColor = '';
    matchStatusBar.style.fontSize = "3rem";
    matchStatusBar.innerText = isMatched ? isMatched : "Ready?...";
  } else {
    matchStatusBar.innerText = "Touch and Listen to the Glass!";
    matchStatusBar.style.fontSize = "1.25rem";
  }
}

function endGame() {
  stopMic();
  noLoop();

  console.log("total cups;", cupCounter, "all matched notes:", matchedNotes);

  gamePlaying = false;

  playerForm();
}

async function playerForm() {
  const { value: username } = await Swal.fire({
    title: "WOW~ \n show it to the world!",
    input: "text",
    inputLabel: `Your score: ${cupCounter} Cups \n with notes: ${matchedNotes}`,
    inputPlaceholder: "Enter your username",
    preConfirm: (inputValue) => {
      if (!inputValue) {
        Swal.showValidationMessage(`Hey, tell your name to the world!!!`);
      }
      return inputValue;
    },
  });

  if (username) {
    Swal.fire(`Name: ${username}\n Score: ${cupCounter} Cups`);
  }
}

function restart() {
  clearInterval(timer);
  // clearTimer(timer)
  document.querySelector("#timer").textContent = "01:00:00";
  document.querySelector("#timer").style.color = "#fffef9";

  firstNote = true;
  gamePlaying = false;

  cupCounter = 0;
  document.querySelector("#cup-counter").innerText = `Cup: \n ${cupCounter}`;

  matchedNotes = [];

  disableMic();

  console.log(
    "RESTART",
    "firstNote true?",
    firstNote,
    "gamePlaying false?",
    gamePlaying
  );
}
