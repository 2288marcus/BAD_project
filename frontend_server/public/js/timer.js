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

  document.getElementById("timer").textContent = formattedTime;
}

function countdownTimer() {
  let timeInMinutes = 1;

  const countdownElement = document.querySelector("#timer");

  let totalTime = timeInMinutes * 60 * 1000;
  let endTime = Date.now() + totalTime;

  const countdownInterval = setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const currentTime = Date.now();
    const remainingTime = Math.max(0, endTime - currentTime);

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    countdownElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (remainingTime === 0) {
      clearInterval(countdownInterval);
      
      playing = false;
      console.log("END GAME!", playing);

      console.log("Countdown finished");
    }
  }
}

function callTimer() {
  if (playing) {
    console.log("i am already playing");
    return
  }
  countdownTimer();
  console.log("timer called!")
}
