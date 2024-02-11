const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  germanWord: { type: String, required: true, unique: true },
  pronunciation: { type: String, required: true },
  lithuanianWord: { type: String, required: true },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 }
});

module.exports = mongoose.model('Word', wordSchema);
