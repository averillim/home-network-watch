import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Who's on your network</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">Loading…</p>
        ) : hosts.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No devices found yet. Data will appear once the backend is connected.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Sent (MB)</TableHead>
                  <TableHead className="text-right">Received (MB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.map((h) => (
                  <TableRow key={h.ip}>
                    <TableCell className="font-medium">
                      {h.name || "Unknown device"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{h.ip}</TableCell>
                    <TableCell className="text-right">{toMB(h.bytes_sent)}</TableCell>
                    <TableCell className="text-right">{toMB(h.bytes_rcvd)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
