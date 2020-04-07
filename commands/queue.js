const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {

    if(!message.member.voice.channel) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | You must be in a voice channel!` }})
  
    let queue = client.player.getQueue(message.guild.id);

    if(!queue) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | There is nothing playing!` }})

    let q = queue.songs.map((song, i) => {
        return `${i === 0 ? 'Current' : `${i+1}`}- ${song.name} : ${song.author}`
    }).join('\n');  
       message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.queue} | ${q}` }})


}

  
module.exports.config = {
  name: "queue",
  aliases: ['q']
}
