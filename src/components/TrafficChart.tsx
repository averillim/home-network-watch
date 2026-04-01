import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProtocolBreakdown } from "@/api/client";

interface TrafficChartProps {
  protocols: ProtocolBreakdown[];
  loading: boolean;
}

const COLORS = [
  "hsl(213, 94%, 50%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(45, 93%, 47%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 67%, 55%)",
  "hsl(330, 70%, 50%)",
  "hsl(170, 70%, 45%)",
];

export default function TrafficChart({ protocols, loading }: TrafficChartProps) {
  const placeholderData: ProtocolBreakdown[] = [
    { label: "YouTube", value: 35 },
    { label: "DNS", value: 15 },
    { label: "TLS/HTTPS", value: 30 },
    { label: "Netflix", value: 12 },
    { label: "Other", value: 8 },
  ];

  const chartData = protocols.length > 0 ? protocols : placeholderData;

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">What's being used</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Loading…</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
