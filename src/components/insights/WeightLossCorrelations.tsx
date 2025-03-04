
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WeightLossCorrelations = () => {
  // Sample correlation data
  const correlationData = [
    { factor: "Medication Adherence", correlation: 0.85 },
    { factor: "Protein Intake", correlation: 0.72 },
    { factor: "Sleep Quality", correlation: 0.68 },
    { factor: "Step Count", correlation: 0.65 },
    { factor: "Stress Level", correlation: -0.58 },
    { factor: "Carb Intake", correlation: -0.45 },
  ];
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Weight Loss Correlations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p
          className="text-sm text-gray-500 dark:text-gray-400 mb-4"
        >
          Factors most strongly correlated with your weight loss success
        </p>

        <div className="space-y-3">
          {correlationData.map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="w-40 text-sm">
                {item.factor}
              </div>
              <div
                className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-r-full ${
                    item.correlation > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.abs(item.correlation) * 100}%`,
                  }}
                ></div>
              </div>
              <div
                className="w-12 text-right text-sm font-medium"
              >
                {item.correlation > 0 ? "+" : ""}
                {Math.round(item.correlation * 100)}%
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            <span
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Key Insight:
            </span>{" "}
            Your weight loss is most strongly correlated with medication
            adherence and protein intake.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightLossCorrelations;
