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
}

interface ServiceRecordContextType {
  recordsByUser: Record<string, ServiceRecord[]>;
  recordsByWorkshop: Record<string, ServiceRecord[]>;
  recordsByService: Record<string, ServiceRecord[]>;
  loading: boolean;
  error: string | null;
  refreshServiceRecords: () => Promise<void>;
}

const ServiceRecordContext = createContext<ServiceRecordContextType | null>(
  null
);

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

  return (
    <ServiceRecordContext.Provider
      value={{
        recordsByUser,
        recordsByWorkshop,
        recordsByService,
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
