
const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.6.9",
    role: 0,
    author: "【﻿ＰＲＯＴＩＣＫ】",
    category: "system",
    countDowns: 3,
    Description: "Show command list",
    guide: {
      en: "{p}{n}",
    }
  },

  onStart: async function ({ api, event, args, getText, threadsData, role }) {
    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);

    const commandName = args[0]?.toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (args[0] && isNaN(parseInt(args[0]))) {
      if (!command) {
        return api.sendMessage(`Command "${commandName}" not found.`, threadID, messageID);
      }

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const author = configCommand.author || "Unknown";
      const Description = configCommand.description?.en || "No description available.";
      const shortDescription = configCommand.shortDescription?.en || "No description available.";
      const usage = (configCommand.guide?.en || "No guide available.")
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);

      let msg = `✨ Command Information ✨\n`;
      msg += `• Name: ${configCommand.name}\n`;
      msg += `• Version: ${configCommand.version}\n`;
      msg += `• Role Required: ${roleText}\n`;
      msg += `• Author: ${author}\n`;
      msg += `• Category: ${configCommand.category}\n`;
      msg += `• Description: ${configCommand.Description}\n`;
      msg += `• shortDescription: ${configCommand.shortDescription}\n`;
      msg += `• Guide: ${usage}\n`;
      msg += `• Cooldown Time: ${configCommand.countDown} seconds\n`;
      msg += `• Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n`;

      return api.sendMessage(msg, threadID, messageID);
    }

    if (!commands || commands.size === 0) {
      return api.sendMessage("Command list is not available at the moment.", threadID, messageID);
    }

    const allCommands = [];
    for (const [name, value] of commands) {
      if (value.config.role > 1 && role < value.config.role) continue; // Filter based on role
      allCommands.push(name);
    }

    const totalCommands = allCommands.length;
    const numberOfOnePage = Math.ceil(totalCommands / 3);
    const startPage = parseInt(args[0]) || 1;
    const page = Math.max(Math.min(startPage, 3), 1);

    const startIndex = (page - 1) * numberOfOnePage;
    const endIndex = Math.min(startIndex + numberOfOnePage, totalCommands);

    let msg = "💫 𝗕𝗼𝘁 𓂃♡ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𓂃♡ 𝗟𝗶𝘀𝘁 💫\n\n";
    msg += "╭───────────────────────────────────────╮\n";
    msg += `│ 𝗣𝗮𝗴𝗲 ${page} / 3\n`;
    msg += "├───────────────╮\n";

    for (let i = startIndex; i < endIndex; i++) {
      msg += `│ • ✨${allCommands[i]}✨\n`; // Listing commands
    }

    msg += "╰───────────────────────────────────────╯\n\n";
    msg += `🔰 Total Command of this Bot ✨: ${totalCommands}\n`;
    msg += `🤍 Owner: 【﻿ＰＲＯＴＩＣＫ】\n`;
    msg += `🌸 Bot Name: ${global.GoatBot.config.nickNameBot}\n`;
    msg += `💙 Bot Prefix: ${prefix}\n`;

    const link = "https://m.facebook.com/protick.mrc/";
    msg += `\n📌💫 Use "${prefix}joingc" to join my group.\n`;
    msg += `📌💫 Or click here to join directly: ${link}\n`;

    const imageUrl = "https://i.imgur.com/gs8PSXG.jpeg";
    const imagePath = __dirname + `/cache/commands.jpg`;

    request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imagePath)
      }, threadID, (error) => {
        fs.unlinkSync(imagePath);
        if (error) {
          console.error("Error sending image:", error);
        }
      });
    });

    return;
  }
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "All Users";
    case 1:
      return "Group Admins";
    case 2:
      return "Bot Admins";
    default:
      return "Unknown Permission";
  }
}
