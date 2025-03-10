
import React from "react";
import { MedicationPageContent } from "./components/MedicationPageContent";
import { Layout } from "@/components/Layout";

const MedicationPage = () => {
  const [currentPage, setCurrentPage] = React.useState("medication");

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <MedicationPageContent />
    </Layout>
  );
};

export default MedicationPage;
