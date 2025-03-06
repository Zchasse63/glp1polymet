
import { useState, useEffect } from 'react';

// Define the default medications to show on dashboard
const DEFAULT_MEDICATIONS = ['ozempic', 'mounjaro'];
const STORAGE_KEY = 'dashboard-medications';
const MAX_MEDICATIONS = 2; // Maximum number of medications on dashboard

export const useMedicationPreferences = () => {
  // Initialize with either stored preferences or defaults
  const [selectedMedications, setSelectedMedications] = useState<string[]>(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    return savedPreferences ? JSON.parse(savedPreferences) : DEFAULT_MEDICATIONS;
  });

  // Store preferences whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedMedications));
  }, [selectedMedications]);

  // Toggle a medication's selection status
  const toggleMedication = (medicationId: string) => {
    setSelectedMedications(prev => {
      // If already selected, remove it
      if (prev.includes(medicationId)) {
        return prev.filter(id => id !== medicationId);
      }
      
      // If not selected and under limit, add it
      if (prev.length < MAX_MEDICATIONS) {
        return [...prev, medicationId];
      }
      
      // If at limit, replace the first one (oldest)
      return [...prev.slice(1), medicationId];
    });
  };

  return {
    selectedMedications,
    toggleMedication,
    MAX_MEDICATIONS
  };
};
