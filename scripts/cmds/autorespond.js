module.exports = {
config: {
name: "autorespondv3",
version: "2.0.0",
author: "Haru",
cooldown: 5,
role: 0,
shortDescription: "Autoresponds with reactions and replies",
longDescription: "Autoresponds with reactions and replies based on specific words or triggers.",
category: "fun",
guide: "?autorespondv3",
},
onStart: async ({ api, event }) => {
// Blank onStart function as per the request
},
onChat: async ({ api, event }) => {
const { body, messageID, threadID } = event;

// Reactions based on words
const emojis = {
"💜": ["Cliff", "August", "Jonell", "David", "purple", "Fritz", "Sab", "Haru", "Xuazane", "Kim"],
"💚": ["dia", "seyj", "ginanun", "gaganunin", "pfft", "xyrene", "gumanun"],
"😾": ["Jo", "Ariii", "talong", "galit"],
"😼": ["wtf", "fck", "haaays", "naku", "ngi ", "ngek", "nge ", "luh", "lah"],
"😸": ["pill", "laugh", "lt ", "gagi", "huy", "hoy"],
"🌀": ["prodia", "sdxl", "bardv3", "tanongv2", "-imagine", "genimg", "Tanongv4", "kamla", "-shortcut"],
"👋": ["hi ", "hello", "salut","bjr","bonjour"," Salut","👋","bonsoir","slt"],
"🔥": ["🔥", ".jpg", "astig", "damn", "angas", "galing", "husay"],"💩":["merde","Merde","caca","Caca","shit"],"🤢":["beurk",
      "dégueulasse",
      "dégeu",
      "horrible"
    ],"🌸": [
      "amour",
      "câlin",
      "tendresse",
      "gentillesse",
      "bienveillance",
      "douceur",
      "complicité",
      "gratitude",
      "bonheur",
      "amitié"
    ],
    "😂": [
      "Ridicule",
      "Clownesque",
      "Farce",
      "Pitrerie",
      "Comique",
      "Drôle",
      "Amusant",
      "Hilarant",
      "Loufoque",
      "Bouffonnerie",
      "Cocasse",
      "Burlesque",
      "Rigolo",
      "Absurde",
      "Irrévérencieux",
      "Ironique",
      "Ironie",
      "Parodie",
      "Esprit",
      "Facétieux"
    ],
    "😎": [
      "cool","formidable"," 😎"
    ],
    "⚡": [
      "Super",
      "Aesther"
    ],
    "🤖": [
      "Prefix","robot"
    ],
    "🔰": [
      "Nathan","barro"
    ],
    "✔️": [
      "Bien",
      "ok"
    ],
    "🎉": [
      "congrats",
      "félicitation",
      "Goddess-Anaïs"
    ],
    "😆": [
      "xD"
    ],
    "♻️": [
      "restart"
    ],
    "🖕": [
      "fuck","enculer","fdp","🖕"
    ],
    "🌀": [
      "imagine","prodia","textpro","photofy"
    ],
    "🌼": [
      "Goddess-Anaïs"
    ],
    "😑": [
      "mmmh",
      "kiii"
    ],
    "💍": [
      "Aesther"
    ],
    "💵": [
      "Anjara"
    ],
    "😝": [
      "Anjara"
    ],
    "✨": [
      "oui","super"
    ],
    "✖️": [
      "wrong",
      "faux"
    ],
    "😽": [
      "araara"
    ],
    "🤡": [
      "Kindly provide the question","clone"," sanchokuin","bakugo"
    ],
    "😕": [
      "bruh"
    ],
    "👎": [
      "Kindly provide"
    ],
    "🌩️": [
      "*thea",
      "Tatakae",
      "Damare"
    ],
  "🤢": [
      "vomir"
    ],
  "🔪": [
      "tué"
    ],
};

// Replies to specific words
const replies = {
      
  "ashcho kobe": "~~𝙴𝚖𝚗𝚎𝚒 𝙳𝚊𝚢𝚜 𝙲𝚘𝚖𝚒𝚗𝚐, 𝚃𝚘𝚖𝚖𝚊! 🙃🌷",
  "ekhon koi": "~~𝙷𝚊𝚖𝚎𝚔 𝙱𝚒𝚝𝚑𝚎, 𝚃𝚞𝚖𝚖𝚊 𝙱𝚊𝚝𝚒𝚎? 🌏✨",
  "tmi khushi to": "~~𝙷𝚊𝚖 𝙺𝚑𝚞𝚜𝚑𝚒 𝙰𝚕𝚙𝚎𝚖𝚊! 🥰🌸",
  "tomar nam ki": "~~𝚂𝚎𝚌𝚛𝚎𝚝 𝙱𝚊𝚋𝚢 𝙼𝚘𝚢𝚎𝚎! 🙈✨",
  "school e ki korcho": "~~𝙿𝚑𝚘𝚛𝚔𝚒 𝙲𝚑𝚎𝚎𝚝 𝚁𝚎𝚊𝚍𝚢! 🎒🌟",
  "tiffin e ki kheyecho": "~~𝙿𝚊𝚝𝚑𝚘𝚝 𝚂𝚑𝚘𝚢 𝙽𝚊𝚖𝚎𝚎! 🍎✨",
  "porikkhar date kobe": "~~𝙰𝚛𝚜𝚊𝚕𝚊 𝚂𝚎𝚝, 𝚂𝚊𝚍 𝙵𝚘𝚛 𝚄! 🙃🌷",
  "borof poreche": "~~𝙽𝚊𝚝𝚞𝚗 𝙲𝚑𝚞𝚕, 𝚆𝚒𝚝𝚑 𝙸𝚌𝚎! ❄️✨",
  "shobar shathe ki": "~~𝚆𝚎 𝙱𝚎 𝙵𝚊𝚖𝚎! 🫂🌺",
  "amake block koro ni": "~~𝙾𝚏𝚏𝚂𝚘𝚗 𝚂𝚊𝚟𝚎𝚍! ❤️✨",
  "tumi valoi": "~~𝙳𝚎𝚢 𝚁𝚒𝚝𝚎𝚜, 𝚂𝚊𝚏𝚊𝚛 𝙽𝚒𝚜𝚑! 🙌🌷",
  "jokhon takao": "~~𝚈𝚘𝚞 𝙶𝚕𝚘𝚠 𝚁𝚎𝚢! ✨🌟",
  "ghum hobe ki": "~~𝙷𝚊 𝙽𝚒𝚝𝚎𝚕𝚎𝚛 𝙲𝚑𝚞𝚔𝚎! 🛏️🌛",
  "phone e ki": "~~𝙻𝚘𝚊𝚍 𝚁𝚎𝚖𝚒𝚗𝚍! 📱🙃",
  "friend er shathe kotha hobe": "~~𝙼𝚎𝚎𝚝 𝙼𝚘𝚛𝚎 𝙰𝚛𝚊𝚝𝚘! 🙃🌺",
  "amar shathe kotha bolo": "~~𝙰𝚜𝚜𝚘, 𝚃𝚊𝚔𝚎 𝙼𝚊𝚒𝚗! 🤗🌟",
  "ami tumar mon chai": "~~𝙾𝚗𝚕𝚢 𝚁𝚎𝚊𝚕 𝚆𝚒𝚝𝚑 𝚃𝚞𝚖𝚖𝚊! 💖✨",
  "keu valobashe na": "ami asi na ?! ❤️🙌",
  "ajker din kharap": "pera neu kn ami asi na! 🌞✨",
  "friend list e ki ache": "~~𝙵𝚞𝚕𝚕 𝙾𝚗 𝙼𝚊𝚍𝚎 𝚃𝚒𝚔𝚔𝚎! 🤍🙌",
  "coffee banate parba": "~~𝙰𝚛 𝚂𝚑𝚘𝚗 𝚂𝚝𝚛𝚘𝚗𝚐! ☕✨",
  "ghum ashe": "~~𝙱𝚒𝚐 𝚁𝚎𝚕𝚊𝚡 𝙳𝚊𝚢! 🛌🌙",
  "cholo kothao jabo": "~~𝙴𝚡𝚌𝚒𝚝𝚎 𝚂𝚎𝚝 𝚃𝚊𝚔𝚎𝚗! ✨🌍",
  "ami ki vule gesi": "~~𝙽𝚘𝚝 𝚁𝚎𝚐𝚛𝚎𝚝, 𝙼𝚊𝚝𝚌𝚑! 🙃🌸",
  "kichu likhbo": "~~𝙼𝚊𝚜𝚝𝚎𝚛𝚢 𝚂𝚘𝚘𝚗! ✍️✨",
  "bike chalao na": "~~𝙵𝚊𝚜𝚝𝚎𝚛 𝙻𝚒𝚏𝚎𝚘𝚗𝚒𝚝𝚎! 🛵✨",
  "pore dekha hobe": "~~𝙿𝚘𝚜𝚝 𝙳𝚛𝚘𝚙 𝚃𝚊𝚔𝚎𝚗! ✨🌸",
  "tomar smile dekhe valo lage": "~~𝙱𝚘𝚗𝚍𝚑𝚞 𝙼𝚊𝚗𝚎 𝙼𝚘𝚘𝚍! 💖🙌" 
};

// React based on words
for (const [emoji, words] of Object.entries(emojis)) {
for (const word of words) {
if (body.toLowerCase().includes(word)) {
api.setMessageReaction(emoji, messageID, () => {}, true);
}
}
}

// Reply based on triggers
for (const [trigger, reply] of Object.entries(replies)) {
if (body.toLowerCase().includes(trigger)) {
api.sendMessage(reply, threadID, messageID);
}
}
},
};
