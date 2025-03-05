
import React from 'react';
import { Info } from 'lucide-react';

/**
 * Component displayed when there are no significant correlations
 */
const NoSignificantCorrelations: React.FC = () => {
  return (
    <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
      <p className="flex items-center gap-1">
        <Info className="h-3 w-3" />
        No strong correlations detected yet. Continue tracking for more accurate insights.
      </p>
    </div>
  );
};

export default NoSignificantCorrelations;
