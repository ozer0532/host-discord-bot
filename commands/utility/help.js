const Discord = require('discord.js');
const getConfig = require('../../config.js');

module.exports = {
	name: 'help',
	description: [
        `Shows information on commands.`,
        `Here is a guide on how to read command information:`,
        `> \`plain text\` - **Enter this literally**, exactly as shown`,
        `> \`<argument>\` - Arguments should be replaced with its appropriate value`,
        `> \`<argument ...>\` - A multi-word argument where you can use spaces as part of the argument`,
        `> \`[entry]\` - An entry is optional`,
        `> \`(entry|entry)\` - (Required) **Pick one** of the entries shown`,
        `> \`[entry|entry]\`- (Optional) **Pick one** of the entries shown`,
        `> \`ellipsis ...\` - Another sub-command is required`,
        `> \`: type\` - Describes a data type of an argument`,
    ].join('\n'),
	aliases: ['h', '?'],
	usage: '[<command>|<category>]',
    uses: [
        "`${prefix}help` - Shows all commands.",
        "`${prefix}help <command>` - Do a search on a specific command.",
        "`${prefix}help <category>` - Shows a list of commands on a specific category. (WIP)",
    ].join("\n"),
    arguments: [
        "`<command> : string` - A name of a command.",
        "`<category> : string` - A name of a category.",
    ].join("\n"),
	execute(message, args) {
		const data = [];
        let embed = new Discord.MessageEmbed();
        const { commands } = message.client;

        // Send all commands to the DM
        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${getConfig("prefix")}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        if (command.description) data.push(`${command.description}\n`);

        if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join('\`, \`')}\``);
        if (command.usage) data.push(`**Usage:** \`${getConfig("prefix")}${command.name} ${command.usage}\``);
        else data.push(`**Usage:** \`${getConfig("prefix")}${command.name}\``);
        if (command.uses) data.push(`**Uses:** \n${command.uses}`.replaceAll('${prefix}', `${getConfig("prefix")}`));
        if (command.arguments) data.push(`**Arguments:** \n${command.arguments}`);
        if (command.cooldown !== undefined) data.push(`**Cooldown:** ${command.cooldown} second(s)`);

        embed = embed.setTitle(command.name).setDescription(command.description);
        embed = embed.setDescription(data.join('\n'));

        message.channel.send(embed);
	},
};