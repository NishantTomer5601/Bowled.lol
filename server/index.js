const express = require('express');
const fs = require('fs');
const Papa = require('papaparse');
const cors = require('cors');
const app = express();

const PORT = 8000;

app.use(cors());

let playersData = [];
let targetPlayer = {}; 


fs.readFile('people.csv', 'utf8', (err, data) => {
    if (err) {
        console.log('Error reading CSV file', err);
        return;
    }

    Papa.parse(data, {
        header: true,
        complete: (results) => {
            playersData = results.data;
            selectRandomTargetPlayer(); 
        },
    });
});


const selectRandomTargetPlayer = () => {
    const randomIndex = Math.floor(Math.random() * playersData.length);
    targetPlayer = playersData[randomIndex];
    console.log(`Selected target player: ${targetPlayer.fullname}`);
};


app.get('/api/players', express.json(), (req, res) => {
    res.json(playersData);
});

app.get('/api/target-player',(req, res) => {
    console.log(targetPlayer.fullname);
    res.json(targetPlayer);
});


app.get('/api/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.json([]); 
    }

    
    const filteredPlayers = playersData
        .filter(player => player.fullname && player.fullname.toLowerCase().startsWith(query.toLowerCase()))
        .map(player => ({
            fullname: player.fullname 
        }));

    res.json(filteredPlayers);
});

app.get('/api/guess', (req, res) => {
    const { guessedPlayerName } = req.query;

    const guessedPlayer = playersData.find(
        (player) => player.fullname && player.fullname.toLowerCase() === guessedPlayerName.toLowerCase()
    );

    if (!guessedPlayer) {
        return res.status(400).json({ message: 'Player not found' });
    }

    const extractYearFromDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split("-");
        return parseInt(year, 10);
    };

    
    const result = {
        fullname: guessedPlayer.fullname,
        country_name: guessedPlayer.country_name,
        position: guessedPlayer.position,
        birthyear: extractYearFromDate(guessedPlayer.dateofbirth),
        battingstyle: guessedPlayer.battingstyle,
        bowlingstyle: guessedPlayer.bowlingstyle,
        image_path: guessedPlayer.image_path,
        country_match: guessedPlayer.country_name === targetPlayer.country_name,
        position_match: guessedPlayer.position === targetPlayer.position,
        birthyear_match: extractYearFromDate(guessedPlayer.dateofbirth) === extractYearFromDate(targetPlayer.dateofbirth),
        battingstyle_match: guessedPlayer.battingstyle === targetPlayer.battingstyle,
        bowlingstyle_match: guessedPlayer.bowlingstyle === targetPlayer.bowlingstyle,
    };

    res.json(result);
});

app.get('/api/reset', (req, res) => {
    selectRandomTargetPlayer();
    res.json({ message: 'New target player selected' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
