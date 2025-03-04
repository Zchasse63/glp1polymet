
/**
 * Utility function to convert weight between different units (lbs and kg)
 */
export const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === "lbs" && toUnit === "kg") return weight * 0.45359237;
  if (fromUnit === "kg" && toUnit === "lbs") return weight * 2.20462262;
  return weight;
};

/**
 * Get weight in the specified display unit
 */
export const getWeightInDisplayUnit = (weight: number, unit: string, displayUnit: string): number => {
  return convertWeight(weight, unit, displayUnit);
};
