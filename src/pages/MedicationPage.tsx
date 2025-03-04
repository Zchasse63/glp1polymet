
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { MedicationCard } from "@/components/MedicationCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const MedicationPage = () => {
  const [currentPage, setCurrentPage] = useState("medication");
  
  const medications = [
    {
      id: "med1",
      name: "Ozempic",
      dose: "0.5mg",
      frequency: "Once weekly",
      lastTaken: "Today",
      nextDose: "In 7 days",
      level: 95,
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
      color: "#f59e0b",
    },
  ];

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Medications</h1>
          <Button className="rounded-full">
            <PlusIcon className="h-5 w-5 mr-1" /> Add New
          </Button>
        </div>

        <div className="space-y-3">
          {medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MedicationPage;
