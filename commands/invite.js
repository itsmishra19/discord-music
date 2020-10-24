const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
  
const exampleEmbed = new Discord.MessageEmbed()
	      .setColor('#0099ff')
        .setTitle(`Invite me!`)
        .setDescription(`[Invite Link](${client.config.inviteURI})\n[Support Server](${client.config.supportServer})`)
	.setTimestamp()
  message.channel.send(exampleEmbed)
  
} 

module.exports.config = {
  name: "invite",
  aliases: ["support"]
}
