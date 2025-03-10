
import { Medication } from '@/types/medication';

export const getDemoMedications = (): Medication[] => [
  {
    id: '1',
    name: 'Metformin',
    dose: '500mg',
    frequency: 'Twice daily',
    lastTaken: '2 hours ago',
    nextDose: 'In 4 hours',
    level: 75,
    totalDose: 100,
    unit: 'mg',
    color: '#4f46e5'
  },
  {
    id: '2',
    name: 'Ozempic',
    dose: '0.25mg',
    frequency: 'Once weekly',
    lastTaken: '3 days ago',
    nextDose: 'In 4 days',
    level: 80,
    totalDose: 100,
    unit: 'mg',
    color: '#0ea5e9'
  },
  {
    id: '3',
    name: 'Vitamin D3',
    dose: '2000 IU',
    frequency: 'Daily',
    lastTaken: 'Today',
    nextDose: 'Tomorrow',
    level: 90,
    totalDose: 100,
    unit: 'IU',
    color: '#f59e0b'
  }
];
