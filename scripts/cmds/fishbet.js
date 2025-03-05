module.exports = {
    config: {
        name: "fishbet",
        version: "1.0",
        author: "Protick",
        countDown: 5,
        role: 0,
        shortDescription: "Bet on catching a fish in different modes!",
        longDescription: "Bet and fish in different modes. Upgrade your fishing rod and challenge others in PvP battles!",
        category: "game",
        guide: "{pn} <amount> | Modes: normal, deepsea, pvp <@player>, event, shop"
    },

    onStart: async function ({ message, event, args, usersData, threadsData }) {
        const userID = event.senderID;
        let betAmount = parseInt(args[0]);
        let mode = args[1] || "normal"; // Default to normal mode if no mode is specified

        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply("🎣 Please enter a valid bet amount.");
        }

        let userBalance = await usersData.get(userID, "money");
        let rodLevel = await usersData.get(userID, "fishingRod") || 1; // Default rod level 1
        let fishCaught = await usersData.get(userID, "fishCaught") || 0; // Count of fishes caught

        if (userBalance < betAmount) {
            return message.reply(`💰 You don't have enough balance. Your current balance is ${userBalance} coins.`);
        }

        // Modes: Normal, Deep Sea, PvP, Event, Shop
        if (mode === "normal") {
            await playNormalFishing();
        } else if (mode === "deepsea") {
            await playDeepSeaFishing();
        } else if (mode === "pvp") {
            await challengePvP(args[2]); // Challenge another player
        } else if (mode === "event") {
            await playEventFishing();
        } else if (mode === "shop") {
            await openShop();
        }

        // Function to play Normal Fishing Mode
        async function playNormalFishing() {
            let reward = await playFishing();
            if (reward === 0) {
                await usersData.set(userID, { money: userBalance - betAmount });
                message.reply(`❌ You caught NOTHING and lost ${betAmount} coins! New balance: ${userBalance - betAmount}`);
            } else {
                await usersData.set(userID, { money: userBalance + reward });
                message.reply(`🎣 You caught a fish and won ${reward} coins! New balance: ${userBalance + reward}`);
            }

            // Upgrade rod every 5 catches
            fishCaught++;
            if (fishCaught % 5 === 0) {
                rodLevel++;
                await usersData.set(userID, { fishingRod: rodLevel });
                message.reply(`🔥 Congrats! Your fishing rod upgraded to Level ${rodLevel}`);
            }
        }

        // Function to play Deep Sea Fishing Mode
        async function playDeepSeaFishing() {
            let reward = await playFishing(true); // Higher rewards in deep sea mode
            if (reward === 0) {
                await usersData.set(userID, { money: userBalance - betAmount });
                message.reply(`❌ You caught NOTHING and lost ${betAmount} coins! New balance: ${userBalance - betAmount}`);
            } else {
                await usersData.set(userID, { money: userBalance + reward });
                message.reply(`🎣 You caught a rare fish and won ${reward} coins! New balance: ${userBalance + reward}`);
            }
        }

        // Function for PvP fishing
        async function challengePvP(challengerID) {
            if (!challengerID) return message.reply("❌ Please specify a player to challenge!");
            let challengerBalance = await usersData.get(challengerID, "money");

            if (challengerBalance < betAmount) {
                return message.reply(`❌ The player doesn't have enough balance to accept the challenge.`);
            }

            // Both players bet the same amount and fish at the same time
            let playerReward = await playFishing();
            let challengerReward = await playFishing();

            let winner = playerReward > challengerReward ? userID : challengerID;
            let winAmount = playerReward > challengerReward ? betAmount * 2 : 0;

            await usersData.set(userID, { money: userBalance + winAmount });
            await usersData.set(challengerID, { money: challengerBalance - betAmount });

            message.reply(`💥 PvP Battle Results! ${winner === userID ? "You won" : "You lost"}! You earned ${winAmount} coins.`);
        }

        // Function to play Event Fishing (Special event with legendary fish)
        async function playEventFishing() {
            let reward = await playFishing(true, true); // Increased chance for legendary fish during events
            if (reward === 0) {
                await usersData.set(userID, { money: userBalance - betAmount });
                message.reply(`❌ You caught NOTHING during the event and lost ${betAmount} coins!`);
            } else {
                await usersData.set(userID, { money: userBalance + reward });
                message.reply(`🎣 You caught a legendary fish and won ${reward} coins during the event!`);
            }
        }

        // Function to open the shop
        async function openShop() {
            let shopItems = [
                { name: "Wooden Rod", price: 100, level: 1 },
                { name: "Pro Rod", price: 500, level: 2 },
                { name: "Speed Boat", price: 1000, level: 1 }
            ];
            let shopMessage = "🛒 Welcome to the Fishing Shop!\n";
            shopItems.forEach(item => {
                shopMessage += `${item.name} - ${item.price} coins\n`;
            });
            message.reply(shopMessage);
        }

        // General function to handle fishing rewards
        async function playFishing(isDeepSea = false, isEvent = false) {
            // Fish probabilities based on rod level and mode
            const fishTypes = [
                { name: "Small Fish", multiplier: 1.5, chance: 50 },
                { name: "Clownfish", multiplier: 2, chance: 30 },
                { name: "Pufferfish", multiplier: 3, chance: 15 },
                { name: "Dolphin", multiplier: 5, chance: 10 },
                { name: "Shark", multiplier: 10, chance: 5 },
                { name: "Nothing", multiplier: 0, chance: 20 }
            ];

            // Increase chances for better fish in deep-sea and event mode
            if (isDeepSea) {
                fishTypes.forEach(fish => fish.chance += 10); // More chances for rare fish in deep sea
            }
            if (isEvent) {
                fishTypes.forEach(fish => fish.chance += 15); // Even higher chances during events
            }

            const totalChance = fishTypes.reduce((sum, fish) => sum + fish.chance, 0);
            let randomChance = Math.random() * totalChance;
            let caughtFish = fishTypes.find(fish => (randomChance -= fish.chance) < 0);

            return caughtFish.multiplier === 0 ? 0 : Math.floor(betAmount * caughtFish.multiplier);
        }
    }
};
