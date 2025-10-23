// busca-cardapio.js
(function(){  // ✅ ADICIONE ESTA LINHA

  function normalize(str){
    return (str||'').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  }

  function getFields(item){
    const name = item.name || '';
    const category = item.category || '';
    const price = item.price || 0;
    const description = item.description || '';
    const services = [].concat(item.services || []);
    const img = item.img || '';
    const id = item.id || 0;
    return { id, name, category, price, description, services, img };
  }

  function scoreItem(item, qWords){
    const { name, category, description, services } = getFields(item);
    const n = normalize(name);
    const c = normalize(category);
    const d = normalize(description);
    const s = normalize(services.join(' '));
    
    let score = 0;
    for(const w of qWords){
      if(n.includes(w)) score += 4;
      if(c.includes(w)) score += 3;
      if(d.includes(w)) score += 2;
      if(s.includes(w)) score += 1;
    }
    return score;
  }

  function orderBy(items, mode, qWords){
    const arr = [...items];
    const norm = s => normalize(s);
    
    if(mode==='name-asc'){
      arr.sort((a,b)=>norm(getFields(a).name).localeCompare(norm(getFields(b).name)));
    }else if(mode==='price-asc'){
      arr.sort((a,b)=>(getFields(a).price||0)-(getFields(b).price||0));
    }else if(mode==='price-desc'){
      arr.sort((a,b) => (getFields(b).price||0)-(getFields(a).price||0));
    }else{
      arr.sort((a,b)=>scoreItem(b,qWords)-scoreItem(a,qWords));
    }
    return arr;
  }

  function filterData(data, q, orderMode){
    const norm = normalize(q);
    if(!norm) return data.slice();
    const qWords = norm.split(/\s+/).filter(Boolean);
    const res = data.filter(item=>scoreItem(item,qWords)>0);
    return orderBy(res, orderMode||'relevance', qWords);
  }

  function makeSuggestions(data, q, limit=8){
    const norm = normalize(q);
    if(!norm) return [];
    const set = new Set();
    const push = v=>{ if(v && !set.has(v)) set.add(v); };
    
    for(const it of data){
      const {name, category, description, services} = getFields(it);
      [name, category, description].forEach(v=>{ if(normalize(v).includes(norm)) push(v); });
      services.forEach(v=>{ if(normalize(v).includes(norm)) push(v); });
      if(set.size>=limit) break;
    }
    return Array.from(set).slice(0,limit);
  }

  function readQueryParam(name){
    const u = new URL(location.href);
    return u.searchParams.get(name)||'';
  }

  window.CardapioUtils = { normalize, getFields, filterData, makeSuggestions, readQueryParam };

})();  // ✅ ADICIONE ESTA LINHA
