const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.1",
    author: "Nazrul",
    countDowns: 10,
    role: 0,
    shortDescription: "Get a list of all commands or command details.",
    longDescription: "Displays a categorized list of commands or detailed information about a specific command.",
    category: "general",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ api, message, args, event, role }) {
    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);

    // If no specific command is requested, show the categorized command list
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
      response += `👑 Owner: ♡ Nazrul ♡\n\n`;
      response += `Type '${prefix}help <cmdName>' to see detailed information about a specific command.`;

      const imageUrl = "https://i.imgur.com/gs8PSXG.jpeg"; // Image link
      const imagePath = __dirname + `/cache/help.jpg`;

      request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
        api.sendMessage({
          body: response,
          attachment: fs.createReadStream(imagePath)
        }, threadID, (error, info) => {
          fs.unlinkSync(imagePath);
          if (!error) {
            setTimeout(() => {
              api.unsendMessage(info.messageID);
            }, 40000);
          }
        });
      });

      return;
    }

    // Fetch command details if a specific command is requested
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) return message.reply(`⚠️ Command '${commandName}' not found.`);

    const configCommand = command.config;
    const roleText = getRoleName(configCommand.role);
    const author = configCommand.author || "Unknown";
    const description = configCommand.longDescription || configCommand.shortDescription || "No description available.";
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
