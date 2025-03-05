
/**
 * InsightsPage
 * 
 * Page component for displaying health insights following CodeFarm principles:
 * - Holistic Development: Integrates insights into the overall app architecture
 * - User-Centric Design: Proper layout and navigation for health insights
 * - Sustainable Code: Clear separation between page structure and content
 */
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import Insights from "@/components/Insights";
import { Helmet } from "react-helmet-async";

const InsightsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("insights");

  return (
    <>
      <Helmet>
        <title>Your Insights | HealthTracker</title>
        <meta name="description" content="View personalized health insights and recommendations based on your data" />
      </Helmet>
      
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <div className="px-4 py-6 md:px-6 max-w-4xl mx-auto">
          <Insights />
        </div>
      </Layout>
    </>
  );
};

export default InsightsPage;
