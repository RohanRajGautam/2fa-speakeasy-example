const express = require('express');
const bodyParser = require('body-parser');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const uuid = require('uuid');
const speakeasy = require('speakeasy');

const app = express();

const db = new JsonDB(new Config("myDataBase", true, false, '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//verify token and set tmp secret permanent
app.post('/api/verify', (req, res) => {
  const { userId, token } = req.body;
  try {
    // retrieve data from myDataBase
    const path =  `/user/${userId}`;
    const user = db.getData(path);
    const { base32: secret } = user.temp_secret;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });
    if (verified) {
      //update user data
      db.push(path, { id: userId, secret: user.temp_secret});
      res.json({ verified: true })
    } else {
      res.json({ verified: false })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving user' })
  };
})

// Validate token
app.post('/api/validate', (req, res) => {
  const { userId, token } = req.body;
  try {
    // Retrieve user from db
    const path = `/user/${userId}`;
    const user = db.getData(path);
    const { base32: secret } = user.secret;
    // Returns true if the token matches
    const tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (tokenValidates) {
      res.json({ validated: true });
    } else {
      res.json({ validated: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving user'})
  };
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  {
  console.log(`Server running on Port ${PORT}`);
})