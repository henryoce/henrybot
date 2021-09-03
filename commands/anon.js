module.exports = {
  name: 'anon',
  description: 'anonymous posting',
  execute (message, args, client) {
    if (!args.length) {
      return message.channel.send('No arguments provided - usage is .anon <sometexthere>')
    }
    const argsstring = args.join(' ')
    client.channels.fetch('878201735494123530').then(channel => {
      message.channel.send(`Submitted following message:\`\`\nSomebody: ${argsstring}\`\``)
      channel.send(`\`\`Somebody: ${argsstring}\`\``)
    })
  }
}
