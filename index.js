/* eslint-disable no-unused-vars */
const fs = require('fs')
const { Collection, Client, Intents, VoiceChannel } = require('discord.js')
const { prefix, token } = require('./config.json')
const Keyv = require('keyv')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES] })
client.commands = new Collection()
const kv = new Keyv()
kv.on('error', err => console.error('Keyv connection error:', err))

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command)
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('messageCreate', async message => {
  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  if (message.author.bot) {
    return true
  }
  if (message.channel.type !== 'dm') {
    client.commands.get('tryInsult').execute(message, args, client, kv)
  }

  if (!message.content.startsWith(prefix)) {
    const mentionedUser = message.mentions.users.first()
    if (typeof mentionedUser !== typeof undefined && mentionedUser.id === '795219509073281074') {
      client.commands.get('chat').execute(message, kv, 1)
    }
  } else {
    switch (command) {
      case 'ping':
        client.commands.get('ping').execute(message, args)
        break
      case 'commands':
      case 'fuck':
      case 'help':
        client.commands.get('help').execute(message, args)
        break
      case 'server':
        client.commands.get('server').execute(message, args)
        break
      case 'info':
        client.commands.get('info').execute(message, args)
        break
      case 'anon':
        client.commands.get('anon').execute(message, args, client)
        break
      case 'wish':
        client.commands.get('wish').execute(message, args)
        break
      case 'findfunny':
        await message.reply(client.commands.get('random').execute('findfunny.txt'))
        break
      case 'whoasked':
        await message.reply(client.commands.get('random').execute('whoasked.txt'))
        break
      case '8ball':
        await message.reply(client.commands.get('random').execute('8ball.txt'))
        break
      case 'insult':
        await message.reply(client.commands.get('random').execute('insults.txt'))
        break
      case 'msg':
        client.commands.get('msg').execute(message, args)
        break
      case 'chat':
      case 'c':
        client.commands.get('chat').execute(message, kv, 1)
        break
      case 'chat2':
      case 'c2':
        client.commands.get('chat').execute(message, kv, 2)
        break
      case 'test':
        client.commands.get('test').execute(message, args)
        break
      case 'tts':
        client.commands.get('tts').execute(message)
        break
      case 'connect':
        client.commands.get('talk').execute(message, client, 'start')
        break
      case 'disconnect':
        client.commands.get('talk').execute(message, client, 'stop')
        break
      case 'say':
        client.commands.get('talk').execute(message, client, 'say')
        break
      case 'vc':
        client.commands.get('talk').execute(message, client, 'voiceReply', kv)
        break
      case 'reset':
        await kv.set('pastUserInputs1', undefined)
        await kv.set('generatedResponses1', undefined)
        break
      default:
        return true
    }
  }
})

client.login(token)
