import { useMemo } from "react";
import type { HostEntry } from "@/api/client";

interface NetworkDiagramProps {
  hosts: HostEntry[];
  loading: boolean;
}

export default function NetworkDiagram({ hosts, loading }: NetworkDiagramProps) {
  const displayHosts = hosts.slice(0, 12);

  const layout = useMemo(() => {
    const cx = 300;
    const cy = 200;
    const radius = 140;
    return displayHosts.map((host, i) => {
      const angle = (2 * Math.PI * i) / Math.max(displayHosts.length, 1) - Math.PI / 2;
      return {
        ...host,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [displayHosts]);

  const gatewayX = 300;
  const gatewayY = 200;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Network Topology — 192.168.2.0/24</h3>
      </div>
      <div className="flex items-center justify-center p-4">
        {loading ? (
          <p className="py-12 text-sm text-muted-foreground">Loading…</p>
        ) : displayHosts.length === 0 ? (
          <p className="py-12 text-sm text-muted-foreground">No VMs detected on this subnet yet.</p>
        ) : (
          <svg viewBox="0 0 600 400" className="w-full max-w-xl" aria-label="Network topology diagram">
            {/* Connections */}
            {layout.map((h, i) => (
              <line
                key={`line-${i}`}
                x1={gatewayX}
                y1={gatewayY}
                x2={h.x}
                y2={h.y}
                stroke="hsl(220, 15%, 85%)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            ))}

            {/* Gateway node */}
            <circle cx={gatewayX} cy={gatewayY} r={28} fill="hsl(220, 80%, 50%)" opacity={0.9} />
            <text x={gatewayX} y={gatewayY - 2} textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
              Gateway
            </text>
            <text x={gatewayX} y={gatewayY + 10} textAnchor="middle" fill="white" fontSize="7" opacity={0.8}>
              .2.1
            </text>

            {/* Host nodes */}
            {layout.map((h, i) => {
              const isActive = (h.bytes_sent + h.bytes_rcvd) > 0;
              const shortIp = h.ip.split(".").slice(-1)[0];
              return (
                <g key={i}>
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={20}
                    fill={isActive ? "hsl(152, 60%, 42%)" : "hsl(220, 15%, 80%)"}
                    opacity={0.85}
                  />
                  <text x={h.x} y={h.y - 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="600">
                    {(h.name || "VM").slice(0, 8)}
                  </text>
                  <text x={h.x} y={h.y + 7} textAnchor="middle" fill="white" fontSize="6" opacity={0.8}>
                    .2.{shortIp}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
