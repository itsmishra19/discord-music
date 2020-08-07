const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {

    if(!client.player.isPlaying(message.guild.id)) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | There is nothing playing!` }})

    let song = await client.player.nowPlaying(message.guild.id);

    message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.music} | Now Playing:\n${song.name} by \`${song.requestedBy}\`` }})
}

module.exports.config = {
  name: "now-playing",
  aliases: ['np']
}
