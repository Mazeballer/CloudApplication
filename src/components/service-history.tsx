'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Wrench,
  CheckCircle,
  MapPin,
  Clock,
  CarFront,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =========================
// Raw API types
// =========================
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
  vehiclePlate?: string;
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

// =========================
// Normalised Types
// =========================
type ServiceStatusRecord = {
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
};

type StatusFilter =
  | 'All'
  | 'Requested'
  | 'Scheduled'
  | 'Active'
  | 'Completed'
  | 'Cancelled';

// =========================
// Normalise Status
// =========================
function normalizeStatus(status?: string): string {
  if (!status || typeof status !== 'string') return 'Requested';

  const lower = status.trim().toLowerCase();

  if (lower.startsWith('req')) return 'Requested';
  if (lower.startsWith('sched')) return 'Scheduled';
  if (lower.startsWith('active')) return 'Active';
  if (lower.startsWith('comp')) return 'Completed';
  if (lower.startsWith('cancel')) return 'Cancelled';

  const s = status.trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Requested';
}

function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'Requested':
      return 'bg-blue-800 text-blue-300 border border-blue-700';

    case 'Scheduled':
      return 'bg-sky-800 text-sky-300 border border-sky-700';

    case 'Active':
      return 'bg-amber-800 text-amber-300 border border-amber-700';

    case 'Completed':
      return 'bg-emerald-800 text-emerald-300 border border-emerald-700';

    case 'Cancelled':
      return 'bg-rose-800 text-rose-300 border border-rose-700';

    default:
      return 'bg-muted text-foreground';
  }
}

// ======================================================
// MAIN MERGED COMPONENT
// ======================================================
export function ServiceHistory() {
  const [records, setRecords] = useState<ServiceStatusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  useEffect(() => {
    const loadHistory = async () => {
      const user = getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/ServiceRecord/all`, {
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('ServiceRecord/all HTTP error:', res.status);
          setRecords([]);
          return;
        }

        const data: ApiResponse = await res.json();
        const userRecords: RawRecord[] = data.byUser?.[String(user.id)] ?? [];

        const mapped: ServiceStatusRecord[] = userRecords.map((r) => {
          const status = normalizeStatus(r.status);

          const rawDate = r.serviceDate;
          let time = '—';
          let dateMs: number | null = null;

          if (rawDate) {
            const d = new Date(rawDate);
            if (!Number.isNaN(d.getTime())) {
              dateMs = d.getTime();
              time = d.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
            }
          }

          return {
            id: r.id,
            vehicle: r.vehicleName ?? 'Unknown vehicle',
            plate: r.vehiclePlate,
            workshop: r.workshopName ?? 'Unknown workshop',
            serviceName: r.serviceName ?? 'Unknown service',
            status,
            rawStatus: r.status,
            date: rawDate,
            dateMs,
            time,
            notes: r.remarks,
          };
        });

        setRecords(mapped);
      } catch (err) {
        console.error('ServiceHistory fetch error:', err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // ======================================================
  // METRICS SECTION
  // ======================================================

  const totalServices = records.length;

  const completed = records.filter((r) => r.status === 'Completed');
  const totalCompleted = completed.length;

  const lastCompleted =
    completed.length > 0
      ? completed.reduce((a, b) =>
          a.dateMs && b.dateMs ? (b.dateMs > a.dateMs ? b : a) : a
        )
      : null;

  const scheduled = records.filter(
    (r) => r.status === 'Scheduled' && r.dateMs !== null
  );

  const nextAppointment =
    scheduled.length > 0
      ? scheduled.reduce((best, cur) =>
          cur.dateMs! < best.dateMs! ? cur : best
        )
      : null;

  const uniqueWorkshops = new Set(records.map((r) => r.workshop)).size;

  // ======================================================
  // FILTERED VIEW
  // ======================================================
  const filteredRecords =
    statusFilter === 'All'
      ? records
      : records.filter((r) => r.status === statusFilter);

  const statusOptions: StatusFilter[] = [
    'All',
    'Requested',
    'Scheduled',
    'Active',
    'Completed',
    'Cancelled',
  ];

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="space-y-6">
      {/* TOP METRICS */}
      <div className="grid sm:grid-cols-5 gap-4">
        <Card className="p-6">
          <Wrench className="h-8 w-8 text-primary mb-2" />
          <p className="text-3xl font-bold">{totalServices}</p>
          <p className="text-sm text-muted-foreground">Total Services</p>
        </Card>

        <Card className="p-6">
          <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
          <p className="text-3xl font-bold">{totalCompleted}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </Card>

        <Card className="p-6">
          <Calendar className="h-8 w-8 text-blue-500 mb-2" />
          <p className="text-3xl font-bold">
            {lastCompleted?.dateMs
              ? new Date(lastCompleted.dateMs).toLocaleDateString('en-GB')
              : '—'}
          </p>
          <p className="text-sm text-muted-foreground">Last Completed</p>
        </Card>

        <Card className="p-6">
          <Calendar className="h-8 w-8 text-indigo-500 mb-2" />
          <p className="text-3xl font-bold">
            {nextAppointment?.dateMs
              ? new Date(nextAppointment.dateMs).toLocaleDateString('en-GB')
              : '—'}
          </p>
          <p className="text-sm text-muted-foreground">Next Appointment</p>
        </Card>

        <Card className="p-6">
          <MapPin className="h-8 w-8 text-pink-500 mb-2" />
          <p className="text-3xl font-bold">{uniqueWorkshops}</p>
          <p className="text-sm text-muted-foreground">Workshops Involved</p>
        </Card>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? 'default' : 'outline'}
            onClick={() => setStatusFilter(status)}
            className="rounded-full px-4"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* RECORD LIST */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading your service history...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No services found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record, idx) => (
              <ServiceStatusCard
                key={`${record.id || 'record'}-${idx}`}
                record={record}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ======================================================
// CARD COMPONENT
// ======================================================
function ServiceStatusCard({ record }: { record: ServiceStatusRecord }) {
  const hasValidDate = record.dateMs !== null;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Top row */}
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
        <Badge className={getStatusBadgeClasses(record.status)}>
          {record.status}
        </Badge>
      </div>

      {/* Middle row: service name */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Service:{' '}
          <span className="font-medium text-foreground">
            {record.serviceName}
          </span>
        </p>
      </div>

      {/* Date and time row */}
      <div className="grid sm:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">
            {hasValidDate
              ? new Date(record.dateMs!).toLocaleDateString('en-GB')
              : '—'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">
            {hasValidDate ? record.time : '—'}
          </span>
        </div>
      </div>

      {/* Notes */}
      {record.notes && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {record.notes}
        </p>
      )}
    </Card>
  );
}
