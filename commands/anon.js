module.exports = {
  name: 'anon',
  description: 'anonymous posting',
  execute (message, args, client) {
    if (!args.length) {
      return message.channel.send('No arguments provided - usage is .anon <sometexthere>')
    }
    // const d = new Date()
    // const hour = d.getHours(`${message.createdAt}`)
    // const minutes = d.getMinutes(`${message.createdAt}`)
    const argsstring = args.join(' ')
    // console.log(argsstring)
    console.log(`${message.author.tag}:${argsstring}`)
    // console.log(client.guilds.fetch('674382447906914304').channels.cache.get('674382449903665195'))
    client.channels.fetch('878201735494123530').then(channel => {
      message.channel.send(`Submitted following message:\`\`\nSomebody: ${argsstring}\`\``)
      channel.send(`\`\`Somebody: ${argsstring}\`\``)
    })
  }
}
