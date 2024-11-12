let apiKey = "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";

const endpoint = "https://api.openai.com/v1/chat/completions";

class DuxChat {
  messagesView;
  isProcessingMessage = false; // Flag to prevent duplicate processing

  constructor(
    startMessage = "Beni dinlediğiniz için teşekkür ederim, sorularınız ve katkılarınız varsa dinlemeye hazırım."
  ) {
    this.startMessage = startMessage;
  }

  addTextBoxInputElement(textInput) {
    this.textInput = textInput;
    this.textInput.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 && !this.isProcessingMessage) {
        this.isProcessingMessage = true;
        this.initiateDuxResponse();
      }
    });
  }

  addSendButtonElement(button) {
    this.sendButton = button;
    this.sendButton.addEventListener("click", () => {
      if (!this.isProcessingMessage) {
        this.isProcessingMessage = true;
        this.initiateDuxResponse();
      }
    });
  }

  addMessagesView(view) {
    this.messagesView = view;
  }

  startChatEngine() {
    this.messagesView.innerHTML = "";
    this.renderDuxMessageFor(this.startMessage, this.startMessage, "forced");
  }

  renderMyMessage(message) {
    console.log("render msg is ca;;ed");
    const myMessageContainer = document.createElement("li");
    myMessageContainer.className = "mine";

    const myIcon = document.createElement("div");
    myIcon.className = "name-tag";
    myIcon.textContent = "ME";

    const myMessageText = document.createElement("div");
    myMessageText.className = "message-text";
    myMessageText.innerHTML = message;

    myMessageContainer.append(myIcon);
    myMessageContainer.append(myMessageText);
    this.messagesView.append(myMessageContainer);

    scrollDown(this.messagesView);
  }

  async initiateDuxResponse() {
    console.log("init respo is called");
    let message = this.textInput.textContent;
    if (message.length > 0) {
      this.renderMyMessage(message);
      this.textInput.textContent = "";

      let language = detectLanguage(message);
      let startingMessage;

      //TODO: This need modification @Clif & @Jeries
      if (language === "turkish") {
        startingMessage = `Give me a response to the input ${message} in the Turkish language.`;
      } else {
        startingMessage = `Give me a response to the input ${message} in the english language.`;
      }

      //NOTE: @AIR-TEAM, CORPUS and predefinedQA are available globally in pdftext.js
      let chunks = chunkArrayOfStrings(CORPUS);

      let querySearch = performSearch(message, chunks);
      console.log("query search: ", querySearch);
      const sourceText = querySearch.join(", ");
      console.log("search results: ", sourceText);

      let promptMessage = generateGPTPrompt({
        sourceText,
        startingMessage,
        predefinedQA,
      });

      this.renderDuxMessageFor(message, promptMessage);
    }

    this.isProcessingMessage = false;
  }

  async renderDuxMessageFor(message, promptMessage, type) {
    const loader = `
        <div class="dux-message-loader">
            <div class="sk-flow">
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
            </div>
        </div>`;

    const duxMessageContainer = document.createElement("li");
    duxMessageContainer.className = "foreign foreign-a";

    const duxIcon = document.createElement("div");
    duxIcon.className = "name-tag";
    duxIcon.textContent = "DU";

    const duxMessageText = document.createElement("div");
    duxMessageText.className = "message-text";
    duxMessageText.innerHTML = loader;

    const duxListenButton = document.createElement("div");
    duxListenButton.className = "play-button";

    const duxListenIcon = document.createElement("img");
    duxListenIcon.src = "assets/icons/speaker.png";
    duxListenButton.append(duxListenIcon);

    const duxPauseButton = document.createElement("div");
    duxPauseButton.className = "play-button pause";

    const duxPauseIcon = document.createElement("img");
    duxPauseIcon.src = "assets/icons/pause.png";
    duxPauseButton.append(duxPauseIcon);

    const duxResumeButton = document.createElement("div");
    duxResumeButton.className = "play-button resume";

    const duxResumeIcon = document.createElement("img");
    duxResumeIcon.src = "assets/icons/resume.png";
    duxResumeButton.append(duxResumeIcon);

    duxMessageContainer.append(duxIcon);
    duxMessageContainer.append(duxMessageText);
    duxMessageContainer.append(duxListenButton);
    duxMessageContainer.append(duxPauseButton);
    duxMessageContainer.append(duxResumeButton);
    this.messagesView.append(duxMessageContainer);

    let responseMessage;

    if (type !== "forced")
      responseMessage = await generateReponseFromGPT(promptMessage, apiKey);
    else responseMessage = message;

    const playButton = duxListenButton;
    const pauseButton = duxPauseButton;
    const resumeButton = duxResumeButton;

    let generator = speakText(
      responseMessage,
      playButton,
      pauseButton,
      resumeButton
    );

    duxMessageText.innerHTML = "";
    duxMessageText.textContent = responseMessage;
    if (globalGenerator)
      if (globalGenerator.hasMoreToPlay()) globalGenerator.pauseButton.click();

    if(type !== "forced") {
      generator.playButton.click();
    }

    if (globalGenerator)
      if (globalGenerator.hasMoreToPlay()) globalGenerator.resumeButton.click();

    scrollDown(this.messagesView);
  }

  // Function to create delay using Promise

  addVoiceButton(voiceButton) {
    voiceButton.addEventListener("mousedown", () => this.startListening());
    voiceButton.addEventListener("mouseup", () => this.stopListening());
  }

  startListening() {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert(
        "Your browser does not support speech recognition. Please use Google Chrome."
      );
      return;
    }

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = "tr-TR"; // Set to Turkish

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      if (!this.isProcessingMessage) {
        this.isProcessingMessage = true;
        //this.renderMyMessage(transcript);
        console.log("setting text ");
        this.textInput.textContent = transcript;
        this.initiateDuxResponse();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error detected:", event.error);
    };
  }

  stopListening() {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.stop();
    }
  }
}

async function generateReponseFromGPT(message, apiKey) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Correct model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from OpenAI API:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from OpenAI:", data.choices[0].message.content);

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error continuing thread:", error);
  }
}

function scrollDown(container) {
  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
}
