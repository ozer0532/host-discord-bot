const Discord = require('discord.js');

const defaultReactions = [
    '0️⃣','1️⃣','2️⃣','3️⃣','4️⃣',
    '5️⃣','6️⃣','7️⃣','8️⃣','9️⃣',
    '🔟','❤','🧡','💛','💚',
    '💙','🖤','🤍','💜','🤎',
]

module.exports = {
	name: 'poll',
    description: 'Create a poll from the given options.',
    // shortDescription: 'Short Description',
    // args: true,
	// aliases: ['alias'],
    usage: '<pollquestion...> | {polloptions}',
    // uses: [
    //     "",
    // ].join('\n'),
    arguments: [
        "`<pollquestion...> : string` - The poll question to be asked. (You can also use a line break to split the question with the options).",
        "`{polloptions} : <polloption...> ['|' {polloptions}]` - A list of `<polloption...>`s seperated by a '|' character or a line break.",
        "`<polloption...> : PollOption` - A one-line string representing an option for the poll. Start with an emoji to set it as the react emoji, otherwise the react emoji is randomly set.",
    ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {
        let text = args.join(' ');

        let options = text.split(/[\n|]/);
        options.filter(option => /^\s$/.test(option));  // Remove whitespaces only text

        let question = options.shift();

        if (options.length < 2) {
            return message.channel.send("Please enter at least 2 options!");
        }

        if (options.length > 20) {
            return message.channel.send(`Cannot make a poll with more than **20** options! (You entered **${options.length}**)`);
        }

        let data = {};

        for (let i = 0; i < options.length; i++) {
            data[defaultReactions[i]] = options[i];
        }

        console.log(data);

        let outputText = Object.entries(data).map((entry) => `${entry[0]} - ${entry[1]}`).join('\n');

        let embed = new Discord.MessageEmbed();
        embed = embed.setTitle(`Poll - ${ question }`);
        embed = embed.setDescription(outputText);

        let pollMessage = await message.channel.send(embed);
        try {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++ ) {
                let key = keys[i];
                await pollMessage.react(key);
            }
        } catch (error) {
            console.error('One of the emojis failed to react.');
            await message.channel.send(`Failed to react with emojis. Reason: ${error}`);
            pollMessage.delete();
        }
	},
};