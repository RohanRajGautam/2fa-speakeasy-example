const express = require('express')

const app = express()

app.get('/api', (req, res) => {
  res.json({ message: 'WElCOME'})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  {
  console.log(`Server running on Port ${PORT}`);
})