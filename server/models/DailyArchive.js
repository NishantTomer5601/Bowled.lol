const mongoose = require('mongoose');

const dailyArchiveSchema = new mongoose.Schema({
  date: String, // YYYY-MM-DD format
  target_player: {
    fullname: String,
    country_name: String,
    position: String,
    dateofbirth: String,
    battingstyle: String,
    bowlingstyle: String,
    image_path: String
  }
});

const DailyArchive = mongoose.model('DailyArchive', dailyArchiveSchema);

module.exports = DailyArchive;
