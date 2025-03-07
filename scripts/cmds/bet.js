const fs = require("fs");

module.exports = {
  config: {
    name: "bet",
    version: "3.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    shortDescription: "High-risk betting game using real balance!",
    longDescription: "Bet coins, win multipliers, jackpots, lucky spins, and use secret codes!",
    category: "games",
    guide: {
      en: "{pn} <amount> - Place a bet\n{pn} loan <amount> - Borrow coins\n{pn} redeem <code> - Use a secret jackpot code\n{pn} spin - Lucky Spin\n{pn} shop - View game shop",
    },
  },

  onStart: async function ({ event, message, args, usersData }) {
    const userId = event.senderID;
    const userData = await usersData.get(userId);
    
    if (!userData.money) userData.money = 10000; // Default starting balance
    if (!userData.loan) userData.loan = 0;
    if (!userData.streak) userData.streak = 0;

    const command = args[0];

    if (command === "loan") {
      const loanAmount = parseInt(args[1]);
      if (!loanAmount || loanAmount <= 0) return message.reply("❌ Invalid loan amount.");
      if (userData.loan > 0) return message.reply("❌ Loan Denied! Repay your existing loan first.");
      userData.money += loanAmount;
      userData.loan = loanAmount;
      await usersData.set(userId, userData);
      return message.reply(`💰 Loan Approved! You borrowed ${loanAmount} coins. Payback with 10% interest.`);
    }

    if (command === "redeem") {
      const code = args[1];
      const secretCodes = { "LUCKY2025": 5000, "BIGWIN": 10000 };
      if (!secretCodes[code]) return message.reply("❌ Invalid code.");
      userData.money += secretCodes[code];
      await usersData.set(userId, userData);
      return message.reply(`🎁 Code Redeemed! You received ${secretCodes[code]} coins.`);
    }

    if (command === "spin") {
      if (userData.money < 500) return message.reply("❌ You need at least 500 coins to spin.");
      userData.money -= 500;
      const spinRewards = [0, 100, 200, 500, 1000, 5000, "JACKPOT"];
      const reward = spinRewards[Math.floor(Math.random() * spinRewards.length)];
      if (reward === "JACKPOT") {
        userData.money += 20000;
        await usersData.set(userId, userData);
        return message.reply("🎰 JACKPOT! You won 20,000 coins!");
      } else {
        userData.money += reward;
        await usersData.set(userId, userData);
        return message.reply(`🎰 Lucky Spin Result: You won ${reward} coins!`);
      }
    }

    if (command === "shop") {
      return message.reply("🛒 Shop:\n1. Lucky Spin (500 coins)\n2. Double Bet (1000 coins)\n3. Fruit Swap (700 coins)");
    }

    const betAmount = parseInt(args[0]);
    if (!betAmount || betAmount <= 0) return message.reply("🚫 Invalid bet amount.");
    if (userData.money < betAmount) return message.reply("🚫 Not enough coins!");

    userData.money -= betAmount;

    const fruits = ["🍉", "🍌", "🍎", "🍇", "🍒"];
    const slots = [fruits[Math.floor(Math.random() * fruits.length)], fruits[Math.floor(Math.random() * fruits.length)], fruits[Math.floor(Math.random() * fruits.length)]];
    const matchedFruits = checkMatchingFruits(slots);

    let winAmount = 0;
    if (matchedFruits === 3) {
      winAmount = betAmount * 30;
      userData.streak++;
    } else if (matchedFruits === 2) {
      winAmount = betAmount * 2;
      userData.streak++;
    } else if (matchedFruits === 1) {
      winAmount = betAmount * 1.5;
      userData.streak++;
    } else {
      userData.streak = 0;
    }

    if (winAmount > 0) {
      userData.money += winAmount;
      await usersData.set(userId, userData);
      message.reply(`🎰 ${slots.join(" | ")}\n🎉 You won ${winAmount} coins!`);
    } else {
      await usersData.set(userId, userData);
      message.reply(`🎰 ${slots.join(" | ")}\n❌ You lost ${betAmount} coins. Better luck next time!`);
    }

    if (userData.streak >= 3) {
      const bonus = betAmount * 0.5;
      userData.money += bonus;
      await usersData.set(userId, userData);
      message.reply(`🔥 Streak Bonus! You won an extra ${bonus} coins for 3 wins in a row!`);
    }
  },
};

function checkMatchingFruits(slots) {
  const uniqueFruits = new Set(slots);
  if (uniqueFruits.size === 1) return 3;
  if (uniqueFruits.size === 2) return 2;
  if (uniqueFruits.size === 3) return 1;
  return 0;
} 
