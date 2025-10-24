document.addEventListener('DOMContentLoaded', () =>{
    //ver mais mobile (cardapio)
  document.getElementById("verMais").addEventListener('click', () => {
    const imgsEscondidas = document.querySelectorAll(".col-12.hide");
    let mostrados = 0;

    imgsEscondidas.forEach((element) => {
      if (mostrados < 3) {
        element.classList.remove("hide");
        mostrados++;
      }
    })

    // Se não houver mais elementos escondidos, esconde o botão
    if (document.querySelectorAll(".col-12.hide").length === 0) {
      document.getElementById("verMais").style.display = "none";
    }

  });
});


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
