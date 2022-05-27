/*
SET UP INSTRUCTIONS:
1. Create /config/token_config.js
2. Add "PUBLIC_TOKEN = 'ENTER YOUR PUBLIC KEY HERE' to /token_config.js" file
3. Install modules in package.json
4. Run "nodemon --inspect index.js"
*/
require('./config/token_config.js') // access app public token
const discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const token = PUBLIC_TOKEN
const client = new discord.Client({
    intents: [ discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES ]
})
const { TOKEN } = require('./config/token_config')
let cron = require('node-cron')
const CHANNEL_ID = '978779616942624778'
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})
const affirmations = [
    "The advice I'd give to somebody that's silently struggling is: You don't have to live that way. You don't have to struggle in silence. You can be un-silent. You can live well with a mental health condition, as long as you open up to somebody about it, because it's really important you share your experience with people so that you can get the help that you need. — Demi Lovato",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human. — Lori Deschene",
    "There is a crack in everything, that's how the light gets in ― Leonard Cohen",
    "I understand your pain. Trust me, I do. I've seen people go from the darkest moments in their lives to living a happy, fulfilling life. You can do it too. I believe in you. You are not a burden. You will never be a burden. — Sophie Turner",
    "Mental health problems don't define who you are. They are something you experience. You walk in the rain and you feel the rain, but you are not the rain. — Matt Haig",
    "If you are broken, you do not have to stay broken. — Selena Gomez",
    "Not until we are lost do we begin to understand ourselves ― Henry David Thoreau",
    "There is hope, even when your brain tells you there isn't. — John Green",
    "Promise me you'll always remember: you're braver than you believe, and stronger than you seem, and smarter than you think. — Christopher Robin from Winnie the Pooh",
    "If you're going through hell, keep going. — Winston Churchill",
    "Change what you can, manage what you can't. — Raymond McCauley"
]
cron.schedule('00 32 16 * * 0-6', function() { // second, minute, hour, day of month, month, day of week (0-6 = Sun-Sat) // 12:00:00 PM
    const channel = client.channels.cache.get(CHANNEL_ID) // discord channel id

    let affirmation = affirmations[Math.floor(Math.random()*affirmations.length)]
    const embeddedMsgParams = new MessageEmbed()
    .setColor('#72ed95')
    .setAuthor({ name: 'Mental Health Bot', iconURL: 'https://i.imgur.com/Qk1n1t0.png'})
    .addFields(
        { name: ':black_heart: :green_heart: Daily Affirmation Quote :green_heart: :black_heart: ', value: `_"${affirmation}"_` },
        { name: '\u200B', value: '\u200B' },
        { name: 'Resources', value: 'Type `!resources` for helpful crisis information', inline: false }
    )
    .setTimestamp()
    .setFooter({ text: 'YOU ARE LOVED', iconURL: 'https://i.imgur.com/Qk1n1t0.png' })
    //.setTitle('EMBED TITLE HERE')
    //.setURL('URL FOR TITLE')
    //.setDescription('DESCRIPTION UNDER TITLE')
    //.setThumbnail('SMALL THUMBNAIL BESIDE AUTHOR')
    //.setImage('SET LARGE IMAGE')
    channel.send({ embeds: [embeddedMsgParams] })
}, {
    scheduled: true,
    timezone: "America/New_York"
})

// !resource message response
client.on('messageCreate', msg => {
    if (msg.content === '!resources') {        
        const embeddedResourcesMsg = new MessageEmbed()
        .setColor('#ffa232')
        .addFields(
            { name: 'Resources', value: "Helpful resources if you or someone you know needs assistance" },
            { name: '\u200B', value: '\u200B' }, // vertical space gap
            { name: 'National Institute of Mental Health (US)', value: 'https://www.nimh.nih.gov/health/find-help' },
            { name: 'National Suicide Prevention Support Line (CA)', value: 'Call 1-833-456-4556, or in Quebec call 1-866-277-3553.' },
            { name: 'Youth Crisis Text Line (CA)', value: 'Text 686868 24/7 for help and support.' },
            { name: 'Shout Crisis Text Line (UK)', value: 'Text Shout to 85258.' },
            { name: 'Mental Health UK (UK)', value: 'https://mentalhealth-uk.org/help-and-information/get-urgent-help/' },
            { name: 'Lifeline Australia (AU)', value: 'Call 13 11 14 anytime.' },
            { name: 'Suicide Callback Service (AU)', value: 'Available 24/7 to help: 1300 659 467.' },
            { name: 'Lifeline Aotearoa (NZ)', value: 'Call 0800 543 354 or text HELP to 4357.' },
            { name: 'Suicide Crisis Hotline (NZ)', value: 'Call this suicide hotline any time at 0508 828 865.' },
            { name: '\u200B', value: '\u200B' }, // vertical space gap
            { name: 'Find a helpline (Multi-Country)', value: 'https://findahelpline.com/i/iasp' }
        )
        channel.send({ embeds: [embeddedResourcesMsg] })
    }
})
client.login(token)