import { Badge } from "@/components/ui/badge";
import type { AlertEntry } from "@/api/client";

interface AlertsPanelProps {
  alerts: AlertEntry[];
  loading: boolean;
}

const severityVariant: Record<string, "destructive" | "warning" | "success"> = {
  high: "destructive",
  medium: "warning",
  low: "success",
};

const severityLabel: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function AlertsPanel({ alerts, loading }: AlertsPanelProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Security Alerts</h3>
      </div>
      <div className="p-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No alerts — everything looks good ✓
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start gap-3 rounded-md bg-muted/50 p-3"
              >
                <Badge variant={severityVariant[alert.severity] ?? "default"} className="mt-0.5 text-[10px]">
                  {severityLabel[alert.severity] ?? alert.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-card-foreground">{alert.message}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{alert.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
