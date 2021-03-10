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
        `> \`{subcommand}\` - A subcommand that is described by the same rules as a normal command.`,
        `> \`[entry]\` - An entry is optional`,
        `> \`(entry|entry)\` - (Required) **Pick one** of the entries shown`,
        `> \`[entry|entry]\`- (Optional) **Pick one** of the entries shown`,
        `> \`ellipsis ...\` - Another sub-command is required`,
        `> \`: type\` - Describes a data type of an argument`,
        `> \`: subcommandusage\` - Describes the usage of a subcommand using the same syntax as a normal command description`,
    ].join('\n'),
    shortDescription: `Shows information on commands.`,
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

        // If the command is !help
        if (!args.length) {
            data.push(`Use \`${getConfig("prefix")}help <category>\` to find more information\non commands on a specific category.\n`);
            data.push('Here\'s a list of all of my commands:');
            
            // Sort into categories
            let categories = getCategories(commands);
            for (const [key, value] of Object.entries(categories)) {
                data.push(`**${key.charAt(0).toUpperCase() + key.slice(1)}:**`);
                data.push(`\`${value.map(v => v.name).join(', ')}\``);
            }

            embed = embed.setTitle('Help');
            embed = embed.setDescription(data.join('\n'));

            return message.channel.send(embed);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        
        if (!command) {
            const category = commands.find(c => c.folder === name)?.folder;

            // If the command/category is not found
            if (!category) {
                return message.channel.send(`**${args[0]}** is not a valid command/category!`);
            }

            // If the command is !help <category>
            data.push(`Use \`${getConfig("prefix")}help <command>\` to find more information\non specific commands.\n`);
            data.push(`Here\'s a list of all commands under the **${category}** category:`);

            let categories = getCategories(commands);
            categories[name].map(c => data.push(`**${c.name}** - ${c.shortDescription || c.description}`));

            embed = embed.setTitle('Help');
            embed = embed.setDescription(data.join('\n'));

            return message.channel.send(embed);
        }

        // If the command is !help <command>
        if (command.description) data.push(`${command.description}\n`);

        if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join('\`, \`')}\``);
        if (command.usage) data.push(`**Usage:** \`${getConfig("prefix")}${command.name} ${command.usage}\``);
        else data.push(`**Usage:** \`${getConfig("prefix")}${command.name}\``);
        if (command.uses) data.push(`**Uses:** \n${command.uses}`.replace(/\${prefix}/g, `${getConfig("prefix")}`));
        if (command.arguments) data.push(`**Arguments:** \n${command.arguments}`);
        if (command.cooldown !== undefined) data.push(`**Cooldown:** ${command.cooldown} second(s)`);

        embed = embed.setTitle(command.name);
        embed = embed.setDescription(data.join('\n'));

        message.channel.send(embed);
	},
};

function getCategories(commands) {
    let categories = {}
    commands.map(command => {
        if (!command.adminOnly) {
            if (!categories[command.folder])
                categories[command.folder] = [command];
            else
                categories[command.folder].push(command);
        }
    });
    return categories;
}