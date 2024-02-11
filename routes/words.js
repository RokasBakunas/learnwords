const express = require('express');
const router = express.Router();
const Word = require('/../models/word');


// Pagrindinis puslapis
router.get('/', (req, res) => {
  res.render('index');
});

// Pridėti žodžius
router.get('/add-words', (req, res) => {
  res.render('add-words');
});

router.get('/edit/:id', async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    res.render('edit-word', { word });
  } catch (error) {
    console.log(error);
    res.redirect('/stats');
  }
});

// Pakeitimų išsaugojimas
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { germanWord, pronunciation, lithuanianWord } = req.body;
  try {
    await Word.findByIdAndUpdate(id, { germanWord, pronunciation, lithuanianWord });
    res.redirect('/stats');
  } catch (error) {
    console.log(error);
    res.redirect('/edit/' + id);
  }
});



router.post('/add-words', async (req, res) => {
  const { germanWord, pronunciation, lithuanianWord } = req.body;
  let words = [];
  for (let i = 0; i < germanWord.length; i++) {
    if (germanWord[i]) {
      words.push({
        germanWord: germanWord[i],
        pronunciation: pronunciation[i],
        lithuanianWord: lithuanianWord[i]
      });
    }
  }
  try {
    await Word.insertMany(words);
    res.redirect('/');
  } catch (error) {
    res.send(error);
  }
});




router.get('/learn', async (req, res) => {
  try {
      const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);
      const word = randomWord[0]; // Kadangi $sample grąžina masyvą, imame pirmą elementą
      let responseRate = 0;
      if (word.correctAnswers + word.wrongAnswers > 0) {
          responseRate = ((word.correctAnswers / (word.correctAnswers + word.wrongAnswers)) * 100).toFixed(2);
      }
      const showGerman = Math.random() > 0.5;
      res.render('learn', { word, responseRate, showGerman });
  } catch (error) {
      console.error("Failed to fetch a random word:", error);
      res.status(500).send("Error fetching a random word");
  }
});



// Teisingo atsakymo logika
router.post('/answer', async (req, res) => {
  const { wordId, answer, language } = req.body;
  const word = await Word.findById(wordId);
  let isCorrect = false;

  if (language === 'LT' && answer.trim().toLowerCase() === word.germanWord.toLowerCase() ||
      language === 'DE' && answer.trim().toLowerCase() === word.lithuanianWord.toLowerCase()) {
    word.correctAnswers += 1;
    isCorrect = true;
  } else {
    word.wrongAnswers += 1;
  }

  await word.save();

  res.render('answer-result', { isCorrect, word });
});

// Statistikos puslapis
router.get('/stats', async (req, res) => {
  const words = await Word.find();
  res.render('stats', { words });
});

module.exports = router;
