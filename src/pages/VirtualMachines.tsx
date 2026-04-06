import { RefreshCw, Server, Wifi, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkDiagram from "@/components/NetworkDiagram";
import VMInventoryTable from "@/components/VMInventoryTable";
import { useVMData } from "@/hooks/useVMData";

export default function VirtualMachines() {
  const { hosts, loading, countdown, refresh } = useVMData();

  const totalTrafficMB = hosts.reduce((s, h) => s + h.bytes_sent + h.bytes_rcvd, 0) / (1024 * 1024);
  const onlineCount = hosts.filter((h) => (h.bytes_sent + h.bytes_rcvd) > 0).length;

  const stats = [
    { label: "Total VMs", value: String(hosts.length), icon: Server, accent: "text-primary" },
    { label: "Online", value: String(onlineCount), icon: Activity, accent: "text-success" },
    { label: "Total Traffic", value: `${totalTrafficMB.toFixed(1)} MB`, icon: Wifi, accent: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Virtual Machines</h1>
            <p className="text-xs text-muted-foreground">Subnet 192.168.2.0/24</p>
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
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </div>

        {/* Network diagram */}
        <NetworkDiagram hosts={hosts} loading={loading} />

        {/* Inventory table */}
        <VMInventoryTable hosts={hosts} loading={loading} />
      </main>
    </div>
  );
}
