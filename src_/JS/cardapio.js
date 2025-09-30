document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".menu-nav button");
  const cards = document.querySelectorAll(".card");
  const moreBtn = document.querySelector(".btn-vermelho");
  const sectionTitle = document.querySelector(".section-title");

  const titles = {
    all: "Todos os pratos:",
    alacarte: "A la carte:",
    rodizio: "Rodízio:",
    executivo: "Menu Executivo:",
    bebidas: "Bebidas:"
  };

  function showCategory(category) {
    // atualiza o título (se existir)
    if (sectionTitle) sectionTitle.textContent = titles[category] || "";

    // mostra/oculta cards
    cards.forEach(card => {
      if (category === "all" || card.classList.contains(category)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    // botão "Veja mais" (se existir) — só aparece quando pertence à categoria ou em "all"
    if (moreBtn) {
      if (category === "all" || moreBtn.classList.contains(category)) {
        moreBtn.classList.remove("hidden");
      } else {
        moreBtn.classList.add("hidden");
      }
    }
  }

  // clique nos botões
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // toggla active visual
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // pega categoria do data-attribute
      const category = btn.dataset.category;
      showCategory(category);
    });
  });

  // inicializa com o botão que estiver com .active no HTML ou com o primeiro
  const activeBtn = document.querySelector(".menu-nav button.active") || buttons[0];
  if (activeBtn) {
    showCategory(activeBtn.dataset.category || "all");
  }
});
