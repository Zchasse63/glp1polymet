
export type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: string | number;
  totalAmount?: string;
  totalDose?: number;
  unit?: string;
  color: string;
};
