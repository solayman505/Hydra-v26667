const si = require('systeminformation');
const fs = require("fs-extra");
const request = require("request");

module.exports = {
    config: {
        name: "system",
        aliases: [],
        version: "1.0",
        author: "",
        countDown: 5,
        role: 0,
        shortDescription: "System Information",
        longDescription: "Displays detailed system information.",
        category: "info",
        guide: "{pn}"
    },

    byte2mb: function (bytes) {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0, n = parseInt(bytes, 10) || 0;
        while (n >= 1024 && ++l) n = n / 1024;
        return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    },

    onStart: async function ({ api, event }) {
        try {
            const timeStart = Date.now();
            const { cpu, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo } = si;

            const { manufacturer, brand, speed, physicalCores, cores } = await cpu();
            const { main: mainTemp } = await cpuTemperature();
            const { currentLoad: load } = await currentLoad();
            const diskInfo = await diskLayout();
            const memInfo = await memLayout();
            const { total: totalMem, available: availableMem } = await mem();
            const { platform: OSPlatform, build: OSBuild } = await osInfo();

            const time = process.uptime();
            const hours = String(Math.floor(time / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
            const seconds = String(Math.floor(time % 60)).padStart(2, '0');

            const systemInfo = `𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼:
CPU Info:
- Manufacturer: ${manufacturer} ${brand}
- Speed: ${speed} GHz
- Physical Cores: ${physicalCores}
- Threads: ${cores}
- Temperature: ${mainTemp}°C
- Load: ${load.toFixed(1)}%

Memory Info:
- Type: ${memInfo[0].type}
- Total: ${this.byte2mb(totalMem)}
- Available: ${this.byte2mb(availableMem)}

Disk Info:
- Name: ${diskInfo[0].name}
- Size: ${this.byte2mb(diskInfo[0].size)}
- Type: ${diskInfo[0].type}

OS Info:
- Platform: ${OSPlatform}
- Build: ${OSBuild}
- Uptime: ${hours}:${minutes}:${seconds}
- Ping: ${(Date.now() - timeStart)}ms`;

            const images = [
                "https://i.imgur.com/u1WkhXi.jpg",
                "https://i.imgur.com/zuUMUDp.jpg",
                "https://i.imgur.com/skHrcq9.jpg",
                "https://i.imgur.com/TE9tH8w.jpg",
                "https://i.imgur.com/on9p0FK.jpg",
                "https://i.imgur.com/mriBW5m.jpg",
                "https://i.imgur.com/ju7CyHo.jpg",
                "https://i.imgur.com/KJunp2s.jpg",
                "https://i.imgur.com/6knPOgd.jpg",
                "https://i.imgur.com/Nxcbwxk.jpg",
                "https://i.imgur.com/FgtghTN.jpg"
            ];

            const imageUrl = images[Math.floor(Math.random() * images.length)];
            const imagePath = __dirname + "/cache/system.jpg";
            
            request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
                api.sendMessage({ body: systemInfo, attachment: fs.createReadStream(imagePath) }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while fetching system information.", event.threadID, event.messageID);
        }
    }
};
