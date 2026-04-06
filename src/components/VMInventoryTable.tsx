import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HostEntry } from "@/api/client";

interface VMInventoryTableProps {
  hosts: HostEntry[];
  loading: boolean;
}

const PAGE_SIZE = 10;

function formatLastSeen(ts?: number): string {
  if (!ts) return "—";
  const diff = Math.floor(Date.now() / 1000 - ts);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getStatus(host: HostEntry): "Online" | "Idle" | "Offline" {
  if ((host.bytes_sent + host.bytes_rcvd) > 0) {
    if ((host.num_flows ?? 0) > 0) return "Online";
    return "Idle";
  }
  return "Offline";
}

const statusColor: Record<string, "success" | "warning" | "default"> = {
  Online: "success",
  Idle: "warning",
  Offline: "default",
};

function toMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function VMInventoryTable({ hosts, loading }: VMInventoryTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hosts.filter(
      (h) =>
        h.name?.toLowerCase().includes(q) ||
        h.ip.includes(q) ||
        (h.mac ?? "").toLowerCase().includes(q)
    );
  }, [hosts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">VM Inventory</h3>
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, IP, or MAC…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
        ) : paged.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {hosts.length === 0
              ? "No VMs detected on 192.168.2.0/24. Data appears once the backend connects."
              : "No results match your search."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">IP Address</TableHead>
                <TableHead className="text-xs">MAC Address</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Last Seen</TableHead>
                <TableHead className="text-right text-xs">Traffic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((h) => {
                const status = getStatus(h);
                return (
                  <TableRow key={h.ip}>
                    <TableCell className="text-sm font-medium">{h.name || "Unknown VM"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{h.device_type || "Virtual Machine"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{h.ip}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{h.mac || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor[status]} className="text-[10px]">
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatLastSeen(h.last_seen)}</TableCell>
                    <TableCell className="text-right text-xs">{toMB(h.bytes_sent + h.bytes_rcvd)} MB</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            Showing {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? "default" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
