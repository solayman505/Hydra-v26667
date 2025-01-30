const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Nazrul",
    countDown: 10,
    role: 0,
    shortDescription: "✨ Get a list of all commands or command details ✨",
    longDescription: "Displays a categorized list of commands or detailed information about a specific command.",
    category: "general",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ message, args, event, role, api }) {
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

      let response = "📜 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗶𝗻 𝗕𝗼𝘁! \n\n";
      Object.entries(categories).forEach(([category, cmdList]) => {
        response += `| ${category.toUpperCase()} |\n`;
        response += `| ❃ ${formatCommands(cmdList)}\n\n`;
      });

      const totalCommands = commands.size;

      response += `⚒️ 𝗕𝗼𝘁 𝗵𝗮𝘀: ${totalCommands} 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n`;
      response += `🛸 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n`;
      response += `👑 𝗢𝘄𝗻𝗲𝗿: ♡ Nazrul ♡\n\n`;
      response += `🔍 𝗧𝘆𝗽𝗲 '${prefix}help <cmdName>' 𝘁𝗼 𝘀𝗲𝗲 𝗱𝗲𝘁𝗮𝗶𝗹𝗲𝗱 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗮𝗯𝗼𝘂𝘁 𝗮 𝘀𝗽𝗲𝗰𝗶𝗳𝗶𝗰 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.`;

      const imageUrl = "https://i.imgur.com/gs8PSXG.jpeg";
      const imagePath = __dirname + `/cache/commands.jpg`;

      request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", async () => {
        const sentMessage = await api.sendMessage({
          body: response,
          attachment: fs.createReadStream(imagePath)
        }, event.threadID, (error) => {
          fs.unlinkSync(imagePath);
          if (error) {
            console.error("Error sending image:", error);
          }
        });

        setTimeout(() => {
          api.unsendMessage(sentMessage.messageID);
        }, 40000);
      });

      return;
    }

    const configCommand = commands.get(args[0]) || aliases.get(args[0]);
    if (!configCommand) return message.reply(`⚠️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 '${args[0]}' 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.`);

    const roleText = getRoleName(configCommand.config.role);
    const author = configCommand.config.author || "Unknown";
    const description = configCommand.config.longDescription || configCommand.config.shortDescription || "No description available.";
    const usage = (configCommand.config.guide || "No guide available.")
      .replace(/{pn}/g, prefix + configCommand.config.name)
      .replace(/{p}/g, prefix)
      .replace(/{n}/g, configCommand.config.name);

    let msg = `📜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 🔖\n\n`;
    msg += `📜 𝗡𝗮𝗺𝗲: ${configCommand.config.name}\n`;
    msg += `🛸 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.config.version}\n`;
    msg += `🔖 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${roleText}\n`;
    msg += `👑 𝗔𝘂𝘁𝗵𝗼𝗿: ${author}\n`;
    msg += `💠 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${configCommand.config.category}\n`;
    msg += `🌊 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n`;
    msg += `🏷️ 𝗚𝘂𝗶𝗱𝗲: ${usage}\n`;
    msg += `🕰️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻𝘀: ${configCommand.config.countDown} seconds\n`;
    msg += `📜 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${configCommand.config.aliases ? configCommand.config.aliases.join(", ") : "None"}\n`;

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
