import { describe, it, expect } from "vitest";
import { calculateCosting } from "../../src/domain/costing.js";

describe("calculateCosting", () => {
  it("calcula custo simples de X-Burger", () => {
    const result = calculateCosting(
      [
        { quantity: 1, unit: "un", unitCostBrl: 1.8 },    // pão brioche
        { quantity: 120, unit: "g", unitCostBrl: 0.042 }, // carne 120g (R$ 42/kg)
        { quantity: 20, unit: "g", unitCostBrl: 0.038 },  // queijo 20g (R$ 38/kg)
        { quantity: 10, unit: "g", unitCostBrl: 0.018 },  // maionese 10g
      ],
      1,
      0.30,
    );
    expect(result.totalCostBrl).toBeCloseTo(7.79, 1);
    expect(result.suggestedPriceBrl).toBeCloseTo(25.97, 1);
    expect(result.marginPct).toBeCloseTo(70, 0);
  });

  it("divide pelo yieldUnits", () => {
    const result = calculateCosting(
      [{ quantity: 1000, unit: "g", unitCostBrl: 0.01 }], // R$ 10 total
      10,
      0.30,
    );
    expect(result.totalCostBrl).toBe(1.0);
    expect(result.suggestedPriceBrl).toBeCloseTo(3.33, 1);
  });

  it("rejeita yieldUnits <= 0", () => {
    expect(() => calculateCosting([], 0, 0.30)).toThrow();
  });

  it("rejeita cmvTarget fora de (0,1)", () => {
    expect(() => calculateCosting([], 1, 0)).toThrow();
    expect(() => calculateCosting([], 1, 1)).toThrow();
  });
});
