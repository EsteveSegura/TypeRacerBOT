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
    let wins = 1;
    let losses = 1;
    for (let i = 0; i < findRacer.length; i++)
    {
        let racerTemp = findRacer[i]._doc.racers;
        for (let r = 0; r < racerTemp.length; r++)
        {
            if (racerTemp[r]._doc.isWinner === true)
            {
                wins++;
            }
            else
            {
                losses++;
            }


        }


    }


    // findRacer.forEach((race) => {
    //     if (race.racers.length != 0) {
    //         console.log("ADD")
    //         race.racers.forEach((el) => { el.isWinner ? wins++ : losses++ });
    //     }
    // })
    console.log(wins)
    console.log(losses)
    let windAndLosses = (wins / losses);
    return windAndLosses;
}

module.exports = { addNewRace, getWinsAndLosses }