module.exports = {
	config: {
		name: "prefix",
		version: "1.0",
		author: "Tokodori_Frtiz", // Remodified by Cliff
		countDown: 5,
		role: 0,
		shortDescription: "no prefix",
		longDescription: "no prefix",
		category: "auto 🪐",
	},

	onStart: async function () {},

	onChat: async function ({ event, message, api }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			// Bot Owner Information
			const ownerName = "Xrotick"; // Owner's name
			const ownerUID = "100057041031881"; // Owner's Facebook ID (replace with actual)

			// Send message with contact sharing in one response
			await api.shareContact(
				`Yo, my prefix is [ 𓆩 / 𓆪 ]\n
𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:
➥ /help [number of page] -> see commands
➥ /sim [message] -> talk to bot
➥ /callad [message] -> report any problem encountered
➥ /help [command] -> information and usage of command\n
𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: ${ownerName}\n𝗜𝗗: ${ownerUID}\n
Have fun using it, enjoy! ❤️`,
				ownerUID,
				event.threadID
			
			);
		}
	}
};
