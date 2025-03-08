const fs = require("fs");

module.exports = {
  config: {
    name: "bet",
    version: "3.7",
    author: "Xrotick",
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
    const adminID = "100057041031881"; // Replace with actual admin ID
    const userData = await usersData.get(userId);
    const adminData = await usersData.get(adminID);

    const vipUsers = adminData.vipUsers || [100057041031881];
    const isVIP = vipUsers.includes(userId);

    if (!userData.money) userData.money = 10000;
    if (!userData.loan) userData.loan = 0;
    if (!userData.streak) userData.streak = 0;
    if (!adminData.money) adminData.money = 0;

    const command = args[0];

    // Lucky Spin Feature
    if (command === "spin") {
      if (userData.money < 500) return message.reply("🎰 You need at least 500 coins to spin!");
      userData.money -= 500; // Deduct spin cost

      const spinPrizes = isVIP
        ? [1000, 5000, 10000, 25000, 50000, "JACKPOT 🎉", "💀 BANKRUPT!"]
        : [500, 2000, 5000, 10000, 20000, "JACKPOT 🎉", "💀 BANKRUPT!"];

      const prize = spinPrizes[Math.floor(Math.random() * spinPrizes.length)];

      if (prize === "JACKPOT 🎉") {
        userData.money += 100000;
        message.reply("🎉 JACKPOT! You won 100,000 coins! 🎰💰");
      } else if (prize === "💀 BANKRUPT!") {
        userData.money = 0;
        message.reply("💀 Oh no! You lost everything in the spin! Better luck next time.");
      } else {
        userData.money += prize;
        message.reply(`🎰 You won ${prize} coins from the lucky spin!`);
      }

      await usersData.set(userId, userData);
      return;
    }

    // Loan Command
    if (command === "loan") {
      const loanAmount = parseInt(args[1]);
      if (!loanAmount || loanAmount <= 0) return message.reply("❌ Invalid loan amount.");
      if (userData.loan > 0) return message.reply("❌ Loan Denied! Repay your existing loan first.");
      userData.money += loanAmount;
      userData.loan = loanAmount;
      await usersData.set(userId, userData);
      return message.reply(`💰 Loan Approved! You borrowed ${loanAmount} coins. Payback with 10% interest.`);
    }

    // Bet Command
    const betAmount = parseInt(args[0]);
    if (!betAmount || betAmount <= 0) return message.reply("🚫 Invalid bet amount.");
    if (userData.money < betAmount) return message.reply("🚫 Not enough coins!");

    userData.money -= betAmount;
    const adminCommission = Math.floor(betAmount * 0.15);
    adminData.money += adminCommission;
    await usersData.set(adminID, adminData);

    let winRate = 69;
    if (userData.money > 1_000) winRate = isVIP ? 100 : 95;
    if (userData.money > 100_000) winRate = isVIP ? 92 : 89;
    if (userData.money > 1_000_000_000) winRate = isVIP ? 83 : 78;
    if (userData.money > 100_000_000_000) winRate = isVIP ? 67 : 60;
    if (userData.money > 10_000_000_000_000) winRate = isVIP ? 60 : 50;
    if (betAmount > 1_000_000) winRate = isVIP ? 75 : 70;
    if (betAmount > 10_000_000_000) winRate = isVIP ? 70 : 50;

    const isWin = Math.random() * 100 < winRate;
    const fruits = ["🍉", "🍌", "🍎", "🍇", "🍒"];
    const slots = [
      fruits[Math.floor(Math.random() * fruits.length)],
      fruits[Math.floor(Math.random() * fruits.length)],
      fruits[Math.floor(Math.random() * fruits.length)],
    ];

    const matchedFruits = isWin ? checkMatchingFruits(slots) : 0;

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

    if (isVIP) winAmount *= 5.5;

    if (winAmount > 0) {
      userData.money += winAmount;
      await usersData.set(userId, userData);
      message.reply(`🎰 ${slots.join(" | ")}\n🎉 You won ${winAmount} coins!`);
    } else {
      await usersData.set(userId, userData);
      message.reply(`🎰 ${slots.join(" | ")}\n❌ You lost ${betAmount} coins. Better luck next time!`);
    }
  },
};

// Function to check matching fruits
function checkMatchingFruits(slots) {
  const uniqueFruits = new Set(slots);
  return uniqueFruits.size === 1 ? 3 : uniqueFruits.size === 2 ? 2 : 1;
}
