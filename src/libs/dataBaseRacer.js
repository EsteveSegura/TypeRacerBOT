const racer = require('../models/racer') //require('.. /models/racer');
const socreUtils = require('../utils/score');

async function addNewRacer(id) {
    let newRacer = new racer({ id: id, allScores: [] })
    let saved = await newRacer.save()
    return saved;
}

async function updateScore(id, lengthPhrase, ms, ratio, windAndLosses) {
    let conmutedScore = socreUtils.calcScore(lengthPhrase, ms)
    let globalScoreCalc = (windAndLosses / ratio)
    let updatingScore = await racer.updateOne({ id: id }, { ratio: isNaN(ratio) ? 1 : ratio, score: isNaN(windAndLosses) ? 1 : windAndLosses, globalScore : isNaN(globalScoreCalc) ? 1 : globalScoreCalc ,  $push: { allScores: conmutedScore } })
    //let updatingScore = await racer.updateOne({ id: id }, { ratio: ratio.toFixed(2), score: windAndLosses.toFixed(2), globalScore: (windAndLosses / ratio).toFixed(2)  $push: { allScores: conmutedScore } })
    /*
    'ratio': {type: Number, default: 0},
    'score': {type: Number, default: 0},
    'globalSocre' : {type: Number, default: 0}
    */

    console.log(updatingScore.ok)
}

async function getAllScores(id) {
    let racer_ = await racer.findOne({ id: id }).exec();
    // if(racer_.allScores.length === 0) {
    if(racer_._doc.allScores.length === 0){

        return 1
    }else{
        let allScoresComuted = racer_._doc.allScores.reduce((prev, current) => current += prev)
        let avg = allScoresComuted / racer_._doc.allScores.length;
        return isNaN(avg) ? 1 : avg
    }
}

async function getScoreBoard(id) {
    let allRacers = await racer.find({})

}

async function getRacer(id) {
    let findRacer = await racer.find({ id: id });
    return !findRacer ? null : findRacer;
}

module.exports = { addNewRacer, updateScore, getRacer, getAllScores }