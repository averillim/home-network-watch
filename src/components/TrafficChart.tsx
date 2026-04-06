import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ProtocolBreakdown } from "@/api/client";

interface TrafficChartProps {
  protocols: ProtocolBreakdown[];
  loading: boolean;
}

const COLORS = [
  "hsl(220, 80%, 50%)",
  "hsl(200, 80%, 50%)",
  "hsl(152, 60%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 60%, 55%)",
  "hsl(330, 65%, 50%)",
  "hsl(180, 60%, 42%)",
];

const placeholderData: ProtocolBreakdown[] = [
  { label: "YouTube", value: 35 },
  { label: "DNS", value: 15 },
  { label: "TLS/HTTPS", value: 30 },
  { label: "Netflix", value: 12 },
  { label: "Other", value: 8 },
];

export default function TrafficChart({ protocols, loading }: TrafficChartProps) {
  const chartData = protocols.length > 0 ? protocols : placeholderData;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Protocol Breakdown</h3>
      </div>
      <div className="p-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(220, 15%, 90%)",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
