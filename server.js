import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

// Kredensial API
const uid = '0x4AAAAAAANuFg_hYO9YJZqo';
const token = 'e2ddc8d3ce8a8fceb9943e60e722018cb23523499b9ac14a8823242e689eefed';

app.get('/txt2vid', async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt harus diisi' });

  try {
    // Mulai proses pembuatan video
    const task = await axios.post(
      'https://aiarticle.erweima.ai/api/v1/start-task',
      { prompt },
      { headers: { uniqueid: uid, verify: token } }
    );

    // Polling hasil
    let result;
    while (true) {
      const { data } = await axios.get(
        `https://aiarticle.erweima.ai/api/v1/secondary-page/api/${task.data.data.recordId}`,
        { headers: { uniqueid: uid, verify: token } }
      );

      if (data.data.state === 'success') {
        result = JSON.parse(data.data.completeData);
        break;
      }
      await new Promise(r => setTimeout(r, 1000)); // delay 1 detik
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

app.listen(3000, () => console.log('✅ Server jalan di http://localhost:3000'));