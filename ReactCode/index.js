const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/api/tts', async (req, res) => {
  const { text, language } = req.body;

  try {
    // Replace with your TTS API call
    const response = await axios.post('TTS_API_URL', {
      text: text,
      language: language
    });

    res.json({ audioUrl: response.data.audioUrl });
  } catch (error) {
    res.status(500).send('Error converting text to speech');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
