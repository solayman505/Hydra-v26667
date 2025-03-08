module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.4",
		author: "NTKhang, Modified by Protick",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "xem số tiền của bạn",
			en: "view your money"
		},
		longDescription: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "tools",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1",
			moneyOf: "%1 đang có %2"
		},
		en: {
			money: "You have %1",
			moneyOf: "%1 has %2"
		}
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		// Function to format money values up to Googol
		function formatMoney(value) {
			const units = [
				"", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion",
				"Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion",
				"Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion",
				"Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion",
				"Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion",
				"Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion",
				"Centillion", "Uncentillion", "Duocentillion", "Trecentillion", "Quattuorcentillion",
				"Quincentillion", "Sexcentillion", "Septencentillion", "Octocentillion", "Novemcentillion",
				"Millinillion", "Unmillinillion", "Duomillinillion", "Tremillinillion", "Quattuormillinillion",
				"Quinmillinillion", "Sexmillinillion", "Septenmillinillion", "Octomillinillion", "Novemmillinillion",
				"Googol"
			];
			let unitIndex = 0;
			while (value >= 1000 && unitIndex < units.length - 1) {
				value /= 1000;
				unitIndex++;
			}
			return value.toFixed(2) + " " + units[unitIndex];
		}

		// If user tagged others
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money") || 0;
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), formatMoney(userMoney)) + '\n';
			}
			return message.reply(msg);
		}

		// If user checks their own balance
		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", formatMoney(userData.money || 0)));
	}
};
