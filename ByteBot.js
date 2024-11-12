const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config({ path: '.env.local' }); 

const token = process.env.token; // Replace with your bot token
const clientId = process.env.clientId; // Replace with your client ID
const guildId = process.env.guildId; // Replace with your guild ID (for development, or you can register globally)

const commands = [
    {
        name: 'calcy',
        description: 'Simple calculator: Use with expressions like 2 + 2',
        type: 1, // Command type is 1 for slash commands
    },
    {
        name: 'about',
        description: 'About the bot',
        type: 1,
    },
    {
        name: 'help',
        description: 'List of available commands',
        type: 1,
    },
    {
        name: 'timeout',
        description: 'Set a timeout for a user',
        options: [
            {
                name: 'user',
                description: 'The user to timeout',
                type: 6, // User type
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration in seconds',
                type: 4, // Integer type
                required: true,
            },
        ],
    },
    {
        name: 'roles',
        description: 'Get user roles',
        type: 1,
    },
    {
        name: 'socials',
        description: 'Get social links of the bot',
        type: 1,
    },
    {
        name: 'updates',
        description: 'Latest updates about the bot',
        type: 1,
    },
    {
        name: 'invite',
        description: 'Get invite link for the bot',
        type: 1,
    },
    {
        name: 'strictmode',
        description: 'Toggle strict mode for the bot',
        type: 1,
    },
];

// Register commands with Discord API
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'calcy') {
        // Simple eval logic for basic arithmetic
        const expression = interaction.options.getString('expression');
        try {
            const result = eval(expression);
            await interaction.reply(`Result: ${result}`);
        } catch (error) {
            await interaction.reply('Invalid expression.');
        }
    } else if (commandName === 'about') {
        await interaction.reply('I am a utility bot to help you with various commands.');
    } else if (commandName === 'help') {
        await interaction.reply('Here are the available commands:\n`/calcy` - Simple calculator\n`/about` - About the bot\n`/help` - List of commands\n`/timeout` - Set a timeout for a user\n`/roles` - Get user roles\n`/socials` - Social links\n`/updates` - Latest updates\n`/invite` - Invite link for the bot\n`/strictmode` - Toggle strict mode');
    } else if (commandName === 'timeout') {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(duration * 1000); // Timeout in milliseconds
            await interaction.reply(`${user.tag} has been timed out for ${duration} seconds.`);
        } catch (error) {
            await interaction.reply('Error in timing out the user.');
        }
    } else if (commandName === 'roles') {
        const roles = interaction.member.roles.cache.map(role => role.name).join(', ');
        await interaction.reply(`Your roles: ${roles}`);
    } else if (commandName === 'socials') {
        await interaction.reply('Check out my social links: [GitHub](https://github.com/yourusername) [Twitter](https://twitter.com/yourusername)');
    } else if (commandName === 'updates') {
        await interaction.reply('Latest updates: Added new features and improved performance.');
    } else if (commandName === 'invite') {
        await interaction.reply('Invite me to your server: [Click here](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=BOT_PERMISSIONS)');
    } else if (commandName === 'strictmode') {
        await interaction.reply('Strict mode is now toggled.');
    }
});

client.login(token);
