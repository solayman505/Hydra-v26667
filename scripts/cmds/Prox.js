const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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', // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

async function getAIResponse(message) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 150,
  });
  return response.data.choices[0].text.trim();
}

module.exports = {bot};
