
import React from 'react';

/**
 * Component displayed when there are no correlations data
 */
const NoCorrelationsState: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <p className="text-muted-foreground">
        Not enough data to analyze correlations.
        <br />
        Continue tracking your health metrics to see what affects your progress.
      </p>
    </div>
  );
};

export default NoCorrelationsState;
