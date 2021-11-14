import dotenv from "dotenv";
dotenv.config();

import * as Discord from "discord.js";

//const Discord = require('discord.js')
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

bot.on('messageCreate', (message) => {
  console.log({message})
    if(message.author.bot) return;
    let prefix = '!';
    // hello there ['hello', 'there']
    // !ban user reason ['!ban', 'user', 'reason']
    let MessageArray = message.content.split(' ');
    let cmd = MessageArray[0].slice(prefix.length)
    let args = MessageArray.slice(1)

    if(!message.content.startsWith(prefix)) return;

    if(cmd == 'h') {
        message.channel.send('hello');
    }
})

bot.login(process.env.DISCORD_TOKEN)