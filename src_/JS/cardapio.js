// Dados do cardápio
const dishes = [
  // --- A LA CARTE ---
  { id:1, name:"Salmão (20 peças)", description:"Sushi, sashimi, uramaki e hot roll.", category:"A la carte", price:120, img:"../img_/salmao.jpg", services:["Presencial","Delivery"] },
  { id:2, name:"Teppan de Salmão", description:"Grelhado com legumes e molho tarê.", category:"A la carte", price:58, img:"../img_/salmaogrelhado.jpg", services:["Presencial"] },
  { id:3, name:"Yakisoba", description:"Massa oriental com frango, carne ou camarão.", category:"A la carte", price:39, img:"../img_/yakissoba.jpg", services:["Presencial","Delivery","Vegano"] },

  // --- RODÍZIO ---
  { id:4, name:"Rodízio Completo", description:"Sushis e sashimis à vontade.", category:"Rodízio", price:85, img:"../img_/sushivariados.jpg", services:["Presencial"] },
  { id:5, name:"Temaki à vontade", description:"Salmão, atum, camarão empanado e Califórnia.", category:"Rodízio", price:48, img:"../img_/temaki2.jpg", services:["Presencial","Delivery"] },
  { id:6, name:"Pratos Quentes", description:"Yakisoba, shimeji na manteiga e harumaki.", category:"Rodízio", price:60, img:"../img_/pratoquente.jpg", services:["Presencial"] },

  // --- MENU EXECUTIVO ---
  { id:7, name:"Executivo Salmão Grelhado", description:"Acompanha arroz, missoshiro e salada sunomono.", category:"Executivo", price:42, img:"../img_/salmaogrelhado.jpg", services:["Presencial","Delivery"] },
  { id:8, name:"Executivo Frango Teriyaki", description:"Com legumes salteados e gohan.", category:"Executivo", price:38, img:"../img_/frango.jpg", services:["Presencial","Delivery"] },
  { id:9, name:"Executivo Yakissoba", description:"Versão individual com frango ou carne bovina.", category:"Executivo", price:35, img:"../img_/yakissoba.jpg", services:["Presencial","Delivery"] },

  // --- BEBIDAS ---
  { id:10, name:"Saké Tradicional", description:"Quente ou gelado.", category:"Bebidas", price:25, img:"../img_/saque1.jpg", services:["Presencial","Delivery","Bebida"] },
  { id:11, name:"Saquerinha", description:"Saké com frutas: morango, kiwi ou maracujá.", category:"Bebidas", price:28, img:"../img_/saque2.jpg", services:["Presencial","Delivery","Bebida"] },
  { id:12, name:"Cerveja Japonesa", description:"Asahi ou Sapporo.", category:"Bebidas", price:22, img:"../img_/cerveja.jpg", services:["Presencial","Bebida"] },

  // --- SOBREMESA ---
  { id:13, name:"Mochi de Chá Verde", description:"Sobremesa leve.", category:"Sobremesa", price:18, img:"../img_/mochi.jpg", services:["Presencial"] }
];

// Sem isso, a busca não encontra os pratos e os cards ficam em branco
window.CARDAPIO = dishes;


// carrinho de compras
let cart = [];

// Carregar carrinho do localStorage
function loadCart() {
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    updateCartBadge();
  }
}

// Salvar carrinho no localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

// Adicionar item ao carrinho
function addToCart(productId) {
  const product = dishes.find(d => d.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img,
      quantity: 1
    });
  }

  saveCart();
  showNotification('Item adicionado ao carrinho!');
}

// Atualizar badge do carrinho
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Mostrar conteúdo do carrinho no modal
function showCartModal() {
  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="text-center p-3">Seu carrinho está vazio.</p>';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    html += `
      <div class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">R$ ${item.price.toFixed(2)}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, -1)">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += `
    <div class="cart-total pt-3 border-top">
      <h5 class="text-end">Total: R$ ${total.toFixed(2)}</h5>
    </div>
  `;

  cartBody.innerHTML = html;
}

// Alterar quantidade
function changeQuantity(index, delta) {
  if (index < 0 || index >= cart.length) return;
  
  cart[index].quantity += delta;
  
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  
  saveCart();
  showCartModal();
}

// Remover item do carrinho
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  showCartModal();
  showNotification('Item removido do carrinho');
}

// Finalizar compra
function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  
  alert('Redirecionando para o pagamento...');
  // Aqui você pode adicionar integração com sistema de pagamento
}

// Mostrar notificação
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}


// Filtrar pratos por busca, categoria e ordenação
function filtrar() {
  const searchInput = document.getElementById('inputBusca');
  const categoryFilter = document.getElementById('filtroCategoria');
  const sortOrder = document.getElementById('ordem');

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedCategory = categoryFilter ? categoryFilter.value : '';
  const orderBy = sortOrder ? sortOrder.value : 'relevance';

  // Filtra por busca e categoria
  let filtered = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm) ||
                         dish.description.toLowerCase().includes(searchTerm) ||
                         dish.category.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !selectedCategory || dish.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Ordena os resultados
  if (orderBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (orderBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (orderBy === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderCards(filtered);
  renderTable(filtered);
  updateResultCount(filtered.length);
}

// Renderizar cards
function renderCards(dishList) {
  const container = document.getElementById('dishCards');
  if (!container) return;

  if (dishList.length === 0) {
    container.innerHTML = '<p class="text-center col-12">Nenhum prato encontrado.</p>';
    return;
  }

  container.innerHTML = dishList.map(dish => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card dish-card h-100">
        <img src="${dish.img}" class="card-img-top" alt="${dish.name}">
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

// Renderizar tabela
function renderTable(dishList) {
  const tbody = document.querySelector('#dishTable tbody');
  if (!tbody) return;

  if (dishList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum prato encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = dishList.map(dish => `
    <tr>
      <td>${dish.name}</td>
      <td>${dish.category}</td>
      <td>${dish.services.join(', ')}</td>
      <td>R$ ${dish.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="addToCart(${dish.id})">
          <i class="fas fa-cart-plus"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Atualizar contador de resultados
function updateResultCount(count) {
  const counter = document.getElementById('resultCount');
  if (counter) {
    counter.textContent = count;
  }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  filtrar(); // Renderiza todos os pratos inicialmente
  
  // Adiciona eventos aos filtros
  const searchInput = document.getElementById('inputBusca');
  const categoryFilter = document.getElementById('filtroCategoria');
  const sortOrder = document.getElementById('ordem');
  
  if (searchInput) searchInput.addEventListener('input', filtrar);
  if (categoryFilter) categoryFilter.addEventListener('change', filtrar);
  if (sortOrder) sortOrder.addEventListener('change', filtrar);
});
