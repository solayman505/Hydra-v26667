client.on('message', (msg) => {
   // Jei message gula user pathabe segulo handle kora
   if (msg.body.toLowerCase() === 'hello') {
      msg.reply('Hi! How can I help you today?');
   }
});
