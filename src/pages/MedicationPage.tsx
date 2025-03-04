
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { MedicationCard } from "@/components/MedicationCard";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, BarChart } from "lucide-react";
import { AddMedicationForm } from "@/components/AddMedicationForm";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define the medication type
export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: number;
  totalDose?: number;
  unit?: string;
  color: string;
}

const generateRandomColor = () => {
  const colors = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const MedicationPage = () => {
  const [currentPage, setCurrentPage] = useState("medication");
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
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
  ]);
  const { toast } = useToast();

  // Sample trend data for medication effectiveness chart
  const trendData = [
    { date: "Week 1", weight: 210, medication: 80 },
    { date: "Week 2", weight: 208, medication: 85 },
    { date: "Week 3", weight: 207, medication: 90 },
    { date: "Week 4", weight: 205, medication: 85 },
    { date: "Week 5", weight: 203, medication: 90 },
    { date: "Week 6", weight: 200, medication: 95 },
    { date: "Week 7", weight: 198, medication: 90 },
    { date: "Week 8", weight: 195, medication: 95 },
  ];

  const handleAddMedication = (data: { name: string; dose: string; frequency: string; unit?: string; totalDose?: number }) => {
    try {
      const newMedication: Medication = {
        id: `med${medications.length + 1}`,
        name: data.name,
        dose: data.dose,
        frequency: data.frequency,
        lastTaken: "Not taken yet",
        nextDose: "Take now",
        level: 100,
        totalDose: data.totalDose || parseInt(data.dose) || 100,
        unit: data.unit || (data.dose.includes("mg") ? "mg" : "units"),
        color: generateRandomColor(),
      };

      setMedications([...medications, newMedication]);
      setIsAddingMedication(false);
      
      toast({
        title: "Success",
        description: `${data.name} has been added to your medications.`,
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
      });
    }
  };

  const handleDeleteMedication = (id: string) => {
    try {
      const medicationToDelete = medications.find(med => med.id === id);
      setMedications(medications.filter(med => med.id !== id));
      
      toast({
        title: "Medication removed",
        description: `${medicationToDelete?.name || 'Medication'} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove medication. Please try again.",
      });
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Medications</h1>
          <Button 
            className="rounded-full" 
            onClick={() => setIsAddingMedication(true)}
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add New
          </Button>
        </div>

        {medications.length > 0 ? (
          <div className="space-y-3">
            {medications.map((medication) => (
              <div key={medication.id} className="relative group">
                <MedicationCard medication={medication} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  onClick={() => handleDeleteMedication(medication.id)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No medications added yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddingMedication(true)}
            >
              Add Your First Medication
            </Button>
          </div>
        )}

        {/* Medication Effectiveness Chart */}
        <Card className="border border-gray-200 dark:border-gray-700 mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Medication Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[250px] w-full">
              <ChartContainer
                config={{}}
                className="aspect-[none] h-[250px]"
              >
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />

                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 6 }}
                    name="Weight (lbs)"
                    radius={4}
                    fill="url(#colorWeight)"
                    fillOpacity={0.2}
                  />

                  <Line
                    type="monotone"
                    dataKey="medication"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                    activeDot={{ r: 6 }}
                    name="Medication Level (%)"
                    radius={4}
                    fill="url(#colorMed)"
                    fillOpacity={0.2}
                  />
                  
                  {/* Add gradient fills */}
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ChartContainer>
            </div>

            <div className="mt-4 text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Analysis:
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Your weight loss shows a strong correlation with medication
                levels. Periods with higher medication adherence show accelerated
                weight loss.
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your medication below.
              </DialogDescription>
            </DialogHeader>
            <AddMedicationForm 
              onSubmit={handleAddMedication} 
              onCancel={() => setIsAddingMedication(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MedicationPage;
