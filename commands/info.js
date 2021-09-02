const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'info',
  description: 'user info',
  execute (message, args) {
    const mentionedUser = message.mentions.users.first()
    let taggedMember = 'blank'
    // const roles = message.member.roles.cache.map(role => role.name)
    if (!args.length && !mentionedUser) { // info of self - if no args and no mentioned user
      if (message.channel.type !== 'dm') {
        taggedMember = message.member
      } else if (message.channel.type === 'dm') {
        taggedMember = message.author
      }
      // console.log(taggedMember)
      info(taggedMember)
    } else if (mentionedUser && message.channel.type !== 'dm') { // info of mentioned user, and not in dm
      const taggedMember = message.mentions.members.first()
      info(taggedMember)
    } else if (args.length && !mentionedUser) { // if invalid user is provided
      message.channel.send('EXIT CODE 1: Invalid user')
    }
    function info (taggedMember) { // function to get info
      if (message.channel.type !== 'dm') {
        const taggedUser = taggedMember.user
        // console.log(taggedUser)
        const perms = taggedMember.permissions
        // console.log(perms);
        const allperms = ['ADMINISTRATOR', 'BAN_MEMBERS', 'KICK_MEMBERS', 'VIEW_AUDIT_LOG', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
        const permlist = []
        if (perms.has('ADMINISTRATOR')) {
          permlist.push('ADMINISTRATOR')
        } else {
          allperms.forEach(function (item, index, array) {
            if (perms.has(item) === true) {
              // console.log(item,index);
              permlist.push(item)
            } else return false// console.log(perms.has(item));
          })
        }
        // console.log(permlist);
        const finallist = permlist.toString().replace(/_/g, ' ').replace(/,/g, ', ').toLowerCase()
        const embed = new MessageEmbed()
          .setTitle(`${taggedUser.tag}`)
          .setColor(0xff0000)
          .setDescription(`<@${taggedUser.id}>\nid: ${taggedUser.id}\ncreated: ${taggedUser.createdAt}\nperms: ${finallist}`)
          .setImage(`${taggedUser.displayAvatarURL({ format: 'png' })}`)
        message.channel.send({ embeds: [embed] }).catch(console.error)
      } else if (message.channel.type === 'dm') {
        const taggedUser = taggedMember
        const embed = new MessageEmbed()
          .setTitle(`${taggedUser.tag}`)
          .setColor(0xff0000)
          .setDescription(`<@${taggedUser.id}>\nid: ${taggedUser.id}\ncreated: ${taggedUser.createdAt}`)
          .setImage(`${taggedUser.displayAvatarURL({ format: 'png' })}`)
        message.channel.send({ embeds: [embed] }).catch(console.error)
      }
    }
  }
}
