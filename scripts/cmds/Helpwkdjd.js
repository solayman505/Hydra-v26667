
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help2",
    version: "1.0",
    author: "【﻿ＰＲＯＴＩＣＫ】",
    countDown: 1,
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

      let response = "📜 Available Commands in Bot! \n\n";
      Object.entries(categories).forEach(([category, cmdList]) => {
        response += `| ${category.toUpperCase()} |\n`;
        response += `| ❃ ${formatCommands(cmdList)}\n\n`;
      });

      const totalCommands = commands.size;

      response += `⚒️ Bot has: ${totalCommands} Commands\n`;
      response += `🛸 Prefix: ${prefix}\n`;
      response += `👑 Owner: ×͜× ＰＲＯＴＩＣＫ\n\n`;
      response += `Type '${prefix}help <cmdName>' to see detailed information about a specific command.`;

      const sentMessage = await message.reply(response);

      setTimeout(() => {
        message.unsend(sentMessage.messageID);
      }, 360000);

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

    let msg = `📜 Command information 🔖\n\n`;
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
