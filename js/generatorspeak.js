class SpeechGenerator {
  constructor(voiceChosen, callbacks = {}, waitTime = 400) {
    this.sentenceStack = [];
    this.isPaused = false;
    this.currentIndex = 0;
    this.voice = voiceChosen;
    this.waitTime = waitTime;

    this.whileTalking = callbacks.whileTalking ?? function () {};
    this.whenPaused = callbacks.whenPaused ?? function () {};
    this.onFinish = callbacks.onFinish ?? function () {}; // onFinish callback function
  }

  addPauseButton(pauseButton) {
    const button = clearEventListeners(pauseButton);
    button.addEventListener("click", () => this.pause());
    this.pauseButton = button;
  }

  addResumeButton(resumeButton) {
    const button = clearEventListeners(resumeButton);
    button.addEventListener("click", () => this.resume());
    this.resumeButton = button;
  }

  addPlayButton(playButton) {
    const button = clearEventListeners(playButton);
    button.addEventListener("click", () => this.playAll());
    this.playButton = button;
  }

  addSentence(sentence) {
    this.sentenceStack.push(sentence);
  }

  async speakSentence(sentence) {
    return new Promise((resolve) => {
      if (!sentence) {
        resolve();
        return;
      }

      this.isPaused = false;
      this.whileTalking();

      // Speak the sentence using ResponsiveVoice
      responsiveVoice.speak(sentence.trim(), this.voice ?? "UK English Male", {
        onend: () => {
          if (!this.isPaused) {
            this.currentIndex++;
          }
          // Resolve the promise when the sentence finishes
          resolve();
        },
      });
    });
  }

  pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      this.whenPaused();
      responsiveVoice.pause();
      this.updateButtonVisibility("paused"); // Update button visibility for paused state
    }
  }

  resume() {
    if (this.isPaused && this.currentIndex < this.sentenceStack.length) {
      this.isPaused = false;
      this.whileTalking();
      this.playFromIndex(this.currentIndex); // Continue from current sentence
      this.updateButtonVisibility("playing"); // Update button visibility for playing state
    }
  }

  async playAll() {
    if (this.sentenceStack.length === 0) return;

    this.currentIndex = 0;
    this.updateButtonVisibility("playing"); // Set buttons to "playing" state

    while (this.currentIndex < this.sentenceStack.length && !this.isPaused) {
      await this.speakSentence(this.sentenceStack[this.currentIndex]);

      if (
        this.waitTime &&
        this.currentIndex < this.sentenceStack.length &&
        !this.isPaused
      ) {
        await new Promise((resolve) => setTimeout(resolve, this.waitTime));
      }
    }

    if (!this.isPaused) {
      this.onFinish(); // Trigger onFinish callback only when fully done
      this.updateButtonVisibility("finished"); // Update buttons for "finished" state
    }
  }

  async playFromIndex(index) {
    while (this.currentIndex < this.sentenceStack.length && !this.isPaused) {
      await this.speakSentence(this.sentenceStack[this.currentIndex]);

      if (
        this.waitTime &&
        this.currentIndex < this.sentenceStack.length &&
        !this.isPaused
      ) {
        await new Promise((resolve) => setTimeout(resolve, this.waitTime));
      }
    }

    if (!this.isPaused && this.currentIndex >= this.sentenceStack.length) {
      this.onFinish();
      this.updateButtonVisibility("finished");
      this.whenPaused();
    }
  }

  reset() {
    this.isPaused = false;
    this.currentIndex = 0;
    responsiveVoice.cancel();
    this.updateButtonVisibility("reset"); // Update button visibility for reset state
  }

  updateButtonVisibility(state) {
    if (state === "playing") {
      if (this.playButton) this.playButton.style.display = "none";
      if (this.pauseButton) this.pauseButton.style.display = "grid";
      if (this.resumeButton) this.resumeButton.style.display = "none";
    } else if (state === "paused") {
      if (this.playButton) this.playButton.style.display = "none";
      if (this.pauseButton) this.pauseButton.style.display = "none";
      if (this.resumeButton) this.resumeButton.style.display = "grid";
    } else if (state === "reset" || state === "finished") {
      if (this.playButton) this.playButton.style.display = "grid";
      if (this.pauseButton) this.pauseButton.style.display = "none";
      if (this.resumeButton) this.resumeButton.style.display = "none";
    }
  }

    hasMoreToPlay() {
    return this.currentIndex < this.sentenceStack.length - 1;
  }

  isFinished() {
    return this.currentIndex >= this.sentenceStack.length - 1 && !this.isPaused;
  }
}

function clearEventListeners(element) {
  const newElement = element.cloneNode(true); // Clone the element
  element.replaceWith(newElement); // Replace old element with new
  return newElement; // Return the new element if you want to add listeners
}
