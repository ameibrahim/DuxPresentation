class QueueSentencesForSpeaking {
  sentences;
  currentSentenceIndex = 0;
  totalSentences;
  isPaused = false;

  voice = "UK English Male";

  constructor(sentences) {
    this.sentences = sentences;
    this.totalSentences = this.sentences.length;
  }

  async play(sentence) {
    this.isDone = false;
    this.currentSentenceIndex++;

    return new Promise((resolve) => {

    });
  }

  moreToPlay() {
    return this.currentSentenceIndex < this.totalSentences;
  }

  done() {
    // speakButton.style.backgroundImage = silentGif;
    this.isDone = true;
    this.currentSentenceIndex = 0;
    this.isPaused = false;
  }

  pause() {
    responsiveVoice.cancel()
    if(!this.isPaused && this.currentSentenceIndex > 0) this.currentSentenceIndex--;
    console.log("paused: ", this.currentSentenceIndex)
    this.isPaused = true;
  }

  playAll() {
    if(this.isPaused) this.isPaused = false;
    console.log("index: ", this.currentSentenceIndex)
    this.play(this.sentences[this.currentSentenceIndex]);
    console.log("index: ", this.currentSentenceIndex)
    if (this.moreToPlay() && !this.isPaused) this.playAll();
    else this.done();
  }
}
