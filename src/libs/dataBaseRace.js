const race = require('../models/race');
const { findRace } = require('./listRace');

async function addNewRace(obj) {
    let newRace = new race(obj)
    let saved = await newRace.save()
    return saved;
}

async function getWinsAndLosses(id) {
    let findRacer = await race.find({ "racers.id": id }).exec();
    console.log(findRacer)
    let wins = 0;
    let losses = 0;
    for (let i = 0; i < findRacer.length; i++) {
        let racerTemp = findRacer[i]._doc.racers;
        console.log(racerTemp)
        for (let r = 0; r < racerTemp.length; r++) {
            if (racerTemp[r]._doc.isWinner === true) {
                wins++;
            }
            else {
                losses++;
            }
        }
    }

    console.log(wins)
    console.log(losses)
    let windAndLosses = (wins / losses);
    return wins === 0 || losses === 0 ? 0 : windAndLosses;
}

module.exports = { addNewRace, getWinsAndLosses }