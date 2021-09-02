const { MessageEmbed } = require('discord.js')
const fs = require('fs')
module.exports = {
  name: 'help',
  description: 'help',
  execute (message, args) {
    const commandList = fs.readFileSync('responses/commands.txt', 'utf8')
    // console.log(commandList)
    const embed = new MessageEmbed()
      .setTitle('commands')
      .setDescription(commandList)
      .setColor(0xff0000)
    message.channel.send({ embeds: [embed] })
  }
}
