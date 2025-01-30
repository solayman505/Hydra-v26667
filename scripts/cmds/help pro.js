const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    role: 0,
    author: "【﻿ＰＲＯＴＩＣＫ】",
    category: "system",
    countDowns: 3,
    description: "Show command list with enhanced formatting.",
    guide: {
      en: "{p}{n} or {p}{n} <command>",
    }
  },

  onStart: async function ({ api, event, args, role }) {
    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);
    
    // If no specific command is requested, show categorized command list
    if (!args[0]) {
      const categories = {};
      commands.forEach((cmd, name) => {
        if (cmd.config.role > role) return;
        const category = cmd.config.category || "Others";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      });

      function formatCommands(commandsArray) {
        const rows = [];
        for (let i = 0; i < commandsArray.length; i += 3) {
          rows.push(commandsArray.slice(i, i + 3).map(cmd => `✨ ${cmd}`).join(" | "));
        }
        return rows.join("\n");
      }

      let msg = "🌟 **Bot Command List** 🌟\n\n";
      Object.entries(categories).forEach(([category, cmdList]) => {
        msg += `📌 **${category.toUpperCase()}**\n`;
        msg += `${formatCommands(cmdList)}\n\n`;
      });

      const totalCommands = commands.size;
      msg += `🔹 **Total Commands:** ${totalCommands}\n`;
      msg += `🔹 **Prefix:** ${prefix}\n`;
      msg += `🔹 **Owner:** 【﻿ＰＲＯＴＩＣＫ】\n`;
      msg += `🔹 Type '${prefix}help <cmd>' for command details.\n`;

      // Adding Image Attachment
      const imageUrl = "https://i.imgur.com/gs8PSXG.jpeg"; // Image link
      const imagePath = __dirname + `/cache/help.jpg`;

      request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imagePath)
        }, threadID, (error, info) => {
          fs.unlinkSync(imagePath);
          if (!error) {
            setTimeout(() => {
              api.unsendMessage(info.messageID);
            }, 40000); // Auto-delete after 40 seconds
          }
        });
      });

      return;
    }

    // Fetch command details if a specific command is requested
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) return api.sendMessage(`⚠️ Command "${commandName}" not found.`, threadID, messageID);

    const configCommand = command.config;
    const roleText = roleTextToString(configCommand.role);
    const author = configCommand.author || "Unknown";
    const description = configCommand.description?.en || "No description available.";
    const shortDescription = configCommand.shortDescription?.en || "No description available.";
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
    detailMsg += `🔹 **Short Description:** ${shortDescription}\n`;
    detailMsg += `🔹 **Usage:** ${usage}\n`;
    detailMsg += `🔹 **Cooldown:** ${configCommand.countDowns} seconds\n`;
    detailMsg += `🔹 **Aliases:** ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n`;

    const sentMessage = await api.sendMessage(detailMsg, threadID, messageID);
    setTimeout(() => {
      api.unsendMessage(sentMessage.messageID);
    }, 40000);
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
