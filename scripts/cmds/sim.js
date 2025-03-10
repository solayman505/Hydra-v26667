const axios = require("axios");
module.exports = {
	config: {
		name: 'sim',
		version: '1.2',
		author: 'xrotick',
		countDown: 3,
		role: 0,
		shortDescription: 'Simsimi ChatBot by',
		longDescription: {
			en: 'Chat with simsimi'
		},
		category: 'chat',
		guide: {
			en: '   {pn} <word>: chat with simsimi'
				+ '\n   Example:{pn} hi'
		}
	},

	langs: {
		en: {
			chatting: 'Already Chatting with sim...',
			error: 'Server Down Please Be Patient'
		}
	},

	onStart: async function ({ args, message, event, getLang }) {
		if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (!isUserCallCommand) {
			return;
		}
		if (args.length > 1) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	try {
		const res = await axios.get(`http://65.109.80.126:20392/sim?type=ask&ask=sim%20${yourMessage}`);
		if (!res.data.success) {
			throw new Error('API returned a non-successful message');
		}
		return res.data.success;
	} catch (err) {
		console.error('Error while getting a message:', err);
		throw err;
	}
      }