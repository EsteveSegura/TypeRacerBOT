const dataBaseWord = require('../libs/dataBaseWord');
const dataBaseRace = require('../libs/dataBaseRace');
const dataBaseRacer = require('../libs/dataBaseRacer');

class TypeRacer {
    constructor(idChannel) {
        this.idChannel = idChannel;
        this.winners = [];
        this.losers = [];
        this.gameStatus = false;
        this.startDate;
        this.quote = [];
        this.randIndex = 0;
        this.isShuffleCapital = false;
        this.shuffleCapital = "";
        this.finished = false;
        this.dataStructuredToDb = [];
    }

    getGameStatus() {
        return this.gameStatus;
    }

    setStartDate() {
        this.startDate = Date.now();
    }

    setFinished() {
        this.finished = true;
    }

    addWinner(user) {
        this.winners.push(user)
    }
    addLoser(user) {
        this.losers.push(user)
    }

    async initGame(lang) {
        this.gameStatus = true;
        this.quote = await dataBaseWord.getAllWords({ lang: lang })
        this.randIndex = Math.round(Math.random() * (this.quote.length - 1))
        if (this.isShuffleCapital) this.shuffleCapitalLetters(this.quote[this.randIndex]);
    }


    shuffleCapitalLetters(str) {
        let strToArray = str.split('');
        let frase = "";
        for (let i = 0; i < strToArray.length; i++) {
            let rand = Math.random();
            if (rand < 0.5) {
                frase = frase + strToArray[i].toUpperCase();
            } else {
                frase = frase + strToArray[i].toLowerCase();
            }
        }
        this.shuffleCapital = frase;
    }

    ifSomeUserAlreadyAnswered(userDiscord) {
        let isUserRepeated = false;
        this.winners.forEach((user) => {
            if (userDiscord == user.userId) {
                isUserRepeated = true;
            }
        });

        this.losers.forEach((user) => {
            if (userDiscord == user.userId) {
                isUserRepeated = true;
            }
        });
        return isUserRepeated;
    }

    getQuote() {
        let strRaw = this.quote[this.randIndex];
        let splitToOfuscated = strRaw.split(" ").join("_");
        //FUN MODE START
        if (this.isShuffleCapital) {
            strRaw = this.shuffleCapital;
            splitToOfuscated = this.shuffleCapital.split(" ").join("_");
        }
        //FUN MODE END
        return {
            ofuscated: splitToOfuscated,
            raw: strRaw
        }
    }

    saveToDataBase(objRace) {
        dataBaseRace.addNewRace({
            phrase: this.quote[this.randIndex],
            racers: objRace
        });
    }

    showLadder(msg) {
        setTimeout(() => {
            let frase = "";
            this.gameStatus = false;
            let participantsRace = this.winners.length + this.losers.length

            this.winners.forEach(async(winner, i) => {
                frase = `${frase}${i == 0 ? "**--Ganadores--**\n" : ""}${i + 1}- <@${winner.userId}> con el tiempo de: **${winner.timeToWin}ms**\n`;
                if (participantsRace > 0) { //cambiado por 1
                    let actualUserScoreDb = await dataBaseRacer.getAllScores(msg.author.id)
                    let ratioDb = await dataBaseRace.getWinsAndLosses(msg.author.id)
                    dataBaseRacer.updateScore(winner.userId, this.quote[this.randIndex].split('').length, winner.timeToWin,ratioDb, actualUserScoreDb)
                }
                this.dataStructuredToDb.push({ id: winner.userId, position: parseInt(i + 1), ms: parseInt(winner.timeToWin), isWinner: true })
            });

            this.losers.forEach((loser, i) => {
                frase = `${frase}${i == 0 ? "**--Perdedores--**\n" : ""}${i + 1}- <@${loser.userId}> con el tiempo de: **${loser.timeToWin}ms**\n`;
                this.dataStructuredToDb.push({ id: loser.userId, position: parseInt(i + 1), ms: parseInt(loser.timeToWin), isWinner: false })
            });

            msg.channel.send(frase == "" ? "💔 💔 💔 Nadie lo consiguio 💔 💔 💔" : frase);
            if (participantsRace < 0) { //modificado estaba en 1
                msg.channel.send(`Recuerda que solo puntua si compiten 2 o mas personas`)
            }

            this.saveToDataBase(this.dataStructuredToDb);
            this.winners = [];
            this.losers = [];
            this.setFinished();
        }, 15000);
    }
}

module.exports = TypeRacer;