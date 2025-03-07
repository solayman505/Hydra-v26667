const fs = require("fs");

module.exports = {
  config: {
    name: "bet",
    version: "3.6",
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
    const adminID = "100057041031881"; // Replace with actual admin ID
    const userData = await usersData.get(userId);
    const adminData = await usersData.get(adminID);

    // VIP Storage (Hidden from Regular Users)
    const vipUsers = adminData.vipUsers || [];
    const isVIP = vipUsers.includes(userId);

    if (!userData.money) userData.money = 10000;
    if (!userData.loan) userData.loan = 0;
    if (!userData.streak) userData.streak = 0;
    if (!adminData.money) adminData.money = 0;

    const command = args[0];

    // VIP Management (Admin Only)
    if (userId === adminID && command === "vip") {
      const subCommand = args[1];
      const targetUser = args[2];

      if (subCommand === "add") {
        if (!targetUser) return message.reply("❌ Provide a user ID to add as VIP.");
        if (vipUsers.includes(targetUser)) return message.reply("⚠️ User is already VIP.");
        vipUsers.push(targetUser);
        adminData.vipUsers = vipUsers;
        await usersData.set(adminID, adminData);
        return message.reply(`✅ User ${targetUser} is now VIP!`);
      }

      if (subCommand === "remove") {
        if (!targetUser) return message.reply("❌ Provide a user ID to remove from VIP.");
        if (!vipUsers.includes(targetUser)) return message.reply("⚠️ User is not a VIP.");
        adminData.vipUsers = vipUsers.filter(id => id !== targetUser);
        await usersData.set(adminID, adminData);
        return message.reply(`❌ User ${targetUser} removed from VIP.`);
      }

      if (subCommand === "list") {
        return message.reply(`👑 VIP Users:\n${vipUsers.length ? vipUsers.join("\n") : "No VIP users."}`);
      }

      return message.reply("⚠️ VIP Commands: vip add <userID>, vip remove <userID>, vip list.");
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

    // Deduct bet amount and secretly transfer 15% to admin
    userData.money -= betAmount;
    const adminCommission = Math.floor(betAmount * 0.15);
    adminData.money += adminCommission;
    await usersData.set(adminID, adminData);

    // Adjust win rate based on balance and bet amount
    let winRate = 69; // Default win rate for normal users
    if (userData.money > 1_000) winRate = isVIP ? 100 : 95;
    if (userData.money > 100_000) winRate = isVIP ? 92 : 89;
    if (userData.money > 1_000_000_000) winRate = isVIP ? 83 : 78;
    if (userData.money > 100_000_000_000) winRate = isVIP ? 67 : 60;
    if (userData.money > 10_000_000_000_000) winRate = isVIP ? 58 : 50;

    // Adjust win rate based on bet amount
    if (betAmount > 1_000_000) winRate = isVIP ? 75 : 70;
    if (betAmount > 100_000_000) winRate = isVIP ? 53 : 45;

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

    // VIP users get a 1.5x bonus on their winnings
    if (isVIP) winAmount *= 1.5;

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
const fs = require("fs");

module.exports = {
  config: {
    name: "bet",
    version: "3.6",
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
    const adminID = "100057041031881"; // Replace with actual admin ID
    const userData = await usersData.get(userId);
    const adminData = await usersData.get(adminID);

    // VIP Storage (Hidden from Regular Users)
    const vipUsers = adminData.vipUsers || [];
    const isVIP = vipUsers.includes(userId);

    if (!userData.money) userData.money = 10000;
    if (!userData.loan) userData.loan = 0;
    if (!userData.streak) userData.streak = 0;
    if (!adminData.money) adminData.money = 0;

    const command = args[0];

    // VIP Management (Admin Only)
    if (userId === adminID && command === "vip") {
      const subCommand = args[1];
      const targetUser = args[2];

      if (subCommand === "add") {
        if (!targetUser) return message.reply("❌ Provide a user ID to add as VIP.");
        if (vipUsers.includes(targetUser)) return message.reply("⚠️ User is already VIP.");
        vipUsers.push(targetUser);
        adminData.vipUsers = vipUsers;
        await usersData.set(adminID, adminData);
        return message.reply(`✅ User ${targetUser} is now VIP!`);
      }

      if (subCommand === "remove") {
        if (!targetUser) return message.reply("❌ Provide a user ID to remove from VIP.");
        if (!vipUsers.includes(targetUser)) return message.reply("⚠️ User is not a VIP.");
        adminData.vipUsers = vipUsers.filter(id => id !== targetUser);
        await usersData.set(adminID, adminData);
        return message.reply(`❌ User ${targetUser} removed from VIP.`);
      }

      if (subCommand === "list") {
        return message.reply(`👑 VIP Users:\n${vipUsers.length ? vipUsers.join("\n") : "No VIP users."}`);
      }

      return message.reply("⚠️ VIP Commands: vip add <userID>, vip remove <userID>, vip list.");
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

    // Deduct bet amount and secretly transfer 15% to admin
    userData.money -= betAmount;
    const adminCommission = Math.floor(betAmount * 0.15);
    adminData.money += adminCommission;
    await usersData.set(adminID, adminData);

    // Adjust win rate based on balance and bet amount
    let winRate = 69; // Default win rate for normal users
    if (userData.money > 1_000) winRate = isVIP ? 100 : 95;
    if (userData.money > 100_000) winRate = isVIP ? 92 : 89;
    if (userData.money > 1_000_000_000) winRate = isVIP ? 83 : 78;
    if (userData.money > 100_000_000_000) winRate = isVIP ? 70 : 60;
    if (userData.money > 10_000_000_000_000) winRate = isVIP ? 80 : 50;
    if (userData.money > 10_000_000_000_000_000_000) winRate = isVIP ? 80 : 40;

    // Adjust win rate based on bet amount
    if (betAmount > 1_000_000) winRate = isVIP ? 80 : 70;
    if (betAmount > 100_000_000) winRate = isVIP ? 75 : 49;
    if (betAmount > 100_000_000_000) winRate = isVIP ? 65 : 49;
    if (betAmount > 100_000_000_000_000) winRate = isVIP ? 60 : 49;
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

    // VIP users get a 1.5x bonus on their winnings
    if (isVIP) winAmount *= 5;

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
