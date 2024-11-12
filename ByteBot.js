const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config({ path: '.env.local' });

const token = process.env.token;
const clientId = process.env.clientId;
const guildId = process.env.guildId;

const commands = [
    {
        name: 'calcy',
        description: 'Simple calculator: Use with expressions like 2 + 2',
        type: 1,
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
                type: 6,
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration in seconds',
                type: 4,
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
    {
        name: 'codepy',
        description: 'Get the link to the ByteXync project',
        type: 1,
    },
    {
        name: 'codejs',
        description: 'Get the link to the ByteBot project',
        type: 1,
    },
    {
        name: 'problem_statement',
        description: 'Get the problem statement for the community builder project',
        type: 1,
    },
];

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
        await interaction.reply('Here are the available commands:\n`/calcy` - Simple calculator\n`/about` - About the bot\n`/help` - List of commands\n`/timeout` - Set a timeout for a user\n`/roles` - Get user roles\n`/socials` - Social links\n`/updates` - Latest updates\n`/invite` - Invite link for the bot\n`/strictmode` - Toggle strict mode\n`/codepy` - Link to the ByteXync project\n`/codejs` - Link to the ByteBot project\n`/problem_statement` - Project problem statement for community builder');
    } else if (commandName === 'timeout') {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(duration * 1000);
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
    } else if (commandName === 'codepy') {
        await interaction.reply('Check out the ByteXync project here: [GitHub - ByteXync](https://github.com/anushgr/Discord-Bot-bytexync)');
    } else if (commandName === 'codejs') {
        await interaction.reply('Check out the ByteBot project here: [GitHub - ByteBot](https://github.com/DilipSC/ByteBot.git)');
    } else if (commandName === 'problem_statement') {
        await interaction.reply(`Community Builder for Remote Workers on a Virtual Island\nRemote workers are invited to a virtual island to socialise, work together, and develop new skills.\n\nPotential Solutions:\n- Bots could help users network, find mentors, or join project teams based on their skills and interests.\n- They could offer tools and resources for digital productivity, like virtual coworking rooms, project management, or brainstorming prompts.\n- Bots could set up group challenges and virtual meet-ups to encourage collaboration and build a strong community of remote workers.`);
    }
});

client.login(token);
