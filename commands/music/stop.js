// https://gabrieltanner.org/blog/dicord-music-bot
module.exports = {
	name: 'stop',
    description: 'Clears the queue and leave the voice channel.',
    args: false,
	aliases: ['st'],
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
            
        if (!serverQueue)
            return message.channel.send("There is no song playing!");
            
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
	},
};
