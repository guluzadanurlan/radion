// === backend/server.js ===

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory DB (simple)
const clients = {}; // { id: { name: "A Butik" } }
let musics = [
  // Demo üçün statik musiqi listi (audio qovluğuna uyğun)
  { title: 'Demo Mahnı 1', fileName: 'track1.mp3', clientId: 'a-butik' },
  { title: 'Demo Mahnı 2', fileName: 'track2.mp3', clientId: 'a-butik' }
];

// Müştəri qeydiyyatı
app.post('/api/register', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Ad tələb olunur' });
  const id = name.toLowerCase().replace(/\s+/g, '-');
  clients[id] = { name };
  res.json({ clientId: id });
});

// Musiqi siyahısı gətir
app.get('/api/music', (req, res) => {
  const { client } = req.query;
  if (client && clients[client]) {
    res.json(musics.filter(m => m.clientId === client));
  } else {
    res.json(musics);
  }
});

// Admin: yeni musiqi əlavə et
app.post('/api/music', (req, res) => {
  const { title, fileName, clientId } = req.body;
  if (!title || !fileName || !clientId) {
    return res.status(400).json({ error: 'title, fileName, clientId tələb olunur' });
  }
  musics.push({ title, fileName, clientId });
  res.json({ success: true });
});

// Server dinləməyə başlayır
app.listen(PORT, () => {
  console.log(`🎧 RadiOn backend işləyir: http://localhost:${PORT}`);
});
