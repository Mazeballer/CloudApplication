"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Wrench,
  AlertTriangle,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RawRecord = {
  id: string;
  vehicleId: string;
  serviceName: string;
  workshopName: string;
  status: string; // Scheduled, Completed, etc.
  serviceDate: string;
  serviceMileage: number;
  remarks?: string;
};

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
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to load service records:", res.status);
          return;
        }

        const data = await res.json();
        const userRecords: RawRecord[] = data.byUser[user.id] ?? [];

        // Only take records for THIS vehicle
        const vehicleRecords = userRecords.filter(
          (r) => r.vehicleId === vehicleId
        );

        setRecords(vehicleRecords);
      } catch (err) {
        console.error("VehicleDetails fetch error:", err);
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

  // ------------------------------------------------------------------
  // REAL DATA CALCULATIONS
  // ------------------------------------------------------------------

  const currentMileage = parseInt(vehicle.mileage.replace(/[^\d]/g, "")) || 0;

  // Completed services for this vehicle
  const completed = records
    .filter((r) => r.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
    );

  // Scheduled (upcoming maintenance)
  const scheduled = records.filter((r) => r.status === "Scheduled");

  // Determine last completed service mileage
  const lastServiceMileage =
    completed.length > 0 ? completed[0].serviceMileage : currentMileage;

  // Assume service interval = 5000 km (you can store this in DB later)
  const SERVICE_INTERVAL = 5000;
  const nextServiceAt = lastServiceMileage + SERVICE_INTERVAL;
  const kmRemaining = Math.max(nextServiceAt - currentMileage, 0);

  // Dynamic alert
  const alerts =
    kmRemaining < 1000
      ? [
          {
            type: "warning",
            message: `Service due in ${kmRemaining} km`,
            date: "Soon",
          },
        ]
      : [];

  // Recent services → completed list
  const recentServices = completed.slice(0, 3);

  // Service progress bar
  const progress = Math.min(
    ((currentMileage - lastServiceMileage) / SERVICE_INTERVAL) * 100,
    100
  );

  const formatNumber = (n: number) => n.toLocaleString();

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

      {/* Vehicle Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={vehicle.image || "/placeholder.svg"}
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

            {/* Vehicle Health */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Service Interval Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {progress.toFixed(0)}%
                </p>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Active Alerts</h2>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <Card key={index} className="p-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.date}
                    </p>
                  </div>
                  <Badge variant="secondary">{alert.type}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming Maintenance</h2>
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
            <h2 className="text-xl font-bold">Recent Services</h2>
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
            <Link href="/dashboard/history">View Full History</Link>
          </Button>
        </Card>
      </div>

      {/* Service Interval */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Next Service Countdown</h2>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground">
            Remaining: {formatNumber(kmRemaining)} km
          </p>
          <Progress value={progress} className="h-3" />
        </div>
      </Card>
    </div>
  );
}
