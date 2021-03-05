module.exports = {
	name: 'nowplaying',
    description: 'Display info on the currently playing track.',
    args: false,
	aliases: ['n', 'np'],
    botPermissions: ['CONNECT', 'SPEAK'],
    guildOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!serverQueue)
            return message.channel.send("There is no song currently playing!");
        
        return message.channel.send([
            `Now playing: **${serverQueue.songs[0].title}**`,
            `Duration: **[${serverQueue.songs[0].duration}]** by **${serverQueue.songs[0].channel}**`,
            `Video: ${serverQueue.songs[0].url}`,
        ].join('\n'));
	},
};
