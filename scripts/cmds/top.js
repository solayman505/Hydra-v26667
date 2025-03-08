module.exports = {
	config: {
		name: "top",
		version: "1.1",
		author: "Loid Butter, Modified by Protick",
		role: 0,
		shortDescription: {
			en: "Top 100 Rich Users"
		},
		longDescription: {
			en: "Displays the top 100 users with the highest balance."
		},
		category: "group",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ api, args, message, event, usersData }) {
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

		// Fetch all users
		const allUsers = await usersData.getAll();

		// Sort users by balance (descending) and get the top 100
		const topUsers = allUsers.sort((a, b) => (b.money || 0) - (a.money || 0)).slice(0, 100);

		// Create the leaderboard text
		const topUsersList = topUsers.map((user, index) => 
			`${index + 1}. ${user.name}: ${formatMoney(user.money || 0)}`
		);

		// Send the formatted leaderboard
		const messageText = `🏆 **Top 100 Richest Users:**\n\n${topUsersList.join('\n')}`;
		message.reply(messageText);
	}
}; 
