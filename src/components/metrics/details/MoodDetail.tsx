
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays } from "date-fns";

interface MoodDetailProps {
  currentMood: string;
}

// Map mood text to numeric values for charting
const moodToValue = {
  "Excellent": 5,
  "Good": 4,
  "Okay": 3,
  "Fair": 2,
  "Poor": 1
};

// Map numeric values back to mood text
const valueToMood = {
  5: "Excellent",
  4: "Good", 
  3: "Okay",
  2: "Fair",
  1: "Poor"
};

// Colors for different mood levels
const moodColors = {
  5: "hsl(142, 76%, 36%)",  // Excellent - Green
  4: "hsl(93, 76%, 49%)",   // Good - Light green
  3: "hsl(48, 96%, 53%)",   // Okay - Yellow
  2: "hsl(31, 90%, 56%)",   // Fair - Orange
  1: "hsl(0, 84%, 60%)"     // Poor - Red
};

export const MoodDetail = ({ currentMood }: MoodDetailProps) => {
  // Generate demo data for the past week
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = format(subDays(new Date(), 6 - i), "MMM dd");
    let moodValue: number;
    
    // For the last day, use the current mood
    if (i === 6) {
      moodValue = moodToValue[currentMood as keyof typeof moodToValue] || 3;
    } else {
      // Random mood value between 1-5 with higher probability of values near current mood
      const currentMoodValue = moodToValue[currentMood as keyof typeof moodToValue] || 3;
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      moodValue = Math.max(1, Math.min(5, currentMoodValue + variation));
    }
    
    return {
      date,
      value: moodValue,
      mood: valueToMood[moodValue as keyof typeof valueToMood]
    };
  });

  // Calculate stats
  const moodValues = data.map(d => d.value);
  const avgMoodValue = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
  const avgMoodText = valueToMood[Math.round(avgMoodValue) as keyof typeof valueToMood];
  
  // Count days with each mood
  const moodCounts: Record<string, number> = {};
  data.forEach(d => {
    moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });

  // Find dominant mood
  const dominantMood = Object.entries(moodCounts).reduce(
    (max, [mood, count]) => count > max.count ? { mood, count } : max, 
    { mood: "", count: 0 }
  ).mood;

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Average Mood</div>
            <div className="text-lg font-semibold mt-1">
              {avgMoodText}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Dominant Mood</div>
            <div className="text-lg font-semibold mt-1">
              {dominantMood}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Current Mood</div>
            <div className="text-lg font-semibold mt-1">
              {currentMood}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  tickMargin={5}
                />
                <YAxis 
                  fontSize={11}
                  tickFormatter={(value) => valueToMood[value as keyof typeof valueToMood] || ""}
                  domain={[0, 6]}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip 
                  formatter={(value) => [valueToMood[value as keyof typeof valueToMood], 'Mood']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={moodColors[entry.value as keyof typeof moodColors]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-md font-medium mb-2">Mood Patterns</h3>
          <p className="text-sm text-muted-foreground">
            Tracking your mood can help identify patterns and triggers that influence your emotional well-being.
            Regular mood tracking provides insights into how factors like sleep, nutrition, and physical activity
            may impact your mental health.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            If you notice persistent low mood, consider speaking with a healthcare professional for support and guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodDetail;
