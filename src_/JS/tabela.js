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

    // Estado de ordenação e paginação
    let ordem = { col: 'name', dir: 1 }; // 1 asc, -1 desc
    let pagina = 1, tam = 8;

    const $tb    = document.getElementById('tb');
    const $pagin = document.getElementById('pagin');
    const $tam   = document.getElementById('tam');
    const $faixa = document.getElementById('faixa');

    function sortBy(arr, col, dir) {
      return [...arr].sort((a, b) => {
        const va = a[col], vb = b[col];
        const comp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
        return comp * dir;
      });
    }

    function paginar(arr) {
      const ini = (pagina - 1) * tam;
      const fim = pagina * tam;
      return { fatia: arr.slice(ini, fim), total: arr.length };
    }

    function render() {
      // ordena conforme estado
      const ordenada = sortBy(dishes, ordem.col, ordem.dir);

      // pagina
      const { fatia, total } = paginar(ordenada);

      // corpo da tabela
      $tb.innerHTML = fatia.map(d => `
        <tr>
          <td>${d.name}</td>
          <td>${d.description}</td>
          <td>${d.category}</td>
          <td class="text-end">R$ ${d.price.toFixed(2)}</td>
        </tr>
      `).join('');

      // faixa "X–Y de N"
      const ini = (pagina - 1) * tam + 1;
      const fim = Math.min(pagina * tam, total);
      $faixa.textContent = `${ini}–${fim} de ${total}`;

      // paginação
      const pags = Math.ceil(total / tam);
      $pagin.innerHTML = `
        <li class="page-item ${pagina === 1 ? 'disabled' : ''}">
          <a class="page-link" data-p="prev">Anterior</a>
        </li>
        ${Array.from({ length: pags }, (_, i) => `
          <li class="page-item ${pagina === i + 1 ? 'active' : ''}">
            <a class="page-link" data-p="${i + 1}">${i + 1}</a>
          </li>`).join('')}
        <li class="page-item ${pagina === pags ? 'disabled' : ''}">
          <a class="page-link" data-p="next">Próxima</a>
        </li>
      `;

      // acessibilidade visual do cabeçalho (seta)
      document.querySelectorAll('thead [data-col]').forEach(th => th.setAttribute('aria-sort', 'none'));
      const thAtivo = document.querySelector(`thead [data-col="${ordem.col}"]`);
      if (thAtivo) thAtivo.setAttribute('aria-sort', ordem.dir === 1 ? 'ascending' : 'descending');
    }

    // Interações do cabeçalho (ordenar)
    document.querySelectorAll('thead [data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        ordem = { col, dir: ordem.col === col ? -ordem.dir : 1 };
        pagina = 1;
        render();
      });
    });

    // Interações de paginação
    $pagin.addEventListener('click', e => {
      const p = e.target.dataset.p; if (!p) return;
      const max = Math.ceil(dishes.length / tam);
      if (p === 'prev' && pagina > 1) pagina--;
      else if (p === 'next' && pagina < max) pagina++;
      else if (!isNaN(+p)) pagina = +p;
      render();
    });

    // Alterar tamanho de página
    $tam.addEventListener('change', () => { 
      tam = +$tam.value; 
      pagina = 1; 
      render(); 
    });

    // Primeiro render
    render();