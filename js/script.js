document.addEventListener('DOMContentLoaded', function () {
  //ouve se o card foi clicado
  document.getElementById('card-alacarte').addEventListener('click', function () {
    //armazena o dataset dentro da variavel category
    const category = this.dataset.category; // "alacarte"
    // redirecionamento imediato passando categoria na query string
    window.location.href = `./src_/HTML/cardapio.html?category=${encodeURIComponent(category)}`;
  });
  document.getElementById('card-rodizio').addEventListener('click', function () {
    const category = this.dataset.category; // "alacarte"
    // redirecionamento imediato passando categoria na query string
    window.location.href = `./src_/HTML/cardapio.html?category=${encodeURIComponent(category)}`;
  });
  document.getElementById('card-menuExecutivo').addEventListener('click', function () {
    const category = this.dataset.category; // "alacarte"
    // redirecionamento imediato passando categoria na query string
    window.location.href = `./src_/HTML/cardapio.html?category=${encodeURIComponent(category)}`;
  });
  document.getElementById('card-bebidas').addEventListener('click', function () {
    const category = this.dataset.category; // "alacarte"
    // redirecionamento imediato passando categoria na query string
    window.location.href = `./src_/HTML/cardapio.html?category=${encodeURIComponent(category)}`;
  });
})

//   var rellax = new Rellax('.rellax', {
//     speed: -3,     // velocidade negativa faz o movimento oposto
//     center: false, // centraliza ou não o movimento
//     round: true,   // arredonda valores para suavidade
//     vertical: true, // ativa o movimento vertical
//     horizontal: false // desativa movimento lateral
// });
