module.exports = {
  name: 'whoasked',
  description: 'whoasked',
  execute (message, client) {
    message.channel.send(client.commands.get('random').execute('whoasked.txt'))
  }
}
