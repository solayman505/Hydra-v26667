const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const request = require("request");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "help",
    version: "1.1",
    author: "【ＰＲＯＴＩＣＫ】",
    countDown: 10,
    role: 0,
    shortDescription: "Get a list of all commands or command details.",
    longDescription: "Displays a categorized list of commands or detailed information about a specific command.",
    category: "general",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);
    
    // Image Links (Random Selection)
    const imageLinks = [
      "https://i.imgur.com/abc123.jpg",
      "https://i.imgur.com/def456.jpg",
      "https://i.imgur.com/ghi789.jpg",
      "https://i.imgur.com/jkl012.jpg",
      "https://i.imgur.com/mno345.jpg"
    ];
    
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imagePath = __dirname + `/cache/help.jpg`;

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

      // Pagination Logic (4 Pages)
      const allCommands = Object.entries(categories);
      const totalPages = 4;
      const page = Math.max(1, Math.min(totalPages, parseInt(args[0]) || 1));
      const commandsPerPage = Math.ceil(allCommands.length / totalPages);
      const start = (page - 1) * commandsPerPage;
      const end = Math.min(start + commandsPerPage, allCommands.length);

      let response = `📜 Available Commands - Page ${page}/${totalPages} 📜\n\n`;
      for (let i = start; i < end; i++) {
        const [category, cmdList] = allCommands[i];
        response += `| ${category.toUpperCase()} |\n`;
        response += `| ❃ ${formatCommands(cmdList)}\n\n`;
      }

      response += `⚒️ Bot has: ${commands.size} Commands\n`;
      response += `🛸 Prefix: ${prefix}\n`;
      response += `👑 Owner: 【ＰＲＯＴＩＣＫ】\n\n`;
      response += `Type '${prefix}help <cmdName>' to see detailed information about a specific command.`;

      request(randomImage).pipe(fs.createWriteStream(imagePath)).on("close", async () => {
        const sentMessage = await message.reply({
          body: response,
          attachment: fs.createReadStream(imagePath),
        });

        setTimeout(() => {
          message.unsend(sentMessage.messageID);
          fs.unlinkSync(imagePath);
        }, 1200000); // 20 minutes auto-delete
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

    let msg = `📜 Command Information 🔖\n\n`;
    msg += `📜 Name: ${configCommand.config.name}\n`;
    msg += `🛸 Version: ${configCommand.config.version}\n`;
    msg += `🔖 Permission: ${roleText}\n`;
    msg += `👑 Author: ${author}\n`;
    msg += `💠 Category: ${configCommand.config.category}\n`;
    msg += `🌊 Description: ${description}\n`;
    msg += `🏷️ Guide: ${usage}\n`;
    msg += `🕰️ Cooldowns: ${configCommand.config.countDown} seconds\n`;
    msg += `📜 Aliases: ${configCommand.config.aliases ? configCommand.config.aliases.join(", ") : "None"}\n`;

    request(randomImage).pipe(fs.createWriteStream(imagePath)).on("close", async () => {
      const sentMessage = await message.reply({
        body: msg,
        attachment: fs.createReadStream(imagePath),
      });

      setTimeout(() => {
        message.unsend(sentMessage.messageID);
        fs.unlinkSync(imagePath);
      }, 1200000); // 20 minutes auto-delete
    });
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
