# 🏗️ Carrusel Interactivo - Instrucciones de Uso

## Requisitos
- Node.js instalado en tu sistema

## Instalación

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Inicia el servidor:**
   ```bash
   npm start
   ```

   El servidor estará disponible en: `http://localhost:3000`

## Agregar Imágenes al Carrusel

Para agregar imágenes al carrusel:

1. Coloca archivos de imagen en la carpeta: `carrousel/img/`
2. Formatos soportados: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
3. El carrusel se cargará automáticamente con las imágenes de esa carpeta

## Características del Carrusel

✨ **Funcionalidades:**
- Carga dinámica de imágenes desde la carpeta `carrousel/img`
- API JSON para obtener lista de imágenes: `GET /api/carousel-images`
- Drag interactivo con mouse (grab/grabbing cursor)
- Limita el movimiento automáticamente
- Hover effects en las imágenes
- Diseño responsivo
- Interfaz moderna y elegante

## Estructura de Carpetas

```
Keystone_Construction/
├── carrousel/
│   └── img/              ← Coloca tus imágenes aquí
├── assets/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
└── README.md
```

## API Endpoint

### GET /api/carousel-images

Devuelve un JSON con todas las imágenes encontradas en la carpeta `carrousel/img`

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "images": [
    {
      "id": 1,
      "src": "/carrousel/img/imagen1.jpg",
      "name": "imagen1.jpg"
    },
    {
      "id": 2,
      "src": "/carrousel/img/imagen2.png",
      "name": "imagen2.png"
    }
  ]
}
```

## Notas

- Las imágenes se cargan automáticamente cuando el servidor inicia
- El carrusel usa drag nativo del navegador
- El carrusel se adapta a diferentes tamaños de pantalla
- Los estilos se integran con el diseño existente de Keystone Construction
