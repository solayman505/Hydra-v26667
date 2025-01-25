const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI configuration with your API key
const configuration = new Configuration({
  apiKey: "sk-abcdef1234567890abcdef1234567890abcdef12",  // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

// Function to get a reply in Bangla
async function getBanglaReply(prompt) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",  // Use a GPT model
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = response.data.choices[0].text.trim();
    console.log("Reply in Bangla:", reply);
    return reply;
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

// Example usage:
const prompt = "bot";  // Input prompt in Bangla
getBanglaReply(prompt);
