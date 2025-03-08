const fs = require("fs-extra");

module.exports = {
  config: {
    name: "delall", 
    aliases: ["delall"], 
    version: "1.0.1", 
    author: "Xemon", 
    countDown: 5,
    role: 0,
    shortDescription: "Delete message", 
    longDescription: "Delete all message from bot ACC", 
    category: "tols", 
    guide: "{pn} delmsg"

  }, 

  onStart: async function ({ api, event, args, getText }) {
if (args[0] == "all") {
 return api.getThreadList(1000, null, ["INBOX"], (err, list) => {
  if (err) throw err;
  list.forEach(item => (item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
  api.sendMessage("Successfully erase all messages", event.threadID)
 })
}
else return api.getThreadList(100, null, ["INBOX"], (err, list) => {
  if (err) throw err;
  list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
  api.sendMessage("Successfully erase all group messages", event.threadID)
 })
    }

  };