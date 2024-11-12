var img = document.getElementById("customModalImage");
let sendButton = document.querySelector("#sendMessage");
let inputText = document.querySelector("#final_speech");
let messagesView = document.querySelector(".chat-box");
let voiceButton = document.querySelector("#voiceButton");
const speakButton = document.getElementById("Speakshow");
let globalGenerator = null;

const talkingGif = "url('images/DuxNeuTalkGood.gif')";
const silentGif = "url('images/DuxProSilent.gif')";
const HiddleGif = "url('images/DuxProHiddleGood.gif')";
let hasfinishTalking = false;
let speaking = false; // Variable to track if currently speaking
let isSpeaking = false;
let introSpoken = false;
let currentSentenceIndex = -1;
let isLastSentenceSpoken = false;
let isPaused = false; // Variable to track if speech is paused
let sentences = []; // Store sentences for resume functionality

// Here we will keep the PDF text he wants
const uploadPDFStaticText = `Sayın başkan ve değerli katılımcılar. 

`;

// const uploadPDFStaticText = `Sayın başkan ve değerli katılımcılar.  Ben ey ay Profesör Daks. yapay zekâ öğretim üyesi olarak Yakın Doğu Üniversitesi’nde görev yapmaktayım. Sizlere bugün, kenelerin morfolojik özelliklerine göre tiplendirilip tanımlanması açısından ele aldığımız ‘kene türlerinin tanımlanmasında yeni dönem: hassasiyet ve hız için yapay zeka’ başlıklı araştırmamızdan ve geliştirdiğimiz web tabanlı uygulamadan bahsedeceğim.
// Bilindiği üzere, günümüzde yaşanan iklim değişiklikleri, savaşlar, göçler ve ekonomik krizler nedeni ile sadece insanlar değil aynı zamanda vektörler de bulundukları coğrafyalardan farklı bölgelere göç etmektedirler. Dünya Sağlık Örgütü de gelecekte vektör kaynaklı hastalıkların bir salgına neden olabileceği konusuna dikkat çekmektedir. Oluşabilecek bir salgının önlenebilmesi açısından vektör   tanımlanması ve takibi oldukça önemlidir. Vektör tanımlama çalışmaları sırasında, tiplendirmenin uzman bir entomolog tarafından yapılması ihtiyacı, tiplendirme çalışmalarının uzun sürmesi ve insan kaynaklı hatalar gibi çeşitli sorunlarla karşılaşılabilmektedir.
// Yürütülen bu çalışmada, Hyalomma ve Rhipicephalus kenelerinin yapay zekâ modeli kullanarak hızlı ve doğru tanısının sağlanması ve aynı zamanda web tabanlı bir uygulama geliştirilerek geniş kitleler tarafından kullanımı amaçlandı.
// Bu amaca yönelik olarak çalışmamızda Kıbrıs’ın çeşitli bölgelerinden toplanan 23’ü Rhipicephalus ve 12’si Hyalomma olmak üzere toplam 35 adet kene kullanıldı. Kenelerden, farklı açılardan çekilmiş, toplamda 19345 yüksek çözünürlüklü görüntü elde edildi. Çalışmada; VGG16, ResNet50 ve araştırmanın görüntü setine özel olarak geliştirilmiş bir CNN modeli olmak üzere üç farklı yapay zekâ modeli kullanıldı. Makine öğrenme modellerini test etmek amacıyla 3947 örnek kene görüntüsü kullanılarak modellerin doğruluk, özgüllük ve duyarlılık değerleri elde edildi. Kontrol grubu olarak 6000 adet çeşitli örümcek ve kene olmayan cisimlerin görüntüleri de çalışmaya dahil edildi. Çalışmamızın ikinci aşamasında ise, bu yenilikçi yaklaşımın hızlı, ulaşılır ve kolay kullanımını sağlamak amacı ile bir web uygulama arayüzü oluşturuldu. Uygulamamızın arayüzünü posterimizde bulunan Şekil 1’de görebilirsiniz. Şekil 1-a, uygulamanın veri giriş kısmını göstermekteyken. Şekil 1-b ise veri çıktısını yani tanımlamanın sonucunu göstermektedir.
// Çalışmamız neticesinde elde ettiğimiz bulgulara baktığımızda, VGG16 modelinin %99,57 doğruluk oranıyla en yüksek doğruluk oranına sahip model olarak öne çıktığını söyleyebiliriz. Bu modeli, %98,98 doğrulukla ResNet50 modeli ve ardından %95,71 doğruluk oranı ile CNN modeli takip etti. Modellere ait doğruluk, özgüllük ve duyarlılık değerlerini posterimizde bulunan Tablo 1’den görebilirsiniz. Ayrıca literatürde bulunan diğer modellerle, çalışmada kullanılan modellerin karşılaştırmaları da Tablo 1’de yer almaktadır. VGG16 ve ResNet50 modellerinin literatürde belirtilen modellere göre daha yüksek düzeyde doğruluk oranına sahip olduğunu rahatlıkla gözlemleyebilirsiniz.
// Sonuç olarak şunları söylemek mümkün , vektörel hastalıkların önlenmesinde sorumlu vektörün belirlenmesi ve vektörün özelliklerine göre mücadele kritik öneme sahiptir. Çalışmamızda yapay zekâ yöntemleri ve web tabanlı uygulamayla kene cinslerini hızlı ve güvenilir bir şekilde tiplendirilebildik. Basit arayüzü sayesinde geniş kitleler tarafından kolayca kullanılabilecek bu yapay zekâ tabanlı çözümün, kene kaynaklı salgınların önlenmesinde önemli bir role sahip olabileceğini düşünmekteyiz.
// Beni dinlediğimiz için teşekkür eder, sorularınız ve katkılarınız var ise dinlemeye hazırım.

// `;

let duxChat = new DuxChat();

duxChat.addSendButtonElement(sendButton);
duxChat.addTextBoxInputElement(inputText);
duxChat.addMessagesView(messagesView);
duxChat.addVoiceButton(voiceButton);
duxChat.startChatEngine();

// Function to create delay using Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function speakText(text, playButton, pauseButton, resumeButton) {
  if (!text || text.trim() === "") {
    console.log("No text provided");
    return;
  }

  const callbacks = { whileTalking, whenPaused };

  const language = detectLanguage(text);
  const voiceChosen =
    language === "turkish" ? "Turkish Male" : "UK English Male";

  sentences = text
    .split(/\.|\?|\!|:|,/) // Split text into sentences
    .filter((sentence) => sentence.trim() !== "");

  const generator = new SpeechGenerator(voiceChosen, callbacks);
  sentences.forEach((sentence) => generator.addSentence(sentence));

  console.log("oause button: ", pauseButton);
  generator.addPauseButton(pauseButton);
  generator.addPlayButton(playButton);
  generator.addResumeButton(resumeButton);

  return generator;
}

function detectLanguage(message) {
  // List of common Turkish words and unique characters
  const turkishCharacters = /[çğıöşüÇĞİÖŞÜ]/;
  const turkishWords = [
    "ve",
    "bu",
    "bir",
    "için",
    "ile",
    "de",
    "da",
    "çok",
    "ama",
    "çünkü",
    "yarın",
  ];

  // List of common English words
  const englishWords = [
    "the",
    "and",
    "is",
    "you",
    "that",
    "it",
    "of",
    "for",
    "with",
    "have",
    "be",
  ];

  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();

  // Check for unique Turkish characters
  if (turkishCharacters.test(lowerMessage)) {
    return "turkish";
  }

  // Count Turkish and English word matches
  let turkishMatchCount = 0;
  let englishMatchCount = 0;

  for (const word of turkishWords) {
    if (lowerMessage.includes(word)) {
      turkishMatchCount++;
    }
  }

  for (const word of englishWords) {
    if (lowerMessage.includes(word)) {
      englishMatchCount++;
    }
  }

  // Decide based on the counts
  if (turkishMatchCount > englishMatchCount) {
    return "turkish";
  } else if (englishMatchCount > turkishMatchCount) {
    return "english";
  }

  // Default to English if no conclusive match
  return "english";
}

function uploadPDF(input) {
  const file = input.files[0];

  if (file.type !== "application/pdf") {
    alert(`File ${file.name} is not a PDF file type`);
    return;
  }

  if (file) {
    console.log("this is my file: ", file);
    loadPDFIntoView(file, "#pdf-review-canvas");
    show(".start-presentation-overlay");
  }

  input.value = "";
}

function whileTalking() {
  speakButton.style.backgroundImage = talkingGif;
}

function whenPaused() {
  console.log("stoppppped");
  speakButton.style.backgroundImage = silentGif;
}

async function startPresentation() {
  hide(".start-presentation-overlay");
  show(".main-presentation-overlay");

  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const resumeButton = document.getElementById("resume");

  startNewSpeechWithGlobalGenerator(
    uploadPDFStaticText,
    playButton,
    pauseButton,
    resumeButton
  );
}

function startNewSpeechWithGlobalGenerator(
  text,
  playButton,
  pauseButton,
  resumeButton
) {
  if (globalGenerator && globalGenerator.hasMoreToPlay()) {
    globalGenerator.pause(); // Pause the current global speech
  }

  globalGenerator = speakText(text, playButton, pauseButton, resumeButton);
  globalGenerator.playAll();
}

function show(CSSIdentifier) {
  document.querySelector(CSSIdentifier).style.display = "grid";
}

function hide(CSSIdentifier) {
  document.querySelector(CSSIdentifier).style.display = "none";
}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = "grid";
}

function loadPDFIntoView(file, canvasCSSIdentifier) {
  const __canvas = document.querySelectorAll(canvasCSSIdentifier);
  __canvas.forEach((canvas) => showFirstPage(file, canvas));
}

async function showFirstPage(file, canvas) {
  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const pdfData = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    const page = await pdf.getPage(1);

    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
  };

  fileReader.readAsArrayBuffer(file);
}

function stopDuxFromTalking() {
  isPaused = true;
  console.log("Stopping speech."); // Debugging print
  responsiveVoice.cancel();
}
