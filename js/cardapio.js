// =============== UTILS ===============
function normalize(str) {
  return (str || '').toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}
 
// =============== DADOS DO CARDÁPIO ===============
const dishes = [
  // --- A LA CARTE ---
  { id: 1, name: "Salmão (20 peças)", description: "Sushi, sashimi, uramaki e hot roll.", category: "A la carte", price: 120, img: "img_/salmao.jpg", services: ["Presencial", "Delivery"] },
  { id: 2, name: "Teppan de Salmão", description: "Grelhado com legumes e molho tarê.", category: "A la carte", price: 58, img: "img_/salmaogrelhado.jpg", services: ["Presencial"] },
  { id: 3, name: "Yakisoba", description: "Massa oriental com frango, carne ou camarão.", category: "A la carte", price: 39, img: "img_/yakissoba.jpg", services: ["Presencial", "Delivery", "Vegano"] },
 
  // --- RODÍZIO ---
  { id: 4, name: "Rodízio Completo", description: "Sushis e sashimis à vontade.", category: "Rodízio", price: 85, img: "img_/sushivariados.jpg", services: ["Presencial"] },
  { id: 5, name: "Temaki à vontade", description: "Salmão, atum, camarão empanado e Califórnia.", category: "Rodízio", price: 48, img: "img_/temaki2.jpg", services: ["Presencial", "Delivery"] },
  { id: 6, name: "Pratos Quentes", description: "Yakisoba, shimeji na manteiga e harumaki.", category: "Rodízio", price: 60, img: "img_/pratoquente.jpg", services: ["Presencial"] },
 
  // --- MENU EXECUTIVO ---
  { id: 7, name: "Executivo Salmão Grelhado", description: "Acompanha arroz, missoshiro e salada sunomono.", category: "Executivo", price: 42, img: "img_/salmaogrelhado.jpg", services: ["Presencial", "Delivery"] },
  { id: 8, name: "Executivo Frango Teriyaki", description: "Com legumes salteados e gohan.", category: "Executivo", price: 38, img: "img_/frango.jpg", services: ["Presencial", "Delivery"] },
  { id: 9, name: "Executivo Yakissoba", description: "Versão individual com frango ou carne bovina.", category: "Executivo", price: 35, img: "img_/yakissoba.jpg", services: ["Presencial", "Delivery"] },
 
  // --- BEBIDAS ---
  { id: 10, name: "Saké Tradicional", description: "Quente ou gelado.", category: "Bebidas", price: 25, img: "img_/saque1.jpg", services: ["Presencial", "Delivery", "Bebida"] },
  { id: 11, name: "Saquerinha", description: "Saké com frutas: morango, kiwi ou maracujá.", category: "Bebidas", price: 28, img: "img_/saque2.jpg", services: ["Presencial", "Delivery", "Bebida"] },
  { id: 12, name: "Cerveja Japonesa", description: "Asahi ou Sapporo.", category: "Bebidas", price: 22, img: "img_/cerveja.jpg", services: ["Presencial", "Bebida"] },
 
  // --- SOBREMESA ---
  { id: 13, name: "Mochi de Chá Verde", description: "Sobremesa leve.", category: "Sobremesa", price: 18, img: "img_/mochi.jpg", services: ["Presencial"] }
];
 
window.CARDAPIO = dishes;
 
// =============== URL ===============
function getQueryParam(name) {
  const url = new URL(window.location);
  return url.searchParams.get(name) || '';
}
 
// =============== CARRINHO (mantido igual) ===============
let cart = [];
 
function loadCart() {
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    updateCartBadge();
  }
}
 
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showCartModal();
}
 
function addToCart(productId) {
  const product = dishes.find(d => d.id === productId);
  if (!product) return;
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.img, quantity: 1 });
  }
  saveCart();
  showNotification('Item adicionado ao carrinho!');
}
 
function updateCartBadge() {
  // badge do desktop
  const badge = document.getElementById('cartBadge');
 
  //adição do badge do mobile
  const mobileBadge = document.getElementById('mobileCartBadge');
  if (!badge || !mobileBadge) return; // verifica se os elementos existem
 
  //aqui ele faz a contagem dos itens do carrinho
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
 
  //com os itens do carrinhos contados, ele atribui para o conteudo html seu valor
  badge.textContent = totalItems;
  mobileBadge.textContent = totalItems;
 
  // se o total de itens do carrinho for maior que zero, faz o badge aparecer, caso ao contrario faz ele sumir
  badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  mobileBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
}
 
function showCartModal() {
  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="text-center p-3">Seu carrinho está vazio.</p>';
    return;
  }
  let html = '', total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    html += `
      <div class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom" style="background: #ffe6e6; border-radius: 15px; padding: 12px;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">R$ ${item.price.toFixed(2)}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, -1);">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += `<div class="cart-total pt-3 border-top"><h5 class="text-end">Total: R$ ${total.toFixed(2)}</h5></div>`;
  cartBody.innerHTML = html;
}
 
function changeQuantity(index, delta ) {
  if (index < 0 || index >= cart.length) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  showCartModal();
}
 
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  showCartModal();
  showNotification('Item removido do carrinho');
}
 
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (!notification) return;
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}
 
// =============== FILTRAGEM AVANÇADA COM BUSCA INTELIGENTE ===============
function filtrar(searchTermOverride = null) {
  const inputBusca = document.getElementById('inputBusca');
  const rawSearch = (searchTermOverride !== null)
    ? searchTermOverride.trim()
    : (inputBusca?.value.trim() || '');
  const normalizedSearch = normalize(rawSearch);
 
  // Filtros avançados
  const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"].gen:checked');
  const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
 
  const serviceCheckboxes = document.querySelectorAll('input[type="checkbox"].svc:checked');
  const requiredServices = Array.from(serviceCheckboxes).map(cb => cb.value);
 
  const minPrice = parseFloat(document.getElementById('min')?.value) || 0;
  const maxPrice = parseFloat(document.getElementById('max')?.value) || Infinity;
 
  const sortValue = document.getElementById('sort')?.value || 'relevance';
 
  // Filtragem principal
  let filtered = dishes.filter(dish => {
    // Normaliza todos os campos relevantes
    const nName = normalize(dish.name);
    const nDesc = normalize(dish.description);
    const nCat = normalize(dish.category);
    const nServices = dish.services.map(s => normalize(s)).join(' ');
 
    // Verifica se o termo de busca está em QUALQUER campo
    const matchesSearch = normalizedSearch === '' ||
      nName.includes(normalizedSearch) ||
      nDesc.includes(normalizedSearch) ||
      nCat.includes(normalizedSearch) ||
      nServices.includes(normalizedSearch);
 
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(dish.category);
    const matchesServices = requiredServices.every(svc => dish.services.includes(svc));
    const matchesPrice = dish.price >= minPrice && dish.price <= maxPrice;
 
    return matchesSearch && matchesCategory && matchesServices && matchesPrice;
  });
 
  // Ordenação
  if (sortValue === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'title-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
  }
 
  renderCards(filtered);
  renderTable(filtered);
  updateResultCount(filtered.length);
}
 
function resetFilters() {
  document.getElementById('inputBusca').value = '';
  document.querySelectorAll('input[type="checkbox"].gen').forEach(cb => cb.checked = true);
  document.querySelectorAll('input[type="checkbox"].svc').forEach(cb => cb.checked = false);
  document.getElementById('min').value = '';
  document.getElementById('max').value = '';
  document.getElementById('sort').value = 'relevance';
  filtrar();
}
 
// =============== RENDERIZAÇÃO ===============
function renderCards(dishList) {
  const container = document.getElementById('cards');
  if (!container) return;
  if (dishList.length === 0) {
    container.innerHTML = '<p class="text-center col-12">Nenhum prato encontrado.</p>';
    return;
  }
  container.innerHTML = dishList.map(dish => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card dish-card h-100">
        <img src="${dish.img}" class="card-img-top" alt="${dish.name}" onerror="this.src='img_/placeholder.jpg'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${dish.name}</h5>
          <p class="card-text text-muted small">${dish.description}</p>
          <p class="card-text"><strong>Categoria:</strong> ${dish.category}</p>
          <p class="card-text"><strong>Serviços:</strong> ${dish.services.join(', ')}</p>
          <div class="mt-auto">
            <p class="price mb-2">R$ ${dish.price.toFixed(2)}</p>
            <button class="btn btn-primary w-100" onclick="addToCart(${dish.id})">
              <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}
 
function renderTable(dishList) {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;
  if (dishList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum prato encontrado.</td></tr>';
    return;
  }
  tbody.innerHTML = dishList.map(dish => `
    <tr>
      <td>${dish.name}</td>
      <td>${dish.category}</td>
      <td>${dish.services.join(', ')}</td>
      <td class="text-end">R$ ${dish.price.toFixed(2)}</td>
    </tr>
  `).join('');
}
 
function updateResultCount(count) {
  const counter = document.getElementById('contagem');
  if (counter) counter.textContent = count;
}
 
function setupViewToggle() {
  document.getElementById('v-cards')?.addEventListener('change', () => {
    document.getElementById('cards').classList.remove('d-none');
    document.getElementById('tableWrap').classList.add('d-none');
  });
  document.getElementById('v-table')?.addEventListener('change', () => {
    document.getElementById('cards').classList.add('d-none');
    document.getElementById('tableWrap').classList.remove('d-none');
  });
}
 
// =============== INICIALIZAÇÃO ===============
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  showCartModal();
 
 
  const queryFromUrl = getQueryParam('q');
  const inputBusca = document.getElementById('inputBusca');
  if (inputBusca && queryFromUrl) {
    inputBusca.value = queryFromUrl;
  }
 
  const modalContent = document.querySelector('#modalCarrinho');
  if (modalContent) {
    modalContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
 
  // Eventos
  if (inputBusca) inputBusca.addEventListener('input', () => filtrar());
  document.getElementById('formFiltros')?.addEventListener('submit', e => e.preventDefault() && filtrar());
  document.getElementById('reset')?.addEventListener('click', resetFilters);
  document.getElementById('sort')?.addEventListener('change', () => filtrar());
 
  document.querySelectorAll('input[type="checkbox"].gen, input[type="checkbox"].svc')
    .forEach(cb => cb.addEventListener('change', () => filtrar()));
 
  document.getElementById('min')?.addEventListener('input', () => filtrar());
  document.getElementById('max')?.addEventListener('input', () => filtrar());
 
  setupViewToggle();
 
  filtrar(queryFromUrl || '');
});

function clearCart() {
  cart = [];
  saveCart(); // Isso já atualiza o localStorage e o badge
}

//btn finalizar compra
document.getElementById('btnFinalizarCompra')?.addEventListener('click', () => {
  // Opcional: limpa o carrinho após "compra"
  clearCart();

  // Fecha o modal do carrinho
  const modalPagamento = bootstrap.Modal.getInstance(document.getElementById('modalPagamento'));
  if (modalPagamento) modalPagamento.hide();

  // Abre o modal de sucesso
  const successModal = new bootstrap.Modal(document.getElementById('modalSucesso'));
  successModal.show();
});

document.getElementById('btnPagamento').addEventListener('click', () => {
  const cartModal = bootstrap.Modal.getInstance(document.getElementById('modalCarrinho'));
  if (cartModal) cartModal.hide();

  const modalPagamento = new bootstrap.Modal(document.getElementById('modalPagamento'));
  modalPagamento.show();
})


// =============== EXPOSIÇÃO GLOBAL ===============
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.showCartModal = showCartModal;