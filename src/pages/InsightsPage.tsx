
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import Insights from "@/components/Insights";

const InsightsPage = () => {
  const [currentPage, setCurrentPage] = React.useState("insights");
  
  useEffect(() => {
    // Ensure we set the correct page when this component mounts
    setCurrentPage("insights");
  }, []);

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Insights />
    </Layout>
  );
};

export default InsightsPage;
