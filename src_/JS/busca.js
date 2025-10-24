// busca.js - Dados das comidas
window.CARDAPIO = [
  // À la carte
  {
    id: 1,
    name: "Salmão",
    category: "À la carte",
    price: 120.90,
    description: "Sushi, sashimi, uramaki e hot roll",
    services: ["Presencial", "Delivery"],
    img: "../img_/salmao.jpg"
  },
  {
    id: 2,
    name: "Teppan de Salmão",
    category: "À la carte",
    price: 58.00,
    description: "Grelhado com legumes e molho tarê.",
    services: ["Presencial"],
    img: "../img_/salmaogrelhado.jpg"
  },
  {
    id: 3,
    name: "Yakisoba",
    category: "À la carte",
    price: 39.00,
    description: "Massa oriental com frango, carne ou camarão.",
    services: ["Presencial", "Delivery"],
    img: "../img_/yakissoba.jpg"
  },
  // fim a la carte

  // Rodízio
  {
    id: 4,
    name: "Rodízio Completo",
    category: "Rodízio",
    price: 85.00,
    description: "Sushis e sashimis à vontade.",
    services: ["Presencial"],
    img: "../img_/sushivariados.jpg"
  },
  {
    id: 5,
    name: "Temaki à vontade",
    category: "Rodízio",
    price: 48.00,
    description: "Salmão, atum, camarão empanado e Califórnia.",
    services: ["Presencial", "Delivery"],
    img: "../img_/temaki2.jpg"
  },
  {
    id: 6,
    name: "Pratos Quentes",
    category: "Rodízio",
    price: 60.00,
    description: "Yakisoba, shimeji na manteiga e harumaki.",
    services: ["Presencial"],
    img: "../img_/pratoquente.jpg"
  },
  // fim rodízio

  // Menu Executivo
  {
    id: 7,
    name: "Executivo Salmão Grelhado",
    category: "Menu Executivo",
    price: 42.00,
    description: "Acompanha arroz, missoshiro e salada sunomono.",
    services: ["Presencial", "Delivery"],
    img: "../img_/salmaogrelhado.jpg"
  },
  {
    id: 8,
    name: "Executivo Frango Teriyaki",
    category: "Menu Executivo",
    price: 38.00,
    description: "Com legumes salteados e gohan.",
    services: ["Presencial", "Delivery"],
    img: "../img_/frango.jpg"
  },
  {
    id: 9,
    name: "Executivo Yakissoba",
    category: "Menu Executivo",
    price: 35.00,
    description: "Versão individual com frango ou carne bovina.",
    services: ["Presencial", "Delivery"],
    img: "../img_/yakissoba.jpg"
  },
  // fim menu executivo
  
  // Bebidas
  {
    id: 10,
    name: "Saké Tradicional",
    category: "Bebidas",
    price: 25.00,
    description: "Quente ou gelado.",
    services: ["Presencial", "Delivery"],
    img: "../img_/saque1.jpg"
  },
  {
    id: 11,
    name: "Saquerinha",
    category: "Bebidas",
    price: 28.00,
    description: "Saké com frutas: morango, kiwi ou maracujá.",
    services: ["Presencial", "Delivery"],
    img: "../img_/saque2.jpg"
  },
  {
    id: 12,
    name: "Cerveja Japonesa",
    category: "Bebidas",
    price: 22.00,
    description: "Asahi ou Sapporo.",
    services: ["Presencial"],
    img: "../img_/cerveja.jpg"
  },
  // fim bebidas

  // Sobremesas
  {
    id: 13,
    name: "Mochi de Chá Verde",
    category: "Sobremesa",
    price: 18.00,
    description: "Sobremesa leve.",
    services: ["Presencial"],
    img: "../img_/mochi.jpg"
  }
  // fim sobremesas
];
