
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Medication } from '@/pages/MedicationPage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

      setMedications(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new medication
  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      // Generate a UUID on the client side
      const newMedication = {
        ...medication,
        id: crypto.randomUUID(),
      };

      // For demo purposes, if there's no authenticated user, update local state only
      if (!user) {
        setMedications((prevMedications) => [newMedication, ...prevMedications]);
        return newMedication;
      }

      const { data, error } = await supabase
        .from('medications')
        .insert(newMedication)
        .select()
        .single();

      if (error) throw error;

      // Update the local state
      setMedications((prevMedications) => [data, ...prevMedications]);
      return data;
    } catch (err) {
      console.error('Error adding medication:', err);
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
