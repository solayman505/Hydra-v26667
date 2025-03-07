const axios = require("axios");

module.exports = {
  config: {
    name: "agify",
    version: "1.0",
    author: "Lahatra",
    shortDescription: {
      en: "Get the approximate age of a person based on their first name",
    },
    longDescription: {
      en: "This command returns the approximate age of a person based on their first name. Usage: !agify [first name]",
    },
    category: "fun",
    guide: {
      en: "{prefix}agify [first name]",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (args.length === 0) {
        api.sendMessage("Oops, you need to specify a first name to get an approximate age!", event.threadID, event.messageID);
        return;
      }

      const name = args[0];
      const url = `https://api.agify.io/?name=${encodeURIComponent(name)}`;

      const response = await axios.get(url);
      const age = response.data.age;

      api.sendMessage(`According to my calculations, ${name} is approximately ${age} years old. But hey, it's just an estimate!`, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("Oops, I couldn't find the estimated age for this person... Sorry!", event.threadID, event.messageID);
    }
  },
};
