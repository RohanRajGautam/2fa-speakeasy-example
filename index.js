const express = require('express');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const speakeasy = require('speakeasy')
const uuid = require('uuid')

const app = express()

const db = new JsonDB(new Config("myDataBase", true, false, '/'));

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the two-factor-authentication example using speakeasy.'})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  {
  console.log(`Server running on Port ${PORT}`);
})