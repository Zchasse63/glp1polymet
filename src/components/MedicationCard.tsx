import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PillIcon, ClockIcon, CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface MedicationProps {
  medication: {
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
  };
}

export function MedicationCard({ medication }: MedicationProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Calculate the remaining amount in proper units
  const unit = medication.unit || "mg";
  const totalDose = medication.totalDose || 100;
  const remainingAmount = Math.round((medication.level / 100) * totalDose);

  // Generate demo adherence data
  const adherenceData = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    adherence: Math.min(100, Math.max(0, medication.level + (Math.random() * 20 - 10)))
  }));

  return (
    <>
      <Card 
        className="overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${medication.color}20` }}
              >
                <PillIcon
                  className="h-5 w-5"
                  style={{ color: medication.color }}
                />
              </div>
              <div>
                <h3 className="font-medium">
                  {medication.name}
                </h3>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {medication.dose} • {medication.frequency}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {remainingAmount} {unit}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Remaining
              </p>
            </div>
          </div>

          <Progress
            value={medication.level}
            className="h-2 mb-3"
            style={
              {
                backgroundColor: `${medication.color}20`,
                "--progress-background": medication.color,
              } as React.CSSProperties
            }
          />

          <div className="flex justify-between text-xs">
            <div
              className="flex items-center text-gray-500 dark:text-gray-400"
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              Last taken: {medication.lastTaken}
            </div>
            <div
              className="flex items-center text-gray-500 dark:text-gray-400"
            >
              <ClockIcon className="h-3 w-3 mr-1" />
              Next dose: {medication.nextDose}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${medication.color}15` }}
              >
                <PillIcon
                  className="h-4 w-4"
                  style={{ color: medication.color }}
                />
              </div>
              {medication.name} Details
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Current Level</div>
                  <div className="text-lg font-semibold mt-1">
                    {remainingAmount} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Last Taken</div>
                  <div className="text-lg font-semibold mt-1">
                    {medication.lastTaken}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Next Dose</div>
                  <div className="text-lg font-semibold mt-1">
                    {medication.nextDose}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <h3 className="text-sm font-medium mb-2">Adherence History</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adherenceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        fontSize={11}
                        tickMargin={5}
                      />
                      <YAxis 
                        fontSize={11}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Adherence']}
                        labelStyle={{ fontSize: 12 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="adherence" 
                        stroke={medication.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Medication Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-muted-foreground">Dose:</div>
                <div>{medication.dose}</div>
                <div className="text-muted-foreground">Frequency:</div>
                <div>{medication.frequency}</div>
                <div className="text-muted-foreground">Total Amount:</div>
                <div>{totalDose} {unit}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
