// ============================================
// CARRUSEL INTERACTIVO CON DRAG + AUTOPLAY (CORREGIDO)
// ============================================

const carouselContainer = document.querySelector('.carousel-container');
const carouselInner = document.querySelector('.carousel-inner');

let pressed = false;
let startX = 0;
let dragInitialX = 0;
let dragInitialPosition = 0;
let currentPosition = 0;
let autoplayInterval = null;
let isAutoplayActive = true;
let isDragging = false;

// 🆕 Variables para distinguir un click de un drag
const CLICK_THRESHOLD = 5;        // px máximos de movimiento para considerarse un click
let mouseMoveDistance = 0;        // distancia máxima recorrida durante el mousedown actual
let mouseDownTarget = null;       // elemento exacto donde se hizo mousedown

// Configuración del autoplay
const AUTOPLAY_SPEED = 2;
const AUTOPLAY_INTERVAL = 30;
const AUTOPLAY_PAUSE_TIME = 3000;

// Cargar imágenes del carrusel desde la API JSON
async function loadCarouselImages() {
  try {
    const response = await fetch('/api/carousel-images');
    const data = await response.json();

    if (data.success && data.images.length > 0) {
      allCarouselImages = data.images;

      carouselInner.innerHTML = data.images.map((image) => `
        <div class="carousel-item">
          <img src="${image.src}" alt="${image.name}" loading="lazy">
        </div>
      `).join('');

      currentPosition = 0;
      carouselInner.style.left = '0px';

      addImageClickListeners();

      setTimeout(startAutoplay, 500);
    } else {
      carouselInner.innerHTML = `
        <div class="carousel-placeholder">
          📁 No hay imágenes en la carpeta carrousel/img<br>
          Agrega imágenes (jpg, png, gif, webp) a esa carpeta para verlas aquí.
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar las imágenes del carrusel:', error);
    carouselInner.innerHTML = `
      <div class="carousel-placeholder">
        ⚠️ Error al cargar las imágenes del carrusel
      </div>
    `;
  }
}

// Preparar las imágenes: desactivar drag nativo y guardar su índice
// (el modal ahora se abre por click simple desde el container, ver handleMouseUp)
function addImageClickListeners() {
  const images = carouselInner.querySelectorAll('img');
  images.forEach((img, index) => {
    // Desactivar el drag nativo del navegador
    img.draggable = false;
    img.addEventListener('dragstart', (e) => e.preventDefault());

    // 🆕 Guardamos el índice en el elemento para poder leerlo luego en handleMouseUp
    img.dataset.index = index;

    // ❌ Ya no se usa dblclick: el click simple se maneja vía carouselContainer
  });
}

// ============================================
// MODAL PARA VER IMÁGENES
// ============================================

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
let allCarouselImages = [];

function openImageModal(index) {
  if (index < 0 || index >= allCarouselImages.length) return;

  currentImageIndex = index;
  const image = allCarouselImages[index];

  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modal.classList.remove('hidden');
  pauseAutoplay();
}

function closeImageModal() {
  modal.classList.add('hidden');
  resumeAutoplay();
}

function showPreviousImage() {
  const newIndex = currentImageIndex - 1;
  if (newIndex < 0) {
    openImageModal(allCarouselImages.length - 1);
  } else {
    openImageModal(newIndex);
  }
}

function showNextImage() {
  const newIndex = currentImageIndex + 1;
  if (newIndex >= allCarouselImages.length) {
    openImageModal(0);
  } else {
    openImageModal(newIndex);
  }
}

modalClose.addEventListener('click', closeImageModal);
modalPrev.addEventListener('click', showPreviousImage);
modalNext.addEventListener('click', showNextImage);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeImageModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeImageModal();
  }
});

// ============================================
// DRAG DEL CARRUSEL (ÚNICO PUNTO DE ENTRADA: carouselContainer)
// ============================================

let onMouseMoveHandler = null;
let onMouseUpHandler = null;

function startDrag(e) {
  e.preventDefault();

  if (modal && !modal.classList.contains('hidden')) return;
  if (isDragging) return;

  pressed = true;
  isDragging = true;

  // 🆕 Reiniciar detección de click vs drag
  mouseMoveDistance = 0;
  mouseDownTarget = e.target;

  dragInitialX = e.clientX;
  dragInitialPosition = parseInt(carouselInner.style.left) || 0;

  carouselContainer.style.cursor = 'grabbing';
  document.body.style.cursor = 'grabbing';
  carouselInner.style.transition = 'none';
  carouselInner.classList.add('dragging');

  pauseAutoplay();

  onMouseMoveHandler = handleMouseMove;
  onMouseUpHandler = handleMouseUp;

  window.addEventListener('mousemove', onMouseMoveHandler);
  window.addEventListener('mouseup', onMouseUpHandler);
}

function handleMouseMove(e) {
  if (!pressed) return;

  const deltaX = e.clientX - dragInitialX;

  // 🆕 Registrar el movimiento máximo para saber si esto fue un click o un drag real
  mouseMoveDistance = Math.max(mouseMoveDistance, Math.abs(deltaX));

  const newPosition = dragInitialPosition + deltaX;

  carouselInner.style.left = `${newPosition}px`;
  document.body.style.cursor = 'grabbing';
}

function handleMouseUp(e) {
  if (!pressed) return;

  pressed = false;
  isDragging = false;
  window.removeEventListener('mousemove', onMouseMoveHandler);
  window.removeEventListener('mouseup', onMouseUpHandler);

  carouselInner.style.transition = 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  carouselInner.classList.remove('dragging');

  carouselContainer.style.cursor = 'grab';
  document.body.style.cursor = 'auto';

  // 🆕 Si apenas hubo movimiento, fue un click, no un drag
  if (mouseMoveDistance < CLICK_THRESHOLD) {
    limitCarouselPosition(); // por seguridad, aunque la posición no debería haber cambiado
    currentPosition = parseInt(carouselInner.style.left) || 0;

    const clickedImg = mouseDownTarget ? mouseDownTarget.closest('img') : null;

    if (clickedImg) {
      const index = parseInt(clickedImg.dataset.index, 10);
      openImageModal(index); // ya pausa el autoplay internamente
      return; // 🔧 importante: NO reanudar el autoplay mientras el modal está abierto
    }

    // Click en el carrusel pero fuera de una imagen: comportamiento normal
    pauseAutoplay();
    setTimeout(resumeAutoplay, AUTOPLAY_PAUSE_TIME);
    return;
  }

  // Comportamiento normal de drag (hubo movimiento real)
  limitCarouselPosition();
  currentPosition = parseInt(carouselInner.style.left) || 0;

  pauseAutoplay();
  setTimeout(resumeAutoplay, AUTOPLAY_PAUSE_TIME);
}

carouselContainer.addEventListener('mousedown', (e) => {
  startDrag(e);
});

carouselContainer.addEventListener('mouseenter', () => {
  if (!isDragging && !pressed) {
    carouselContainer.style.cursor = 'grab';
  }
});

carouselContainer.addEventListener('mouseleave', () => {
  if (!isDragging && !pressed) {
    carouselContainer.style.cursor = 'grab';
  }
});

function limitCarouselPosition() {
  const scrollWidth = carouselInner.scrollWidth;
  const clientWidth = carouselContainer.clientWidth;
  const maxScroll = -(scrollWidth - clientWidth);

  let currentLeft = parseInt(carouselInner.style.left) || 0;

  if (currentLeft > 0) {
    carouselInner.style.left = '0px';
    currentPosition = 0;
  }

  if (currentLeft < maxScroll) {
    carouselInner.style.left = `${maxScroll}px`;
    currentPosition = maxScroll;
  }
}

// ============================================
// AUTOPLAY
// ============================================

function startAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }

  isAutoplayActive = true;
  autoplayInterval = setInterval(() => {
    if (isAutoplayActive && !isDragging && !pressed) {
      const currentLeft = parseInt(carouselInner.style.left) || 0;
      const scrollWidth = carouselInner.scrollWidth;
      const clientWidth = carouselContainer.clientWidth;
      const maxScroll = -(scrollWidth - clientWidth);

      if (currentLeft <= maxScroll) {
        carouselInner.style.transition = 'left 0.5s ease';
        carouselInner.style.left = '0px';
        currentPosition = 0;
      } else {
        carouselInner.style.transition = 'left 0.1s linear';
        const newPosition = currentLeft - AUTOPLAY_SPEED;
        carouselInner.style.left = `${newPosition}px`;
        currentPosition = newPosition;
      }
    }
  }, AUTOPLAY_INTERVAL);
}

function pauseAutoplay() {
  isAutoplayActive = false;
}

function resumeAutoplay() {
  isAutoplayActive = true;
}

if (carouselContainer && carouselInner) {
  loadCarouselImages();
}

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Formulario enviado correctamente');
    form.reset();
  });
}