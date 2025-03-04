
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Line, 
  LineChart, 
  XAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { ChevronRightIcon, LayoutDashboard, PillIcon } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WeightDataPoint = {
  date: string;
  weight: number;
};

type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: string;
  totalAmount: string;
  color: string;
};

type WeightProgressProps = {
  weightData: WeightDataPoint[];
  isLoaded: boolean;
  onViewDetails: () => void;
};

// Example medication data to overlay
const medicationData = [
  {
    id: "ozempic",
    name: "Ozempic",
    dose: "0.5mg",
    doseHistory: [
      { date: "Jan 1", level: 65 },
      { date: "Jan 15", level: 80 },
      { date: "Feb 1", level: 75 },
      { date: "Feb 15", level: 85 },
      { date: "Mar 1", level: 78 },
      { date: "Mar 15", level: 90 },
      { date: "Apr 1", level: 85 },
    ],
    color: "hsl(var(--chart-1))",
  },
  {
    id: "mounjaro",
    name: "Mounjaro",
    dose: "5mg",
    doseHistory: [
      { date: "Jan 1", level: 45 },
      { date: "Jan 15", level: 60 },
      { date: "Feb 1", level: 50 },
      { date: "Feb 15", level: 70 },
      { date: "Mar 1", level: 65 },
      { date: "Mar 15", level: 75 },
      { date: "Apr 1", level: 70 },
    ],
    color: "hsl(var(--chart-2))",
  },
];

export const WeightProgress = ({ weightData, isLoaded, onViewDetails }: WeightProgressProps) => {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showAllMedications, setShowAllMedications] = useState(false);

  // Merge weight data with medication data for display
  const combinedData = weightData.map(weight => {
    const result: any = { ...weight };
    
    medicationData.forEach(med => {
      // Find matching date entry
      const matchingDose = med.doseHistory.find(dose => dose.date === weight.date);
      if (matchingDose) {
        result[med.id] = matchingDose.level;
      }
    });
    
    return result;
  });

  const toggleMedication = (medicationId: string) => {
    setSelectedMedications(prev => {
      if (prev.includes(medicationId)) {
        return prev.filter(id => id !== medicationId);
      } else {
        return [...prev, medicationId];
      }
    });
    // If we're adding a medication, turn off "all" view
    if (!selectedMedications.includes(medicationId)) {
      setShowAllMedications(false);
    }
  };

  const toggleAllMedications = () => {
    const newShowAll = !showAllMedications;
    setShowAllMedications(newShowAll);
    
    // If turning on "all", select all medications
    if (newShowAll) {
      setSelectedMedications(medicationData.map(med => med.id));
    } else {
      setSelectedMedications([]);
    }
  };

  // Determine which medications to display
  const medicationsToShow = showAllMedications 
    ? medicationData 
    : medicationData.filter(med => selectedMedications.includes(med.id));

  return (
    <section 
      className={`opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Weight Progress
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PillIcon className="h-4 w-4" />
                    <span>Overlay</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={showAllMedications}
                    onCheckedChange={toggleAllMedications}
                  >
                    Show All Medications
                  </DropdownMenuCheckboxItem>
                  
                  {medicationData.map(med => (
                    <DropdownMenuCheckboxItem
                      key={med.id}
                      checked={selectedMedications.includes(med.id)}
                      onCheckedChange={() => toggleMedication(med.id)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: med.color }}
                        ></div>
                        {med.name} {med.dose}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:bg-primary/5"
                onClick={onViewDetails}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                -18 lbs
              </div>
              <div className="text-sm text-muted-foreground">
                Since starting GLP-1
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">
                192 lbs
              </div>
              <div className="text-sm text-muted-foreground">
                Current weight
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                  </linearGradient>
                  {medicationData.map((med) => (
                    <linearGradient key={`${med.id}Gradient`} id={`${med.id}Gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={med.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={med.color} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.2)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickMargin={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  tickMargin={10}
                  yAxisId="weight"
                  domain={['auto', 'auto']}
                />
                {medicationsToShow.length > 0 && (
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    tickMargin={10}
                    yAxisId="medication"
                    orientation="right"
                    domain={[0, 100]}
                    label={{ value: 'Medication %', angle: -90, position: 'insideRight' }}
                  />
                )}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'weight') return [`${value} lbs`, 'Weight'];
                    
                    // Find the medication name by ID
                    const medication = medicationData.find(med => med.id === name);
                    return [`${value}%`, medication?.name || name];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                
                {medicationsToShow.length > 0 && <Legend />}
                
                <Line
                  type="monotone"
                  dataKey="weight"
                  yAxisId="weight"
                  name="Weight"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "hsl(var(--chart-1))" }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                  connectNulls
                />
                
                {medicationsToShow.map((med) => (
                  <Line
                    key={med.id}
                    type="monotone"
                    dataKey={med.id}
                    yAxisId="medication"
                    name={med.name}
                    stroke={med.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: med.color }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                    connectNulls
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WeightProgress;
