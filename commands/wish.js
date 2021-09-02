const Keyv = require('keyv')
const keyvault = new Keyv()

module.exports = {
  name: 'wish',
  description: 'time wasting simulator',
  execute (message, args) {
    // const fiveStar = ['Xiao', 'Jean', 'Qiqi', 'Keqing', 'Mona', 'Diluc']
    const bannerFives = 'Hu Tao'
    const fivers = 'Jean,Qiqi,Keqing,Mona,Diluc'
    const fiveStar = (bannerFives + fivers).split(',')
    const bannerFours = 'Xingqiu,Xiangling,Chongyun'
    const fours = 'Sucrose,Diona,Fischl,Beidou,Razor,Noelle,Ningguang,Barbara,Bennet,Xinyan,Favonius Warbow,Sacrifical Bow,Rust,The Stringless,Favonius Codex,Sacrificial Fragments,Eye of Perception,The Widsith,Favonius Greatsword,Sacrifical Greatsword,Rainslasher,The Bell,Favonius Lance,Dragon\'s Bane,Favonius Sword,Sacrificial Sword,Lion\'s Roar,The Flute'
    const fourStar = (bannerFours + fours).split(',')

    // const fourStar = ['Diona', 'Beidou', 'Xinyan', 'Sucrose', 'Chongyun', 'Fischl', 'Razor', 'Noelle', 'Ningguang', 'Xingqiu', 'Barbara', 'Xiangling', 'Bennett', 'Rust', 'Sacrificial Bow', 'The Stringless', 'Favonius Warbow', 'Eye of Perception', 'Sacrificial Fragments', 'The Widsith', 'Favonius Codex', 'Rainslasher', 'Sacrificial Greatsword', 'The Bell', 'Favonius Greatsword', 'Favonius Lance', 'Dragon\'s Bane', 'Lion\'s Roar', 'Sacrificial Sword', 'The Flute', 'Favonius Sword']
    const output = []
    let fourCertain
    let fiveCertain
    let x = 0
    let rollNum
    let fourBanner
    let fiveBanner
    if (isNaN(args)) {
      x = 1
    } else x = args
    if (x < 1) {
      x = 1
    }

    function roller (x, fourCertain, fiveCertain, fourBanner, fiveBanner) {
      if (x === 0) {
        // console.log('LETS GO')
        const foutput = output.join(' ')
        message.channel.send(`${foutput}`)
          .catch(console.error)
      }
      rollNum = (Math.round(Math.random() * 1000) / 10)
      // console.log('x,fourcertina,fivecertain' + x + fourCertain + fiveCertain)
      if (rollNum <= 0.6 || fiveCertain) { // 5* character
        rollNum = (Math.floor(Math.random() * 2))
        // console.log(rollNum)
        if (rollNum === 1) {
          fiveBanner = true
        }
        if (fiveBanner === true) {
          output.push(`**${bannerFives}**`)
          console.log('yep')
          return ('fiveBannerReset')
        } else {
          rollNum = (Math.floor(Math.random() * 5))
          output.push(`**${fivers.split(',')[rollNum]}**`)
          return ('fiveReset')
        }
      } else if (rollNum <= 5.1 || fourCertain) { // 4* character or weapon
        rollNum = (Math.floor(Math.random() * 30))
        output.push(`${fourStar[rollNum]}`)
        return ('fourReset')
      } else { // 3* weapon
        output.push('-')
        return ('trash')
      }
    }
    async function pity (x) {
      while (x > 0) {
        let fourPity = await keyvault.get(`fourPity${message.author.id}`)
        let newFourPity
        let fivePity = await keyvault.get(`fivePity${message.author.id}`)
        let newFivePity
        // console.log('primobalance' + primobalance)
        if (typeof fourPity === 'undefined') {
          // eslint-disable-next-line no-unused-vars
          fourPity = 0
          await keyvault.set(`fourPity${message.author.id}`, '0')
        }
        if (typeof fivePity === 'undefined') {
          // eslint-disable-next-line no-unused-vars
          fivePity = 0
          await keyvault.set(`fivePity${message.author.id}`, '0')
        }
        if (typeof fiveBanner === 'undefined') {
          // eslint-disable-next-line no-unused-vars
          fiveBanner = false
          await keyvault.set(`fiveBanner${message.author.id}`, 'false')
        }
        if (typeof fourBanner === 'undefined') {
          // eslint-disable-next-line no-unused-vars
          fourBanner = false
          await keyvault.set(`fourBanner${message.author.id}`, 'false')
        }
        // console.log('pitybefore' + pity)
        if (fivePity > 98) {
          // console.log('five pity' + fivePity)
          newFivePity = 0
          fivePity = 0
          fiveCertain = true
          const rollerOutput = roller(x, null, fiveCertain, null, null)
          if (rollerOutput === 'fiveReset') {
            newFivePity = 0
            fiveBanner = true
            await keyvault.set(`fiveBanner${message.author.id}`, `${fiveBanner}`)
            console.log('fivebanner true=' + `${fiveBanner}`)
          }
        }
        if (fourPity > 8) {
          newFourPity = 0
          fourPity = 0
          fourCertain = true
          newFivePity = +fivePity + +1
          // console.log('pity > 8,' + newPity)
          roller(x, fourCertain)
        } else if (fourPity <= 8 || fivePity <= 98) {
          newFourPity = +fourPity + +1
          newFivePity = +fivePity + +1
          // console.log('newpity' + newFourPity + ' ' + newFivePity)
          const rollerOutput = roller(x, null, null, null, fiveBanner)
          // console.log(fiveBanner)
          if (rollerOutput === 'fourReset') { newFourPity = 0 }
          if (rollerOutput === 'fiveBannerReset') {
            newFivePity = 0
            fiveBanner = false
            await keyvault.set(`fiveBanner${message.author.id}`, `${fiveBanner}`)
            // console.log('fivebanner' + `${fiveBanner}`)
          }
          if (rollerOutput === 'fiveReset') {
            newFivePity = 0
            fiveBanner = true
            await keyvault.set(`fiveBanner${message.author.id}`, `${fiveBanner}`)
            // console.log('fivebanner true=' + `${fiveBanner}`)
          }
          // console.log(roller(x))
          // console.log(await keyvault.get(`primo${message.author.id}`))
        }
        // console.log(confirmed)
        await keyvault.set(`fourPity${message.author.id}`, `${newFourPity}`)
        await keyvault.set(`fivePity${message.author.id}`, `${newFivePity}`)
        // varchange(confirmed)
        x--
      }
      x = 0
      roller(x)
    }

    async function pityInitiator (x) {
      await pity(x)
    }
    if (message.channel.type === 'dm') {
      message.channel.send('EXIT CODE 2: This command can only be used in servers')
    } else if (message.author.id === '691743958526722118') {
      message.channel.send('no')
    } else if (x > 100) {
      message.channel.send('EXIT CODE 3: Wish count must be 1-100')
    } else if (message.channel.type !== 'dm') {
      pityInitiator(x)
    }
  }
}
