const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "namaj",
    version: "1.2",
    author: "Mahim",
    countDown: 5,
    role: 0,
    shortDescription: "Get prayer times for a specific location.",
    longDescription: "Fetches daily prayer times for any location based on latitude and longitude.",
    category: "islam",
    guide: "To use this command, type `-namaj <city>`.",
  },

  onStart: async function ({ api, args, message }) {
    const location = args.join(" ");
    if (!location) {
      message.reply("Please provide a location. Example: `-namaj Dhaka`");
      return;
    }

    try {
      // Step 1: Convert location to latitude and longitude
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      if (!geoResponse.data.length) {
        message.reply("Location not found. Please enter a valid city name.");
        return;
      }
      
      const { lat, lon, display_name } = geoResponse.data[0];

      // Step 2: Get prayer times for the location
      const prayerResponse = await axios.get(`http://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city: location,
          country: "", // You can leave this blank
          method: 2, // Calculation method (ISNA)
        },
      });

      const timings = prayerResponse.data.data.timings;

      // Step 3: Prepare response message
      let replyMessage = `🕋 --- PRAYER TIME ---🕋\n🌍 Location: ${display_name}\n🗓️ Date: ${prayerResponse.data.data.date.readable}\n`;
      
      const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const currentTime = moment().tz('Asia/Dhaka'); // Change time zone accordingly
      let nextPrayer = "";
      let remainingTime = "";

      for (let i = 0; i < prayerNames.length; i++) {
        const prayerName = prayerNames[i];
        const prayerTime = moment(timings[prayerName], "HH:mm").tz('Asia/Dhaka');

        replyMessage += `\n🤲 ${prayerName}: ${prayerTime.format("h:mm A")}`;

        if (!nextPrayer && currentTime.isBefore(prayerTime)) {
          nextPrayer = prayerName;
          remainingTime = moment.duration(prayerTime.diff(currentTime)).humanize();
        }
      }

      replyMessage += `\n\n🕌 Next Prayer Start 🕌\nCurrent time: ${currentTime.format("h:mm A")}`;
      if (nextPrayer) {
        replyMessage += `\nNext prayer: ${nextPrayer}\nTime: ${moment(timings[nextPrayer], "HH:mm").tz('Asia/Dhaka').format("h:mm A")}\nTime remaining: ${remainingTime}`;
      } else {
        replyMessage += "\nNo more prayers today.";
      }

      message.reply(replyMessage);
    } catch (error) {
      console.error("Error retrieving prayer time information:", error);
      message.reply("Sorry, there was an error retrieving the prayer times.");
    }
  },
};
