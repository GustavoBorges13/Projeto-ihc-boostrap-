document.addEventListener('DOMContentLoaded', () => {

  // --- NOVA LÓGICA: NAVBAR TRANSPARENTE AO ROLAR ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      // Adiciona a classe se a rolagem for maior que 50px, remove se for menor
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // --- ADICIONADO: INICIALIZAÇÃO DA ANIMAÇÃO AO ROLAR (AOS) ---
  AOS.init({
    duration: 800, // Duração da animação em ms
    once: true,    // Anima apenas uma vez por elemento
    offset: 50,    // Começa a animar 50px antes do elemento aparecer na tela
  });


  const carousel = document.getElementById('heroCarousel');

  if (carousel) {
    const carouselInstance = new bootstrap.Carousel(carousel, {
      interval: 5000,
      pause: false,
      ride: 'carousel'
    });

    // Função para animar a entrada do texto
    function animateIn(slide) {
      const caption = slide.querySelector('.carousel-caption');
      if (caption) {
        caption.classList.remove('animate__fadeOut');
        caption.classList.add('animate__animated', 'animate__fadeIn');
        caption.style.opacity = 1; // Garante que fique visível
      }
    }

    // Função para animar a saída do texto
    function animateOut(slide) {
      const caption = slide.querySelector('.carousel-caption');
      if (caption) {
        caption.classList.remove('animate__fadeIn');
        caption.classList.add('animate__animated', 'animate__fadeOut');
      }
    }

    // Anima o primeiro slide ao carregar
    const initialSlide = carousel.querySelector('.carousel-item.active');
    if (initialSlide) {
      animateIn(initialSlide);
    }

    // Evento que dispara ANTES da transição do slide começar
    carousel.addEventListener('slide.bs.carousel', function (event) {
      const outgoingSlide = carousel.querySelector('.carousel-item.active');
      const incomingSlide = event.relatedTarget;

      if (outgoingSlide) {
        animateOut(outgoingSlide);
      }
      if (incomingSlide) {
        animateIn(incomingSlide);
      }
    });
  }


  const rootElement = document.documentElement;

  // BOTÕES
  const buttons = {
    theme: document.getElementById('toggle-theme'),
    contrast: document.getElementById('toggle-contrast'),
    brightness: document.getElementById('toggle-brightness'),
    increaseFont: document.getElementById('increase-font'),
    decreaseFont: document.getElementById('decrease-font')
  };

  // --- FUNÇÃO GENÉRICA PARA TOGGLE ---
  function toggleButtonState(button, state) {
    if (state) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  }

  // --- TEMA ---
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      rootElement.setAttribute('data-bs-theme', 'dark');
      buttons.theme.querySelector('i').classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
      toggleButtonState(buttons.theme, true);
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.setAttribute('data-bs-theme', 'light');
      buttons.theme.querySelector('i').classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
      toggleButtonState(buttons.theme, false);
      localStorage.setItem('theme', 'light');
    }
  };

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  buttons.theme.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTheme = rootElement.getAttribute('data-bs-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // --- CONTRASTE ---
  buttons.contrast.addEventListener('click', (e) => {
    e.preventDefault();
    const active = document.body.classList.toggle('alto-contraste');
    toggleButtonState(buttons.contrast, active);
  });

  // --- BRILHO ---
  buttons.brightness.addEventListener('click', (e) => {
    e.preventDefault();
    const active = rootElement.classList.toggle('low-brightness');
    toggleButtonState(buttons.brightness, active);
  });

  // --- FONTES ---
  let currentFontSize = parseFloat(getComputedStyle(rootElement).fontSize);

  buttons.increaseFont.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentFontSize < 24) currentFontSize += 2;
    rootElement.style.fontSize = `${currentFontSize}px`;
    toggleButtonState(buttons.increaseFont, currentFontSize > 16);
    toggleButtonState(buttons.decreaseFont, currentFontSize < 16);
  });

  buttons.decreaseFont.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentFontSize > 12) currentFontSize -= 2;
    rootElement.style.fontSize = `${currentFontSize}px`;
    toggleButtonState(buttons.decreaseFont, currentFontSize < 16);
    toggleButtonState(buttons.increaseFont, currentFontSize > 16);
  });

  /* Nada demais... */
  const btn = document.getElementById('teapotBtn');
  const modal = document.getElementById('teapotModal');
  const closeBtn = document.querySelector('.close');

  btn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

});


