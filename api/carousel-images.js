const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const carouselDir = path.join(process.cwd(), 'carrousel', 'img');

  if (!fs.existsSync(carouselDir)) {
    res.status(404).json({ error: 'Carpeta carrousel/img no encontrada', images: [] });
    return;
  }

  try {
    const files = fs.readdirSync(carouselDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map((file, index) => ({
        id: index + 1,
        src: `/carrousel/img/${file}`,
        name: file
      }));

    res.status(200).json({ success: true, count: images.length, images });
  } catch (error) {
    res.status(500).json({ error: 'Error al leer la carpeta', message: error.message });
  }
};