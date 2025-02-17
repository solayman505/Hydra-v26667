module.exports = {
	config: {
		name: "war",
		version: "1.0",
		author: "Xemon",
		role: 2,
		category: "texts",
		guide: {
			vi: "Not Available",
			en: "cpx @(mention)"
		} 
	},

  onStart: async function ({ api, event, userData, args }) {
      var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Need to tag 1 friend whome you want to scold with bad words", event.threadID);
 let name =  event.mentions[mention];
    var arraytag = []; 
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
setTimeout(() => {a({body: "মাদারচোদ......." + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "🔱🙁🔱 বোকাচোদা..........." + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: " খানকির ছেলে............ " + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "গুদ মারানি...... " + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: " পোড মারানি............... " + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: " রেন্ডির ছেলে ......" + " " + name, mentions: arraytag})}, 14000);
setTimeout(() => {a({body: " বিচির বাল গুদের ছাল......... " + " " + name, mentions: arraytag})}, 16000);
setTimeout(() => {a({body: "খোয়া চোদা ........." + " " + name, mentions: arraytag})}, 18000);
setTimeout(() => {a({body: "বাইনচোদ........... " + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "বেশ্যা মাগী......." + " " + name, mentions: arraytag})}, 22000);
setTimeout(() => {a({body: "কুত্তাচোদা........" + " " + name, mentions: arraytag})}, 2400);
setTimeout(() => {a({body: "হাতি চোদা........" + " " + name, mentions: arraytag})}, 26000);
setTimeout(() => {a({body: "ডাইনোসর চোদা......." + " " + name, mentions: arraytag})}, 28000);
setTimeout(() => {a({body: "এঙ্গেল চোদা...................." + " " + name, mentions: arraytag})}, 30000);
setTimeout(() => {a({body: "চুতমারানি............" + " " + name, mentions: arraytag})}, 32000);
setTimeout(() => {a({body: "খানকি মাগী............" + " " + name, mentions: arraytag})}, 34000);
setTimeout(() => {a({body: "tor bou re cudi" + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a({body: "তোর বউ আমার" + " " + name, mentions: arraytag})} , 38000);
setTimeout(() => {a({body: "মাগির পোলা" + " " + name, mentions: arraytag})} , 40000);
setTimeout(() => {a({body: "তোর নানির হেডা😾🥀🤣" + " " + name, mentions: arraytag})} , 42000);
  }
};
