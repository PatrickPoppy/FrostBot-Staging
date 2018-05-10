const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let shards = require("./shards.json");
let xp = require("./xp.json");



fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  
fs.readdir('./events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
    });
});

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} was loaded successfully!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {

  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers and watching ${bot.users.size} users!`);

  bot.user.setStatus('idle')
});

bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} | (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setStatus('idle')
  });

bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setStatus('idle')
});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") 
    message.author.send("Hey, I dont work using DMs, please invite me to a Server! ✅ https://discordapp.com/oauth2/authorize?client_id=434159357434003456&permissions=10246&scope=bot")

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  
  
  if(!shards[message.author.id]){
    shards[message.author.id] = {
      shards: 0
    };
  }

  let shardAmt = Math.floor(Math.random() * 5) + 1;
  let baseAmt = Math.floor(Math.random() * 5) + 1;

  if(shardAmt === baseAmt){
    shards[message.author.id] = {
      shards: shards[message.author.id].shards + shardAmt
    };
  fs.writeFile("./shards.json", JSON.stringify(shards), (err) => {
    if (err) console.log(err)
  });
    
  //let userShards = shards[message.author.id].shards;

  //let shardicon = message.author.displayAvatarURL
 // let shardEmbed = new Discord.RichEmbed()
 // .setAuthor(message.author.username)
//  .setColor("#0000FF")
//  .addField("Shards earnt by talking 💍", `${shardAmt} shards`, true)
 // .setThumbnail(shardicon)
 // .addField("Total amount of shards", userShards, true)
 // .addField("Gain more shards by talking in chat!", "Don't spam or you may be punished!", true)
 // .setFooter(`Version 1.0.5 BETA | Requested By ${message.author.username} ID: ${message.author.id}`, message.author.displayAvatarURL);
  

//  message.channel.send(shardEmbed).then(msg => {msg.delete(10000)});
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let userxp = xp[message.author.id].xp;
  let userlvl = xp[message.author.id].level;
  let nextLvl = xp[message.author.id].level * 1000;
  xp[message.author.id].xp =  userxp + xpAdd;
  if(nextLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = userlvl + 1;
  if (message.guild.id === "439643553648476160") return
    message.author.displayAvatarURL
    let lvlup = new Discord.RichEmbed()
    .setTitle(`${message.author.username} Level Up!`)
    .setColor("#0000FF")
    .addField("Congratulations, you have Leveled up to Level ", userlvl + 1)
    .addField("Keep on talking to earn more experience points", "Do not abuse this feature by spamming or you will be punished!")
    .setFooter(`Version 1.0.5 BETA | Requested By ${message.author.username} ID: ${message.author.id}`, message.author.displayAvatarURL);

    message.channel.send(lvlup)
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });
  let prefix = prefixes[message.guild.id].prefixes;
  if(!message.content.startsWith(prefix)) return;
 


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
  
});

bot.login(botconfig.token);