const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const cooldowns = new Map(); // User cooldown tracking

module.exports = {
  config: {
    name: "help",
    version: "3.3",
    role: 0,
    author: "【﻿ＰＲＯＴＩＣＫ】",
    category: "system",
    countDowns: 3,
    description: "Enhanced Help Command with Anime Girls!",
    guide: {
      en: "{p}{n} [page] or {p}{n} <command>",
    }
  },

  onStart: async function ({ api, event, args, role }) {
    const { threadID, messageID, senderID } = event;
    const prefix = getPrefix(threadID);

    // Cooldown Handling
    if (cooldowns.has(senderID)) {
      const timeLeft = ((cooldowns.get(senderID) - Date.now()) / 1000).toFixed(1);
      if (timeLeft > 0) return api.sendMessage(`⏳ Please wait ${timeLeft}s before using 'help' again!`, threadID, messageID);
    }
    cooldowns.set(senderID, Date.now() + 5000); // 5s cooldown

    // If specific command details are requested
    if (args[0] && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) return api.sendMessage(`⚠️ Command "${commandName}" not found.`, threadID, messageID);

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const author = configCommand.author || "Unknown";
      const description = configCommand.description?.en || "No description available.";
      const usage = (configCommand.guide?.en || "No guide available.")
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);

      let detailMsg = `📜 **Command Information** 📜\n\n`;
      detailMsg += `🔹 **Name:** ${configCommand.name}\n`;
      detailMsg += `🔹 **Version:** ${configCommand.version}\n`;
      detailMsg += `🔹 **Required Role:** ${roleText}\n`;
      detailMsg += `🔹 **Author:** ${author}\n`;
      detailMsg += `🔹 **Category:** ${configCommand.category}\n`;
      detailMsg += `🔹 **Description:** ${description}\n`;
      detailMsg += `🔹 **Usage:** ${usage}\n`;
      detailMsg += `🔹 **Cooldown:** ${configCommand.countDowns} seconds\n`;
      detailMsg += `🔹 **Aliases:** ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n`;

      const sentMessage = await api.sendMessage(detailMsg, threadID, messageID);
      setTimeout(() => api.unsendMessage(sentMessage.messageID), 40000);
      return;
    }

    // Command Listing with 70 Commands Per Page
    const allCommands = [...commands.keys()].filter(cmd => commands.get(cmd).config.role <= role);
    const totalCommands = allCommands.length;
    const commandsPerPage = 70;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    const page = Math.max(1, Math.min(totalPages, parseInt(args[0]) || 1));

    let msg = `🌟 **Bot Command List (Page ${page}/${totalPages})** 🌟\n\n`;
    const startIdx = (page - 1) * commandsPerPage;
    const endIdx = Math.min(startIdx + commandsPerPage, totalCommands);

    for (let i = startIdx; i < endIdx; i++) {
      const cmd = commands.get(allCommands[i]);
      msg += `✨ **${cmd.config.name}** - ${cmd.config.shortDescription || "No description"}\n`;
    }

    msg += `\n📌 **Use "${prefix}help <command>" for details.**\n`;
    msg += `📌 **Use "${prefix}help [page]" to navigate pages.**\n`;
    msg += `\n🔹 **Total Commands:** ${totalCommands}\n`;
    msg += `🔹 **Prefix:** ${prefix}\n`;
    msg += `🔹 **Owner:** 【﻿ＰＲＯＴＩＣＫ】\n`;

    // Interactive Buttons (If your bot supports buttons)
    const buttons = [
      { label: "⬅️ Previous", command: `${prefix}help ${Math.max(1, page - 1)}` },
      { label: "➡️ Next", command: `${prefix}help ${Math.min(totalPages, page + 1)}` }
    ];

    // Random Anime Girl Image Selection
    const animeImages = [
      "https://i.imgur.com/a1N0bVJ.jpg",
      "https://i.imgur.com/xGfjK9U.jpg",
      "https://i.imgur.com/VKzHPnQ.jpg",
      "https://i.imgur.com/PyJQ9Ys.jpg",
      "https://i.imgur.com/Uc8hQX5.jpg",
      "https://i.imgur.com/Nu1yPZi.jpg",
      "https://i.imgur.com/YIjx6bb.jpg",
      "https://i.imgur.com/Qz8Ee2e.jpg",
      "https://i.imgur.com/9ZPVOVl.jpg",
      "https://i.imgur.com/R5TBzA4.jpg"
    ];
    const randomImage = animeImages[Math.floor(Math.random() * animeImages.length)];
    const imagePath = __dirname + `/cache/help.jpg`;

    request(randomImage).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imagePath),
        buttons: buttons.map(b => ({ type: "postback", title: b.label, payload: b.command }))
      }, threadID, (error, info) => {
        fs.unlinkSync(imagePath);
        if (!error) {
          setTimeout(() => api.unsendMessage(info.messageID), 60000);
        }
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
