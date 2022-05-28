require('./config/token_config.js')
const discord = require('discord.js')
const { Permissions, MessageEmbed } = require('discord.js')
const token = PUBLIC_TOKEN
const client = new discord.Client({intents: [ discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]})
client.on('ready', () => {console.log(`Logged in as ${client.user.tag}!`)})
const prefix = '!'
const AdminCmdLogsChannel = '979900930529046599'
const AdminChatLogsChannel = '979917081954902026'

/*
The permissions assigned to these actions are called 'elevated permissions' and are: KICK_MEMBERS, BAN_MEMBERS, ADMINISTRATOR, 
MANAGE_CHANNELS, MANAGE_GUILD, MANAGE_MESSAGES, MANAGE_ROLES, MANAGE_WEBHOOKS, MANAGE_THREADS, and MANAGE_EMOJIS_AND_STICKERS.
*/
client.on('messageCreate', msg => {
    // Roles
    const AdministratorRole = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) 
    let getChannelID = msg.channel.name;

    // If !nuke by Admin in non-Admin/Logs channel
    if ((msg.content === '!nuke') && AdministratorRole && !(msg.channelId == AdminCmdLogsChannel || msg.channelId == AdminChatLogsChannel)) {
        async function wipe() {
            var msg_size = 1;
            while (msg_size > 0) {
                await msg.channel.bulkDelete(100)
            .then(messages => msg_size = messages.size)
            .catch(console.error);
            }
        }
        wipe()
        logMessage = 'Channel ID: `' + getChannelID + '` chat history deleted by ' + msg.member.displayName + ' (command: !nuke) at `' + new Date(msg.createdTimestamp).toLocaleString() + '`'
        client.channels.cache.get(AdminCmdLogsChannel).send(logMessage) // log action to admin/logs channel
    }
    // If !nuke and NOT Admin
    if ((msg.content === '!nuke') && !AdministratorRole) {
        logMessage = msg.member.displayName + ' attempted to delete chat history for `' + getChannelID + ' (command: !nuke)` at `' + new Date(msg.createdTimestamp).toLocaleString() + '`. Check member role permissions if this member is intended to be able to perform this action.'
        client.channels.cache.get(AdminCmdLogsChannel).send(logMessage) // log action to admin/logs channel
    }
    // If !nuke and Admin and Admin/Logs Channel
    if ((msg.content === '!nuke') && AdministratorRole && (msg.channelId == AdminCmdLogsChannel || msg.channelId == AdminChatLogsChannel)) {
        const embeddedMsgParams = new MessageEmbed()
        .setColor('#72ed95')
        .setImage('https://i.imgur.com/eXaznjw.jpg')
        client.channels.cache.get(AdminCmdLogsChannel).send({ embeds: [embeddedMsgParams] })
    }
    // If !nukeAdmin and Admin and Admin/Logs Channel
    if ((msg.content === '!nukeAdmin') && AdministratorRole && (msg.channelId == AdminCmdLogsChannel || msg.channelId == AdminChatLogsChannel)) {
        async function wipeAdmin() {
            var msg_size = 1;
            while (msg_size > 0) {
                await msg.channel.bulkDelete(100)
            .then(messages => msg_size = messages.size)
            .catch(console.error)
            }
        }
        wipeAdmin()
        logMessage = 'Channel ID: `' + getChannelID + '` chat history deleted by ' + msg.member.displayName + ' (command: !nuke) at `' + new Date(msg.createdTimestamp).toLocaleString() + '`'
        client.channels.cache.get(AdminCmdLogsChannel).send(logMessage) // log action to admin/logs channel
    }

    // Log non-admin messages
    if(msg.channelId != AdminCmdLogsChannel && msg.channelId != AdminChatLogsChannel) {
        client.channels.cache.get('979917081954902026').send('```(' + new Date(msg.createdTimestamp).toLocaleString() + ') ' + msg.channel.name + ' - ' + msg.member.displayName + ': ' + msg.content + '```')
    }
    
});

client.login(token)