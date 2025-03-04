
import React from "react";
import { Layout } from "@/components/Layout";
import Insights from "@/components/Insights";

const InsightsPage = () => {
  const [currentPage, setCurrentPage] = React.useState("insights");

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Insights />
    </Layout>
  );
};

export default InsightsPage;
