const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const app = express();


app.get('/', (req, res) => {
  res.send("Hi, I am root")
});

app.get('/testListing', async (req, res) => {
  let sampleListing = new Listing({
    title: 'Test Listing',
    description: 'This is a test listing',
    image: '',
    price: 100,
    location: 'New York',
    country: 'USA'
  });

  await sampleListing.save()
  console.log('Sample listing saved:', sampleListing);
  res.send('Sample listing saved');
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
}
);