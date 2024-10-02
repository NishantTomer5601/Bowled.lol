const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const Papa = require('papaparse');
const cors = require('cors');
const app = express();

const DailyArchive = require('./models/DailyArchive');
const Feedback = require('./models/Feedback')
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],        
  credentials: true,               
}));

app.use(bodyParser.json());

const PORT = 8000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));



let playersData = [];
let targetPlayer = {}; 
const HOUR_IN_MS = 3600 * 1000; 
const now = new Date();
const currentHour = now.getHours();



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
let ans=0;
const timeUntilNextHour = () => {
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0); // Next hour at exactly :00
    
    ans=nextHour-now;
    
    return ans;
};

const startHourlyRefresh = () => {
    setTimeout(() => {
        selectRandomTargetPlayer();
        
        setInterval(selectRandomTargetPlayer, HOUR_IN_MS);
    }, timeUntilNextHour());
};

startHourlyRefresh();


if (currentHour === 7) {
    const today = now.toISOString().split('T')[0];
    if (!targetPlayer || !targetPlayer.fullname) {
            console.error("No target player selected. Cannot archive.");
            return;  // Abort the archive process if targetPlayer is not selected
        }
    const ArchiveSave={
        fullname: targetPlayer.fullname,
        country_name: targetPlayer.country_name,
        position: targetPlayer.position,
        dateofbirth: targetPlayer.dateofbirth,
        battingstyle: targetPlayer.battingstyle,
        bowlingstyle: targetPlayer.bowlingstyle,
        image_path: targetPlayer.image_path
      }
      console.log('Saving target player data: ', ArchiveSave); 
    const dailyArchive = new DailyArchive({
      date: today,
      target_player: ArchiveSave
    });
    // console.log('Saving target player data: ', ArchiveSave);


    dailyArchive.save()
  .then(() => {
    console.log(`Archived daily player for ${today} at 7:00 AM.`);
  })
  .catch(err => {
    console.error('Error saving daily archive player:', err);
  });
}


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

app.get('/api/archive-player', (req, res) => {
  const { date } = req.query;

  DailyArchive.findOne({ date })
    .then(player => {
      if (!player) {
        return res.status(404).json({ message: 'No archived player found for this date.' });
      }
      res.json(player.target_player);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching archived player.' });
    });
});


app.get('/api/archive', (req, res) => {
  DailyArchive.find({}, 'date')
    .then(archives => {
      res.json(archives);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching archive data.' });
    });
});

app.post('/api/feedback', async (req, res) => {
  const { feedback } = req.body;
  try {
    const newFeedback = new Feedback({ feedback });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
