'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Calendar,
  Wrench,
  AlertTriangle,
  Bell,
  Gauge,
} from 'lucide-react';
import Link from 'next/link';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RawRecord = {
  id: string;
  vehicleId: string;
  serviceName: string;
  workshopName: string;
  status: string;
  serviceDate: string;
  serviceMileage: number;
  remarks?: string;
  componentTypes?: string[];
};

type PartStatus = 'good' | 'warning' | 'critical' | 'unknown';

type PartKey =
  | 'EngineOil'
  | 'BrakePads'
  | 'Tyres'
  | 'Battery'
  | 'AirFilter'
  | 'CabinFilter'
  | 'Coolant'
  | 'SparkPlugs'
  | 'TransmissionFluid';

type PartConfig = {
  key: PartKey;
  label: string;
  expectedLifeMonths: number;
};

type PartHealth = {
  name: string;
  healthPercent: number;
  ageMonths: number | null;
  status: PartStatus;
  lastServiceDate?: string;
};

const PARTS_CONFIG: PartConfig[] = [
  { key: 'EngineOil', label: 'Engine oil', expectedLifeMonths: 6 },
  { key: 'BrakePads', label: 'Brake pads', expectedLifeMonths: 24 },
  { key: 'Tyres', label: 'Tyres', expectedLifeMonths: 36 },
  { key: 'Battery', label: 'Battery', expectedLifeMonths: 48 },
  { key: 'AirFilter', label: 'Air filter', expectedLifeMonths: 18 },
  { key: 'CabinFilter', label: 'Cabin filter', expectedLifeMonths: 18 },
  { key: 'Coolant', label: 'Coolant system', expectedLifeMonths: 48 },
  { key: 'SparkPlugs', label: 'Spark plugs', expectedLifeMonths: 48 },
  {
    key: 'TransmissionFluid',
    label: 'Transmission fluid',
    expectedLifeMonths: 60,
  },
];

export function VehicleDetails({ vehicleId }: { vehicleId: string }) {
  const { vehicles } = useVehicles();
  const [records, setRecords] = useState<RawRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  useEffect(() => {
    const loadData = async () => {
      if (!vehicle) return;

      const user = getCurrentUser();
      if (!user) return;

      try {
        const res = await fetch(`${API_URL}/api/ServiceRecord/all`, {
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('Failed to load service records:', res.status);
          return;
        }

        const data = await res.json();
        const userRecords: RawRecord[] = data.byUser[user.id] ?? [];

        const vehicleRecords = userRecords.filter(
          (r) => r.vehicleId === vehicleId
        );

        setRecords(vehicleRecords);
      } catch (err) {
        console.error('VehicleDetails fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [vehicleId, vehicle]);

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vehicle not found</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const currentMileage = parseInt(vehicle.mileage.replace(/[^\d]/g, '')) || 0;

  const completed = records
    .filter((r) => r.status === 'Completed')
    .sort(
      (a, b) =>
        new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
    );

  const scheduled = records.filter((r) => r.status === 'Scheduled');

  const lastServiceMileage =
    completed.length > 0 ? completed[0].serviceMileage : currentMileage;

  // This is only for display in the header
  const SERVICE_INTERVAL = 5000;
  const nextServiceAt = lastServiceMileage + SERVICE_INTERVAL;

  const recentServices = completed.slice(0, 3);

  const formatNumber = (n: number) => n.toLocaleString();

  // Parts health based on age (time since last service that included that component)

  const now = new Date();

  const partsHealth: PartHealth[] = PARTS_CONFIG.map((part) => {
    // Look for the most recent completed service that included this component
    const lastService = completed.find((r) =>
      r.componentTypes?.includes(part.key)
    );

    // If this part has never been serviced, we do not know its health
    if (!lastService) {
      return {
        name: part.label,
        healthPercent: 0,
        ageMonths: null,
        status: 'unknown',
      };
    }

    const serviceDate = new Date(lastService.serviceDate);
    const diffMs = now.getTime() - serviceDate.getTime();
    const ageDays = diffMs / (1000 * 60 * 60 * 24);
    const ageMonths = ageDays / 30;

    const expectedMonths = part.expectedLifeMonths;

    // How much of its lifespan has been used
    const usedPercentByAge = Math.min(
      Math.max((ageMonths / expectedMonths) * 100, 0),
      100
    );

    const healthPercent = Math.max(0, Math.min(100, 100 - usedPercentByAge));

    let status: PartStatus;
    if (healthPercent >= 70) status = 'good';
    else if (healthPercent >= 40) status = 'warning';
    else status = 'critical';

    return {
      name: part.label,
      healthPercent,
      ageMonths: Math.max(0, Math.floor(ageMonths)),
      status,
      lastServiceDate: lastService.serviceDate,
    };
  });

  const trackedParts = partsHealth.filter((p) => p.status !== 'unknown');

  let overallHealthPercent = 100;

  if (trackedParts.length > 0) {
    overallHealthPercent =
      trackedParts.reduce((sum, p) => sum + p.healthPercent, 0) /
      trackedParts.length;
    overallHealthPercent = Math.max(0, Math.min(100, overallHealthPercent));
  }

  const overallStatus =
    overallHealthPercent >= 80
      ? 'Good'
      : overallHealthPercent >= 50
      ? 'Fair'
      : 'Poor';

  const overallBadgeVariant =
    overallStatus === 'Good'
      ? 'default'
      : overallStatus === 'Fair'
      ? 'secondary'
      : 'destructive';

  const getPartBadgeVariant = (status: PartStatus) => {
    if (status === 'good') return 'outline';
    if (status === 'warning') return 'secondary';
    if (status === 'critical') return 'destructive';
    return 'outline';
  };

  // Alerts based on critical parts only
  const criticalParts = partsHealth.filter((p) => p.status === 'critical');

  // ------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Vehicle Header + Overall Component Health */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={vehicle.image || '/placeholder.svg'}
            className="w-full lg:w-80 h-56 object-cover rounded-lg"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-muted-foreground">{vehicle.plate}</p>
              </div>

              <Button asChild>
                <Link href="/dashboard/book">Book Service</Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Color</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Purchase Date
                </p>
                <p className="font-medium">{vehicle.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Mileage
                </p>
                <p className="font-medium">{vehicle.mileage}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Next Service Mileage
                </p>
                <p className="font-medium">{formatNumber(nextServiceAt)} km</p>
              </div>
            </div>

            {/* Overall Component Health by age */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Vehicle Health Index</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">
                    {overallHealthPercent.toFixed(0)}%
                  </p>
                  <Badge variant={overallBadgeVariant}>{overallStatus}</Badge>
                </div>
              </div>
              <Progress value={overallHealthPercent} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Based on how long parts have been in use since their last
                service.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts based on critical parts only */}
      {criticalParts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Active alerts</h2>
          </div>

          <div className="space-y-3">
            <Card className="p-4 border-amber-500">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">
                    Critical components need attention
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {criticalParts.map((p) => p.name).join(', ')}
                  </p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
            </Card>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming maintenance</h2>
          </div>

          {scheduled.length === 0 ? (
            <p className="text-muted-foreground">No upcoming services.</p>
          ) : (
            <div className="space-y-3">
              {scheduled.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.serviceName}</h3>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(item.serviceDate).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Services */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Recent services</h2>
          </div>

          {recentServices.length === 0 ? (
            <p className="text-muted-foreground">No completed services.</p>
          ) : (
            <div className="space-y-3">
              {recentServices.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{service.serviceName}</h3>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(service.serviceDate).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/history">View full history</Link>
          </Button>
        </Card>
      </div>

      {/* Car parts health by age */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Car Parts Health</h2>

        {partsHealth.every((p) => p.status === 'unknown') ? (
          <p className="text-sm text-muted-foreground">
            No component data yet. Once your services include engine oil, brake
            pads, or tyres, their health will appear here.
          </p>
        ) : (
          <div className="space-y-4">
            {partsHealth.map((part) => (
              <div key={part.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{part.name}</p>
                    {part.ageMonths != null && (
                      <p className="text-xs text-muted-foreground">
                        Last changed about {part.ageMonths} month
                        {part.ageMonths === 1 ? '' : 's'} ago
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {part.healthPercent.toFixed(0)}%
                    </p>
                    <Badge variant={getPartBadgeVariant(part.status)}>
                      {part.status === 'good'
                        ? 'Good'
                        : part.status === 'warning'
                        ? 'Warning'
                        : part.status === 'critical'
                        ? 'Critical'
                        : 'Unknown'}
                    </Badge>
                  </div>
                </div>
                <Progress value={part.healthPercent} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
