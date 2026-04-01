import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Security Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Loading…</p>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No alerts right now — everything looks good! 🎉
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
              >
                <Badge variant={severityVariant[alert.severity] ?? "default"}>
                  {severityLabel[alert.severity] ?? alert.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {alert.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
