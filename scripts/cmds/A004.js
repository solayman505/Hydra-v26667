const fs = require("fs");

module.exports = {
    name: "a",
    description: "Automatically reply to users based on keywords stored in a database",
    event: ["message"],
    async run({ api, event }) {
        const message = event.body ? event.body.toLowerCase() : "";

        // Load the database
        const db = JSON.parse(fs.readFileSync("./database.json", "utf-8"));

        // Default greeting for new chats
        if (event.isGroup === false && event.isFirstMessage === true) {
            const defaultGreeting = "Hello! I am here to assist you. Type a keyword to get started.";
            return api.sendMessage(defaultGreeting, event.threadID);
        }

        // Find the keyword in the database
        const command = db.keywords.find(cmd => message.includes(cmd.keyword));

        if (command) {
            // Replace dynamic variables (e.g., {time}, {date})
            const reply = command.reply
                .replace("{time}", new Date().toLocaleTimeString())
                .replace("{date}", new Date().toLocaleDateString());

            // Send the reply
            return api.sendMessage(reply, event.threadID, event.messageID);
        }

        // If no keyword matches, send a default response
        const defaultReply = "Sorry, I don't understand that. Try using a keyword like 'help' or 'hello'.";
        api.sendMessage(defaultReply, event.threadID, event.messageID);
    }
};
