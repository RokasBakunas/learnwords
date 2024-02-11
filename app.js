const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const Word = require('./models/Word');
const wordRoutes = require('./routes/words');
const path = require('path');


require('dotenv').config()

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB);

app.use('/', wordRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
