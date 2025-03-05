
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibleLabel, useReducedMotion } from "@/utils/accessibilityUtils";
import { motion } from "framer-motion";
import WeightSummary from "./tabs/weight/WeightSummary";

interface HealthSummaryProps {
  startWeight: number;
  currentWeight: number;
  displayUnit: "lbs" | "kg";
  bmi?: number;
  bodyFatPercentage?: number;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({
  startWeight,
  currentWeight,
  displayUnit,
  bmi,
  bodyFatPercentage
}) => {
  // Calculate summary data
  const weightLoss = startWeight - currentWeight;
  const percentageLoss = (weightLoss / startWeight) * 100;
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();
  
  // Determine status based on weight loss
  const getHealthStatus = () => {
    if (weightLoss <= 0) return "Maintaining";
    if (percentageLoss < 5) return "Starting";
    if (percentageLoss < 10) return "Progressing";
    return "Succeeding";
  };
  
  const healthStatus = getHealthStatus();
  
  // Set animation based on user preferences
  const animations = prefersReducedMotion 
    ? { initial: {}, animate: {} } 
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };
  
  return (
    <motion.div {...animations}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Your Health Summary</span>
            <span 
              className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
              aria-label={`Current status: ${healthStatus}`}
            >
              {healthStatus}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section aria-labelledby="weight-summary-heading">
              <h3 id="weight-summary-heading" className="sr-only">Weight Summary</h3>
              <WeightSummary
                startWeight={startWeight}
                currentWeight={currentWeight}
                weightLoss={weightLoss}
                percentageLoss={percentageLoss}
                displayUnit={displayUnit}
              />
            </section>
            
            {(bmi || bodyFatPercentage) && (
              <section aria-labelledby="body-composition-heading" className="pt-4 border-t">
                <h3 id="body-composition-heading" className="text-sm font-medium mb-3">Body Composition</h3>
                <div className="grid grid-cols-2 gap-4">
                  {bmi && (
                    <div>
                      <AccessibleLabel htmlFor="bmi-value">BMI</AccessibleLabel>
                      <p id="bmi-value" className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                    </div>
                  )}
                  
                  {bodyFatPercentage && (
                    <div>
                      <AccessibleLabel htmlFor="body-fat-value">Body Fat</AccessibleLabel>
                      <p id="body-fat-value" className="text-2xl font-bold">{bodyFatPercentage.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthSummary;
