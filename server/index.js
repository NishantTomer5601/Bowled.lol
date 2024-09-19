const express = require('express');
const fs = require('fs');
const Papa = require('papaparse');
const cors = require('cors');
const app =  express();

const PORT = 8000;

app.use(cors());

let playersData = [];
fs.readFile('people.csv', 'utf8', (err, data) => {
    if(err){
        console.log('Error Reading CSV file', err);
        return;
    }

    Papa.parse(data, {
        header : true,
        complete: (results) => {
            playersData = results.data;
        },
    });
});

app.get('/api/players', express.json(), (req,res) =>{
    res.json(playersData);
})

app.post('/api/guess', express.json(), (req,res) => {
    const {guessedPlayerName, targetPlayerName } = req.body;

    const guessedPlayer = playersData.find(
        (player) => player.name && player.name.toLowerCase() === guessedPlayerName.toLowerCase()
    );

    const targetPlayer = playersData.find(
        (player) => player.name && player.name.toLowerCase() === targetPlayerName.toLowerCase()
    );

    if(!guessedPlayer || !targetPlayer){
        return res.status(400).json({ message: 'Player not found '});
    }

    const result = {
        name: guessedPlayer.name,
        nation: guessedPlayer.nation === targetPlayer.nation,
        role: guessedPlayer.role === targetPlayer.role,
        retired: guessedPlayer.retired === targetPlayer.retired,
        born: guessedPlayer.born === targetPlayer.born,
        battingHand: guessedPlayer.battingHand === targetPlayer.battingHand,
        totalMatches: guessedPlayer.totalMatches === targetPlayer.totalMatches,
        currentIPLTeam: guessedPlayer.currentIPLTeam === targetPlayer.currentIPLTeam,
    };
    res.json(result);
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});