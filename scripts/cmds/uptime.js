let fontEnabled = true;

function formatFont(text) {
	const fontMapping = {
		a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
		n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
		A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
		N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙"
	};

	let formattedText = "";
	for (const char of text) {
		if (fontEnabled && char in fontMapping) {
			formattedText += fontMapping[char];
		} else {
			formattedText += char;
		}
	}

	return formattedText;
}

const os = require('os');
const fs = require('fs').promises;
const pidusage = require('pidusage');

async function getStartTimestamp() {
	try {
		const startTimeStr = await fs.readFile('time.txt', 'utf8');
		return parseInt(startTimeStr);
	} catch (error) {
		return Date.now();
	}
}

async function saveStartTimestamp(timestamp) {
	try {
		await fs.writeFile('time.txt', timestamp.toString());
	} catch (error) {
		console.error('Error saving start timestamp:', error);
	}
}

function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

function getUptime(uptime) {
	const days = Math.floor(uptime / (3600 * 24));
	const hours = Math.floor((uptime % (3600 * 24)) / 3600);
	const mins = Math.floor((uptime % 3600) / 60);
	const seconds = Math.floor(uptime % 60);
	const months = Math.floor(days / 30);
	const remainingDays = days % 30;

	return `Uptime: ${months} month(s), ${remainingDays} day(s), ${hours} hour(s), ${mins} minute(s), and ${seconds} second(s)`;
}

function getDiskSpace() {
	const disk = os.freemem(); // Available disk space (RAM)
	const totalDisk = os.totalmem(); // Total disk space (RAM)
	return {
		free: byte2mb(disk),
		total: byte2mb(totalDisk)
	};
}

async function onStart({ api, event }) {
	const startTime = await getStartTimestamp();
	const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

	const usage = await pidusage(process.pid);
	const osInfo = {
		platform: os.platform(),
		architecture: os.arch()
	};

	const timeStart = Date.now();
	const uptimeMessage = getUptime(uptimeSeconds);
	const uid = "100057041031881";
	const diskSpace = getDiskSpace();

	const returnResult = `
BOT has been working for ${uptimeMessage}
❖ CPU Usage: ${usage.cpu.toFixed(1)}%
❖ RAM Usage: ${byte2mb(usage.memory)}
❖ Cores: ${os.cpus().length}
❖ Ping: ${Date.now() - timeStart}ms
❖ OS Platform: ${osInfo.platform}
❖ System Architecture: ${osInfo.architecture}
❖ Free Disk Space: ${diskSpace.free}
❖ Total Disk Space: ${diskSpace.total}`;

	await saveStartTimestamp(startTime);
	return api.shareContact(formatFont(returnResult), uid, event.threadID);
}

module.exports = {
	config: {
		name: 'uptime',
		version: '2.2.0',
		author: "Xrotick", // Do not change credits
		countDown: 5,
		role: 0,
		shortDescription: 'Shows uptime and system details',
		longDescription: {
			en: ''
		},
		category: 'tools',
		guide: {
			en: '{p}uptime'
		}
	},
	byte2mb,
	getStartTimestamp,
	saveStartTimestamp,
	getUptime,
	getDiskSpace,
	onStart
};
