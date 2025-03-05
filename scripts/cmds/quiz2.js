const axios = require("axios");

module.exports = {
  config: {
    name: "quiz",
    version: "3.4",
    author: "Xrotick",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝗦𝗦𝗖 𝗟𝗘𝗩𝗘𝗟 𝗤𝗨𝗜𝗭"
    },
    longDescription: {
      en: "𝗦𝗦𝗖 𝗦𝗧𝗨𝗗𝗘𝗡𝗧𝗦' 𝗕𝗜𝗢𝗟𝗢𝗚𝗬, 𝗖𝗛𝗘𝗠𝗜𝗦𝗧𝗥𝗬, 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 & 𝗠𝗔𝗧𝗛 𝗤𝗨𝗜𝗭"
    },
    category: "games",
    guide: {
      en: "**{pn}**"
    }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const userID = event.senderID;
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID].name;

      let category;
      const randomNum = Math.random() * 100;

      if (randomNum < 50) category = 17; // Biology (50%)
      else if (randomNum < 90) category = 19; // Chemistry (40%)
      else if (randomNum < 95) category = 18; // Physics (5%)
      else category = 30; // Math (5%)

      const res = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&category=${category}&difficulty=easy`);
      const quiz = res.data.results[0];

      const questionEn = quiz.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
      const correctAnswerEn = quiz.correct_answer;
      const answersEn = [...quiz.incorrect_answers, correctAnswerEn].sort(() => Math.random() - 0.5);

      // **Translate Question, Options & Correct Answer to Bengali**
      const translateText = async (text) => {
        try {
          const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bn`);
          return response.data.responseData.translatedText;
        } catch (error) {
          console.error("Translation Error:", error);
          return text;
        }
      };

      const questionBn = await translateText(questionEn);
      const correctAnswerBn = await translateText(correctAnswerEn);
      const answersBn = await Promise.all(answersEn.map(async (answer) => await translateText(answer)));

      let message = ` 𝗤𝗨𝗜𝗭! 🎓\n\n` +
        `👤 𝗤𝗨𝗜𝗭 𝗙𝗢𝗥: \n[ ${userName} ]\n` +
        `💡 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬:${quiz.category}\n` +
        `❓ 𝗣𝗥𝗔𝗦𝗡𝗢: ${questionBn}\n\n` +
        `🔹 𝗢𝗣𝗧𝗜𝗢𝗡𝗦:\n`;

      answersBn.forEach((ans, index) => {
        message += `${index + 1}. ${ans}\n`;
      });

      message += `\n⏳𝗬𝗢𝗨 𝗛𝗔𝗩𝗘 𝟰𝟱 𝗦𝗘𝗖𝗢𝗡𝗗𝗦 𝗧𝗢 𝗥𝗘𝗣𝗟𝗬 𝗪𝗜𝗧𝗛 𝗧𝗛𝗘 𝗖𝗢𝗥𝗥𝗘𝗖𝗧 𝗢𝗣𝗧𝗜𝗢𝗡 𝗡𝗨𝗠𝗕𝗘𝗥!!`;

      api.sendMessage(message, event.threadID, (err, info) => {
        if (err) return console.error(err);

        global.GoatBot.quizGame = {
          threadID: event.threadID,
          messageID: info.messageID,
          correctAnswer: correctAnswerBn,
          options: answersBn,
          requesterID: userID,
          requesterName: userName
        };

        setTimeout(() => {
          if (global.GoatBot.quizGame && global.GoatBot.quizGame.threadID === event.threadID) {
            api.sendMessage(`⏳⏳ 𝗧𝗜𝗠𝗘'𝗦 𝗨𝗣! ❌\n✅ 𝗖𝗢𝗥𝗥𝗘𝗖𝗧 𝗔𝗡𝗦𝗪𝗘𝗥 𝗪𝗔𝗦 : ${correctAnswerBn}`, event.threadID);
            delete global.GoatBot.quizGame;
          }
        }, 45000);
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢 𝗙𝗘𝗧𝗖𝗛 𝗤𝗨𝗜𝗭! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗧𝗥𝗬 𝗔𝗚𝗔𝗜𝗡 𝗟𝗔𝗧𝗘𝗥", event.threadID);
    }
  },

  onChat: async function ({ api, event, usersData }) {
    if (!global.GoatBot.quizGame || global.GoatBot.quizGame.threadID !== event.threadID) return;

    const { correctAnswer, options, requesterID, requesterName, messageID } = global.GoatBot.quizGame;
    const answerIndex = parseInt(event.body.trim()) - 1;
    const userID = event.senderID;

    if (userID !== requesterID) {
      return api.sendMessage(`𝗬𝗢𝗨 𝗔𝗥𝗘 𝗡𝗢𝗧 𝗔𝗟𝗟𝗢𝗪𝗘𝗗 𝗧𝗢 𝗔𝗡𝗦𝗪𝗘𝗥 𝗧𝗛𝗜𝗦 𝗤𝗨𝗜𝗭!\n📢 𝗧𝗛𝗜𝗦 𝗜𝗦 𝗢𝗡𝗟𝗬 𝗙𝗢𝗥 ${requesterName} `, event.threadID, event.messageID);
    }

    if (answerIndex >= 0 && answerIndex < options.length) {
      api.unsendMessage(messageID);

      if (options[answerIndex] === correctAnswer) {
        const userData = await usersData.get(userID);
        userData.exp = (userData.exp || 0) + 500;
        userData.money = (userData.money || 0) + 9999;
        await usersData.set(userID, userData);

        api.sendMessage(
          `✅ 𝗖𝗢𝗥𝗥𝗘𝗖𝗧 𝗔𝗡𝗦𝗪𝗘𝗥! 🎉\n📢 ${requesterName} 𝗔𝗡𝗦𝗪𝗘𝗥𝗘𝗗 𝗙𝗜𝗥𝗦𝗧!\n\n` +
        `🎁 𝗬𝗢𝗨 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗:\n➤ +𝟱𝟬𝟬 𝗘𝗫𝗣\n➤ +𝟵𝟵𝟵𝟵 𝗖𝗢𝗜𝗡𝗦 💰`,
          event.threadID
        );
      } else {
        api.sendMessage(`❌Wrong answer\n✅ The right answer is: ${correctAnswer}`, event.threadID);
      }

      delete global.GoatBot.quizGame;
    }
  }
};
