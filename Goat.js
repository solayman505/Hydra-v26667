const fs = require("fs");
const path = require("path");
const axios = require("axios");
const google = require("googleapis").google;
const nodemailer = require("nodemailer");
const { execSync } = require('child_process');
const log = require('./logger/log.js');

// Error Handling
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

// Disable promise warning
process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

// Utility function to validate JSON
function validJSON(pathDir) {
  try {
    if (!fs.existsSync(pathDir))
      throw new Error(`File "${pathDir}" not found`);
    execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
    return true;
  }
  catch (err) {
    let msgError = err.message;
    msgError = msgError.split("\n").slice(1).join("\n");
    const indexPos = msgError.indexOf("    at");
    msgError = msgError.slice(0, indexPos != -1 ? indexPos - 1 : msgError.length);
    throw new Error(msgError);
  }
}

// Configuration files
const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirAccount = path.normalize(`${__dirname}/account${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`);

// Validate config files
for (const pathDir of [dirConfig, dirConfigCommands]) {
  try {
    validJSON(pathDir);
  }
  catch (err) {
    log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message.split("\n").map(line => `  ${line}`).join("\n")}\nPlease fix it and restart bot`);
    process.exit(0);
  }
}

// Load configuration
const config = require(dirConfig);
if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds))
  config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(id => id.toString());
const configCommands = require(dirConfigCommands);

// Initialize GoatBot object
global.GoatBot = {
  startTime: Date.now() - process.uptime() * 1000, 
  commands: new Map(),
  eventCommands: new Map(),
  aliases: new Map(),
  config,
  configCommands,
  envGlobal: configCommands.envGlobal,
  envCommands: configCommands.envCommands,
  envEvents: configCommands.envEvents,
};

// Function to load commands
const loadCommand = (filePath) => {
  const command = require(filePath);

  // If command is in MiraiBot format, convert it to GoatBot format
  if (typeof command.run === "function") {
    return {
      config: {
        name: path.basename(filePath, ".js"),
        version: "1.0",
        author: "Converted from Mirai",
        role: 0,
        countDown: 5,
        category: "converted",
        shortDescription: "Converted Mirai Command",
        longDescription: "This command was converted from MiraiBot to work in GoatBot."
      },
      onStart: async function({ api, event, args }) {
        return await command.run({ api, event, args });
      }
    };
  }

  return command;
};

// Load all commands
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith(".js")) {
    global.GoatBot.commands[file.replace(".js", "")] = loadCommand(path.join(commandsPath, file));
  }
});

console.log("✅ GoatBot loaded all commands, including MiraiBot commands!");

// Auto-restart logic
if (config.autoRestart) {
  const time = config.autoRestart.time;
  if (!isNaN(time) && time > 0) {
    utils.log.info("AUTO RESTART", `Restarting in ${time}ms`);
    setTimeout(() => {
      utils.log.info("AUTO RESTART", "Restarting...");
      process.exit(2);
    }, time);
  }
}

// Set up email transporter using OAuth2
const { gmailAccount } = config.credentials;
const { email, clientId, clientSecret, refreshToken } = gmailAccount;
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(clientId, clientSecret);
OAuth2_client.setCredentials({ refresh_token: refreshToken });
let accessToken;
try {
  accessToken = await OAuth2_client.getAccessToken();
}
catch (err) {
  throw new Error("Google API Token Expired");
}
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: email,
    clientId,
    clientSecret,
    refreshToken,
    accessToken
  }
});

// Utility function to send mail
async function sendMail({ to, subject, text, html, attachments }) {
  const mailOptions = {
    from: email,
    to,
    subject,
    text,
    html,
    attachments
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

global.utils = {
  sendMail,
  transporter
};

// Watch and reload config files when modified
const watchAndReloadConfig = (dir, type, prop, logName) => {
  let lastModified = fs.statSync(dir).mtimeMs;
  let isFirstModified = true;

  fs.watch(dir, (eventType) => {
    if (eventType === type) {
      const oldConfig = global.GoatBot[prop];
      setTimeout(() => {
        if (isFirstModified) {
          isFirstModified = false;
          return;
        }
        if (lastModified === fs.statSync(dir).mtimeMs) {
          return;
        }
        global.GoatBot[prop] = JSON.parse(fs.readFileSync(dir, 'utf-8'));
        log.success(logName, `Reloaded ${dir.replace(process.cwd(), "")}`);
      }, 200);
      lastModified = fs.statSync(dir).mtimeMs;
    }
  });
};

watchAndReloadConfig(dirConfigCommands, 'change', 'configCommands', 'CONFIG COMMANDS');
watchAndReloadConfig(dirConfig, 'change', 'config', 'CONFIG');

console.log("🚀 Hydra is now running!");
