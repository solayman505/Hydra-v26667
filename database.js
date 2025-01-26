const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE keyword_reply (id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT NOT NULL, reply TEXT NOT NULL)");

  const stmt = db.prepare("INSERT INTO keyword_reply (keyword, reply) VALUES (?, ?)");
  stmt.run('hello', 'Hi there! How can I help you today?');
  stmt.run('bye', 'Goodbye! Have a great day!');
  stmt.finalize();
});

module.exports = db;
