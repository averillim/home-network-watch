import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SummaryBar from "@/components/SummaryBar";
import HostsTable from "@/components/HostsTable";
import TrafficChart from "@/components/TrafficChart";
import AlertsPanel from "@/components/AlertsPanel";
import { useNetworkData } from "@/hooks/useNetworkData";

export default function Index() {
  const { summary, hosts, protocols, alerts, loading, countdown, refresh } =
    useNetworkData();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Network overview at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Refresh in {countdown}s</span>
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <SummaryBar data={summary} loading={loading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <HostsTable hosts={hosts} loading={loading} />
          <div className="space-y-6">
            <TrafficChart protocols={protocols} loading={loading} />
            <AlertsPanel alerts={alerts} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
