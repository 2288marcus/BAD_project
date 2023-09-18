let startTime;
let timerInterval;

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);

  console.log("Timer started");
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;

  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  document.querySelector("#timer").textContent = formattedTime;
}

function countdownTimer() {
  let timeInMinutes = 1;

  let totalTime = timeInMinutes * 60 * 1000;
  let endTime = Date.now() + totalTime;

  let countdownInterval = setInterval(updateCountdown, 1);

  function updateCountdown() {
    const currentTime = Date.now();
    const remainingTime = Math.max(0, endTime - currentTime);

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    const milliseconds = Math.floor((remainingTime % 1000) / 10);

    document.querySelector("#timer").innerText = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
      .toString()
      .padStart(2, "0")}`;

    document.querySelector("#timer").style.color = "#fffef9";

    if (remainingTime <= 10000) {
      document.querySelector("#timer").style.color = "orange";
    }

    if (remainingTime <= 5000) {
      document.querySelector("#timer").style.color = "red";
    }

    if (remainingTime === 0) {
      endGame();
      clearInterval(countdownInterval);
      document.querySelector("#timer").textContent = "Game Over!";

      console.log("END GAME!", gamePlaying);
      console.log("Countdown finished");
    }
  }
  return countdownInterval;
}

function callTimer() {
  if (gamePlaying) {
    console.log("already playing, timer continued counting");
    return;
  }
  let timer = countdownTimer();

  console.log("timer called!");
  gamePlaying = true;
  return timer;
}
