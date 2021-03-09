module.exports = {
	name: 'loop',
    description: 'Repeats a song or all tracks in the queue.',
    // shortDescription: 'Short Description',
    // args: true,
	aliases: ['repeat'],
    usage: '[off|single|all]',
    uses: [
        "`${prefix}loop` - Toggles between off, single, and all.",
        "`${prefix}loop off` - Stops the looping.",
        "`${prefix}loop single` - Loops the current track playing.",
        "`${prefix}loop all` - Loops the whole queue, sending the current track to the back of the queue once it finishes.",
    ].join('\n'),
    // arguments: [
    //     "",
    // ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {
        const serverQueue = client.database.queue.get(message.guild.id);

        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to change the loop settings!"
            );
        if (!serverQueue)
            return message.channel.send("The queue is empty!");
        
        if (args[0]) {
            if (args[0] == 'off' || args[0] == 'single' || args[0] == 'all') {
                serverQueue.loop = args[0];
                return message.channel.send(`Loop is set to: **${args[0]}**`);
            } else {
                return message.channel.send(`Accepted arguments are: \`off|single|all\``);
            }
        } else {
            if (serverQueue.loop == 'off') {
                serverQueue.loop = 'single';
            } else if (serverQueue.loop == 'single') {
                serverQueue.loop = 'all';
            } else {
                serverQueue.loop = 'off';
            }
            return message.channel.send(`Loop is set to: **${serverQueue.loop}**`);
        }
	},
};