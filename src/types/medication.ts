
/**
 * Medication Types
 * 
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Modularity: Separation of concerns
 */

/**
 * Medication frequency options
 */
export type MedicationFrequency = 
  | 'daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'as_needed';

/**
 * Medication unit options
 */
export type MedicationUnit = 
  | 'mg'
  | 'g'
  | 'mcg'
  | 'mL'
  | 'L'
  | 'IU'
  | 'tablet'
  | 'capsule'
  | 'dose'
  | 'other';

/**
 * Medication route options
 */
export type MedicationRoute = 
  | 'oral'
  | 'topical'
  | 'injection'
  | 'inhalation'
  | 'rectal'
  | 'vaginal'
  | 'ophthalmic'
  | 'otic'
  | 'nasal'
  | 'other';

/**
 * Medication categories
 */
export type MedicationCategory = 
  | 'antidiabetic'
  | 'weightLoss'
  | 'antihypertensive'
  | 'cholesterol'
  | 'antibiotic'
  | 'antiinflammatory'
  | 'antidepressant'
  | 'antiallergy'
  | 'vitamin'
  | 'supplement'
  | 'painkiller'
  | 'other';

/**
 * Medication adherence status
 */
export type AdherenceStatus = 'taken' | 'missed' | 'late' | 'scheduled';

/**
 * Complete medication information
 */
export interface Medication {
  /** Unique identifier */
  id: string;
  /** Name of medication */
  name: string;
  /** Medication strength */
  dosage: number;
  /** Unit of measurement */
  unit: MedicationUnit;
  /** How often medication should be taken */
  frequency: MedicationFrequency;
  /** Route of administration */
  route: MedicationRoute;
  /** Category or type of medication */
  category: MedicationCategory;
  /** Special instructions */
  instructions?: string;
  /** Prescribing doctor */
  prescribedBy?: string;
  /** Date prescribed */
  prescribedDate?: string;
  /** Date to start taking */
  startDate: string;
  /** Date to stop taking (if applicable) */
  endDate?: string;
  /** Associated condition */
  condition?: string;
  /** Any notes about this medication */
  notes?: string;
  /** Custom color for UI */
  color?: string;
}

/**
 * Medication log entry
 */
export interface MedicationLog {
  /** Unique identifier */
  id: string;
  /** Reference to medication */
  medicationId: string;
  /** When medication was taken or missed */
  timestamp: string;
  /** Whether medication was taken */
  status: AdherenceStatus;
  /** Any notes about this dose */
  notes?: string;
  /** Side effects experienced */
  sideEffects?: string[];
  /** How user felt after taking (1-5) */
  effectiveness?: number;
}

/**
 * Medication schedule
 */
export interface MedicationSchedule {
  /** Reference to medication */
  medicationId: string;
  /** Scheduled time(s) in 24h format (HH:MM) */
  times: string[];
  /** Days of week (0-6, starting Sunday) */
  daysOfWeek?: number[];
  /** Whether to send reminders */
  reminderEnabled: boolean;
  /** Minutes before scheduled time to send reminder */
  reminderMinutesBefore?: number;
}

/**
 * Medication adherence statistics
 */
export interface MedicationAdherenceStats {
  /** Medication identifier */
  medicationId: string;
  /** Medication name */
  medicationName: string;
  /** Total doses */
  totalDoses: number;
  /** Doses taken */
  takenDoses: number;
  /** Doses missed */
  missedDoses: number;
  /** Adherence percentage */
  adherencePercentage: number;
  /** Current streak of taken doses */
  currentStreak: number;
  /** Best streak ever achieved */
  bestStreak: number;
}
