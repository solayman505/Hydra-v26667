const anyanime = require("anyanime");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "animegif",
    version: "1.1",
    author: "SiAM",
    countDown: 5,
    role: 0,
    shortDescription: "Get a random anime GIF",
    longDescription: "Bot will send you a random short anime GIF",
    category: "media",
    guide: "To use this command, simply type {pn}"
  },

  onStart: async function ({ api, args, message }) {
    try {
      const animeGif = await anyanime.getAnime({ type: "gif", number: 1 });
      const gifUrl = animeGif[0];
      const buffer = await axios.get(gifUrl, { responseType: "arraybuffer" });
      const time = Date.now();
      fs.writeFileSync(`${time}_anime.gif`, buffer.data);
      message.reply({
        body: `Here's a random anime GIF for you! 🎉`,
        attachment: fs.createReadStream(`${time}_anime.gif`)
      }, () => fs.unlinkSync(`${time}_anime.gif`));
    } catch (error) {
      console.error(error);
      message.reply(`Sorry, couldn't fetch an anime GIF at the moment. Please try again later.`);
    }
  }
};
