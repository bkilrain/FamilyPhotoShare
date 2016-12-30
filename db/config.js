const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on('error', () => {
  console.log('DB Error!');
});

db.once('open', () => {
  console.log('DB connected! :)');
})