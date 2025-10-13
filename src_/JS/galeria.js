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