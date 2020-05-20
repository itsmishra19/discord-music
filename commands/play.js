const Discord = require("discord.js")
const fs = require("fs")

module.exports.run = async (client, message, args) => {
let queue = args.join(" ");
if (!queue) return message.channel.send({embed: {color: client.colors.error, description: `${client.emotes.error} | Please enter a query to search!` }})

let playing = client.player.isPlaying(message.guild.id);

if(playing){
    // Add the song to the queue
    let song = await client.player.addToQueue(message.guild.id, queue, message.member.user.tag);
    message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.success} | ${song.name} Added to the queue!` }})
} else {
    // Else, play the song
    let song = await client.player.play(message.member.voice.channel, queue, message.member.user.tag);
    message.channel.send({embed: {color: client.colors.success, description: `${client.emotes.music} | Now Playing:\n${song.name}` }})
    song.queue.on('end', () => {
    message.channel.send({embed: {color: client.colors.warning, description: `${client.emotes.warning} | Queue completed, add some more songs to play!` }})
    });

    song.queue.on('songChanged', (oldSong, newSong, skipped, repeatMode) => {
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
