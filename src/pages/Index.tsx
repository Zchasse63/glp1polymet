
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Dashboard />
    </Layout>
  );
};

export default Index;
