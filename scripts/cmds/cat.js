const axios = require('axios');

module.exports = {
  config: {
    name: 'cat',
    aliases: ['catfact'],
    version: '1.2',
    author: 'JV',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Sends a random cat image with a fact.',
      bn: 'একটি এলোমেলো বিড়ালের ছবি এবং তথ্য পাঠায়।'
    },
    longDescription: {
      en: 'Sends a random cat image fetched from the CatAPI along with an interesting cat fact.',
      bn: 'CatAPI থেকে একটি এলোমেলো বিড়ালের ছবি নিয়ে এবং একটি আকর্ষণীয় বিড়াল তথ্য সহ পাঠায়।'
    },
    guide: {
      en: '{pn}',
      bn: '{pn} কমান্ড ব্যবহার করুন একটি বিড়ালের ছবি এবং তথ্য পেতে।'
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const [imageResponse, factResponse] = await Promise.all([
        axios.get('https://api.thecatapi.com/v1/images/search'),
        axios.get('https://catfact.ninja/facts')
      ]);

      if (!imageResponse.data[0]?.url) throw new Error('Invalid or missing response from CatAPI');
      if (!factResponse.data?.data || factResponse.data.data.length === 0) throw new Error('Invalid or missing cat facts');

      const imageURL = imageResponse.data[0].url;
      const facts = factResponse.data.data;
      const factText = facts[Math.floor(Math.random() * facts.length)].fact;

      // Translate to Bangla
      const translateResponse = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(factText)}&langpair=en|bn`);
      const translatedFact = translateResponse.data.responseData.translatedText;

      const stream = await global.utils.getStreamFromURL(imageURL);
      if (!stream) throw new Error('Failed to fetch image from URL');

      await api.sendMessage({
        body: `🐱 Cat Fact:
        🇧🇩 ${translatedFact}`,
        attachment: stream
      }, event.threadID);
    } catch (error) {
      console.error(`Failed to send cat image: ${error.message}`);
      api.sendMessage('Failed to send cat image', event.threadID);
    }
  }
};
