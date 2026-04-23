// Cálculo puro de custo, preço sugerido e margem.
// Sem dependência de Prisma — recebe valores, devolve valores.

export type DishIngredientLine = {
  quantity: number;
  unit: string;
  unitCostBrl: number; // custo por 1 unidade do 'unit'
};

export type CostingResult = {
  totalCostBrl: number;
  suggestedPriceBrl: number;
  marginPct: number;
};

/**
 * Calcula custo total de uma receita e preço sugerido.
 *
 * @param lines Linhas da ficha com quantidade, unidade e custo unitário.
 * @param yieldUnits Quantas unidades a receita rende. Custo total é dividido por isso.
 * @param cmvTarget CMV alvo como decimal. 0.30 = CMV de 30% → preço = custo / 0.30.
 */
export function calculateCosting(
  lines: DishIngredientLine[],
  yieldUnits: number,
  cmvTarget: number,
): CostingResult {
  if (yieldUnits <= 0) throw new Error("yieldUnits deve ser > 0");
  if (cmvTarget <= 0 || cmvTarget >= 1) throw new Error("cmvTarget deve ser entre 0 e 1");

  const totalRecipeCost = lines.reduce((sum, line) => sum + line.quantity * line.unitCostBrl, 0);
  const totalCostBrl = totalRecipeCost / yieldUnits;
  const suggestedPriceBrl = totalCostBrl / cmvTarget;
  const marginPct = ((suggestedPriceBrl - totalCostBrl) / suggestedPriceBrl) * 100;

  return {
    totalCostBrl: round2(totalCostBrl),
    suggestedPriceBrl: round2(suggestedPriceBrl),
    marginPct: round2(marginPct),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
