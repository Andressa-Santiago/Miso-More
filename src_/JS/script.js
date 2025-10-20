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


// modal carrinho - aumentar e diminuir quantidade
document.addEventListener('DOMContentLoaded', function() {
  const modalBody = document.querySelector('#modalCarrinho .modal-body');
  const btnFinalizar = document.getElementById('btnFinalizarCompra');
  
  // Controle de quantidade
  modalBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-quantity')) {
      const action = e.target.dataset.action;
      const quantitySpan = e.target.parentElement.querySelector('.quantity');
      let quantity = parseInt(quantitySpan.textContent);
      
      if (action === 'increase') {
        quantity++;
      } else if (action === 'decrease' && quantity > 1) {
        quantity--;
      }
      
      quantitySpan.textContent = quantity;
      calculateTotal();
    }
  });
  
  // Calcular total
  function calculateTotal() {
    const items = document.querySelectorAll('#modalCarrinho .modal-body > div:not(:last-child)');
    let total = 0;
    
    items.forEach(item => {
      const priceText = item.querySelector('p.fw-bold:last-of-type').textContent;
      const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
      const quantity = parseInt(item.querySelector('.quantity').textContent);
      total += price * quantity;
    });
    
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }
  
  // Finalizar compra
  btnFinalizar.addEventListener('click', function() {
    // Fechar modal do carrinho
    const modalCarrinho = bootstrap.Modal.getInstance(document.getElementById('modalCarrinho'));
    modalCarrinho.hide();
    
    // Aguardar fechamento e abrir modal de sucesso
    setTimeout(function() {
      const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
      modalSucesso.show();
      
      // Limpar carrinho após fechar modal de sucesso
      document.getElementById('modalSucesso').addEventListener('hidden.bs.modal', function() {
        resetarCarrinho();
      }, { once: true });
    }, 300);
  });
  
  // Resetar carrinho
  function resetarCarrinho() {
    document.querySelectorAll('.quantity').forEach(span => {
      span.textContent = '1';
    });
    calculateTotal();
  }
});


