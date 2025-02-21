const fs = require("fs");
const path = require("path");

const miraiToGoat = (miraiCommand) => {
  return {
    config: {
      name: miraiCommand.config.name || "mirai",
      version: "1.0",
      author: "Xrotick",
      role: miraiCommand.config.role || 0,
      countDown: miraiCommand.config.countDown || 5,
      category: "converted",
      shortDescription: miraiCommand.config.shortDescription || "Converted from Mirai",
      longDescription: miraiCommand.config.longDescription || "This command was converted from MiraiBot"
    },

    onStart: async function({ api, event, args }) {
      const miraiArgs = {
        event,
        api,
        args,
        Users: global.data.Users,
        Threads: global.data.Threads
      };
      return await miraiCommand.run(miraiArgs);
    }
  };
};

// MiraiBot কমান্ড গুলো GoatBot-এর মধ্যে কনভার্ট করা
const miraiCommandsPath = path.join(__dirname, "mirai");
fs.readdirSync(miraiCommandsPath).forEach(file => {
  if (file.endsWith(".js")) {
    const miraiCommand = require(path.join(miraiCommandsPath, file));
    module.exports[miraiCommand.config.name] = miraiToGoat(miraiCommand);
  }
});
