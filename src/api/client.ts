import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export interface NetworkSummary {
  num_hosts: number;
  throughput_bps: number;
  num_flows: number;
  engaged_alerts: number;
}

export interface HostEntry {
  name: string;
  ip: string;
  bytes_sent: number;
  bytes_rcvd: number;
  is_local: boolean;
  mac?: string;
  os?: string;
  last_seen?: number;
  device_type?: string;
  num_flows?: number;
  active_flows_as_client?: number;
  active_flows_as_server?: number;
}

export interface ProtocolBreakdown {
  label: string;
  value: number;
}

export interface AlertEntry {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
  timestamp: string;
}

export async function fetchSummary(): Promise<NetworkSummary> {
  const { data } = await apiClient.get("/summary");
  return data;
}

export async function fetchHosts(): Promise<HostEntry[]> {
  const { data } = await apiClient.get("/hosts");
  return Array.isArray(data) ? data : [];
}

export async function fetchSubnetHosts(subnet: string): Promise<HostEntry[]> {
  const { data } = await apiClient.get("/hosts", { params: { subnet } });
  return Array.isArray(data) ? data : [];
}

export async function fetchProtocols(): Promise<ProtocolBreakdown[]> {
  const { data } = await apiClient.get("/protocols");
  return Array.isArray(data) ? data : [];
}

export async function fetchAlerts(): Promise<AlertEntry[]> {
  const { data } = await apiClient.get("/alerts");
  return Array.isArray(data) ? data : [];
}

export default apiClient;
