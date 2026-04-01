import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchSummary,
  fetchHosts,
  fetchProtocols,
  fetchAlerts,
  type NetworkSummary,
  type HostEntry,
  type ProtocolBreakdown,
  type AlertEntry,
} from "@/api/client";

const POLL_INTERVAL = 30;

export function useNetworkData() {
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [hosts, setHosts] = useState<HostEntry[]>([]);
  const [protocols, setProtocols] = useState<ProtocolBreakdown[]>([]);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(POLL_INTERVAL);
  const countdownRef = useRef(POLL_INTERVAL);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [s, h, p, a] = await Promise.allSettled([
        fetchSummary(),
        fetchHosts(),
        fetchProtocols(),
        fetchAlerts(),
      ]);
      if (s.status === "fulfilled") setSummary(s.value);
      if (h.status === "fulfilled") setHosts(h.value);
      if (p.status === "fulfilled") setProtocols(p.value);
      if (a.status === "fulfilled") setAlerts(a.value);
    } catch {
      // silently fail — UI shows placeholder state
    } finally {
      setLoading(false);
      countdownRef.current = POLL_INTERVAL;
      setCountdown(POLL_INTERVAL);
    }
  }, []);

  useEffect(() => {
    refresh();

    const timer = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        refresh();
      } else {
        setCountdown(countdownRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [refresh]);

  return { summary, hosts, protocols, alerts, loading, countdown, refresh };
}
