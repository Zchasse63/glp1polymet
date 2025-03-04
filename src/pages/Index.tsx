
import { Layout } from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="flex justify-end p-4">
        <Button asChild className="mb-4">
          <Link to="/progress">View Progress Journey</Link>
        </Button>
      </div>
      <Dashboard />
    </Layout>
  );
};

export default Index;
