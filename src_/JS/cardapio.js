// ========================
// 1. Dados dos pratos
// ========================
const dishes = [
  { id:1, name:"Salmão (20 peças)", description:"Sushi, sashimi, uramaki e hot roll.", category:"A la carte", price:120, img:"../img_/salmao.jpg", services:["Presencial","Delivery"] },
  { id:2, name:"Teppan de Salmão", description:"Grelhado com legumes e molho tarê.", category:"A la carte", price:58, img:"../img_/salmaogrelhado.jpg", services:["Presencial"] },
  { id:3, name:"Yakisoba", description:"Massa oriental com frango, carne ou camarão.", category:"A la carte", price:39, img:"../img_/yakissoba.jpg", services:["Presencial","Delivery","Vegano"] },
  { id:4, name:"Rodízio Completo", description:"Sushis e sashimis à vontade.", category:"Rodízio", price:85, img:"../img_/sushivariados.jpg", services:["Presencial"] },
  { id:5, name:"Temaki à vontade", description:"Vários sabores.", category:"Rodízio", price:48, img:"../img_/temaki2.jpg", services:["Presencial","Delivery"] },
  { id:6, name:"Executivo Salmão", description:"10 peças (sushi, sashimi, hot roll).", category:"Executivo", price:45, img:"../img_/salmao.jpg", services:["Presencial","Delivery"] },
  { id:7, name:"Chá Verde Importado", description:"Quente ou gelado.", category:"Bebidas", price:12, img:"../img_/bebidas.jpg", services:["Presencial","Delivery","Bebida"] },
  { id:8, name:"Tempurá de Legumes", description:"Sobremesa leve.", category:"Sobremesa", price:18, img:"../img_/sobremesa.jpg", services:["Presencial"] }
];

// ========================
// 2. SISTEMA DE CARRINHO
// ========================
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
    cartBody.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
    return;
  }
  
  let html = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    
    html += `
      <div class="d-flex align-items-center p-3 mb-3" style="background-color: #ffc0cb; border-radius: 15px;">
        <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 100px; height: 80px; object-fit: cover;">
        <div class="ms-3 flex-grow-1">
          <p class="mb-1 fw-bold">${item.name}</p>
          <p class="mb-0 fw-bold" style="color: #333;">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-light px-2" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="mx-2 fw-bold quantity">${item.quantity}</span>
          <button class="btn btn-sm btn-light px-2" onclick="updateQuantity(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  
  html += `
    <div class="mt-4 text-end">
      <h5 class="fw-bold" style="color: #eb1d27;">Total: <span id="total">R$ ${total.toFixed(2)}</span></h5>
    </div>
  `;
  
  cartBody.innerHTML = html;
}

// Atualizar quantidade
function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  
  saveCart();
  showCartModal();
}

// Remover item do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  showCartModal();
}

// Notificação de item adicionado
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  notification.style.zIndex = '9999';
  notification.innerHTML = `<i class="fa-solid fa-check-circle me-2"></i>${message}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// ========================
// 3. Seletores úteis
// ========================
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const el = {
  q: $('#q'),
  min: $('#min'),
  max: $('#max'),
  sort: $('#sort'),
  gens: $$('.gen'),
  svcs: $$('.svc'),
  reset: $('#reset'),
  form: $('#formFiltros'),
  cont: $('#contagem'),
  cards: $('#cards'),
  tbody: $('#tbody'),
  vCards: $('#v-cards'),
  vTable: $('#v-table'),
  tableWrap: $('#tableWrap')
};

let st = {
  q:'',
  min:null,
  max:null,
  gens:new Set(['A la carte','Rodízio','Executivo','Bebidas','Sobremesa']),
  svcs:new Set(),
  sort:'relevance',
  view:'cards'
};

// ========================
// 4. Funções de filtro
// ========================
const incluiTodos = (arr,set)=>[...set].every(v=>arr.includes(v));

function lerFiltros(){
  st.q = el.q.value.trim().toLowerCase();
  st.min = el.min.value ? +el.min.value : null;
  st.max = el.max.value ? +el.max.value : null;
  st.gens = new Set(el.gens.filter(c=>c.checked).map(c=>c.value));
  st.svcs = new Set(el.svcs.filter(c=>c.checked).map(c=>c.value));
  st.sort = el.sort.value;
}

function filtrar(){
  lerFiltros();

  let out = dishes.filter(l=>{
    if(st.q && !(l.name.toLowerCase().includes(st.q) || l.description.toLowerCase().includes(st.q) || l.category.toLowerCase().includes(st.q))) return false;
    if(!st.gens.has(l.category)) return false;
    if(st.svcs.size && !incluiTodos(l.services, st.svcs)) return false;
    if(st.min!=null && l.price < st.min) return false;
    if(st.max!=null && l.price > st.max) return false;
    return true;
  });

  switch(st.sort){
    case 'price-asc': out.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': out.sort((a,b)=>b.price-a.price); break;
    case 'title-asc': out.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }

  render(out);
}

// ========================
// 5. Renderização dos cards
// ========================
function render(lista){
  // Cards
  el.cards.innerHTML = lista.map(l=>`
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100">
        <img class="card-img-top" src="${l.img}" alt="${l.name}">
        <div class="card-body d-flex flex-column">
          <h6 class="mb-1">${l.name}</h6>
          <small class="text-muted">${l.category} — R$ ${l.price}</small>
          <p class="card-text">${l.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
            <span class="badge text-bg-light">R$ ${l.price}</span>
            <div class="d-flex gap-1">
              ${l.services.map(s=>`<span class="badge text-bg-secondary">${s}</span>`).join('')}
            </div>
          </div>
          <button class="btn btn-primary btn-sm mt-3 w-100" style="background-color: #eb1d27; border-color: #eb1d27;" onclick="addToCart(${l.id})">
            <i class="fa-solid fa-cart-plus me-2"></i>Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Tabela
  el.tbody.innerHTML = lista.map(l=>`
    <tr>
      <td data-label="Prato">${l.name}</td>
      <td data-label="Categoria">${l.category}</td>
      <td data-label="Serviços">${l.description}</td>
      <td data-label="Preço" class="text-end">R$ ${l.price}</td>
      <td data-label="Opções">${l.services.map(s=>`<span class="badge text-bg-secondary me-1">${s}</span>`).join('')}</td>
    </tr>
  `).join('');

  el.cont.textContent = String(lista.length);
}

// ========================
// 6. Controle da view
// ========================
function setView(v){
  st.view = v;
  el.tableWrap.classList.toggle('d-none', v==='cards');
  el.cards.classList.toggle('d-none', v==='table');
}

el.vCards.addEventListener('change', ()=>setView('cards'));
el.vTable.addEventListener('change', ()=>setView('table'));

// Filtros
el.form.addEventListener('submit', e=>{
  e.preventDefault();
  filtrar();
  const oc = bootstrap.Offcanvas.getInstance(document.getElementById('filtrosOff'));
  if(oc) oc.hide();
});

[el.q, el.min, el.max, el.sort, ...el.gens, ...el.svcs].forEach(c=>{
  c.addEventListener('input', filtrar);
  c.addEventListener('change', filtrar);
});

el.reset.addEventListener('click', ()=>{
  el.q.value=''; el.min.value=''; el.max.value='';
  el.sort.value='relevance';
  el.gens.forEach(c=>c.checked=true);
  el.svcs.forEach(c=>c.checked=false);
  filtrar();
});

// ========================
// 7. INICIALIZAÇÃO
// ========================
document.addEventListener('DOMContentLoaded', function() {
  // Carregar carrinho salvo
  loadCart();
  
  // Inicializar visualização e filtros
  setView('cards');
  filtrar();
  
  // Configurar modal do carrinho
  const modalCarrinho = document.getElementById('modalCarrinho');
  if (modalCarrinho) {
    modalCarrinho.addEventListener('show.bs.modal', showCartModal);
  }
  
  // Botão finalizar compra
  const btnFinalizar = document.getElementById('btnFinalizarCompra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }
      
      // Fechar modal do carrinho
      const modalCarrinhoInstance = bootstrap.Modal.getInstance(modalCarrinho);
      modalCarrinhoInstance.hide();
      
      // Aguardar fechamento e abrir modal de sucesso
      setTimeout(function() {
        const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
        modalSucesso.show();
        
        // Limpar carrinho após fechar modal de sucesso
        document.getElementById('modalSucesso').addEventListener('hidden.bs.modal', function() {
          cart = [];
          saveCart();
        }, { once: true });
      }, 300);
    });
  }
});

// Inicializa (fallback caso DOMContentLoaded já tenha passado)
if (document.readyState === 'loading') {
  // Aguarda DOMContentLoaded
} else {
  // DOM já carregado, inicializar diretamente
  setView('cards');
  filtrar();
}
