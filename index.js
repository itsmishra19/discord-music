const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()

const settings = require("./config/bot.json") //The bot connects using the configuration file


const { Player } = require("discord-player"); //Create a new Player (Youtube API key is your Youtube Data v3 key)

const player = new Player(client, settings.youtube_api); //To easily access the player

client.player = player;
client.commands = new Discord.Collection();
client.aliases =  new Discord.Collection();
client.emotes = require("./config/emojis.json");
client.colors = require("./config/colors.json");

fs.readdir("./commands/", (err, files) => {
    //it will filter all the files in commands directory with extension .js
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    //this will be executed if there is no files in command folder with extention .js
    if(jsfile.length <= 0) return console.log("Could not find any commands!");
    //it's similar to for loop
    jsfile.forEach((f, i) => { 
     //it will log all the file names with extension .js
    console.log(`Loaded ${f}!`);
        
    let pull = require(`./commands/${f}`);
   
    client.commands.set(pull.config.name, pull);  
    pull.config.aliases.forEach(alias => {
    client.aliases.set(alias, pull.config.name)
                
    });
})});

client.on("ready", () => {

    console.log("The bot is ready to play music"); //If the bot is ready it sends a message in the console
    //It will count all voice channels in which bot is connected, if none it will return 0
    let playing = client.voice.connections.size; 
    //It will set the bot status to streaming
    client.user.setPresence({ activity: { name: `music on ${playing}`, type: "STREAMING", url: "https://twitch.tv/hydroxin" } })

});

client.on('message', async message => {
    
    let prefix = settings.prefix
        
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
      
      
    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args,prefix);   
        
});

client.login(settings.token_bot); //This is the heart of the bot
