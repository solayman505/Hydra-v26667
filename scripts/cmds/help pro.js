const fs = require("fs-extra");
const request = require("request");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Nazrul",
    countDown: 10,
    role: 0,
    shortDescription: "Get a list of all commands or command details.",
    longDescription: "Displays a categorized list of commands or detailed information about a specific command.",
    category: "general",
    guide: "{pn} or {pn} <command>",
  },

  onStart: async function ({ api, event, args, role }) {
    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);

    // Command Details
    if (args[0] && isNaN(parseInt(args[0]))) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) return api.sendMessage(`⚠️ Command "${commandName}" not found.`, threadID, messageID);

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const author = configCommand.author || "Unknown";
      const description = configCommand.longDescription || configCommand.shortDescription || "No description available.";
      const usage = (configCommand.guide || "No guide available.")
        .replace(/{pn}/g, prefix + configCommand.name)
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
      detailMsg += `🔹 **Cooldown:** ${configCommand.countDown} seconds\n`;
      detailMsg += `🔹 **Aliases:** ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n`;

      return api.sendMessage(detailMsg, threadID, messageID);
    }

    // Command List with Pagination
    const allCommands = [...commands.keys()].filter(cmd => commands.get(cmd).config.role <= role);
    const totalCommands = allCommands.length;
    const commandsPerPage = 100;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    const page = Math.max(1, Math.min(totalPages, parseInt(args[0]) || 1));

    let msg = `💫 𝗕𝗼𝘁 𓂃♡ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𓂃♡ 𝗟𝗶𝘀𝘁 💫\n\n`;
    msg += `╭────────────────────╮\n`;
    msg += `│ **Page ${page} / ${totalPages}**\n`;
    msg += `├────────────────────┤\n`;

    const startIdx = (page - 1) * commandsPerPage;
    const endIdx = Math.min(startIdx + commandsPerPage, totalCommands);

    for (let i = startIdx; i < endIdx; i++) {
      const cmd = commands.get(allCommands[i]);
      msg += `│ ✨ **${cmd.config.name}** - ${cmd.config.shortDescription || "No description"}\n`;
    }

    msg += `╰────────────────────╯\n\n`;
    msg += `📌 **Use "${prefix}help <command>" for details.**\n`;
    msg += `📌 **Use "${prefix}help [page]" to navigate pages.**\n`;
    msg += `\n🔹 **Total Commands:** ${totalCommands}\n`;
    msg += `🔹 **Prefix:** ${prefix}\n`;
    msg += `🔹 **Owner:** ♡ Nazrul ♡\n`;

    // 100 Anime Girl Images
    const animeImages = [
      "https://i.imgur.com/gs8PSXG.jpeg",
      "https://i.imgur.com/a1b2C3D.jpg",
      "https://i.imgur.com/XyZ4a5B.jpg",
      "https://i.imgur.com/BcD6eFg.jpg",
      "https://i.imgur.com/LMN78OP.jpg",
      "https://i.imgur.com/qRStUV1.jpg",
      "https://i.imgur.com/vWXYza2.jpg",
      "https://i.imgur.com/ABC3dEF.jpg",
      "https://i.imgur.com/GHIJ4KL.jpg",
      "https://i.imgur.com/MNO5PQR.jpg",
      // ... Add up to 100 image links
    ];
    
    const selectedImages = animeImages.sort(() => 0.5 - Math.random()).slice(0, 10); // Pick 10 random images per request
    const imagePaths = selectedImages.map((_, i) => __dirname + `/cache/help_${i}.jpg`);

    // Download Images
    let downloaded = 0;
    selectedImages.forEach((url, index) => {
      request(url).pipe(fs.createWriteStream(imagePaths[index])).on("close", () => {
        downloaded++;
        if (downloaded === selectedImages.length) {
          api.sendMessage({
            body: msg,
            attachment: imagePaths.map(path => fs.createReadStream(path))
          }, threadID, (error, info) => {
            imagePaths.forEach(fs.unlinkSync);
            if (error) console.error("Error sending images:", error);
            setTimeout(() => api.unsendMessage(info.messageID), 30 * 60 * 1000); // Auto-delete after 30 min
          });
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
