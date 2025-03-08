const axios = require("axios");
const fs = require("fs");
const request = require("request");
const Scraper = require("mal-scraper");

module.exports = {
	config: {
		name: "mal",
		version: "1.0.0",
		role: 0,
		author: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
		shortDescription: "Search Anime from Myanimelist",
		category: "media",
		guide: "[name of anime]",
		countDown: 5,
	},

	onStart: async function ({ api, event }) {
		const input = event.body;
		let query = input.substring(5);
		let data = input.split(" ");
		let Replaced = query.replace(/ /g, " ");

		api.sendMessage(`🔍𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿\n【 ${Replaced} 】`, event.threadID, event.messageID);

		try {
			const Anime = await Scraper.getInfoFromName(Replaced);
			let getURL = Anime.picture;
			let ext = getURL.substring(getURL.lastIndexOf(".") + 1);

			if (!Anime.genres[0] || Anime.genres[0] === null) Anime.genres[0] = "None";

			let title = Anime.title;
			let japTitle = Anime.japaneseTitle;
			let type = Anime.type;
			let status = Anime.status;
			let premiered = Anime.premiered;
			let broadcast = Anime.broadcast;
			let aired = Anime.aired;
			let producers = Anime.producers;
			let studios = Anime.studios;
			let source = Anime.source;
			let episodes = Anime.episodes;
			let duration = Anime.duration;
			let genres = Anime.genres.join(", ");
			let popularity = Anime.popularity;
			let ranked = Anime.ranked;
			let score = Anime.score;
			let rating = Anime.rating;
			let synopsis = Anime.synopsis;
			let url = Anime.url;
			let endD = Anime.end_date;

			let callback = function () {
				api.sendMessage(
					{
						body: `Title: ${title}\nJapanese: ${japTitle}\nType: ${type}\nStatus: ${status}\nPremiered: ${premiered}\nBroadcast: ${broadcast}\nAired: ${aired}\nProducers: ${producers}\nStudios: ${studios}\nSource: ${source}\nEpisodes: ${episodes}\nDuration: ${duration}\nGenres: ${genres}\nPopularity: ${popularity}\nRanked: ${ranked}\nScore: ${score}\nRating: ${rating}\n\nSynopsis: \n${synopsis}\nLink: ${url}`,
						attachment: fs.createReadStream(__dirname + `/cache/mal.${ext}`),
					},
					event.threadID,
					() => fs.unlinkSync(__dirname + `/cache/mal.${ext}`),
					event.messageID
				);
			};

			request(getURL)
				.pipe(fs.createWriteStream(__dirname + `/cache/mal.${ext}`))
				.on("close", callback);
		} catch (err) {
			api.sendMessage("⚠️" + err, event.threadID, event.messageID);
		}
	},
};
