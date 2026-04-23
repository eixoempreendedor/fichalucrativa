import { PrismaClient, PriceSource } from "@prisma/client";

const prisma = new PrismaClient();

type SeedIngredient = {
  name: string;
  canonicalName: string;
  unit: string;
  category: string;
  priceBrl: number;
  quantity: number;
  priceUnit: string;
};

// Preços baseline — pesquisa atacarejo BR (Assaí/Atacadão BSB), abril 2026.
// Esses valores vivem como source='seed' e são substituídos pelo próprio preço
// do restaurante assim que o usuário informa.
const INGREDIENTS: SeedIngredient[] = [
  // Pães
  { name: "Pão de hambúrguer brioche", canonicalName: "pao_hamburguer_brioche", unit: "un", category: "padaria", priceBrl: 1.8, quantity: 1, priceUnit: "un" },
  { name: "Pão de hambúrguer tradicional", canonicalName: "pao_hamburguer", unit: "un", category: "padaria", priceBrl: 0.9, quantity: 1, priceUnit: "un" },
  { name: "Pão francês", canonicalName: "pao_frances", unit: "un", category: "padaria", priceBrl: 0.6, quantity: 1, priceUnit: "un" },
  { name: "Pão sírio", canonicalName: "pao_sirio", unit: "un", category: "padaria", priceBrl: 1.2, quantity: 1, priceUnit: "un" },
  { name: "Massa de pizza pré-assada", canonicalName: "massa_pizza", unit: "un", category: "padaria", priceBrl: 4.5, quantity: 1, priceUnit: "un" },

  // Proteínas — bovino
  { name: "Carne moída bovina", canonicalName: "carne_moida_bovina", unit: "g", category: "proteina_bovina", priceBrl: 42.0, quantity: 1000, priceUnit: "g" },
  { name: "Hambúrguer artesanal 150g", canonicalName: "hamburguer_artesanal_150", unit: "un", category: "proteina_bovina", priceBrl: 5.5, quantity: 1, priceUnit: "un" },
  { name: "Picanha fatiada", canonicalName: "picanha", unit: "g", category: "proteina_bovina", priceBrl: 85.0, quantity: 1000, priceUnit: "g" },
  { name: "Contra-filé", canonicalName: "contra_file", unit: "g", category: "proteina_bovina", priceBrl: 52.0, quantity: 1000, priceUnit: "g" },
  { name: "Filé mignon", canonicalName: "file_mignon", unit: "g", category: "proteina_bovina", priceBrl: 98.0, quantity: 1000, priceUnit: "g" },

  // Proteínas — suíno
  { name: "Bacon em cubos", canonicalName: "bacon", unit: "g", category: "proteina_suina", priceBrl: 36.0, quantity: 1000, priceUnit: "g" },
  { name: "Linguiça toscana", canonicalName: "linguica_toscana", unit: "g", category: "proteina_suina", priceBrl: 26.0, quantity: 1000, priceUnit: "g" },
  { name: "Calabresa fatiada", canonicalName: "calabresa", unit: "g", category: "proteina_suina", priceBrl: 28.0, quantity: 1000, priceUnit: "g" },
  { name: "Presunto fatiado", canonicalName: "presunto", unit: "g", category: "proteina_suina", priceBrl: 32.0, quantity: 1000, priceUnit: "g" },

  // Proteínas — aves
  { name: "Peito de frango", canonicalName: "peito_frango", unit: "g", category: "proteina_aves", priceBrl: 20.0, quantity: 1000, priceUnit: "g" },
  { name: "Frango desfiado", canonicalName: "frango_desfiado", unit: "g", category: "proteina_aves", priceBrl: 24.0, quantity: 1000, priceUnit: "g" },

  // Proteínas — peixe
  { name: "Salmão fresco", canonicalName: "salmao", unit: "g", category: "proteina_peixe", priceBrl: 95.0, quantity: 1000, priceUnit: "g" },
  { name: "Atum em conserva", canonicalName: "atum_conserva", unit: "g", category: "proteina_peixe", priceBrl: 85.0, quantity: 1000, priceUnit: "g" },

  // Laticínios
  { name: "Queijo mussarela", canonicalName: "queijo_mussarela", unit: "g", category: "laticinio", priceBrl: 38.0, quantity: 1000, priceUnit: "g" },
  { name: "Queijo cheddar em fatias", canonicalName: "queijo_cheddar", unit: "g", category: "laticinio", priceBrl: 44.0, quantity: 1000, priceUnit: "g" },
  { name: "Queijo parmesão ralado", canonicalName: "queijo_parmesao", unit: "g", category: "laticinio", priceBrl: 68.0, quantity: 1000, priceUnit: "g" },
  { name: "Queijo prato", canonicalName: "queijo_prato", unit: "g", category: "laticinio", priceBrl: 42.0, quantity: 1000, priceUnit: "g" },
  { name: "Catupiry", canonicalName: "catupiry", unit: "g", category: "laticinio", priceBrl: 32.0, quantity: 1000, priceUnit: "g" },
  { name: "Cream cheese", canonicalName: "cream_cheese", unit: "g", category: "laticinio", priceBrl: 48.0, quantity: 1000, priceUnit: "g" },
  { name: "Manteiga", canonicalName: "manteiga", unit: "g", category: "laticinio", priceBrl: 52.0, quantity: 1000, priceUnit: "g" },
  { name: "Leite integral", canonicalName: "leite_integral", unit: "ml", category: "laticinio", priceBrl: 5.5, quantity: 1000, priceUnit: "ml" },
  { name: "Creme de leite", canonicalName: "creme_leite", unit: "ml", category: "laticinio", priceBrl: 8.0, quantity: 200, priceUnit: "ml" },
  { name: "Leite condensado", canonicalName: "leite_condensado", unit: "g", category: "laticinio", priceBrl: 9.5, quantity: 395, priceUnit: "g" },
  { name: "Iogurte natural", canonicalName: "iogurte_natural", unit: "ml", category: "laticinio", priceBrl: 8.0, quantity: 500, priceUnit: "ml" },

  // Hortifruti
  { name: "Alface americana", canonicalName: "alface", unit: "un", category: "hortifruti", priceBrl: 4.0, quantity: 1, priceUnit: "un" },
  { name: "Tomate", canonicalName: "tomate", unit: "g", category: "hortifruti", priceBrl: 8.0, quantity: 1000, priceUnit: "g" },
  { name: "Cebola", canonicalName: "cebola", unit: "g", category: "hortifruti", priceBrl: 6.0, quantity: 1000, priceUnit: "g" },
  { name: "Alho", canonicalName: "alho", unit: "g", category: "hortifruti", priceBrl: 28.0, quantity: 1000, priceUnit: "g" },
  { name: "Batata inglesa", canonicalName: "batata_inglesa", unit: "g", category: "hortifruti", priceBrl: 5.5, quantity: 1000, priceUnit: "g" },
  { name: "Cenoura", canonicalName: "cenoura", unit: "g", category: "hortifruti", priceBrl: 4.5, quantity: 1000, priceUnit: "g" },
  { name: "Pimentão verde", canonicalName: "pimentao", unit: "g", category: "hortifruti", priceBrl: 7.0, quantity: 1000, priceUnit: "g" },
  { name: "Limão", canonicalName: "limao", unit: "un", category: "hortifruti", priceBrl: 0.8, quantity: 1, priceUnit: "un" },
  { name: "Cheiro-verde", canonicalName: "cheiro_verde", unit: "un", category: "hortifruti", priceBrl: 2.5, quantity: 1, priceUnit: "un" },
  { name: "Manjericão fresco", canonicalName: "manjericao", unit: "un", category: "hortifruti", priceBrl: 5.0, quantity: 1, priceUnit: "un" },
  { name: "Banana", canonicalName: "banana", unit: "g", category: "hortifruti", priceBrl: 6.0, quantity: 1000, priceUnit: "g" },
  { name: "Morango", canonicalName: "morango", unit: "g", category: "hortifruti", priceBrl: 25.0, quantity: 1000, priceUnit: "g" },
  { name: "Abacaxi", canonicalName: "abacaxi", unit: "un", category: "hortifruti", priceBrl: 7.0, quantity: 1, priceUnit: "un" },

  // Molhos e condimentos
  { name: "Ketchup", canonicalName: "ketchup", unit: "ml", category: "molho", priceBrl: 14.0, quantity: 400, priceUnit: "ml" },
  { name: "Mostarda", canonicalName: "mostarda", unit: "ml", category: "molho", priceBrl: 13.0, quantity: 400, priceUnit: "ml" },
  { name: "Maionese", canonicalName: "maionese", unit: "ml", category: "molho", priceBrl: 18.0, quantity: 500, priceUnit: "ml" },
  { name: "Molho de tomate", canonicalName: "molho_tomate", unit: "g", category: "molho", priceBrl: 4.5, quantity: 340, priceUnit: "g" },
  { name: "Molho barbecue", canonicalName: "molho_barbecue", unit: "ml", category: "molho", priceBrl: 22.0, quantity: 400, priceUnit: "ml" },
  { name: "Shoyu", canonicalName: "shoyu", unit: "ml", category: "molho", priceBrl: 12.0, quantity: 500, priceUnit: "ml" },
  { name: "Azeite de oliva", canonicalName: "azeite", unit: "ml", category: "oleo", priceBrl: 32.0, quantity: 500, priceUnit: "ml" },
  { name: "Óleo de soja", canonicalName: "oleo_soja", unit: "ml", category: "oleo", priceBrl: 10.0, quantity: 900, priceUnit: "ml" },
  { name: "Vinagre", canonicalName: "vinagre", unit: "ml", category: "molho", priceBrl: 5.0, quantity: 750, priceUnit: "ml" },

  // Temperos básicos
  { name: "Sal", canonicalName: "sal", unit: "g", category: "tempero", priceBrl: 3.0, quantity: 1000, priceUnit: "g" },
  { name: "Pimenta-do-reino", canonicalName: "pimenta_reino", unit: "g", category: "tempero", priceBrl: 45.0, quantity: 100, priceUnit: "g" },
  { name: "Orégano", canonicalName: "oregano", unit: "g", category: "tempero", priceBrl: 6.0, quantity: 50, priceUnit: "g" },

  // Farinhas e secos
  { name: "Farinha de trigo", canonicalName: "farinha_trigo", unit: "g", category: "seco", priceBrl: 5.5, quantity: 1000, priceUnit: "g" },
  { name: "Açúcar refinado", canonicalName: "acucar", unit: "g", category: "seco", priceBrl: 5.0, quantity: 1000, priceUnit: "g" },
  { name: "Açúcar cristal", canonicalName: "acucar_cristal", unit: "g", category: "seco", priceBrl: 4.5, quantity: 1000, priceUnit: "g" },
  { name: "Fermento químico", canonicalName: "fermento_quimico", unit: "g", category: "seco", priceBrl: 14.0, quantity: 100, priceUnit: "g" },
  { name: "Fermento biológico seco", canonicalName: "fermento_biologico", unit: "g", category: "seco", priceBrl: 18.0, quantity: 100, priceUnit: "g" },
  { name: "Chocolate em pó 50%", canonicalName: "chocolate_po", unit: "g", category: "seco", priceBrl: 28.0, quantity: 200, priceUnit: "g" },
  { name: "Chocolate granulado", canonicalName: "granulado", unit: "g", category: "seco", priceBrl: 22.0, quantity: 500, priceUnit: "g" },
  { name: "Coco ralado", canonicalName: "coco_ralado", unit: "g", category: "seco", priceBrl: 18.0, quantity: 100, priceUnit: "g" },
  { name: "Aveia em flocos", canonicalName: "aveia", unit: "g", category: "seco", priceBrl: 9.0, quantity: 500, priceUnit: "g" },
  { name: "Arroz branco", canonicalName: "arroz", unit: "g", category: "seco", priceBrl: 6.5, quantity: 1000, priceUnit: "g" },
  { name: "Feijão carioca", canonicalName: "feijao", unit: "g", category: "seco", priceBrl: 11.0, quantity: 1000, priceUnit: "g" },
  { name: "Macarrão espaguete", canonicalName: "macarrao_espaguete", unit: "g", category: "seco", priceBrl: 6.5, quantity: 500, priceUnit: "g" },
  { name: "Ovos", canonicalName: "ovo", unit: "un", category: "proteina", priceBrl: 0.9, quantity: 1, priceUnit: "un" },

  // Bebidas (para combos)
  { name: "Refrigerante lata 350ml", canonicalName: "refri_lata", unit: "un", category: "bebida", priceBrl: 4.5, quantity: 1, priceUnit: "un" },
  { name: "Água mineral 500ml", canonicalName: "agua_500", unit: "un", category: "bebida", priceBrl: 1.8, quantity: 1, priceUnit: "un" },
  { name: "Suco em polpa 100g", canonicalName: "polpa_suco", unit: "un", category: "bebida", priceBrl: 3.5, quantity: 1, priceUnit: "un" },

  // Embalagens (custo indireto relevante)
  { name: "Embalagem hambúrguer kraft", canonicalName: "embalagem_burger", unit: "un", category: "embalagem", priceBrl: 0.6, quantity: 1, priceUnit: "un" },
  { name: "Caixa de pizza 35cm", canonicalName: "caixa_pizza_35", unit: "un", category: "embalagem", priceBrl: 2.2, quantity: 1, priceUnit: "un" },
  { name: "Marmita descartável 500ml", canonicalName: "marmita_500", unit: "un", category: "embalagem", priceBrl: 0.9, quantity: 1, priceUnit: "un" },
  { name: "Copo PP 300ml", canonicalName: "copo_300", unit: "un", category: "embalagem", priceBrl: 0.15, quantity: 1, priceUnit: "un" },
  { name: "Canudo", canonicalName: "canudo", unit: "un", category: "embalagem", priceBrl: 0.05, quantity: 1, priceUnit: "un" },
  { name: "Guardanapo", canonicalName: "guardanapo", unit: "un", category: "embalagem", priceBrl: 0.04, quantity: 1, priceUnit: "un" },
  { name: "Saco kraft delivery", canonicalName: "saco_kraft", unit: "un", category: "embalagem", priceBrl: 0.5, quantity: 1, priceUnit: "un" },
];

async function main() {
  console.log(`Iniciando seed de ${INGREDIENTS.length} ingredientes...`);

  // Prisma não aceita null em chave composta do upsert. Fazemos findFirst + create.
  for (const item of INGREDIENTS) {
    const existing = await prisma.ingredient.findFirst({
      where: { canonicalName: item.canonicalName, createdById: null },
    });

    const ingredient =
      existing ??
      (await prisma.ingredient.create({
        data: {
          name: item.name,
          canonicalName: item.canonicalName,
          unit: item.unit,
          category: item.category,
          isGlobal: true,
        },
      }));

    // Só adiciona preço baseline se ainda não existir um seed para esse ingrediente.
    const hasSeedPrice = await prisma.ingredientPrice.findFirst({
      where: { ingredientId: ingredient.id, source: PriceSource.seed, restaurantId: null },
    });

    if (!hasSeedPrice) {
      await prisma.ingredientPrice.create({
        data: {
          ingredientId: ingredient.id,
          restaurantId: null,
          priceBrl: item.priceBrl,
          quantity: item.quantity,
          unit: item.priceUnit,
          source: PriceSource.seed,
        },
      });
    }
  }

  console.log(`✅ Seed concluído: ${INGREDIENTS.length} ingredientes com preços baseline.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
