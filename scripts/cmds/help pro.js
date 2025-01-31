const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.6.9",
    role: 0,
    author: "【ＰＲＯＴＩＣＫ】",
    category: "system",
    countDowns: 3,
    description: "Show command list",
    shortDescription: "Displays a categorized list of commands or detailed info about a command.",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ api, event, args, role }) {
    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);

    // Image Links (Random Selection)
    const imageLinks = [
      "https://i.imgur.com/gs8PSXG.jpeg",
      "https://i.imgur.com/abc123.jpg",
      "https://i.imgur.com/def456.jpg",
      "https://i.imgur.com/ghi789.jpg",
      "https://i.imgur.com/jkl012.jpg"
    ];
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imagePath = __dirname + `/cache/help.jpg`;

    const commandName = args[0]?.toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (args[0] && isNaN(parseInt(args[0]))) {
      if (!command) {
        return api.sendMessage(`⚠️ Command "${commandName}" not found.`, threadID, messageID);
      }

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const author = configCommand.author || "Unknown";
      const description = configCommand.description || configCommand.shortDescription || "No description available.";
      const usage = (configCommand.guide || "No guide available.")
        .replace(/{pn}/g, prefix + configCommand.name)
        .replace(/{p}/g, prefix)
        .replace(/{n}/g, configCommand.name);

      let msg = `📜 Command Information 🔖\n\n`;
      msg += `📜 Name: ${configCommand.name}\n`;
      msg += `🛸 Version: ${configCommand.version}\n`;
      msg += `🔖 Permission: ${roleText}\n`;
      msg += `👑 Author: ${author}\n`;
      msg += `💠 Category: ${configCommand.category}\n`;
      msg += `🌊 Description: ${description}\n`;
      msg += `🏷️ Guide: ${usage}\n`;
      msg += `🕰️ Cooldowns: ${configCommand.countDowns} seconds\n`;
      msg += `📜 Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n`;

      request(randomImage).pipe(fs.createWriteStream(imagePath)).on("close", () => {
        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imagePath)
        }, threadID, (error, info) => {
          fs.unlinkSync(imagePath);
          setTimeout(() => api.unsendMessage(info.messageID), 40000);
        });
      });

      return;
    }

    const allCommands = [];
    for (const [name, value] of commands) {
      if (value.config.role > 1 && role < value.config.role) continue;
      allCommands.push(name);
    }

    const totalCommands = allCommands.length;
    const numberOfOnePage = Math.ceil(totalCommands / 4);
    const startPage = parseInt(args[0]) || 1;
    const page = Math.max(Math.min(startPage, 4), 1);

    const startIndex = (page - 1) * numberOfOnePage;
    const endIndex = Math.min(startIndex + numberOfOnePage, totalCommands);

    let msg = "💫 𝗕𝗼𝘁 𓂃♡ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𓂃♡ 𝗟𝗶𝘀𝘁 💫\n\n";
    msg += `│ 𝗣𝗮𝗴𝗲 ${page} / 4\n`;

    for (let i = startIndex; i < endIndex; i++) {
      msg += `✨ ${allCommands[i]}\n`;
    }

    msg += `\n🔰 Total Commands: ${totalCommands}\n`;
    msg += `🤍 Owner: 【ＰＲＯＴＩＣＫ】\n`;
    msg += `🌸 Bot Name: ${global.GoatBot.config.nickNameBot}\n`;
    msg += `💙 Prefix: ${prefix}\n`;

    request(randomImage).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imagePath)
      }, threadID, (error, info) => {
        fs.unlinkSync(imagePath);
        setTimeout(() => api.unsendMessage(info.messageID), 40000);
      });
    });
  }
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "Everyone";
    case 1:
      return "Group Admins";
    case 2:
      return "Bot Admins";
    default:
      return "Unknown Role";
  }
}
