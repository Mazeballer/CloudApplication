"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, MapPin, Clock, CarFront } from "lucide-react";
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
  vehiclePlate?: string; // <- from VehiclePlate in C#
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

type ServiceStatusRecord = {
  id: string;
  vehicle: string;
  plate?: string;
  workshop: string;
  serviceName: string;
  status: string; // normalised label
  rawStatus: string;
  date: string;
  dateMs: number | null;
  time: string;
  notes?: string;
};

type StatusFilter =
  | "All"
  | "Requested"
  | "Scheduled"
  | "Active"
  | "Completed"
  | "Cancelled";

function normalizeStatus(status?: string): string {
  if (!status || typeof status !== "string") return "Requested";
  const lower = status.trim().toLowerCase();
  if (lower.startsWith("req")) return "Requested";
  if (lower.startsWith("sched")) return "Scheduled";
  if (lower.startsWith("active")) return "Active";
  if (lower.startsWith("comp")) return "Completed";
  if (lower.startsWith("cancel")) return "Cancelled";
  // fallback: capitalise first letter
  const s = status.trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Requested";
}

export function ServiceStatus() {
  const [allRecords, setAllRecords] = useState<ServiceStatusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    const load = async () => {
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
          setAllRecords([]);
          return;
        }

        const data: ApiResponse = await res.json();
        console.log("ServiceRecord/all response:", data);

        const userId = String(user.id);
        const userRecords: RawRecord[] = data.byUser?.[userId] ?? [];

        const mapped: ServiceStatusRecord[] = userRecords.map((r) => {
          const status = normalizeStatus(r.status);

          const rawDate = r.serviceDate;
          let time = "—";
          let dateMs: number | null = null;

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
            plate: r.vehiclePlate,
            workshop: r.workshopName ?? "Unknown workshop",
            serviceName: r.serviceName ?? "Unknown service",
            status,
            rawStatus: r.status,
            date: rawDate,
            dateMs,
            time,
            notes: r.remarks,
          };
        });

        setAllRecords(mapped);
      } catch (err) {
        console.error("ServiceStatus fetch error:", err);
        setAllRecords([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // filter
  const filteredRecords = allRecords.filter((r) =>
    statusFilter === "All" ? true : r.status === statusFilter
  );

  const totalServices = allRecords.length;

  const scheduledRecords = allRecords.filter(
    (r) => r.status === "Scheduled" && r.dateMs !== null
  );

  const nextAppointment =
    scheduledRecords.length > 0
      ? scheduledRecords.reduce((best, cur) =>
          (cur.dateMs as number) < (best.dateMs as number) ? cur : best
        )
      : null;

  const uniqueWorkshops = new Set(allRecords.map((r) => r.workshop)).size;

  const statusOptions: StatusFilter[] = [
    "All",
    "Requested",
    "Scheduled",
    "Active",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <p className="text-3xl font-bold">{totalServices}</p>
          <p className="text-sm text-muted-foreground">Total Services</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">
            {nextAppointment && nextAppointment.dateMs
              ? new Date(nextAppointment.dateMs).toLocaleDateString("en-GB")
              : "—"}
          </p>
          <p className="text-sm text-muted-foreground">Next Appointment</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold">{uniqueWorkshops}</p>
          <p className="text-sm text-muted-foreground">Workshops Involved</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
            className="rounded-full px-4"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Service list */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading your service status...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No services found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record, idx) => (
              <ServiceStatusCard
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

function ServiceStatusCard({ record }: { record: ServiceStatusRecord }) {
  const hasValidDate = record.dateMs !== null;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Top row: vehicle + plate + status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <CarFront className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-semibold">{record.vehicle}</h3>
            {record.plate && (
              <p className="text-sm font-medium text-muted-foreground">
                Plate: {record.plate}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{record.workshop}</p>
          </div>
        </div>
        <Badge>{record.status}</Badge>
      </div>

      {/* Middle row: service name */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Service:&nbsp;
          <span className="font-medium text-foreground">
            {record.serviceName}
          </span>
        </p>
      </div>

      {/* Date & time row */}
      <div className="grid sm:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">
            {hasValidDate
              ? new Date(record.dateMs as number).toLocaleDateString("en-GB")
              : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">
            {hasValidDate ? record.time : "—"}
          </span>
        </div>
      </div>

      {record.notes && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {record.notes}
        </p>
      )}
    </Card>
  );
}
