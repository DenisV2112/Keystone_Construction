# 🏗️ Keystone Construction Co.

Sitio web profesional de Keystone Construction Company con carrusel interactivo de proyectos.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 12+ instalado
- npm

### Instalación y Ejecución

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Inicia el servidor:**
   ```bash
   npm start
   ```

3. **Abre en tu navegador:**
   ```
   http://localhost:3000
   ```

## 📸 Carrusel Interactivo

El sitio incluye un carrusel dinámico que carga imágenes automáticamente.

### Agregar Imágenes al Carrusel

1. Coloca tus imágenes en: `carrousel/img/`
2. Formatos soportados: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
3. Las imágenes se cargarán automáticamente en el carrusel

### Características del Carrusel

✨ **Funcionalidades:**
- Carga dinámica de imágenes via API JSON
- Interacción drag (arrastrar con mouse)
- Efecto hover en imágenes
- Limitación automática de bordes
- Cursores grab/grabbing
- Diseño responsive

### API Endpoint

```
GET /api/carousel-images
```

Devuelve:
```json
{
  "success": true,
  "count": 5,
  "images": [
    {
      "id": 1,
      "src": "/carrousel/img/imagen.jpg",
      "name": "imagen.jpg"
    }
  ]
}
```

## 📁 Estructura del Proyecto

```
Keystone_Construction/
├── carrousel/
│   └── img/                 ← Coloca imágenes aquí
├── assets/                  ← Imágenes del sitio
├── index.html               ← HTML principal
├── style.css                ← Estilos CSS
├── script.js                ← JavaScript (incluye carrusel)
├── server.js                ← Servidor Express
├── package.json             ← Dependencias npm
└── README.md
```

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express
- **Datos:** JSON API

## 📝 Notas

- El carrusel se adapta a pantallas de diferentes tamaños
- Las imágenes se cargan bajo demanda (lazy loading)
- El servidor actualiza automáticamente la lista de imágenes
- Compatible con navegadores modernos

## 📧 Contacto

Para más información: keystone.co.construction@gmail.com

---

**Creado por:** Keystone Construction Co.
