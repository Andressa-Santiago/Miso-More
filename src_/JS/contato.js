
  // Faz o fade-up aparecer ao rolar a página
  const faders = document.querySelectorAll('.fade-up');

  function checkFadeUp() {
    const triggerBottom = window.innerHeight * 0.85;

    faders.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('show');
      }
    });
  }

  window.addEventListener('scroll', checkFadeUp);
  window.addEventListener('load', checkFadeUp);
