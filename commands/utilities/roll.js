module.exports = {
	name: 'roll',
    description: 'Description',
    // shortDescription: 'Short Description',
    args: false,
	aliases: ['dice', 'r'],
    usage: '[<number>|<die>] [<amount>]',
    uses: [
        "`${prefix}roll` - Roll a d6.",
        "`${prefix}roll <number>` - Pick a random number from 1 to the specified number.",
        "`${prefix}roll <die>` - Roll a die, e.g. `d4`, `d6`, or `d12`. (WIP)",
        "`${prefix}roll [<number>|<die>] <amount>` - Roll multiple numbers/dice and display the sum total.",
    ].join('\n'),
    arguments: [
        "`<number> : integer` - A number.",
        // "`<die> : Die` - A valid die name. (`coin`,`d2`,`d4`, `d6`, `d8`, `d10`, `d12`, `d20`)",
        "`<amount> : integer` - The amount of numbers/dice to roll.",
    ].join('\n'),
    // userPermissions: [],
    // botPermissions: [],
    // guildOnly: true,
    // adminOnly: true,
	async execute(message, args, client) {
        let amount = args[1] || 1;

        if (amount <= 0) {
            return message.channel.send(`Amount cannot be less than 1`);
        }

        // Check if is num
        if (args[0] && !isNaN(parseInt(args[0]))) {
            let number = parseInt(args[0]);
            
            if (amount == 1) {
                let randVal = Math.floor(Math.random() * number) + 1;
                message.channel.send(`You rolled **${randVal}**.`);
            } else {
                let randVal = [];
                for (let i = 0; i < amount; i++) {
                    randVal.push(Math.floor(Math.random() * number) + 1);
                }
                let sum = randVal.reduce((acc, curr) => acc + curr);
                if (amount <= 10) {
                    message.channel.send(`You rolled ${ randVal.join(' + ') } = **${ sum }**`);
                } else {
                    message.channel.send(`You rolled a total sum of **${ sum }**`);
                }
            }

            return;
        }

        let dieName = args[0] || 'd6';
        dieName = dieName.toLowerCase();

        // If die exists
        if (!rollDie(dieName)) {
            return message.channel.send(`**${dieName}** is not a die!`);
        }

        // If is dice
	},
};

function rollDie(dieName) {
    return undefined;
}