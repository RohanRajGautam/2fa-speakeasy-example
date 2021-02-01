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

// Register user and create temp secret
app.post('/api/register', (req, res) => {
  const id = uuid.v4();
  try {
    const path = `/user/${id}`
    //create temporary secret until verified
    const temp_secret = speakeasy.generateSecret();
    //create user in the db
    db.push(path, { id, temp_secret });
    //send user id and base32 key to user
    res.json({ id, secret: temp_secret.base32 })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error generating secret key'})
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  {
  console.log(`Server running on Port ${PORT}`);
})