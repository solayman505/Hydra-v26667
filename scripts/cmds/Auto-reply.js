const axios = require("axios");
const fs = require("fs");
const path = require("path");

const databasePath = path.join("automatic.json"); // Path to the database file

// Function to load the database
const loadDatabase = () => {
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify({})); // Create file if not exists
  }
  const data = fs.readFileSync(databasePath);
  return JSON.parse(data);
};

// Function to save the database
const saveDatabase = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

module.exports.config = {
  name: "databaseChat",
  aliases: ["dbchat", "botdb"],
  version: "1.0.0",
  author: "Your Name",
  description: "Chatbot with database integration",
};

module.exports.onChat = async ({ api, event }) => {
  try {
    const db = loadDatabase(); // Load the database
    const body = event.body ? event.body.toLowerCase() : "";

    // Check if the message matches any entry in the database
    const reply = db[body];
    if (reply) {
      return api.sendMessage(reply, event.threadID, event.messageID);
    } else {
      return api.sendMessage(
        "Sorry, I don't have a reply for that. You can teach me!",
        event.threadID,
        event.messageID
      );
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onCommand = async ({ api, event, args }) => {
  const db = loadDatabase(); // Load the database
  const command = args[0];

  // Add a new keyword-reply pair to the database
  if (command === "add") {
    const [keyword, ...replyParts] = args.slice(1);
    const reply = replyParts.join(" ");

    if (!keyword || !reply) {
      return api.sendMessage(
        "Usage: add [keyword] [reply]\nExample: add hello Hi there!",
        event.threadID,
        event.messageID
      );
    }

    db[keyword.toLowerCase()] = reply;
    saveDatabase(db); // Save the updated database
    return api.sendMessage(`Added: "${keyword}" -> "${reply}"`, event.threadID, event.messageID);
  }

  // Remove a keyword-reply pair from the database
  if (command === "remove") {
    const keyword = args[1];
    if (!keyword) {
      return api.sendMessage("Usage: remove [keyword]", event.threadID, event.messageID);
    }

    if (db[keyword.toLowerCase()]) {
      delete db[keyword.toLowerCase()];
      saveDatabase(db); // Save the updated database
      return api.sendMessage(`Removed keyword: "${keyword}"`, event.threadID, event.messageID);
    } else {
      return api.sendMessage(`Keyword "${keyword}" not found in the database.`, event.threadID, event.messageID);
    }
  }

  // List all keywords in the database
  if (command === "list") {
    const keys = Object.keys(db);
    if (keys.length === 0) {
      return api.sendMessage("The database is empty.", event.threadID, event.messageID);
    }

    const list = keys.map((key, index) => `${index + 1}. ${key} -> ${db[key]}`).join("\n");
    return api.sendMessage(`Database contents:\n${list}`, event.threadID, event.messageID);
  }
};
