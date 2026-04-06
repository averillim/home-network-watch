import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSubnetHosts, type HostEntry } from "@/api/client";

const POLL_INTERVAL = 30;
const VM_SUBNET = "192.168.2.0/24";

export function useVMData() {
  const [hosts, setHosts] = useState<HostEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(POLL_INTERVAL);
  const countdownRef = useRef(POLL_INTERVAL);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSubnetHosts(VM_SUBNET);
      setHosts(data);
    } catch {
      // silent
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

  return { hosts, loading, countdown, refresh };
}
