
import React, { useState } from "react";
import { Layout } from "@/components/Layout";

const ProgressJourney = () => {
  const [currentPage, setCurrentPage] = useState("progress");

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Progress Journey</h1>
        <p className="text-gray-500">
          Your weight loss and health journey details will appear here.
        </p>
      </div>
    </Layout>
  );
};

export default ProgressJourney;
