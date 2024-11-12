function pauseDux() {
  responsiveVoice.pause();
  hidePauseButton();
  showResumeButton();
}

function resumeDux() {
  responsiveVoice.resume();
  hideResumeButton();
  showPauseButton();
}

function showPauseButton() {
  let pauseButton = document.querySelector("#pauseDuxButton");
  pauseButton.style.display = "block";
}

function hidePauseButton() {
  let pauseButton = document.querySelector("#pauseDuxButton");
  pauseButton.style.display = "none";
}

function showResumeButton() {
  let pauseButton = document.querySelector("#resumeDuxButton");
  pauseButton.style.display = "block";
}

function hideResumeButton() {
  let pauseButton = document.querySelector("#resumeDuxButton");
  pauseButton.style.display = "none";
}
