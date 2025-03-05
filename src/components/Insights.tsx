
import React from "react";
import InsightsHeader from "./insights/InsightsHeader";
import WeeklyProgressSummary from "./insights/WeeklyProgressSummary";
import PersonalizedRecommendations from "./insights/PersonalizedRecommendations";
import WeightLossCorrelations from "./insights/WeightLossCorrelations";

const Insights = () => {
  return (
    <div className="p-4 md:p-5 space-y-6 md:space-y-8">
      <InsightsHeader />
      <WeeklyProgressSummary />
      <PersonalizedRecommendations />
      <WeightLossCorrelations />
    </div>
  );
};

export default Insights;
