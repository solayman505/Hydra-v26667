const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
	config: {
		name: "hug",
		version: "3.1.1",
		role: 0,
		author: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
		shortDescription: "Send a hug 🥰",
		category: "image",
		guide: "Use this command to send a hug image with a mentioned user.",
		countDown: 5,
	},

	onLoad: async function () {
		const { resolve } = path;
		const { existsSync, mkdirSync } = fs;
		const { downloadFile } = global.utils;
		const dirMaterial = resolve(__dirname, "cache", "canvas");
		const filePath = resolve(dirMaterial, "hugv1.png");

		if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
		if (!existsSync(filePath)) {
			await downloadFile("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", filePath);
		}
	},

	onStart: async function ({ api, event }) {
		const { threadID, messageID, senderID, mentions } = event;
		const mention = Object.keys(mentions);
		if (!mention[0]) return api.sendMessage("Please mention one person to hug.", threadID, messageID);

		const one = senderID;
		const two = mention[0];

		try {
			const imagePath = await makeImage({ one, two });
			return api.sendMessage({ body: "", attachment: fs.createReadStream(imagePath) }, threadID, () => fs.unlinkSync(imagePath), messageID);
		} catch (error) {
			return api.sendMessage("An error occurred while generating the hug image.", threadID, messageID);
		}
	}
};

async function makeImage({ one, two }) {
	const __root = path.resolve(__dirname, "cache", "canvas");
	const background = await jimp.read(path.join(__root, "hugv1.png"));
	const outputPath = path.join(__root, `hug_${one}_${two}.png`);
	const avatarOnePath = path.join(__root, `avt_${one}.png`);
	const avatarTwoPath = path.join(__root, `avt_${two}.png`);

	// Fetch avatars
	const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { responseType: "arraybuffer" })).data;
	fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne, "utf-8"));

	const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { responseType: "arraybuffer" })).data;
	fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo, "utf-8"));

	// Process images
	const circleOne = await jimp.read(await circle(avatarOnePath));
	const circleTwo = await jimp.read(await circle(avatarTwoPath));
	background.composite(circleOne.resize(150, 150), 320, 100).composite(circleTwo.resize(130, 130), 280, 280);

	// Save final image
	const outputBuffer = await background.getBufferAsync("image/png");
	fs.writeFileSync(outputPath, outputBuffer);

	// Cleanup
	fs.unlinkSync(avatarOnePath);
	fs.unlinkSync(avatarTwoPath);

	return outputPath;
}

async function circle(imagePath) {
	const image = await jimp.read(imagePath);
	image.circle();
	return await image.getBufferAsync("image/png");
    }
