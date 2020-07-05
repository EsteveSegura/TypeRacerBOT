require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
const stringsUtils = require('./utils/strings');
const asyncUtils = require('./utils/async');
const typeRacer = require('./libs/typeracer');

mongoose.connect('mongodb://localhost/typerace', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DataBase: OK")
})

client.on('ready', function () {
  console.log("TypeRacer: OK ");
});

const semafro = ['🟢', '🟡', '🔴']
let newRace = new typeRacer()

client.on('message', async (msg) => {
  if (msg.content.toLocaleLowerCase() == "!typerace") {
    if (!newRace.gameStatus) {
      channelOnRace = msg.channel.id
      let msgRacer = await msg.channel.send(`Preparados! Sustituye las "_" por espacios " "`)
      newRace.initGame()
      await asyncUtils.sleep(5)
      for (let i = 3; i >= 1; i--) {
        msgRacer.edit(` ${semafro[i - 1]} ${semafro[i - 1]} ${semafro[i - 1]}   ${i}   ${semafro[i - 1]} ${semafro[i - 1]} ${semafro[i - 1]}`)
        await asyncUtils.sleep(1)
      }

      msgRacer.edit(newRace.getQuote().ofuscated)
      newRace.setStartDate()
      newRace.showLadder(msg)
      console.log(newRace.getQuote().raw)
    }
  }


  if (newRace.gameStatus && !newRace.ifSomeUserAlreadyAnswered(msg.author.id)) {
    let timeOnRespond = Math.abs(Date.now() - newRace.startDate)
    let getDistance = stringsUtils.editDistance(newRace.getQuote().raw, msg.content)

    if (newRace.getQuote().raw == msg.content) {
      msg.react('👍')
      newRace.addWinner({ 'userId': msg.author.id, timeToWin: timeOnRespond.toString() })
    }

    if (getDistance <= 3 && getDistance != 0) {
      msg.react('👎')
      newRace.addLoser({ 'userId': msg.author.id, timeToWin: timeOnRespond.toString() })
    }
  }
});


client.login(process.env.DISCORD_TOKEN);


