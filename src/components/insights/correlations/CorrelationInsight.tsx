
import React from 'react';

interface CorrelationInsightProps {
  insight: string | null;
}

/**
 * Component to display the text insight about correlations
 */
const CorrelationInsight: React.FC<CorrelationInsightProps> = ({ insight }) => {
  if (!insight) return null;
  
  return (
    <div className="mb-4 p-3 bg-primary/10 rounded-md">
      <p dangerouslySetInnerHTML={{ __html: insight }} />
    </div>
  );
};

export default CorrelationInsight;
