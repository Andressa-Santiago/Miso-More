
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

  const $ = s=>document.querySelector(s);
  const $$ = s=>[...document.querySelectorAll(s)];
  const el = {
    q: $('#q'), min: $('#min'), max: $('#max'), sort: $('#sort'), 
    gens: $$('.gen'), svcs: $$('.svc'), reset: $('#reset'), form: $('#formFiltros'),
    cont: $('#contagem'), cards: $('#cards'), tbody: $('#tbody'),
    vCards: $('#v-cards'), vTable: $('#v-table'), tableWrap: $('#tableWrap')
  };
  
  let st = { q:'', min:null, max:null, gens:new Set(['A la carte','Rodizio','Executivo','Bebidas', 'Sobremesa']), svcs:new Set(), sort:'relevance', view:'cards' };


  const incluiTodos = (arr, set)=>[...set].every(v=>arr.includes(v));

  function lerFiltros(){
    st.q   = el.q.value.trim().toLowerCase();
    st.min = el.min.value? +el.min.value : null;
    st.max = el.max.value? +el.max.value : null;
    st.gens = new Set(el.gens.filter(c=>c.checked).map(c=>c.value));
    st.svcs = new Set(el.svcs.filter(c=>c.checked).map(c=>c.value));
    st.sort = el.sort.value;
  }

  function filtrar(){
    lerFiltros();
      let out =   dishes.filter(l=>{
      if(st.q && !(l.name.toLowerCase().includes(st.q) || l.description.toLowerCase().includes(st.q) || l.category.toLowerCase().includes(st.q))) return false;
      if(!st.gens.has(l.category)) return false;
      if(st.svcs.size && !incluiTodos(l.services, st.svcs)) return false;
      if(st.min!=null && l.price < st.min) return false;
      if(st.max!=null && l.price > st.max) return false;
      return true;
  });
  switch(st.sort){
    case 'price-asc':  out.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': out.sort((a,b)=>b.price-a.price); break;
    case 'title-asc': out.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  render(out);
}
//?

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
                <div class="d-flex gap-1">${l.services.map(s=>`<span class="badge text-bg-secondary">${s}</span>`).join('')}</div>
            </div>
        </div>
      </div>
   </div>
 `).join('');

   //tabela
    el.tbody.innerHTML = lista.map(l=>`
    <tr>
      <td>${l.name}</td><td>${l.category}</td>
      <td>${l.description}</td>
      <td class="text-end">${l.price}</td>
      <td>${l.services.map(s=>`<span class="badge text-bg-secondary me-1">${s}</span>`).join('')}</td>
    </tr>
   `).join('');

    el.cont.textContent = String(lista.length);
}

// ... (Resto do código omitido por estar correto)

function setView (v){
  st.view = v;
  el.tableWrap.classList.toggle('d-none', v==='cards');
  el.cards.classList.toggle('d-none', v=== 'table');
}

el.vCards.addEventListener('change', ()=>setView('cards'));
el.vTable.addEventListener('change', ()=>setView('table'));
el.form.addEventListener('submit', e=>{ e.preventDefault(); filtrar(); const oc=bootstrap.Offcanvas.getInstance(document.getElementById('filtros')); if(oc) oc.hide(); });
[el.q, el.min, el.max, el.sort, ...el.gens, ...el.svcs].forEach(c=>{ c.addEventListener('input', filtrar); c.addEventListener('change', filtrar); });
el.reset.addEventListener('click', ()=>{
  el.q.value=''; el.min.value=''; el.max.value=''; el.sort.value='relevance';
  el.gens.forEach(c=>c.checked=true); el.svcs.forEach(c=>c.checked=false);
  filtrar();
});

// Inicializa
setView('cards'); filtrar();




  
