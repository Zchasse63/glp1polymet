
import { supabase } from '@/lib/supabase';
import { Medication } from '@/types/medication';
import { ErrorLogger } from '@/utils/errorHandling';
import { getDemoMedications } from '@/data/mockMedications';

// Transform functions stay the same
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

export const transformMedicationForDb = (medication: Omit<Medication, 'id'>, userId?: string) => ({
  name: medication.name,
  dose: medication.dose,
  frequency: medication.frequency,
  last_taken: medication.lastTaken,
  next_dose: medication.nextDose,
  level: typeof medication.level === 'string' ? parseInt(medication.level as string) : medication.level,
  total_dose: medication.totalDose,
  unit: medication.unit,
  color: medication.color,
  user_id: userId
});

export const medicationService = {
  fetchMedications: async (userId?: string) => {
    try {
      // For demo mode or no userId, return mock data
      if (!userId || userId === 'demo-user-id') {
        return getDemoMedications();
      }

      let query = supabase.from('medications').select('*');
      
      // Only filter by user_id if we have a real UUID
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(transformMedicationData);
    } catch (err) {
      console.error('Error fetching medications:', err);
      ErrorLogger.error('Failed to fetch medications', 'FETCH_MEDICATIONS_ERROR', { component: 'medicationService' }, err);
      // Return demo medications as fallback in case of error
      return getDemoMedications();
    }
  },

  addMedication: async (medication: Omit<Medication, 'id'>, userId?: string) => {
    try {
      // In demo mode, just return a mock response
      if (!userId || userId === 'demo-user-id') {
        const mockMedication = {
          ...medication,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };
        return transformMedicationData(mockMedication);
      }

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

  deleteMedication: async (id: string, userId?: string) => {
    try {
      // In demo mode, just return success
      if (!userId || userId === 'demo-user-id') {
        return true;
      }

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error deleting medication:', err);
      ErrorLogger.error('Failed to delete medication', 'DELETE_MEDICATION_ERROR', { component: 'medicationService', medicationId: id }, err);
      throw err;
    }
  },
  
  updateMedication: async (id: string, medication: Partial<Omit<Medication, 'id'>>, userId?: string) => {
    try {
      // In demo mode, just return the updated medication
      if (!userId || userId === 'demo-user-id') {
        const mockMedication = {
          id,
          ...medication,
          updated_at: new Date().toISOString()
        };
        return transformMedicationData(mockMedication);
      }

      const updates: any = {};
      
      if (medication.name) updates.name = medication.name;
      if (medication.dose) updates.dose = medication.dose;
      if (medication.frequency) updates.frequency = medication.frequency;
      if (medication.lastTaken) updates.last_taken = medication.lastTaken;
      if (medication.nextDose) updates.next_dose = medication.nextDose;
      if (medication.level !== undefined) {
        updates.level = typeof medication.level === 'string' 
          ? parseInt(medication.level as string) 
          : medication.level;
      }
      if (medication.totalDose !== undefined) updates.total_dose = medication.totalDose;
      if (medication.unit) updates.unit = medication.unit;
      if (medication.color) updates.color = medication.color;
      
      const { data, error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return transformMedicationData(data);
    } catch (err) {
      console.error('Error updating medication:', err);
      ErrorLogger.error('Failed to update medication', 'UPDATE_MEDICATION_ERROR', { component: 'medicationService', medicationId: id }, err);
      throw err;
    }
  }
};

