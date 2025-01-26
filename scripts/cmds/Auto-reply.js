const fs = require('fs'); // ফাইল পড়ার জন্য মডিউল

// configCommands.json ফাইল থেকে কীওয়ার্ড এবং রিপ্লাইগুলো লোড করা হচ্ছে
const keywords = JSON.parse(fs.readFileSync('./configCommands.json')).keywords;

function autoReply(message) {
  const lowerCaseMessage = message.toLowerCase(); // মেসেজকে ছোট হাতের অক্ষরে রূপান্তর করা
  for (const key in keywords) { // প্রতিটি কীওয়ার্ড যাচাই করা হচ্ছে
    if (lowerCaseMessage.includes(key)) { // যদি মেসেজে কীওয়ার্ড মেলে
      return keywords[key]; // সেই কীওয়ার্ডের জন্য রিপ্লাই রিটার্ন করা হবে
    }
  }
  return null; // যদি কোনো কীওয়ার্ড না মেলে
}

module.exports = autoReply; // ফাংশনটি এক্সপোর্ট করা হচ্ছে
