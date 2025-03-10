
import { supabase } from '@/lib/supabase';
import { Medication } from '@/types/medication';
import { ErrorLogger } from '@/utils/errorHandling';

/**
 * Transform database medication data to application format
 */
export const transformMedicationData = (dbMedication: any): Medication => ({
  id: dbMedication.id,
  name: dbMedication.name,
  dose: dbMedication.dose,
  frequency: dbMedication.frequency,
  lastTaken: dbMedication.last_taken,
  nextDose: dbMedication.next_dose,
  level: dbMedication.level,
  totalDose: dbMedication.total_dose,
  unit: dbMedication.unit,
  color: dbMedication.color
});

/**
 * Transform application medication data to database format
 */
export const transformMedicationForDb = (medication: Omit<Medication, 'id'>, userId?: string) => ({
  name: medication.name,
  dose: medication.dose,
  frequency: medication.frequency,
  last_taken: medication.lastTaken,
  next_dose: medication.nextDose,
  level: medication.level,
  total_dose: medication.totalDose,
  unit: medication.unit,
  color: medication.color,
  user_id: userId
});

/**
 * Service for handling medication-related database operations
 */
export const medicationService = {
  /**
   * Fetch all medications for a user
   */
  fetchMedications: async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert data from database format to application format
      return (data || []).map(transformMedicationData);
    } catch (err) {
      console.error('Error fetching medications:', err);
      ErrorLogger.error('Failed to fetch medications', 'FETCH_MEDICATIONS_ERROR', { component: 'medicationService' }, err);
      throw err;
    }
  },

  /**
   * Add a new medication
   */
  addMedication: async (medication: Omit<Medication, 'id'>, userId?: string) => {
    try {
      const dbMedication = transformMedicationForDb(medication, userId);

      const { data, error } = await supabase
        .from('medications')
        .insert(dbMedication)
        .select()
        .single();

      if (error) throw error;

      return transformMedicationData(data);
    } catch (err) {
      console.error('Error adding medication:', err);
      ErrorLogger.error('Failed to add medication', 'ADD_MEDICATION_ERROR', { component: 'medicationService' }, err);
      throw err;
    }
  },

  /**
   * Delete a medication by ID
   */
  deleteMedication: async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error deleting medication:', err);
      ErrorLogger.error('Failed to delete medication', 'DELETE_MEDICATION_ERROR', { component: 'medicationService', medicationId: id }, err);
      throw err;
    }
  }
};
