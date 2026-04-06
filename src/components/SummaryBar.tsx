import { Wifi, Monitor, Activity, ShieldAlert, type LucideIcon } from "lucide-react";
import type { NetworkSummary } from "@/api/client";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
}

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent ?? "text-muted-foreground/60"}`} />
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
    </div>
  );
}

const statCards = [
  { key: "num_hosts" as const, label: "Devices", icon: Monitor, format: (v: number) => String(v), accent: "text-primary" },
  { key: "throughput_bps" as const, label: "Throughput", icon: Wifi, format: (v: number) => `${(v / 1_000_000).toFixed(1)} Mbps`, accent: "text-accent" },
  { key: "num_flows" as const, label: "Active Flows", icon: Activity, format: (v: number) => String(v), accent: "text-success" },
  { key: "engaged_alerts" as const, label: "Alerts", icon: ShieldAlert, format: (v: number) => String(v), accent: "text-destructive" },
];

interface SummaryBarProps {
  data: NetworkSummary | null;
  loading: boolean;
}

export default function SummaryBar({ data, loading }: SummaryBarProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map(({ key, label, icon, format, accent }) => (
        <StatCard
          key={key}
          label={label}
          value={loading || !data ? "—" : format(data[key])}
          icon={icon}
          accent={accent}
        />
      ))}
    </div>
  );
}
