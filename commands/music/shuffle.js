module.exports = {
	name: 'shuffle',
    description: 'Shuffles the next track playing by taking a random track from the queue to the top.',
    shortDescription: 'Shuffles the next track playing.',
    // args: true,
	// aliases: [''],
    usage: '[off|on]',
    uses: [
        "`${prefix}shuffle` - Toggles between off and on.",
        "`${prefix}shuffle off` - Turns off queue shuffling.",
        "`${prefix}shuffle on` - Turns on queue shuffling.",
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
                "You have to be in a voice channel to change the shuffle settings!"
            );
        if (!serverQueue)
            return message.channel.send("The queue is empty!");
        
        if (args[0]) {
            if (args[0] == 'off' || args[0] == 'on') {
                serverQueue.shuffle = args[0] == 'on';
                return message.channel.send(`Shuffle is set to: **${args[0]}**`);
            } else {
                return message.channel.send(`Accepted arguments are: \`off|on\``);
            }
        } else {
            serverQueue.shuffle = !serverQueue.shuffle;
            return message.channel.send(`Shuffle is set to: **${serverQueue.shuffle ? 'on' : 'off'}**`);
        }
	},
};