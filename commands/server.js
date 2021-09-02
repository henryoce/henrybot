const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'server',
  description: 'server info',
  execute (message, args) {
    if (message.channel.type !== 'dm') {
      // console.log(message.guild.ownerID)
      const embed = new MessageEmbed()
        .setTitle(`${message.guild.name} [${message.guild.memberCount}]`)
        .setImage(`${message.guild.iconURL({ format: 'png' })}`)
        .setColor(0xff000)
        .setDescription(`**region:** ${message.guild.region}\n**created:** ${message.guild.createdAt}\n**owner:** <@${message.guild.ownerID}>`)
      message.channel.send({ embeds: [embed] })
        .catch(console.error)
    } else {
      message.channel.send('This command can only be used in servers')
    }
  }
}
