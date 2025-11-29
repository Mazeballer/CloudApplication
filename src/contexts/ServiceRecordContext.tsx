"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAllServiceRecords } from "@/lib/serviceRecord";
import { useAuth } from "@/lib/auth";

interface ServiceRecord {
  id: string;
  vehicleId: string;
  workshopId: string;
  serviceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  vehicleName: string;
  workshopName: string;
  serviceName: string;

  serviceDate: string;
  serviceMileage: number;

  remarks: string;
  status?: string;
  invoiceId?: string;
}

export interface NormalizedServiceRecord {
  id: string;
  vehicle: string;
  plate?: string;
  workshop: string;
  serviceName: string;
  status: string; // normalized
  rawStatus: string;
  date: string;
  dateMs: number | null;
  time: string;
  notes?: string;
  invoiceId?: string;
  invoicePdfUrl?: string;
}

interface ServiceRecordContextType {
  recordsByUser: Record<string, ServiceRecord[]>;
  recordsByWorkshop: Record<string, ServiceRecord[]>;
  recordsByService: Record<string, ServiceRecord[]>;

  // NEW: Normalized records for UI components like service-history
  normalizedByUser: Record<string, NormalizedServiceRecord[]>;

  loading: boolean;
  error: string | null;

  refreshServiceRecords: () => Promise<void>;
}

const ServiceRecordContext = createContext<ServiceRecordContextType | null>(
  null
);

function normalizeStatus(status?: string): string {
  if (!status || typeof status !== "string") return "Requested";

  const lower = status.trim().toLowerCase();

  if (lower.startsWith("req")) return "Requested";
  if (lower.startsWith("sched")) return "Scheduled";
  if (lower.startsWith("active")) return "Active";
  if (lower.startsWith("comp")) return "Completed";
  if (lower.startsWith("cancel")) return "Cancelled";

  const s = status.trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Requested";
}

export function ServiceRecordProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [recordsByUser, setRecordsByUser] = useState<
    Record<string, ServiceRecord[]>
  >({});
  const [recordsByWorkshop, setRecordsByWorkshop] = useState<
    Record<string, ServiceRecord[]>
  >({});
  const [recordsByService, setRecordsByService] = useState<
    Record<string, ServiceRecord[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // LOAD DATA
  const refreshServiceRecords = async () => {
    try {
      setLoading(true);
      const data = await getAllServiceRecords();

      setRecordsByUser(data.byUser || {});
      setRecordsByWorkshop(data.byWorkshop || {});
      setRecordsByService(data.byService || {});
    } catch (err: any) {
      setError(err.message || "Failed to fetch service records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshServiceRecords();
  }, []);

  const normalizedByUser: Record<string, NormalizedServiceRecord[]> = {};

  Object.keys(recordsByUser).forEach((userId) => {
    const list = recordsByUser[userId] ?? [];

    normalizedByUser[userId] = list.map((r) => {
      const rawDate = r.serviceDate;
      let dateMs: number | null = null;
      let time = "—";

      if (rawDate) {
        const d = new Date(rawDate);
        if (!Number.isNaN(d.getTime())) {
          dateMs = d.getTime();
          time = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      return {
        id: r.id,
        vehicle: r.vehicleName ?? "Unknown vehicle",
        plate: (r as any).vehiclePlate,
        workshop: r.workshopName ?? "Unknown workshop",
        serviceName: r.serviceName ?? "Unknown service",
        status: normalizeStatus(r.status),
        rawStatus: r.status ?? "",
        date: rawDate,
        dateMs,
        time,
        notes: r.remarks,
      };
    });
  });

  return (
    <ServiceRecordContext.Provider
      value={{
        recordsByUser,
        recordsByWorkshop,
        recordsByService,

        normalizedByUser, // ← NEW

        loading,
        error,
        refreshServiceRecords,
      }}
    >
      {children}
    </ServiceRecordContext.Provider>
  );
}

export function useServiceRecords() {
  const ctx = useContext(ServiceRecordContext);
  if (!ctx)
    throw new Error(
      "useServiceRecords must be used inside <ServiceRecordProvider>"
    );
  return ctx;
}
