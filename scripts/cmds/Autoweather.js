const axios = require("axios");

module.exports = {
  name: "autoweather",
  category: "utility",
  desc: "Automatically updates weather every 30 minutes",
  execute: async ({ bot, chat }) => {
    const config = {
      location: "Dhaka", // Change to your preferred location
      apiKey: "bd5e378503939ddaee76f12ad7a97608", // Replace with your API key
      updateInterval: 30 * 60 * 1000, // 30 minutes in milliseconds
    };

    const getWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${config.location}&units=metric&appid=${config.apiKey}`;
        const response = await axios.get(url);
        const data = response.data;

        const weatherMessage = `🌤️ *Weather Update for ${config.location}*\n\n` +
          `🌡️ Temperature: ${data.main.temp}°C\n` +
          `☁️ Condition: ${data.weather[0].description}\n` +
          `💨 Wind Speed: ${data.wind.speed} m/s\n` +
          `💦 Humidity: ${data.main.humidity}%\n\n` +
          `⏳ *Next update in 30 minutes*`;

        await bot.sendMessage(chat.id, { text: weatherMessage });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    // Run initially
    getWeather();

    // Set interval for auto-update
    setInterval(getWeather, config.updateInterval);
  },
};
