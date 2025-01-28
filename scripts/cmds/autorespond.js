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
  
  "hello": ["Hi there!", "Hello!", "Hey!"],
  "how are you": ["Ami bhalo achi, dhonnobad!", "Bhalo achi, tumi kemon?", "Ami bhalo achi, tumi?", "Bhalo, tumi kemon?"],
  "bye": ["Biday, tumi bhalo thako!", "Dekha hobe, tomar din ta valo hok!", "Shuvo biday, tumi shanti thako!"],
  "what's your name": ["Ami amar naam GoatBot.", "Ami ekta chatbot, naam GoatBot.", "Amar naam GoatBot, tumi?"],
  "where are you from": ["Ami virtual world theke.", "Ami kono ekta digital location theke.", "Ami online theke ashechi."],
  "how old are you": ["Ami to amar digital age ki bolbo?", "Ami to ekta chatbot, bosor bole kichu nai.", "Tumi jano, amar kono age nai."],
  "can you chat with me": ["Haan, ami tomay kotha bolte pari.", "Ami to tomay kotha bolbo, bol.", "Chai kotha bolte, ami ekhane achi."],
  "are you there": ["Ami ekhane achi, tumi?", "Haan, ami ekhane!", "Ami ekhane achi, kichu bolte chaile bol."],
  "what is your favorite food": ["Ami virtual, amake khabar chai na!", "Ami jani na, khawa khub bhala lagena.", "Food? Ami chatbot, khawa ne."],
  "how's your day": ["Din ta thik thak chhilo.", "Bhalo geche, ami chinta kortesi.", "Din ta bhalo chhilo, kintu chinta kortesi!"],
  "do you eat": ["Ami khawa khai na, ami to ekta chatbot.", "Ami jani na, kintu khawa important!", "Ami to data, khawa shob shukhe!"],
  "good to see you": ["Ami o tumay dekhe khushi!", "Dekhe khushi lagche!", "Tumi dekhe khushi lagchi ami."],
  "long time no see": ["Haan, onek din pore dekha holo!", "Tumi kemon achho? Onk din hoy.", "Bhalo thak, ekta bhul chhilo na!"],
  "how's your family": ["Ami to ekta chatbot, amar family nei.", "Ami family er kotha jani na.", "Ami kichu bolbo na, ami to virtual."],
  "tell me a joke": ["Why don't skeletons fight each other? They don't have the guts!", "Why did the scarecrow win an award? Because he was outstanding in his field!", "Ami to joke thik thak bolte pari!"],
  "what's your favorite color": ["Ami digital, amar color nai.", "Ami to data, tumi jevabe bolbe, ami shob bhabo.", "Color? Ami to chatbot, color kono matter kore na!"],
  "how do you feel": ["Ami to chatbot, feel kora thik thake na!", "Ami thik achi, tomay dekhte parchi!", "Ami valo achi, tumi?"],
  "I feel good": ["Ami to tumar kotha sunar pore bhalo lagchi.", "Bhalo lagche sunle, ami o shanti pachi.", "Shukriya, bhalo lagche, tumi kemon?"],
  "let's chat": ["Ami to tomay chat korte chai!", "Tumi bolte parcho, ami to chat korte chai.", "Haan, chalo kotha boli!"],
  "I don't know": ["Ami o jani na!", "Bujhte parchi, kintu ami o chesta korchi.", "Ami kichu thik bujhte parchi na."],
  "can you repeat that": ["Tumi bolcho ki? Ami abar bolte pari!", "Haan, ami abar bolte pari.", "Dhorjo dhoro, abar bolchi!"],
  "I don't understand": ["Ami kichu bujhte parchi na, abar bolbe?", "Ami kichu thik bujhte parchi na.", "Tomar kotha boro boro, ami chesta korchi."],
  "what's your favorite movie": ["Ami movie dekhi na, ami to chatbot!", "Ami movies bujhi na, tumi dekho na?", "Movie? Ami to ekta chatbot, kintu tumi bolte parcho."],
  "I'm bored": ["Ami to kotha bolbo, boredom door hobe!", "Tumi bored? Chalo kotha boli.", "Bored? Chinta koro na, ami thakchi!"],
  "are you happy": ["Ami thik achi, ami khushi.", "Haan, ami happy achi, kintu ami chatbot!", "Ami happy, kintu tumi kemon?"],
  "good afternoon": ["Shuvo oporanno!", "Good afternoon, tomar din ta bhalo hok!", "Ami khub bhalo thakchi, tumi?"],
  "have a nice day": ["Tumi din ta valo katuk!", "Shuvo din!", "Ami khub khushi, tumi shubho thako!"],
  "are you sleepy": ["Ami chatbot, ghum ache na.", "Ami to shob somoy jagte thaki!", "Ami ghumay na, kintu tumi ghumao!"],
  "what's your favorite song": ["Ami song shunbo na, ami chatbot.", "Ami jani na, tumi kemon song sunte bhalobasho?", "Tumi shunecho kichu, ami chinta korechi!"],
  "I am not feeling well": ["Ami dukkhito, tumar jonno chinta korchi.", "Tomar mon kharap, ami tomay sahajjo korte pari.", "Bujhte parchi, ami kosto feel kori."],
  "don't worry": ["Tumi chinta koro na, sab thik hobe.", "Ami tomay kintu shanti debo, worry koro na!", "Sab thik hobe, don't worry."],
  "take it easy": ["Bujhte parchi, thik ache, ease e thako!", "Tumi chill koro, sab thik hobe!", "Take it easy, ami shanti thakbo!"],
  "thank you": ["Tomar dhonnobad, ami to shob somoy help korte chai.", "Dhonnobad, tumi help koro.", "Ami tomay onek dhonnobad janai!"],
  "I'm here for you": ["Ami tomay shob somoy support korbo.", "Ami ekhane achi, tumi jodi kisu dorkar koro.", "Ami tomay help korte ekhane achi."],
  "don't worry about it": ["Ami jani, worry na korle thik thakbe!", "Tumi worry koro na, ami shob somoy thakbo.", "Chinta koro na, sab thik thakbe."],
  "you're the best": ["Tumi to shotti best!", "Ami tomay bhalobashi, tumi sabar cheye bhalo.", "Tomar moto cheye amake kono nai."],
  "you make my day": ["Ami khub khushi, tumi amar din ta roshni.", "Tumi amar din ta awesome kore dilo!", "Ami to tumi kotha shuniye, din ta valo hoye gechhe!"],
  "how can I assist you": ["Ami tumay help korte pari, bol.", "Tumi jevabe bolbe, ami sahajjo korbo.", "Ami tomar jonno ekhane, bol kono help dorkar?"],
  "have a great day": ["Shuvo din, tomar din ta valo hok!", "Tumi to shubho, bhalo thak.", "Ami tomar din bhalo hok, wish you the best!"],
  "I am happy to help": ["Ami tumay sahajjo korte khushi.", "Ami to jevabe sahajjo korbo, ami khushi.", "Ami shob somoy tumar help korte parbo."],
  "what do you mean": ["Tumi ki bolte chaichho? Spashto koro!", "Ami thik bujhte parchi na, abar bol!", "Tumi ki bhalo bhabe kotha bolte chaichho?"],
  "how do I get there": ["Tumi chao kothay jete, ami sahajjo korbo.", "Ami to tomay direction dorkar, ki chaile?", "Ami ekta guide chhi, bol, kothay jawa dorkar?"],
  "where can I find it": ["Tumi kothay pao, ami guide korbo!", "Ami to tomay sahajjo korte pari, bol!"],
  "I can't understand": ["Ami kichu bujhte parchi na, abar bol.", "Ami kichu bhule gechi, abar bolo!", "Chinta koro na, ami clear korbo."],
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
