import { Wifi, Monitor, Activity, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { NetworkSummary } from "@/api/client";

interface SummaryBarProps {
  data: NetworkSummary | null;
  loading: boolean;
}

const statCards = [
  {
    key: "num_hosts" as const,
    label: "Devices on your network",
    icon: Monitor,
    format: (v: number) => String(v),
  },
  {
    key: "throughput_bps" as const,
    label: "Network speed",
    icon: Wifi,
    format: (v: number) => `${(v / 1_000_000).toFixed(1)} Mbps`,
  },
  {
    key: "num_flows" as const,
    label: "Active connections",
    icon: Activity,
    format: (v: number) => String(v),
  },
  {
    key: "engaged_alerts" as const,
    label: "Security alerts",
    icon: ShieldAlert,
    format: (v: number) => String(v),
  },
];

export default function SummaryBar({ data, loading }: SummaryBarProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="border-none shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground">
                {loading || !data ? "—" : format(data[key])}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
