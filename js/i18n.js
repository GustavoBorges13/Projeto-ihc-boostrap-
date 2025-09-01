document.addEventListener('DOMContentLoaded', () => {
  let translations = {};
  let currentLanguage = localStorage.getItem('lang') || 'PT';
  let visitorCountPromise = null;

  // NOVO: Variável para armazenar o ID do setTimeout da animação de digitação
  let typingTimeoutId = null;

  // Função para aplicar o efeito de digitação
  function typeEffect(element, text, speed = 50) {
    if (!element) return;

    // NOVO: Se houver uma animação de digitação anterior, cancele-a
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null; // Reseta o ID
    }

    element.innerHTML = '';
    let i = 0;

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        // Armazena o ID do setTimeout
        typingTimeoutId = setTimeout(type, speed);
      } else {
        // NOVO: A animação terminou, limpa o ID
        typingTimeoutId = null;
      }
    }
    type();
  }

  // Função para carregar as traduções
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`locales/${lang.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      translations = await response.json();
      applyTranslations();
      updateLanguageDropdown(lang);
      localStorage.setItem('lang', lang);
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
      applyTranslations();
    }
  }

  // Função para aplicar as traduções na página
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      // NOVO: Verifica se o elemento atual é o visitCounterElement
      const isVisitCounter = element.id === 'visitCounter';

      if (translations[key]) {
        let translatedText = translations[key];

        // Lógica para o título do hero (com gradiente)
        if (key === 'hero_h2_1a' || key === 'hero_h2_2a') {
          element.setAttribute('data-text', translatedText);
          element.textContent = translatedText;
        } else if (!isVisitCounter) { // NOVO: Só atualiza textContent se NÃO for o visitCounter
          element.textContent = translatedText;
        }
        // A lógica do visitCounter é tratada separadamente abaixo
      }
    });

    // Lógica específica para o contador de visitas na barra de transição
    const visitCounterElement = document.getElementById('visitCounter');
    if (visitCounterElement) {
        visitorCountPromise.then(count => {
            let textToShow;
            if (count !== undefined && count !== null) {
                textToShow = translations['transition_bar_text'] || 'Since 1997, turning dreams into musical reality. We\'ve received {visits} visits!';
                textToShow = textToShow.replace('{visits}', count);
            } else {
                textToShow = translations['transition_bar_loading'] || 'Loading visits...';
            }
            typeEffect(visitCounterElement, textToShow);
        });
        // Enquanto espera, mostra o texto de carregamento (sem animação para não quebrar)
        // Isso garante que o texto inicial seja traduzido imediatamente
        visitCounterElement.textContent = translations['transition_bar_loading'] || 'Carregando visitas...';
    }


    // Traduzir atributos 'title' e 'placeholder'
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (translations[key]) {
        element.setAttribute('title', translations[key]);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        element.setAttribute('placeholder', translations[key]);
      }
    });

    // Traduzir o título da página
    const pageTitleElement = document.querySelector('title');
    if (pageTitleElement && translations['title_page']) {
        pageTitleElement.textContent = translations['title_page'];
    }
  }

  // Atualizar dropdown de idioma
  function updateLanguageDropdown(lang) {
    const currentFlag = document.getElementById('current-flag');
    const currentLangText = document.getElementById('current-lang');
    if (currentFlag && currentLangText) {
      switch (lang) {
        case 'PT':
          currentFlag.textContent = '🇧🇷';
          currentLangText.textContent = 'PT';
          break;
        case 'EN':
          currentFlag.textContent = '🇺🇸';
          currentLangText.textContent = 'EN';
          break;
        case 'ES':
          currentFlag.textContent = '🇪🇸';
          currentLangText.textContent = 'ES';
          break;
        case 'JP':
        currentFlag.textContent = '🇯🇵';
        currentLangText.textContent = 'JP';
        break;
      }
    }
  }

  // Event Listeners para os botões de idioma
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = item.dataset.lang;
      loadTranslations(lang);
    });
  });

  // Cria uma Promise que será resolvida quando o contador de visitas for carregado
  visitorCountPromise = new Promise(resolve => {
    const checkVisitorCount = () => {
      if (window.globalVisitorCount !== undefined) {
        resolve(window.globalVisitorCount);
      } else {
        setTimeout(checkVisitorCount, 50);
      }
    };
    checkVisitorCount();
  });

  // Carrega as traduções assim que o DOM estiver pronto
  loadTranslations(currentLanguage);
});