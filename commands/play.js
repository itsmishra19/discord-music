const { Util } = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {
if (!message.member.voice.channel) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | You must be in a voice channel to play!`}});
  
if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | You are not in my voice channel!`}});

let query = args.join(" ");
if (!query) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | Please enter a query to search!` }})

const searchTracks = await client.player.searchTracks(query).catch(e => {
  return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | No results found!`}})
});

if(searchTracks.length < 1) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | No results found!`}})
  
let track = searchTracks[0];


if(client.player.isPlaying(message.guild.id)){
    // Add the song to the queue
    let song = await client.player.addToQueue(message.guild.id, track, message.member.user.tag);
   return message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.success} | ${Util.escapeMarkdown(song.name)} by ${Util.escapeMarkdown(song.author)}  Added to the queue!` }})
} else {
    // Else, play the song
    let song = await client.player.play(message.member.voice.channel, track, message.member.user.tag);
    message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.music} | Now Playing:\n${song.name}` }})
    client.player.getQueue(message.guild.id).on('end', () => {
    message.channel.send({embed: {color: client.colors.warning, description: `${client.emotes.warning} | Queue completed, add some more songs to play!` }})
    });

    client.player.getQueue(message.guild.id).on('trackChanged', (oldSong, newSong, skipped, repeatMode) => {
        if(repeatMode){
            message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.repeat} | Repeating:\n ${oldSong.name}` }})
        } else {
            message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.music} | Now Playing:\n ${newSong.name}` }})
        }
    });
}
}
  
module.exports.config = {
  name: "play",
  aliases: ['p']
}
