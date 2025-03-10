
import { Medication } from '@/types/medication';

/**
 * Demo medications for when a user is not authenticated
 */
export const getDemoMedications = (): Medication[] => [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Ozempic",
    dose: "0.5mg",
    frequency: "Once weekly",
    lastTaken: "Today",
    nextDose: "In 7 days",
    level: 95,
    totalDose: 0.5,
    unit: "mg",
    color: "#4f46e5",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Metformin",
    dose: "500mg",
    frequency: "Twice daily",
    lastTaken: "4 hours ago",
    nextDose: "In 8 hours",
    level: 80,
    totalDose: 500,
    unit: "mg",
    color: "#0ea5e9",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Vitamin D",
    dose: "2000 IU",
    frequency: "Once daily",
    lastTaken: "Yesterday",
    nextDose: "Today",
    level: 60,
    totalDose: 2000,
    unit: "IU",
    color: "#f59e0b",
  },
];
