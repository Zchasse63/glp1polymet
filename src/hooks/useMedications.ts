
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Medication } from '@/pages/MedicationPage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorLogger } from '@/utils/errorHandling';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch medications from Supabase
  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, if there's no authenticated user, return demo data
      if (!user) {
        const demoMedications: Medication[] = [
          {
            id: "med1",
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
            id: "med2",
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
            id: "med3",
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
        setMedications(demoMedications);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert data from database format to application format
      const formattedData = data?.map(item => ({
        id: item.id,
        name: item.name,
        dose: item.dose,
        frequency: item.frequency,
        lastTaken: item.last_taken,
        nextDose: item.next_dose,
        level: item.level,
        totalDose: item.total_dose,
        unit: item.unit,
        color: item.color
      })) || [];

      setMedications(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));
      
      // Log the error to our error tracking system
      ErrorLogger.error(
        'Failed to fetch medications', 
        'FETCH_MEDICATIONS_ERROR',
        { component: 'useMedications' },
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new medication
  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      // Format the medication data for database storage
      const dbMedication = {
        name: medication.name,
        dose: medication.dose,
        frequency: medication.frequency,
        last_taken: medication.lastTaken,
        next_dose: medication.nextDose,
        level: medication.level,
        total_dose: medication.totalDose,
        unit: medication.unit,
        color: medication.color,
        user_id: user?.id
      };

      // For demo purposes, if there's no authenticated user, update local state only
      if (!user) {
        const newMedication = {
          ...medication,
          id: crypto.randomUUID(),
        };
        setMedications((prevMedications) => [newMedication, ...prevMedications]);
        return newMedication;
      }

      const { data, error } = await supabase
        .from('medications')
        .insert(dbMedication)
        .select()
        .single();

      if (error) throw error;

      // Convert the returned data to application format
      const newMedication: Medication = {
        id: data.id,
        name: data.name,
        dose: data.dose,
        frequency: data.frequency,
        lastTaken: data.last_taken,
        nextDose: data.next_dose,
        level: data.level,
        totalDose: data.total_dose,
        unit: data.unit,
        color: data.color
      };

      // Update the local state
      setMedications((prevMedications) => [newMedication, ...prevMedications]);
      return newMedication;
    } catch (err) {
      console.error('Error adding medication:', err);
      
      // Log the error to our error tracking system
      ErrorLogger.error(
        'Failed to add medication', 
        'ADD_MEDICATION_ERROR',
        { component: 'useMedications' },
        err
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
      });
      throw err;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: string) => {
    try {
      // For demo purposes, if there's no authenticated user, update local state only
      if (!user) {
        setMedications((prevMedications) => 
          prevMedications.filter(med => med.id !== id)
        );
        return;
      }

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the local state
      setMedications((prevMedications) => 
        prevMedications.filter(med => med.id !== id)
      );
    } catch (err) {
      console.error('Error deleting medication:', err);
      
      // Log the error to our error tracking system
      ErrorLogger.error(
        'Failed to delete medication', 
        'DELETE_MEDICATION_ERROR',
        { component: 'useMedications', medicationId: id },
        err
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete medication. Please try again.",
      });
      throw err;
    }
  };

  // Fetch medications on mount and when user changes
  useEffect(() => {
    fetchMedications();
  }, [user]);

  return {
    medications,
    isLoading,
    error,
    addMedication,
    deleteMedication,
    refetch: fetchMedications
  };
};
