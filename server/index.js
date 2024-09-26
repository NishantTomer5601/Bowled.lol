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
});

// Search endpoint for filtering players by name
app.get('/api/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.json([]); // If no query, return empty array
    }

    const filteredPlayers = playersData.filter(player => 
        player.fullname && player.fullname.toLowerCase().startsWith(query.toLowerCase())
    );

    res.json(filteredPlayers);
});

app.get('/api/guess',  (req,res) => {
    const {guessedPlayerName, targetPlayerName } = req.query;

    const guessedPlayer = playersData.find(
        (player) => player.fullname && player.fullname.toLowerCase() === guessedPlayerName.toLowerCase()
    );
    //console.log(guessedPlayer);


    const targetPlayer = playersData.find(
        (player) => player.fullname && typeof targetPlayerName === 'string' &&  player.fullname.toLowerCase() === targetPlayerName.toLowerCase()
    );

    if(!guessedPlayer || !targetPlayer){
        return res.status(400).json({ message: 'Player not found '});
    }
    // console.log(guessedPlayer);
    // console.log(targetPlayer);

    const result = {
        fullname: guessedPlayer.fullname,
        country_name: guessedPlayer.country_name === targetPlayer.country_name,
        position: guessedPlayer.position === targetPlayer.position,
        dateofbirth: guessedPlayer.dateofbirth === targetPlayer.dateofbirth,
        battingstyle: guessedPlayer.battingstyle === targetPlayer.battingstyle,
        bowlingstyle: guessedPlayer.bowlingstyle === targetPlayer.bowlingstyle,
        image_path: guessedPlayer.image_path,
        
    };
    res.json(result);
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});