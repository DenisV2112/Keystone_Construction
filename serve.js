// serve.js — SOLO para desarrollo local, Vercel no lo usa
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/carousel-images', (req, res) => {
  const carouselDir = path.join(__dirname, 'carrousel', 'img');
  if (!fs.existsSync(carouselDir)) {
    return res.status(404).json({ error: 'Carpeta carrousel/img no encontrada', images: [] });
  }
  try {
    const files = fs.readdirSync(carouselDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map((file, index) => ({ id: index + 1, src: `/carrousel/img/${file}`, name: file }));
    res.json({ success: true, count: images.length, images });
  } catch (error) {
    res.status(500).json({ error: 'Error al leer la carpeta', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor local en http://localhost:${PORT}`);
});