const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");
module.exports = {
  config: {
    name: "battlefield",
    version: "1.0.0",
    hasPermission: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "battlefield",
    commandCategory: "random-img",
    cooldowns: 0,
  },

  run: async function ({ api, event, args, utils, Users, Threads }) {
    try {
      let { threadID, senderID, messageID } = event;
      let text = args.join(" ");
      if (!text)
        return api.sendMessage(
          'Please enter the correct format [text1 | text2]!',
          event.threadID,
          event.messageID
        );
      const length_0 = parseInt(text.length);
      const text1 = text.substr(0, text.indexOf(" | "));
      if (!text1)
        return api.sendMessage(
          'Please enter the correct format [text1 | text2 ]!',
          event.threadID,
          event.messageID
        );
      const length = parseInt(text1.length);
      const text2 = text.split(" | ").pop();
      if (!text2)
        return api.sendMessage(
          'Please enter the correct format [text1 | text2 ]!',
          event.threadID,
          event.messageID
        );
      const length_2 = parseInt(text2.length);
      const res = await axios.get(
        `https://cakrayp.herokuapp.com/api/textmaker/photooxy?text=${text1}&text2=${text2}&theme=battlefield&apikey=cakrayp24Q6&responsetype=json`
      );
      console.log(res.data);
      var data = res.data;
      let callback = function () {
        return api.sendMessage(
          {
            body: ``,
            attachment: fs.createReadStream(__dirname + `/cache/image.png`),
          },
          event.threadID,
          () => fs.unlinkSync(__dirname + `/cache/image.png`),
          event.messageID
        );
      };
      return request(encodeURI(data.result.image_url))
        .pipe(fs.createWriteStream(__dirname + `/cache/image.png`))
        .on("close", callback);
    } catch (err) {
      console.log(err);
      return api.sendMessage(`Error`, event.threadID);
    }
  },
};
