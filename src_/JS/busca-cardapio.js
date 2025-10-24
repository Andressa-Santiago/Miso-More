// IIFE (função auto-executável) para evitar poluir o escopo global
(function(){

    // Função que normaliza strings: remove acentos e converte para minúsculas
    // Exemplo: "Café" vira "cafe"
    function normalize(str){
        return (str||'').toString()
          // Separa caracteres dos acentos    
          .normalize('NFD')
          // Remove os acentos
          .replace(/\p{Diacritic}/gu,'')
          
          // Converte para minúsculas
          .toLowerCase();
    }

    // Extrai e padroniza os campos de um item do cardápio
    // Garante que todos os campos existam mesmo se estiverem vazios
    function getFields(item){
        const name = item.name || ''; // Nome do prato
        const category = item.category || ''; // Categoria (ex: "sobremesa")
        const price = item.price || 0; // Preço
        const description = item.description || ''; // Descrição do prato
        const services = [].concat(item.services || []); // Serviços disponíveis (ex: "delivery")
        const img = item.img || ''; // URL da imagem
        const id = item.id || 0; // ID único do item
        return { id, name, category, price, description, services, img };
    }

    // Calcula uma pontuação de relevância para um item baseado nas palavras buscadas
    // Quanto maior a pontuação, mais relevante é o item
    function scoreItem(item, qWords){
        const { name, category, description, services } = getFields(item);
        const n = normalize(name);
        const c = normalize(category);
        const d = normalize(description);
        const s = normalize(services.join(' '));
        
        let score = 0;
        
        // Percorre cada palavra da busca
        for(const w of qWords){
            if(n.includes(w)) score += 4; // Nome tem peso 4 (mais importante)
            if(c.includes(w)) score += 3; // Categoria tem peso 3
            if(d.includes(w)) score += 2; // Descrição tem peso 2
            if(s.includes(w)) score += 1; // Serviços tem peso 1 (menos importante)
        }
        
        return score;
    }

    // Ordena a lista de itens de acordo com o modo escolhido
    function orderBy(items, mode, qWords){
        const arr = [...items]; // Cria uma cópia para não alterar o array original
        const norm = s => normalize(s);
        
        if(mode==='name-asc'){
            // Ordena alfabeticamente pelo nome (A-Z)
            arr.sort((a,b)=>norm(getFields(a).name).localeCompare(norm(getFields(b).name)));
        }else if(mode==='price-asc'){
            // Ordena por preço crescente (menor para maior)
            arr.sort((a,b)=>(getFields(a).price||0)-(getFields(b).price||0));
        }else if(mode==='price-desc'){
            // Ordena por preço decrescente (maior para menor)
            arr.sort((a,b) => (getFields(b).price||0)-(getFields(a).price||0));
        }else{
            // Ordena por relevância (padrão) - itens com maior score aparecem primeiro
            arr.sort((a,b)=>scoreItem(b,qWords)-scoreItem(a,qWords));
        }
        
        return arr;
    }

    // Filtra os dados do cardápio baseado na busca e aplica ordenação
    function filterData(data, q, orderMode){
        
        // Normaliza a busca
        const norm = normalize(q);
        
        // Se busca vazia, retorna tudo
        if(!norm) return data.slice(); 
        
        // Separa em palavras
        const qWords = norm.split(/\s+/).filter(Boolean); 
        // Mantém apenas itens com score > 0
        const res = data.filter(item=>scoreItem(item,qWords)>0); 
        
         // Ordena os resultados
        return orderBy(res, orderMode||'relevance', qWords);
    }

    // Gera sugestões de busca baseado no que o usuário digitou
    // Útil para autocomplete
    function makeSuggestions(data, q, limit=8){
        const norm = normalize(q);

        // Se busca vazia, não sugere nada
        if(!norm) return []; 
        
        // Usa Set para evitar sugestões duplicadas
        const set = new Set();
        const push = v=>{ if(v && !set.has(v)) set.add(v); };
        
        // Percorre todos os itens do cardápio
        for(const it of data){
            const {name, category, description, services} = getFields(it);
            
            // Adiciona campos que contenham a busca
            [name, category, description].forEach(v=>{ 
                if(normalize(v).includes(norm)) push(v); 
            });
            services.forEach(v=>{ 
                if(normalize(v).includes(norm)) push(v); 
            });
            
            // Para quando atingir o limite de sugestões
            if(set.size>=limit) break; 
        }
        
        // Retorna array com no máximo 8 sugestões
        return Array.from(set).slice(0,limit);
    }

    // Lê um parâmetro da URL
    // Exemplo: se a URL for "?busca=pizza", readQueryParam('busca') retorna "pizza"
    function readQueryParam(name){
        const u = new URL(location.href);
        return u.searchParams.get(name)||'';
    }

    // Exporta as funções para uso global através do objeto CardapioUtils
    window.CardapioUtils = { normalize, getFields, filterData, makeSuggestions, readQueryParam };

})();