const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');

const app = express();

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
})

async function main() {
  await mongoose.connect(MONGO_URL)
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.send("Hi, I am root")
});

app.get('/listings', async (req, res) => {
    try {
      const allListings = await Listing.find();
      res.render("listings/index.ejs", {allListings})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.listen(8080, () => {
  console.log('Server is running on port 8080');
}
);