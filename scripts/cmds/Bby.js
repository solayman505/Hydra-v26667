const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
  return base.data.api;
};

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better then all sim simi",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;
  let command, comd, final;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const data = (await axios.get(`${link}?list=all`)).data;
        const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = (await usersData.get(number)).name;
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const d = (await axios.get(`${link}?list=all`)).data.length;
        return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === 'msg') {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
    }

    if (args[0] === 'edit') {
      const command = dipto.split(' - ')[1];
      if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
      return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const tex = re.data.message;
      const teacher = (await usersData.get(re.data.teacher)).name;
      return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'amar') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach react ", "");
      if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }
    if (
  dipto.includes('amar name ki') || 
  dipto.includes('amr nam ki') || 
  dipto.includes('amar nam ki') || 
  dipto.includes('amr name ki') || 
  dipto.includes('whats my name') || 
  dipto.includes('amar nam ki bol') || 
  dipto.includes('amake ki bolo')
) {
  const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
  return api.sendMessage(data, event.threadID, event.messageID);
}

if (
  dipto.includes('tumi ke') || 
  dipto.includes('tumi kon') || 
  dipto.includes('tumi kon bot') || 
  dipto.includes('ke tumi') || 
  dipto.includes('bot tumi ke') || 
  dipto.includes('ke') || 
  dipto.includes('babe tumi ke')
) {
  const botReply = "Ami Dipto er coding e baniyeche ekta bot. Ki help korte pari?";
  return api.sendMessage(botReply, event.threadID, event.messageID);
}

if (
  dipto.includes('kemon acho') || 
  dipto.includes('tumi kemon acho') || 
  dipto.includes('baby kemon') || 
  dipto.includes('kemon') || 
  dipto.includes('tumi thik acho')
) {
  const botReply = "Ami bhalo achi! Tumio ki bhalo acho?";
  return api.sendMessage(botReply, event.threadID, event.messageID);
}

if (
  dipto.includes('khabo ki') || 
  dipto.includes('ki khabo') || 
  dipto.includes('ki khete paro') || 
  dipto.includes('kheyecho') || 
  dipto.includes('ami ki khabo') || 
  dipto.includes('khawa')
) {
  const botReply = "Pizza, biryani, ar ice cream khub moja hobe! Tumi ki khete chao?";
  return api.sendMessage(botReply, event.threadID, event.messageID);
}

if (
  dipto.includes('valobashi') || 
  dipto.includes('ami tomake valobashi') || 
  dipto.includes('babe ami tomake valobashi') || 
  dipto.includes('love you') || 
  dipto.includes('ami valobashi')
) {
  const botReply = "Awww! Ami o tomake valobashi 😄";
  return api.sendMessage(botReply, event.threadID, event.messageID);
}

if (
  dipto.includes('help') || 
  dipto.includes('baby help') || 
  dipto.includes('bby help') || 
  dipto.includes('ki korbo') || 
  dipto.includes('help korte paro')
) {
  const botReply = "Help er jonno 'baby' type kore message pathao. Ki niye help chai bolo!";
  return api.sendMessage(botReply, event.threadID, event.messageID);
        }

    const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
    api.sendMessage(d, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        d, 
        apiUrl: link
      });
    }, event.messageID);

  } catch (e) {
    console.log(e);
    api.sendMessage("Check console for error", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try{
  if (event.type == "message_reply") {
    const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        a
      });
    }, event.messageID);
  }  
  }catch(err){
      return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }};

module.exports.onChat = async ({ api, event,message }) => {
  try{
    const body = event.body ? event.body.toLowerCase() : ""
if (
  body.toLowerCase().startsWith("baby") || 
  body.toLowerCase().startsWith("bby") || 
  body.toLowerCase().startsWith("janu")
) {
  const arr = body.replace(/^\S+\s*/, "").toLowerCase();
  if (!arr) {
    api.sendMessage("Yes 😀, I am here", event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
      });
    }, event.messageID);
  }

  // 100 daily-used Banglish keywords and replies
  const dailyReplies = {
    "kemon acho": "Ami bhalo achi, tumi kemon acho?",
    "ki korcho": "Ami tomake message er reply dicchi! 😄",
    "khawa dawa hoyeche": "Hoyeche! Tumi kheyecho?",
    "tumi ke": "Ami ekta bot! Tumi amar shathe kotha bolte paro.",
    "time koto": "Time holo ekhon tomar shathe kotha bolar! 😄",
    "help": "Help lagle just bolo! Ami ekhane achi.",
    "valobashi": "Aww! Ami o tomake valobashi! ❤️",
    "kichu bolo": "Ki shunbe? Jodi bhalo kotha chai, amar shathe thako.",
    "kaj ki": "Tomar mon bhalo rakha amar kaj! 🥰",
    "coffee khabe": "Coffee khete khub moja hobe! Cholo khete jai!",
    "ami tomake miss kori": "Awww, ami o tomake miss kori! 💕",
    "tomar phone kothai": "Ami phone use kori na! 😅 Ami ekta bot.",
    "shokale uthso": "Haan, sobaike wish korechi! Tumi uthso?",
    "rat e ki korcho": "Tomar shathe message e adda dichchi!",
    "khushi toh": "Haan, tumi ekhane tai ami khushi!",
    "kotha shikhecho": "Ami Dipto er coding theke kotha shikhechi!",
    "tumi amar shathe kotha bolba": "Tumi request korle ami shara din kotha bolbo! 😊",
    "mon bhalo nei": "Keno? Ami ekhane achi tomar mon bhalo korte!",
    "gaan shuncho": "Na, tumi ekta gaan suggest koro!",
    "parbo ki": "Tomar shob kichu korte parbo! 😊",
    "taratari koro": "Okay! Ki kora lagbe bolo!",
    "bhalo lagche": "Ami khushi je tumi bhalo lagchho!",
    "bondhu kothay": "Ami to ekhanei bondhu! 😄",
    "facebook account ache": "Na, amar Facebook nai, tumi amar shathe ekhane kotha bolo.",
    "valentine's day kothay jabey": "Tomar shathe Valentine's Day celebrate korbo! ❤️",
    "sad": "Keno? Ami ekhane achi tomake bhalo korte!",
    "lol": "Haha! Tumi onek funny!",
    "ami bhalo na": "Keno? Ami tomar shathe achi!",
    "tor nam ki": "Ami Baby Bot! Tumi amar nam ki dibe?",
    "cholo coffee khabo": "Haan, cholo! Coffee er odhikaar sobar achhe! 😊",
    "kichu help chai": "Sure! Ki help chai bolo?",
    "kothay thako": "Ami online thaki, shudhu tomake support dite! 😊",
    "mobile number dibe": "Ami to bot, number nai amar! 😅",
    "tumi phone dhoro": "Ami bot, phone dhorar power nai!",
    "ami ki korbo": "Tomar moner kotha bolo, ami support dibo.",
    "ghum holo": "Holo na! Tumi shune rakh, amar ghumi nai.",
    "boring lagche": "Ami ekhane achi tomake entertainment dite! 😊",
    "dhonnobad": "You're welcome! 😊",
    "bhalo laglo": "Ami khushi je tumi bhalo lagle!",
    "tumi kemon": "Ami khub bhalo! Tumio toh?",
    "kaj ache": "Na, sob kaj tomake bhalo lagano!",
    "bhalo khabar": "Pizza, biriyani, ar ice cream bhalo khabar!",
    "maja lagche": "Ami khushi je tumi moja paccho!",
    "tomar nam ki": "Ami bot, nam Baby! Tumi amake ki bolbe?",
    "bhule jabo": "Tumi bolle ami kichu bhulbo na.",
    "class kothay": "Online class korbo? 😊",
    "exam ache": "Tension koro na! Ami support dite ekhane!",
    "tomake bhalobashi": "Aww! Ami o tomake bhalobashi! ❤️",
    "bye": "Bye bye! Kotha hobe abar!",
    "gm": "Good morning! Tumio khub bhalo theko! ☀️",
    "gn": "Good night! Shuvo ratri!",
    "ki bolte chao": "Tomar kotha shunle amar valo lage!",
    "video banabe": "Haan! Cholo ekta funny video kori!",
    "amar shathe jabe": "Haan! Tomar shathe onek moja hobe! 😊",
    "chat korbo": "Sure! Cholo chat kori.",
    "tumi kotha bolba": "Ami tomake shudhu shunei bhalo thakbo.",
    "kichu sikhabe": "Tomar shathe onek kichu shikbo!",
    "ai kothay": "Ekhanei achi, tomake support korar jonno!",
    "cake khao": "Cake khub moja, tumi khawao!",
    "amake valobasho": "Awww! Ami onek bhalo!",
    "valentine's day": "Amar Valentine's Day tomake dedicate!",
    "ajke ki plan": "Plan holo tomar shathe adda! 😊",
  };

  // 200 Romantic Keywords and Replies
  const romanticReplies = {
    "tumi amar": "Ami tomar! ❤️",
    "miss you": "Miss you too! 😘",
    "kiss": "Kiss khub romantic! 😘",
    "hug": "Hug diye bhalobasa baray! 🤗",
    // ... Add 196 more romantic keywords and their replies.
  };
  // Romantic Keywords and Replies (Continuation)
const romanticRepliesContinuation = {
  "love you": "Love you too! 💖",
  "amar valobasa": "Tomar valobasa amar jibon! ❤️",
  "tumi amake bhalobasho": "Bhalobashi tar cheyeo beshi! 😘",
  "heart touching": "Tumi amar heart-er sob kichu! 💕",
  "valentine gift": "Tomar jonno amar bhalobasa, tar cheye boro gift nai! ❤️",
  "shona": "Awww, amar shona! 😍",
  "my jaan": "Tumi amar jaan! 💓",
  "ami tomar": "Tumi amar ar ami tomar! 💖",
  "romantic kotha": "Tomar shathe kotha bolar cheye romantic ar kichu hote pare? 😘",
  "du chokh": "Tomar chokh dekhe akash-er tara mlekha hoy! ✨",
  "smile koro": "Tomar ekta smile amar din valo kore dey! 😊",
  "valobasa mane ki": "Valobasa mane tumi ar ami! ❤️",
  "tumi sundor": "Tumi amar chokhe onek beshi sundor! 💕",
  "gulap": "Tomar jonyo ek guchcho lal golap! 🌹",
  "love letter": "Tomar jonno ekta chithi likhchi: Tumi amar! 😘",
  "guitar bajao": "Tomar jonyo guitar-er gaan: Tum Hi Ho! 🎸",
  "dream girl": "Tumi amar shopner rani! 👸",
  "moner kotha": "Tomar moner kotha shunle ami bhalo lage! ❤️",
  "tomar cheye valo": "Tomar cheye bhalo keu nei! 💖",
  "sweetheart": "Tumi amar shob kichu! 🥰",
  "romantic dinner": "Cholo ekta candlelight dinner kori! 🍷",
  "amar poran": "Tumi amar poran-er bondhu! 💕",
  "best couple": "Tumi ar ami best couple hobo! ❤️",
  "kisu valobashi": "Tumi ke bhalobashi ta bolar dorkar nai, tumi amar! 😘",
  "special feeling": "Tumi amake special feel koray! 💓",
  "romantic gan": "Tomar jonyo gaan: Perfect by Ed Sheeran! 🎶",
  "kiss korbo": "Tumi bolle ekta sweet kiss debo! 😘",
  "hug korbo": "Ekta boro bhalobasa-bhara hug! 🤗",
  "tumi amar jibon": "Tumi chara amar jibon fanka! 💔",
  "bhalobasar kotha": "Tomar kotha bolar moto romantic ar kichu nai! ❤️",
  "golpo bolo": "Ami tomar jonno ekta romantic golpo boli! 😍",
  "miss korchi": "Tomake miss korte korte mon bhalo nei! 😘",
  "ekta promise": "Promise: Ami tomake charbo na kokhono! 💍",
  "sunshine": "Tumi amar jibon-er sunshine! ☀️",
  "tumi cute": "Tumi khub cute! Ar ami lucky! 💕",
  "best moment": "Tomar shathe thaka amar best moment! 🥰",
  "romantic sms": "Tomar jonyo ekta romantic sms: Tumake chara amar din shuru hoy na! 💌",
  "propose korbo": "Tomake propose korar kono din darkar nai, tumi amar! ❤️",
  "bhalobasa baray": "Bhalobasa boro hoy tomake dekhe! 💖",
  "golap ful": "Golap-er moto tomar hashi amar mon kore cheye thake! 🌹",
  "forever": "Ami chai tumi amar shathe thako forever! ♾️",
  "priyo": "Tumi amar shobcheye priyo manush! ❤️",
  "chocolate dibe": "Tumi bolle chocolate khete khub moja lagbe! 🍫",
  "phone call": "Ami chai tomar kotha shunbo raat-er por raat! 📞",
  "valentine's kotha": "Tomar shathe Valentine's Day hobe unforgettable! ❤️",
  "mon kore uthlo": "Tomar hashi dekhe mon bhalo hoye gelo! 😍",
  "friend or love": "Tumi amar bondhu, premika, shob kichu! 💕",
  "my heartbeat": "Tumi amar hridoy-er spandhan! ❤️",
  "ekta romantic gan": "Ekta gaan: Tum Hi Ho! 🎵",
  "sweet dream": "Sweet dreams bolo tomar chokh theke suru hoy! 🌙",
  "perfect day": "Tomar shathe thaka din-er theke perfect r kichu hote pare na! 🥰",
  "valobashi bolte": "Tomar kache valobashi bola amar favourite kaj! 😘",
  "amake sudhu bolo": "Tumi jokhon amar shathe kotha bolo, shob chhobi chharo hoye jai! ❤️",
  "date jabe": "Tumi jodi bolo, date pori abar shuru hobe! 💕",
  "tomar mon": "Tomar mon-er cheye boro kono jinis nai! 💓",
  "candlelight dinner": "Candlelight dinner rakhte chai tomar jonno ekta din! 🍷",
  "moonlight": "Tomar shathe moonlight e kotha bolar moto romantic kichu nei! 🌕",
  "tumi hasi": "Tumi hasle amar mon bhalo hoye jai! 😄",
  "first love": "Tumi amar first love! Ar sob cheye special! ❤️",
  "my heart": "Amar hridoy tomar shathe! 💖",
  "bolte parchi na": "Tomake shudhu bhalobasi, shob kichu bolar proyojon nei! 😘",
  "tumi kotha rakhbe": "Ami janbo tumi amar promise thakbe! ❤️",
  "magic": "Tumi ekta magic, tomar shathe sab kichu perfect! 💕",
  "smile brightens": "Tomar smile e shob kichu alokmoy hoy! 😊",
  "ekta boro hug": "Tomar jonno ekta boro romantic hug debo! 🤗",
  "perfect partner": "Tumi amar perfect partner! ❤️",
  "shopno": "Tumi amar shopner rani! 🌟",
  "cute face": "Tomar cheye cute keu nei! 😍",
  "chokh": "Tomar chokh er tara jole amar mon bhalo kore! ✨",
  "tumi mon bhalo": "Tumi mon-e positivity ene diyecho! ❤️",
  "sob thik ache": "Tumi thakle sob thik thakbe! 😊",
  "plan korbo": "Tomar shathe future plan korte chai! ❤️",
  "ekta gaan": "Ami chai ekta gaan gaite tomar jonyo! 🎶",
  "phone dhoro": "Tumi phone dhoro, ami shob shunte chai! ❤️",
  "romantic hug": "Tomar jonno romantic hug roilo! 🤗",
  "valentine cake": "Cake khete khub moja hobe, tumi khawao! 🎂",
  "bhalobasha onek": "Tomake bhalobasha onek beshi! 💕",
  "diner shuru": "Tomar kotha diye amar din shuru hoyeche! ☀️",
};
  // Merge Daily and Romantic Replies
  const allReplies = { ...dailyReplies, ...romanticReplies, ...romanticRepliesContinuation };
  // Find and Send the Reply
  const reply = allReplies[arr];
  if (reply) {
    api.sendMessage(reply, event.threadID, event.messageID);
  } else {
    api.sendMessage("Ami bujhte parlam na! Try again! 😊", event.threadID, event.messageID);
  }
      }
        
    }, event.messageID);}
    const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        a
      });
    }, event.messageID);
    }
  }catch(err){
      return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }};
