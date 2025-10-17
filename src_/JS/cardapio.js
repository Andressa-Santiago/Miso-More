// cardapio.js - versão robusta
(function () {
  // Dados de exemplo (substitua pelas suas imagens/campos)
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

  // DOM refs (verifica existência)
  const cardsWrap = document.getElementById('cards');
  const tbody = document.getElementById('tbody');
  const contagem = document.getElementById('contagem');
  const form = document.getElementById('formFiltros');
  if (!cardsWrap || !tbody || !contagem || !form) {
    console.warn('cardapio.js: elementos obrigatórios não encontrados no DOM. Verifique ids (cards, tbody, contagem, formFiltros).');
    return;
  }

  const qEl = document.getElementById('q');
  const cats = Array.from(document.querySelectorAll('.cat'));
  const svcs = Array.from(document.querySelectorAll('.svc'));
  const minEl = document.getElementById('min');
  const maxEl = document.getElementById('max');
  const sortEl = document.getElementById('sort');
  const resetBtn = document.getElementById('reset');

  const vCards = document.getElementById('v-cards');
  const vTable = document.getElementById('v-table');
  const tableWrap = document.getElementById('tableWrap');

  // Helpers
  function escapeHtml(text){
    if(!text && text !== 0) return '';
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Render cards
  function renderCards(list){
    cardsWrap.innerHTML = '';
    if(!list.length){
      cardsWrap.innerHTML = `<div class="col-12"><div class="alert alert-info bg-transparent border border-1 text-white">Nenhum prato encontrado.</div></div>`;
      return;
    }
    list.forEach(d => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-xl-4 card-wrap';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${d.img}" onerror="this.src='../img_/placeholder.jpg'" class="dish-img" alt="${escapeHtml(d.name)}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="me-2">
                <div class="title">${escapeHtml(d.name)}</div>
                <div class="text-muted small">${escapeHtml(d.description)}</div>
              </div>
              <div class="text-end">
                <div class="badge-price">R$ ${d.price.toFixed(2).replace('.',',')}</div>
              </div>
            </div>
            <div class="tag-row">
              <span class="service-badge">${escapeHtml(d.category)}</span>
              ${d.services.map(s => `<span class="service-badge">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        </div>`;
      cardsWrap.appendChild(col);
    });
  }

  // Render table
  function renderTable(list){
    tbody.innerHTML = '';
    if(!list.length){
      tbody.innerHTML = `<tr><td colspan="4" class="text-muted">Nenhum prato encontrado.</td></tr>`;
      return;
    }
    list.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${d.img}" onerror="this.src='../img_/placeholder.jpg'" width="64" height="48" style="object-fit:cover;border-radius:6px;">
            <div>
              <div class="fw-semibold">${escapeHtml(d.name)}</div>
              <div class="text-muted small">${escapeHtml(d.description)}</div>
            </div>
          </div>
        </td>
        <td>${escapeHtml(d.category)}</td>
        <td>${d.services.map(s => `<span class="service-badge">${escapeHtml(s)}</span>`).join(' ')}</td>
        <td class="text-end">R$ ${d.price.toFixed(2).replace('.',',')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateCount(n){ contagem.textContent = n; }

  // Filtering & sorting
  function applyFilters(){
    let q = (qEl && qEl.value) ? qEl.value.trim().toLowerCase() : '';
    const catChecked = cats.filter(c => c.checked).map(c => c.value);
    const svcChecked = svcs.filter(s => s.checked).map(s => s.value);
    const min = parseFloat(minEl && minEl.value) || null;
    const max = parseFloat(maxEl && maxEl.value) || null;

    let list = [...dishesFallback()];

    if(q){
      list = list.filter(d => (d.name + ' ' + d.description + ' ' + d.category).toLowerCase().includes(q));
    }

    if(catChecked.length){
      list = list.filter(d => catChecked.includes(d.category));
    }

    if(svcChecked.length){
      list = list.filter(d => svcChecked.every(svc => d.services.includes(svc)));
    }

    if(min !== null) list = list.filter(d => d.price >= min);
    if(max !== null) list = list.filter(d => d.price <= max);

    const sort = sortEl ? sortEl.value : 'relevance';
    if(sort === 'price-asc'){ list.sort((a,b) => a.price - b.price); }
    else if(sort === 'price-desc'){ list.sort((a,b) => b.price - a.price); }
    else if(sort === 'name-asc'){ list.sort((a,b) => a.name.localeCompare(b.name, 'pt-BR')); }

    renderCards(list);
    renderTable(list);
    updateCount(list.length);

    if(vTable && vTable.checked){
      tableWrap.classList.remove('d-none');
      cardsWrap.classList.add('d-none');
    } else {
      tableWrap.classList.add('d-none');
      cardsWrap.classList.remove('d-none');
    }
  }

  // Fallback dish list if `dishes` not in this scope
  function dishesFallback(){ return (typeof dishes !== 'undefined' ? dishes : window.__dishes || []); }

  // Events
  if(form){
    form.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
  }
  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      form.reset();
      cats.forEach(c => c.checked = true);
      svcs.forEach(s => s.checked = false);
      if(minEl) minEl.value = '';
      if(maxEl) maxEl.value = '';
      if(sortEl) sortEl.value = 'relevance';
      if(qEl) qEl.value = '';
      applyFilters();
    });
  }

  [qEl, minEl, maxEl, sortEl].forEach(el => { if(el) el.addEventListener('input', applyFilters); });
  cats.forEach(c => c.addEventListener('change', applyFilters));
  svcs.forEach(s => s.addEventListener('change', applyFilters));
  if(vCards) vCards.addEventListener('change', applyFilters);
  if(vTable) vTable.addEventListener('change', applyFilters);

  // Render inicial
  applyFilters();

  // expose for debugging (opcional)
  window.applyFilters = applyFilters;
})();
