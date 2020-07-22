const race = require('../models/race');
const { findRace } = require('./listRace');

async function addNewRace(obj) {
    let newRace = new race(obj)
    let saved = await newRace.save()
    return saved;
}

async function getWinsAndLosses(id) {
    let findRacer = await race.find({ "racers.id": id }).exec();
    let wins = 0;
    let losses = 0;
    for (let i = 0; i < findRacer.length; i++) {
        let racerTemp = findRacer[i]._doc.racers;
        for (let r = 0; r < racerTemp.length; r++) {
            if (racerTemp[r]._doc.isWinner === true) {
                wins++;
            }
            else {
                losses++;
            }
        }
    }

    let windAndLosses = (wins / losses);
    return wins === 0 || losses === 0 ? 0 : windAndLosses;
}

module.exports = { addNewRace, getWinsAndLosses }