module.exports = {
    config: {
        name: "haha",
        version: "1.0",
        author: "Jaychris Garcia",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "fun",
    },
    onStart: async function(){}, 
    onChat: async function({
        event,
        message,
        getLang
    }) {
        const keywords = {
            "hahaha": [
                "oi baicdhod hasle tore kutttar motu lage!",
                "hahaha, really funny!",
                "You laugh like a donkey!",
                "Stop laughing, it's not that funny!",
                "Your laugh is contagious!"
            ],
            "good morning": [
                "Good morning! Have a great day!",
                "Morning! Hope you have a wonderful day!",
                "Good morning! Rise and shine!",
                "Morning! Wishing you a fantastic day ahead!",
                "Good morning! Let's make today amazing!"
            ],
            "good night": [
                "Good night! Sleep tight!",
                "Night! Sweet dreams!",
                "Good night! Rest well!",
                "Night! Have a peaceful sleep!",
                "Good night! See you tomorrow!"
            ],
            "hello": [
                "Hello! How are you?",
                "Hi there! What's up?",
                "Hey! How's it going?",
                "Hello! Nice to see you!",
                "Hi! How have you been?"
            ],
            "bye": [
                "Goodbye! Take care!",
                "Bye! See you later!",
                "Goodbye! Have a great day!",
                "Bye! Stay safe!",
                "Goodbye! Until next time!"
            ]
        };

        const messageText = event.body && event.body.toLowerCase();
        if (messageText && keywords[messageText]) {
            const replies = keywords[messageText];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            return message.reply(randomReply);
        }
    }
};