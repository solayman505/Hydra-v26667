const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "【﻿ＰＲＯＴＩＣＫ】", // Updated author
    countDown: 3, // Updated countDown
    role: 0,
    shortDescription: "Get a list of all commands or command details.",
    longDescription: "Displays a categorized list of commands or detailed information about a specific command.",
    category: "general",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);

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
          rows.push(commandsArray.slice(i, i + 3).join(" ❃ "));
        }
        return rows.join("\n| ❃ ");
      }

      let response = "💫 𝗕𝗼𝘁 𓂃♡ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𓂃♡ 𝗟𝗶𝘀𝘁 💫\n\n";
      response += "╭───────────────────────────────────────╮\n";
      Object.entries(categories).forEach(([category, cmdList]) => {
        response += `│ ${category.toUpperCase()}\n`;
        response += `├───────────────╮\n`;
        response += `│ ❃ ${formatCommands(cmdList)}\n`;
        response += "╰───────────────────────────────────────╯\n\n";
      });

      const totalCommands = commands.size;

      response += `🔰 Total Command of this Bot ✨: ${totalCommands}\n`;
      response += `🤍 Owner: 【﻿ＰＲＯＴＩＣＫ】\n`;
      response += `🌸 Bot Name: ${global.GoatBot.config.nickNameBot}\n`;
      response += `💙 Bot Prefix: ${prefix}\n`;

      const link = "https://m.facebook.com/protick.mrc/";
      response += `\n📌💫 Use "${prefix}joingc" to join my group.\n`;
      response += `📌💫 Or click here to join directly: ${link}\n`;

      const imageUrl = "https://i.imgur.com/gs8PSXG.jpeg"; // Random image from cd1
      const imagePath = __dirname + `/cache/commands.jpg`;

      request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
        message.reply({
          body: response,
          attachment: fs.createReadStream(imagePath)
        }, (error) => {
          fs.unlinkSync(imagePath);
          if (error) {
            console.error("Error sending image:", error);
          }
        });
      });

      return;
    }

    const configCommand = commands.get(args[0]) || aliases.get(args[0]);
    if (!configCommand) return message.reply(`⚠️ Command '${args[0]}' not found.`);

    const roleText = getRoleName(configCommand.config.role);
    const author = configCommand.config.author || "Unknown";
    const description = configCommand.config.longDescription || configCommand.config.shortDescription || "No description available.";
    const usage = (configCommand.config.guide || "No guide available.")
      .replace(/{pn}/g, prefix + configCommand.config.name)
      .replace(/{p}/g, prefix)
      .replace(/{n}/g, configCommand.config.name);

    let msg = `✨ Command Information ✨\n\n`;
    msg += `📜 Name: ${configCommand.config.name}\n`;
    msg += `🛸 Version: ${configCommand.config.version}\n`;
    msg += `🔖 Permission: ${roleText}\n`;
    msg += `👑 Author: ${author}\n`;
    msg += `💠 Category: ${configCommand.config.category}\n`;
    msg += `🌊 Description: ${description}\n`;
    msg += `🏷️ Guide: ${usage}\n`;
    msg += `🕰️ Cooldowns: ${configCommand.config.countDown} seconds\n`;
    msg += `📜 Aliases: ${configCommand.config.aliases ? configCommand.config.aliases.join(", ") : "None"}\n`;

    const sentMessage = await message.reply(msg);

    setTimeout(() => {
      message.unsend(sentMessage.messageID);
    }, 40000);
  },
};

function getRoleName(role) {
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
