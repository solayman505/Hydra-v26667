const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

// Import the database connection

const db = require("./db.js");  // Ensure the path is correct

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	return async function (event) {
		// Check if the bot is in the inbox and anti inbox is enabled
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		const message = createFuncMessage(api, event);

		await handlerCheckDB(usersData, threadsData, event);
		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat)
			return;

		const {
			onAnyEvent, onFirstChat, onStart, onChat,
			onReply, onEvent, handlerEvent, onReaction,
			typ, presence, read_receipt
		} = handlerChat;

		onAnyEvent();

		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onFirstChat();

				// Auto-reply logic
				onChat: async () => {
					const userMessage = event.body?.toLowerCase(); // Get the user's message and convert to lowercase
					if (!userMessage) return; // Skip if no message exists

					try {
						// Query the database for a matching keyword
						const [rows] = await db.query('SELECT response FROM auto_replies WHERE keyword = ?', [userMessage]);

						// If a response is found, send it
						if (rows.length > 0) {
							const reply = rows[0].response;
							api.sendMessage(reply, event.threadID);
						} else {
							// Optional: Fallback message if no response is found
							api.sendMessage("Sorry, I don't understand that. Try using specific keywords.", event.threadID);
						}
					} catch (error) {
						console.error('Error querying database for auto-reply:', error);
					}
				};

				onStart();
				onReply();
				break;

			case "event":
				handlerEvent();
				onEvent();
				break;

			case "message_reaction":
				onReaction();
				break;

			case "typ":
				typ();
				break;

			case "presence":
				presence();
				break;

			case "read_receipt":
				read_receipt();
				break;

			default:
				break;
		}
	};
};
