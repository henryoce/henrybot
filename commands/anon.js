module.exports = {
  name: 'anon',
  description: 'anonymous posting',
  execute (message, args, client) {
    // check if no args were provided
    if (!args.length) {
      return message.channel.send('No arguments provided - usage is .anon <sometexthere>')
    }
    // join args into one string
    const argsstring = args.join(' ')
    // fetch anon channel and send message
    client.channels.fetch('878201735494123530').then(channel => {
      message.channel.send(`Submitted following message:\`\`\nSomebody: ${argsstring}\`\``)
      channel.send(`\`\`Somebody: ${argsstring}\`\``)
    })
  }
}
