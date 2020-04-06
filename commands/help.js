const Discord = require("discord.js")
const fs = require("fs")
module.exports.run = async (client, message, args, prefix) => {
  
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
        .setTitle(`Commands for ${client.user.username}!`)
        .setDescription(`${client.commands.map(c => c.config.name)}`)
	.setTimestamp()

message.channel.send(exampleEmbed)
  
} 

module.exports.config = {
  name: "help",
  aliases: ['h',"hlp"]
}
