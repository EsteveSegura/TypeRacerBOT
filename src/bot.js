require('dotenv').config();
const Discord = require('discord.js');
const MessageEmbed = require('discord.js').MessageEmbed;
const client = new Discord.Client();
const mongoose = require('mongoose');
const typeRacer = require('./libs/typeracer');
const helper = require('./libs/helpers');
const raceCommands = require('./commands/raceCommands');
const listRace = require('./libs/listRace');
const dataBaseRacer = require('./libs/dataBaseRacer')
const dataBaseRace = require('./libs/dataBaseRace');
const { configDic } = require('./secure/config');
    //"212729336036458496"

//ToDo:
// 1- Calc the loss points

// mongoose.connect('mongodb://localhost/typerace', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//     console.log("DataBase: OK")
// })

mongoose.connect(configDic.DATABASE_SERVICE + configDic.USUARIO + ":" + configDic.PASSWORD + configDic.DATABASE_URI + configDic.DATABASENAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
    console.log("DataBase: OK")
})


client.on('ready', function() {
    console.log("TypeRacer: OK ");
});

client.on('guildMemberAdd', async(member) => {
    dataBaseRacer.addNewRacer(member.user.id)
})

client.on('guildCreate', async(guild) => {
    guild.members.cache.forEach(async(member) => {
        dataBaseRacer.addNewRacer(member.user.id)
    });
})

client.on('message', async(msg) => {
    let findActiveRace = listRace.findRace(listRace.races, msg.channel.id);
    let msgSplit = msg.content.split(" ");

    let foundLang = helper.languages.filter((lang) => {
        if (lang == msgSplit[1]) { return lang }
    })

    //commands

    if (msg.content === 'how to embed') {
        const embed = new MessageEmbed().setTitle('A slick little embed').setColor(0xff0000).setDescription('Hello, this is a slick embed!');
        msg.channel.send(embed);
    }


    if (msg.content.toLowerCase() == "!comando") {
        let actualUserScore = await dataBaseRacer.getAllScores(msg.author.id)
        let ratio = await dataBaseRace.getWinsAndLosses(msg.author.id)
        console.log(await dataBaseRacer.getAllScores(msg.author.id))
        const embedScore = new MessageEmbed()
            .setTitle(`Scores from : ${msg.author.username}`)
            .setColor(0xff3e00)
            .addFields({ name: 'Ratio', value: `*${await dataBaseRace.getWinsAndLosses(msg.author.id)}*`, inline: true }, { name: 'Score', value: `*${await dataBaseRacer.getAllScores(msg.author.id)}*`, inline: true }, { name: 'GlobaScore', value: `__**${(actualUserScore / ratio)}**__` })
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
        msg.channel.send(embedScore)
    }

    if (msg.content.toLowerCase() == "!ratio") {
        let ratio = await dataBaseRace.getWinsAndLosses(msg.author.id)
        msg.reply(ratio)
    }

    if (msg.content.toLocaleLowerCase() == "!score") {
        let actualUserScore = await dataBaseRacer.getAllScores(msg.author.id)
        msg.channel.send(actualUserScore)
    }

    if (msg.content.toLowerCase().startsWith("!typerace")) {
        listRace.races = listRace.removeFinishedRaces(listRace.races)
        if (findActiveRace == null || findActiveRace.finished) {
            listRace.races.push(new typeRacer(msg.channel.id))
            let findActiveRace_ = listRace.findRace(listRace.races, msg.channel.id)
            await raceCommands.typeRaceCommand(findActiveRace_, msg, foundLang)
        }
    }

    if (msg.content.toLowerCase().startsWith("!addword")) {
        await raceCommands.addWord(msg, foundLang)
    }

    //Get all answers
    if (findActiveRace) {
        if (findActiveRace.gameStatus && !findActiveRace.ifSomeUserAlreadyAnswered(msg.author.id)) {
            raceCommands.userAnswer(findActiveRace, msg)
        }

    }
});


client.login(process.env.DISCORD_TOKEN);