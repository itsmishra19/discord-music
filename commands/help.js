const Discord = require("discord.js")
const fs = require("fs")
module.exports.run = async (client, message, args, prefix) => {
  
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
        .setTitle(`Commands for ${client.user.username}!`)
        .setDescription(`**__${prefix}play__** **Usage: ${prefix}play <Song Name> Description: To Play Music**\n\n**__${prefix}skip__** **Usage: ${prefix}skip Description: To Skip Music**\n\n**__${prefix}dc__** **Usage: ${prefix}dc Description: Bot Disconnect From Connected VC**\n\n**__${prefix}queue__** **Usage: ${prefix}queue Description: To Check The Queue List**\n\n**__${prefix}np__** **Usage: ${prefix}np Description: To Check The Current Playing Song**\n\n**__${prefix}volume__** **Usage: ${prefix}volume 10 Description: To Increase Or Decrease Song Volume**\n\n**__${prefix}pause__** **Usage: ${prefix}pause Description: Pause The Current Playing Song**\n\n**__${prefix}resume__** **Usage: ${prefix}resume Description: Resumes The Paused Song**\n\n**__${prefix}search__** **Usage: ${prefix}search <Song Name> Description: Searches Song By Given Name**\n\n**__${prefix}shuffle__** **Usage: ${prefix}shuffle Description: Shuffle The Song**\n\n**__${prefix}loop__** **Usage: ${prefix}loop Description: Repeat The Current Song. To Off Loop Use Again ${prefix}loop**`)
	.setTimestamp()

message.channel.send(exampleEmbed)
  
} 

module.exports.config = {
  name: "help",
  aliases: ['h',"hlp"]
}
