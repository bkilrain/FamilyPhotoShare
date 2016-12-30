const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', () => {
  console.log('DB Error!');
});

db.once('open', () => {
  console.log('DB connected! :)');
});

const Users = new mongoose.Schema({

});

const Batches = new mongoose.Schema({

});