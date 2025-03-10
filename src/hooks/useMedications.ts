
import { useState, useEffect } from 'react';
import { Medication } from '@/types/medication';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { medicationService } from '@/services/medicationService';
import { getDemoMedications } from '@/data/mockMedications';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch medications from Supabase or use demo data
  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, if there's no authenticated user, return demo data
      if (!user) {
        const demoMedications = getDemoMedications();
        setMedications(demoMedications);
        setError(null);
        return;
      }

      const data = await medicationService.fetchMedications(user.id);
      setMedications(data);
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
      // For demo purposes, if there's no authenticated user, update local state only
      if (!user) {
        const newMedication = {
          ...medication,
          id: crypto.randomUUID(),
        };
        setMedications((prevMedications) => [newMedication, ...prevMedications]);
        return newMedication;
      }

      const newMedication = await medicationService.addMedication(medication, user.id);

      // Update the local state
      setMedications((prevMedications) => [newMedication, ...prevMedications]);
      return newMedication;
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

      await medicationService.deleteMedication(id);

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
  
  // Update a medication
  const updateMedication = async (id: string, medicationUpdates: Partial<Omit<Medication, 'id'>>) => {
    try {
      // For demo purposes, if there's no authenticated user, update local state only
      if (!user) {
        setMedications((prevMedications) => 
          prevMedications.map(med => 
            med.id === id ? { ...med, ...medicationUpdates } : med
          )
        );
        return;
      }

      const updatedMedication = await medicationService.updateMedication(id, medicationUpdates);

      // Update the local state
      setMedications((prevMedications) => 
        prevMedications.map(med => 
          med.id === id ? updatedMedication : med
        )
      );
    } catch (err) {
      console.error('Error updating medication:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update medication. Please try again.",
      });
      throw err;
    }
  };

  // Show a notification when in demo mode
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Demo Mode",
        description: "You're viewing demo medications. Sign in to manage your own medications.",
      });
    }
  }, [user, isLoading]);

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
    updateMedication,
    refetch: fetchMedications
  };
};
