
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { HeartIcon, ActivityIcon, BrainIcon } from "lucide-react";
import { 
  Line, 
  LineChart, 
  XAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip, 
  Area
} from "recharts";

interface VitalsTabProps {
  healthMetrics: {
    heartRate: Array<{ date: string; value: number }>;
    bloodPressure: Array<{ date: string; systolic: number; diastolic: number }>;
    glucose: Array<{ date: string; value: number }>;
  };
}

const VitalsTab = ({ healthMetrics }: VitalsTabProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-rose-500" />
              Heart Rate
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">72 bpm</p>
            <p className="text-sm text-muted-foreground">Resting heart rate</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics.heartRate} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} bpm`, 'Heart Rate']} />
                <defs>
                  <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#heartRateGradient)"
                  fillOpacity={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Heart Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <ActivityIcon className="h-5 w-5 mr-2 text-cyan-500" />
              Blood Pressure
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">120/80</p>
            <p className="text-sm text-muted-foreground">Current blood pressure</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics.bloodPressure} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    return [`${value} mmHg`, name === "systolic" ? "Systolic" : "Diastolic"];
                  }} 
                />
                <defs>
                  <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#06b6d4" 
                  fill="url(#systolicGradient)"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#0891b2" 
                  fill="url(#diastolicGradient)"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#0891b2" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Diastolic"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <BrainIcon className="h-5 w-5 mr-2 text-amber-500" />
              Glucose
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">98 mg/dL</p>
            <p className="text-sm text-muted-foreground">Fasting blood glucose</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics.glucose} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mg/dL`, 'Glucose']} />
                <defs>
                  <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fill="url(#glucoseGradient)"
                  fillOpacity={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Glucose"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default VitalsTab;
