
import { useState, useEffect, useCallback } from 'react';
import { Medication } from '@/types/medication';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { medicationService } from '@/services/medicationService';
import { getDemoMedications } from '@/data/mockMedications';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFetched, setIsFetched] = useState(false); // Add a flag to track if data has been fetched
  const { user } = useAuth();

  // Use useCallback to prevent unnecessary recreation of this function
  const fetchMedications = useCallback(async () => {
    // Skip fetching if we've already fetched the data once
    if (isFetched) return;
    
    try {
      setIsLoading(true);
      
      // For demo purposes, if there's no authenticated user, return demo data
      if (!user) {
        const demoMedications = getDemoMedications();
        setMedications(demoMedications);
        setError(null);
      } else {
        const data = await medicationService.fetchMedications(user.id);
        setMedications(data);
        setError(null);
      }
      
      // Mark data as fetched
      setIsFetched(true);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));
    } finally {
      setIsLoading(false);
    }
  }, [user, isFetched]); // Include isFetched in the dependencies

  // Force refetch function that bypasses the isFetched check
  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, if there's no authenticated user, return demo data
      if (!user) {
        const demoMedications = getDemoMedications();
        setMedications(demoMedications);
        setError(null);
      } else {
        const data = await medicationService.fetchMedications(user.id);
        setMedications(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

  // Show a notification when in demo mode - only once when component mounts
  useEffect(() => {
    if (!user && !isLoading && medications.length > 0) {
      toast({
        title: "Demo Mode",
        description: "You're viewing demo medications. Sign in to manage your own medications.",
      });
    }
  }, [user, isLoading, medications.length]);

  // Fetch medications ONLY when user changes or component mounts
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    isLoading,
    error,
    addMedication,
    deleteMedication,
    updateMedication,
    refetch
  };
};
