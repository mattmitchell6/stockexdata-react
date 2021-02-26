const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const stocks = require('./routes/stocks')
const auth = require('./routes/auth')
const watchlist = require('./routes/watchlist')

const app = express()
require('dotenv').config();

// const user = require('./routes/user')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose connect
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 });

 app.use(session({
   store: new mongoStore({
     mongooseConnection: mongoose.connection,
     ttl: 60 * 24 * 60 * 60 // 60 days
   }),
   name: 'stock_ex_data',
   secret: 'unique-secret',
   resave: false,
   saveUninitialized: false
   // cookie: {maxAge: 30 * 86400 * 1000 } // 30 days
 }));

// Routes
app.use('/api/stocks', stocks)
app.use('/api/auth', auth)
app.use('/api/watchlist', watchlist)

// Starting Server
app.listen(process.env.PORT || 8080, () => {
	console.log(`App listening on PORT: ${process.env.PORT || 8080}`)
})
