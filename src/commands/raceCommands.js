const asyncUtils = require('../utils/async');
const stringsUtils = require('../utils/strings')
const dataBaseWord = require('../libs/dataBaseWord')
const dataBaseRacer = require('../libs/dataBaseRacer')
const MessageEmbed = require('discord.js').MessageEmbed;
const semafro = ['🟢', '🟡', '🔴']

async function typeRaceCommand(newRace, msg, foundLang) {
    if (!newRace.gameStatus && newRace) {
        let msgRacer = await msg.channel.send(`Preparados! Sustituye las "_" por espacios " "`)
        await newRace.initGame(foundLang.length > 0 ? foundLang[0] : "ENG")

        await asyncUtils.sleep(5)

        for (let i = 3; i >= 1; i--) {
            msgRacer.edit(` ${semafro[i - 1]} ${semafro[i - 1]} ${semafro[i - 1]}   ${i}   ${semafro[i - 1]} ${semafro[i - 1]} ${semafro[i - 1]}`)
            await asyncUtils.sleep(1)
        }

        msgRacer.edit(newRace.getQuote().ofuscated)
        newRace.setStartDate()
        await newRace.showLadder(msg)
    }
}

function userAnswer(newRace, msg) {
    let timeOnRespond = Math.abs(Date.now() - newRace.startDate)
    let getDistance = stringsUtils.editDistance(newRace.getQuote().raw, msg.content)


    //ToDo: Join in one function
    if (newRace.getQuote().raw == msg.content) {
        msg.react('👍')
        newRace.addWinner({ 'userId': msg.author.id, timeToWin: timeOnRespond.toString() })
    }

    //ToDo: MOVE this to config file.
    if (getDistance <= 5 && getDistance != 0) {
        msg.react('👎')
        newRace.addLoser({ 'userId': msg.author.id, timeToWin: timeOnRespond.toString() })
    }
}

async function addWord(msg, foundLang) {
    //jl. modificado para que solo admin
    if (msg.member.hasPermission("ADMINISTRATOR")) {
        if (foundLang.length > 0) {
            let wordToAdd = msg.content.toLowerCase().replace(`!addword ${foundLang[0].toLowerCase()} `, "")
            let addToDb = await dataBaseWord.addNewWord({ 'lang': foundLang[0], 'word': wordToAdd })
            msg.reply("Añadido a la base de datos!")
        } else {
            msg.react('😵')
            msg.reply(`Sintaxis incorrecta. Ej: **!addWord <language> <text>**`)
        }
    } else {
        msg.reply(`Por el momento solo los administradores pueden añadir frases.`)
    }
}

async function showLadderBoard(msg,client) {
    let firstElements = await dataBaseRacer.getGlobalScoreBoard();
    let dataToShow = []
    
    for (let i = 0; i < 10; i++) {
        let userNickName = client.guilds.cache.get(msg.guild.id).members.cache.get(firstElements[i].id).user.username
        dataToShow.push({ name:`${i+1} - ${userNickName}`, value: firstElements[i].globalScore.toFixed(2), inline: true  })
    }

    const embedScore = new MessageEmbed()
        .setTitle("GLOBAL LADDER BOARD")
        .setColor(0xff3e00)
        .addFields(dataToShow)
        .setTimestamp()
        .setFooter('Made with <3 GiR');
    msg.channel.send(embedScore)
}

module.exports = { typeRaceCommand, userAnswer, addWord,showLadderBoard }