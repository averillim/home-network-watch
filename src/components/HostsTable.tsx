import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HostEntry } from "@/api/client";

interface HostsTableProps {
  hosts: HostEntry[];
  loading: boolean;
}

function toMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function HostsTable({ hosts, loading }: HostsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = hosts.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.ip.includes(search)
  );

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Active Hosts</h3>
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hosts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {hosts.length === 0
              ? "No hosts detected yet. Data appears once the backend connects."
              : "No results match your search."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Device</TableHead>
                <TableHead className="text-xs">IP Address</TableHead>
                <TableHead className="text-right text-xs">Sent</TableHead>
                <TableHead className="text-right text-xs">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => (
                <TableRow key={h.ip}>
                  <TableCell className="text-sm font-medium">{h.name || "Unknown"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{h.ip}</TableCell>
                  <TableCell className="text-right text-sm">{toMB(h.bytes_sent)} MB</TableCell>
                  <TableCell className="text-right text-sm">{toMB(h.bytes_rcvd)} MB</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
