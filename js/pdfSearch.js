function generateGPTPrompt({ sourceText, startingMessage, predefinedQA }) {
  // Construct the prompt starting with the user's question
  let prompt = `You are Prof Dux, an AI lecturer at Near East University. Only state who you are when explicitly asked questions like "Who are you?" or "Sen kimsin?" and respond in the language used in the question. If asked in Turkish, respond in Turkish.\n\n${startingMessage}\n\n`;


  // If source text is provided, append it as additional context
  // prompt +=
  //   sourceText.length > 0
  //     ? `Please use the following source information 1 and 2 to guide your response: \n\n source 1 - [${sourceText}]\n\n`
  //     : "";

  // Guide the model to respond to the user's question using the predefined Q&A list
  prompt +=
    `Please respond to the user's question by selecting the most relevant answer from the list of predefined questions and answers below. ` +
      sourceText.length >
    0
      ? `as well as the following source information \n\n source - [${sourceText}]\n\n `
      : "" +
        `Ensure the response matches the meaning of the user's question, even if the wording is slightly different. ` +
        `Here is the list of questions and answers:\n\n`;

  // Loop over each question-answer pair and add it to the prompt
  for (const [question, answer] of Object.entries(predefinedQA)) {
    prompt += `Q: "${question}"\nA: "${answer}"\n\n`;
  }

  // Add instructions for handling unmatched questions
  prompt +=
    `If you cannot find an exact answer in the above list or source information, provide a well-informed response using your general knowledge, ` +
    `but do not mention the absence of information, any lack of data, or that it was not in the provided materials.\n`;

  return prompt;
}

function performSearch(query, corpus) {
  const matches = [];
  const keywords = query.toLowerCase().split(" "); // Split the query into individual keywords

  console.log("keywords: ", keywords);

  // Iterate through each paragraph in the corpus
  corpus.forEach((paragraph) => {
    const text = paragraph.toLowerCase(); // Lowercase the paragraph text for case-insensitive comparison
    const keywordCount = countKeywords(text, keywords); // Count the occurrences of the keywords

    // If there are keyword matches, calculate a relevance score and store the paragraph
    if (keywordCount > 0) {
      const relevanceScore = calculateRelevance(text, keywords);
      matches.push({ paragraph, relevanceScore });
    }
  });

  // Sort matches by relevance score in descending order and pick the top 5
  matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return matches.slice(0, 5).map((match) => match.paragraph); // Return the first 5 matching paragraphs based on the highest relevance scores
}

// Helper function to count the number of keyword matches in a paragraph
function countKeywords(text, keywords) {
  return keywords.reduce((count, keyword) => {
    return count + (text.includes(keyword) ? 1 : 0);
  }, 0);
}

// Helper function to calculate the relevance score of a paragraph based on keyword occurrences
function calculateRelevance(text, keywords) {
  // Initialize the relevance score
  let score = 0;

  // For each keyword, count how many times it appears in the text
  keywords.forEach((keyword) => {
    const keywordRegex = new RegExp(keyword, "g"); // Create a regex to find all occurrences of the keyword
    const matches = text.match(keywordRegex); // Get all matches for the keyword in the paragraph
    score += matches ? matches.length : 0; // Add the number of matches to the score
  });

  return score;
}

function cleanText(text) {
  // Remove extra spaces, newlines, and trim leading/trailing whitespace
  return text
    .replace(/\s+/g, " ") // Replace all consecutive spaces, tabs, and newlines with a single space
    .replace(/^\s+|\s+$/g, "") // Trim leading and trailing spaces
    .replace(/\n/g, " "); // Replace any newline characters with a space
}

function chunkText(text, minWords = 20, maxWords = 50) {
  const cleanedText = cleanText(text); // Clean the text before processing
  const words = cleanedText.split(" "); // Split the cleaned text into words
  const chunks = [];
  let currentChunk = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);

    // If the chunk is large enough or we are at the last word
    if (
      currentChunk.length >= minWords &&
      (currentChunk.length >= maxWords || i === words.length - 1)
    ) {
      chunks.push(currentChunk.join(" ")); // Join the words to form a chunk
      currentChunk = []; // Reset the current chunk
    }
  }

  return chunks; // Return an array of chunks
}

function chunkArrayOfStrings(textArray) {
  const allChunks = [];

  // For each string in the array, chunk it into smaller paragraphs
  textArray.forEach((text) => {
    const chunks = chunkText(text);
    allChunks.push(...chunks); // Add all chunks to the result array
  });

  return allChunks; // Return all the chunks
}

// // Example usage
// const query = "what is rhipicephalus?";

// let chunks = chunkArrayOfStrings(corpus);
// let querySearch = performSearch(query, chunks);
// // console.log("shunks: ", chunks);
// console.log("query search: ", querySearch);
// const results = querySearch.join(", ");
// console.log("search results: ", results);
// console.log(generateGPTPrompt(results));
