import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/fetch', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url);
    console.log('Response from OpenStreetMap API:', response.data); // Add logging
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching data:', error); // Add logging
    res.status(500).send('Error fetching data');  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});