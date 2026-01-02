
import { StageData } from '../types';

// Multipliers by Product ID (Numeric Codes)
// Format: code: { baseFactor, thermal multiplier }
export const PRODUCT_MULTIPLIERS: Record<number, { factor: number; thermal: number }> = {
  // 100s: Roasting
  101: { factor: 1.2, thermal: 0.8 },  // Coffee
  102: { factor: 2.5, thermal: 1.5 },  // Chemicals
  // 200s: Mixing
  201: { factor: 1.8, thermal: 0.5 },  // Pharma
  202: { factor: 1.1, thermal: 0.4 },  // Food
  // 300s: Fermentation
  301: { factor: 0.9, thermal: 0.3 },  // Brewing
  302: { factor: 2.1, thermal: 0.6 },  // Bio-plastics
  // 400s: Extraction
  401: { factor: 1.5, thermal: 0.9 },  // Essential Oils
  402: { factor: 4.2, thermal: 1.8 },  // Lithium
  // 500s: Assembly
  501: { factor: 3.5, thermal: 0.2 },  // Electronics
  502: { factor: 1.3, thermal: 0.1 },  // Packaging
};

export const calculateEmissions = (data: StageData): number => {
  let co2 = 0;
  
  const pCode = data.productCode || 101;
  const multiplier = PRODUCT_MULTIPLIERS[pCode] || { factor: 1.0, thermal: 0.5 };

  // 1. Energy Base Emissions (Default to 0 if not provided, allowing other factors to dominate)
  // Use Number() to safely handle both strings from form inputs and numeric values/defaults
  const energyKwh = Number(data.energyKwh || data.machine_energy || data.hvac_usage || data.idle_energy || 0);
  const energyEmissions = energyKwh * 0.45 * multiplier.factor;
  co2 += energyEmissions;

  // 2. Transport Impact (Commonly in first stages)
  // Use Number() to safely handle both strings from form inputs and numeric values/defaults
  const transportDist = Number(data.transport_dist || data.supply_distance || 0);
  if (transportDist > 0) {
    // Use Number() to safely handle both strings from form inputs and numeric values/defaults
    const transportWeight = Number(data.weight_kg || data.mass_inbound || 1);
    co2 += (transportDist * transportWeight * 0.0001); // Simplified g/km/kg factor
  }

  // 3. Thermal Processing Impact
  // Use Number() to safely handle both strings from form inputs and numeric values/defaults
  const targetTemp = Number(data.targetTemp || data.sterilization_temp || 0);
  if (targetTemp > 20) {
    const heatFactor = (targetTemp - 20) * 0.02 * multiplier.thermal;
    co2 += heatFactor;
  }

  // 4. Waste/Scrap Penalties
  // Use Number() to safely handle both strings from form inputs and numeric values/defaults
  const scrapRate = Number(data.scrap_rate || 0);
  if (scrapRate > 0) {
    co2 *= (1 + (scrapRate / 100));
  }

  // 5. Efficiency Correction (The envScore field)
  // FIX: Using Number() instead of parseFloat() because envScore is typed as a number in BaseData,
  // and passing a number to parseFloat() causes a TypeScript error in strict environments.
  const envScore = Number(data.envScore || 80);
  if (envScore < 70) co2 *= 1.15;
  else if (envScore > 90) co2 *= 0.90;

  return parseFloat(co2.toFixed(2));
};

export const getEfficiencyScore = (totalEmissions: number): number => {
    const score = Math.max(0, 100 - (totalEmissions / 5));
    return Math.round(score);
}
