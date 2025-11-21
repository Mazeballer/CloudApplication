"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, FileText, CheckCircle, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RawRecord = {
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
  remarks?: string;
  status: string;
};

type ApiResponse = {
  byUser: Record<string, RawRecord[]>;
  byWorkshop: Record<string, RawRecord[]>;
  byService: Record<string, RawRecord[]>;
};

type ServiceHistoryRecord = {
  id: string;
  vehicle: string;
  workshop: string;
  serviceName: string;
  status: string;
  date: string; // ISO string or ""
  dateMs: number | null;
  time: string;
  notes?: string;
};

export function ServiceHistory() {
  const [records, setRecords] = useState<ServiceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const user = getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/ServiceRecord/all`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("ServiceRecord/all HTTP error:", res.status);
          setRecords([]);
          return;
        }

        const data: ApiResponse = await res.json();
        console.log("ServiceRecord/all (history) response:", data);

        const userId = String(user.id);
        const userRecords: RawRecord[] = data.byUser?.[userId] ?? [];

        const completedRaw = userRecords.filter(
          (r) => r.status === "Completed"
        );

        const mapped: ServiceHistoryRecord[] = completedRaw.map((r) => {
          const d = r.serviceDate ? new Date(r.serviceDate) : null;
          const hasValidDate = d && !Number.isNaN(d.getTime());

          return {
            id: r.id,
            vehicle: r.vehicleName ?? "Unknown vehicle",
            workshop: r.workshopName ?? "Unknown workshop",
            serviceName: r.serviceName ?? "Unknown service",
            status: r.status ?? "Completed",
            date: hasValidDate ? d!.toISOString() : "",
            dateMs: hasValidDate ? d!.getTime() : null,
            time: hasValidDate
              ? d!.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—",
            notes: r.remarks,
          };
        });

        setRecords(mapped);
      } catch (err) {
        console.error("ServiceHistory fetch error:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // All metrics are now based ONLY on completed records
  const totalCompleted = records.length;

  const lastCompleted =
    records.length > 0
      ? records.reduce((latest, cur) =>
          cur.dateMs && latest.dateMs
            ? cur.dateMs > latest.dateMs
              ? cur
              : latest
            : latest
        )
      : null;

  const completedWorkshops = new Set(records.map((r) => r.workshop)).size;

  return (
    <div className="space-y-6">
      {/* Summary Stats – only completed services */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold">{totalCompleted}</p>
          <p className="text-sm text-muted-foreground">
            Total Completed Services
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">
            {lastCompleted && lastCompleted.dateMs
              ? new Date(lastCompleted.dateMs).toLocaleDateString("en-GB")
              : "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            Last Completed Service
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <p className="text-3xl font-bold">{completedWorkshops}</p>
          <p className="text-sm text-muted-foreground">
            Workshops with Completed Services
          </p>
        </Card>
      </div>

      {/* Service Records – completed only */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading your completed service history...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No completed services yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => (
              <ServiceRecordCard
                key={`${record.id || "record"}-${idx}`}
                record={record}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ServiceRecordCard({ record }: { record: ServiceHistoryRecord }) {
  const hasValidDate = !!record.date;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{record.serviceName}</h3>
            <Badge variant="default">Completed</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{record.vehicle}</p>
          <p className="text-sm text-muted-foreground">{record.workshop}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">
            {hasValidDate
              ? new Date(record.date).toLocaleDateString("en-GB")
              : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">{record.time}</span>
        </div>
      </div>

      {record.notes && (
        <div className="flex items-start gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {record.notes}
          </p>
        </div>
      )}
    </Card>
  );
}
