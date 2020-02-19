const Discord = require("discord.js")
const fs = require("fs")
const emotes = require ("../config/emojis.json")

module.exports.run = async (client, message, args) => {
  
if(!message.member.voice.channel) return message.channel.send(`**You're not in a voice channel ${emotes.error}**`)
if(!client.player.isPlaying(message.guild.id)) return message.channel.send(`**No music playing on this server ${emotes.error}**`)

     client.player.setRepeatMode(message.guild.id, true);
        // Get the current song
        let song = await client.player.nowPlaying(message.guild.id);
  
        message.channel.send(`**${song.name}, added for looping!**`);

    
}

module.exports.config = {
  name: "loop",
  aliases: ['repeat']
}