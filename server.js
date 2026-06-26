const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Endpoint para obtener las imágenes del carrusel
app.get('/api/carousel-images', (req, res) => {
  const carouselDir = path.join(__dirname, 'carrousel', 'img');
  
  // Verificar si la carpeta existe
  if (!fs.existsSync(carouselDir)) {
    return res.status(404).json({ 
      error: 'Carpeta carrousel/img no encontrada',
      images: []
    });
  }

  try {
    const files = fs.readdirSync(carouselDir);
    
    // Filtrar solo archivos de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map((file, index) => ({
        id: index + 1,
        src: `/carrousel/img/${file}`,
        name: file
      }));

    res.json({ 
      success: true,
      count: images.length,
      images: images 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al leer la carpeta',
      message: error.message 
    });
  }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`🏗️  Servidor de Keystone Construction corriendo en http://localhost:${PORT}`);
  console.log(`📁 Para agregar imágenes al carrusel, coloca archivos en: ${path.join(__dirname, 'carrousel', 'img')}`);
});
