
import React from "react";

interface InsightDisplayProps {
  insight: string;
}

const InsightDisplay: React.FC<InsightDisplayProps> = ({ insight }) => {
  return (
    <div className="mt-4 text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
        Key Insight:
      </p>
      <p 
        className="text-gray-600 dark:text-gray-400" 
        dangerouslySetInnerHTML={{ __html: insight }}
      />
    </div>
  );
};

export default InsightDisplay;
