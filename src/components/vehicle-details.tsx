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

export function VehicleDetails({ vehicleId }: { vehicleId: string }) {
  const { vehicles } = useVehicles();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get actual vehicle from DB/context
  const vehicle = vehicles.find((v) => v.id === vehicleId);

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

  const fakeNextServiceMileage = 50000;
  const fakeHealthScore = 85;

  const fakeAlerts = [
    {
      type: "warning",
      message: "Oil change due in 800 km",
      date: "Due next week",
    },
  ];

  const fakeUpcomingMaintenance = [
    { service: "Oil Change", dueIn: "800 km", priority: "high" },
    { service: "Tire Rotation", dueIn: "3,200 km", priority: "medium" },
    { service: "Air Filter", dueIn: "5,000 km", priority: "low" },
  ];

  const fakeRecentServices = [
    { service: "Brake Inspection", date: "Dec 15, 2024", cost: "$120.00" },
    { service: "Tire Rotation", date: "Aug 20, 2024", cost: "$70.00" },
  ];

  // Service progress bar calculation
  const currentMileageNumber =
    parseInt(vehicle.mileage.replace(/[^\d]/g, "")) || 0;
  const serviceProgress = (currentMileageNumber / fakeNextServiceMileage) * 100;
  const kmUntilService = Math.max(
    fakeNextServiceMileage - currentMileageNumber,
    0
  );

  // Format numbers safely (only on client)
  const formatNumber = (num: number) => {
    if (!isMounted) return num.toString();
    return num.toLocaleString();
  };

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
            alt={`${vehicle.make} ${vehicle.model}`}
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

              <Button>Book Service</Button>
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
                <p className="font-medium" suppressHydrationWarning>
                  {formatNumber(fakeNextServiceMileage)} km
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Vehicle Health Score</p>
                <p className="text-2xl font-bold text-primary">
                  {fakeHealthScore}%
                </p>
              </div>
              <Progress value={fakeHealthScore} className="h-3" />
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {fakeAlerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Active Alerts</h2>
          </div>

          <div className="space-y-3">
            {fakeAlerts.map((alert, index) => (
              <Card
                key={index}
                className={`p-4 ${
                  alert.type === "critical"
                    ? "border-red-500"
                    : "border-amber-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Bell
                    className={`h-5 w-5 ${
                      alert.type === "critical"
                        ? "text-red-500"
                        : "text-amber-500"
                    } mt-0.5`}
                  />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.date}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.type === "critical" ? "destructive" : "secondary"
                    }
                  >
                    {alert.type}
                  </Badge>
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

          <div className="space-y-3">
            {fakeUpcomingMaintenance.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.service}</h3>
                  <Badge
                    variant={
                      item.priority === "critical"
                        ? "destructive"
                        : item.priority === "high"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Due in: {item.dueIn}
                </p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Services */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Recent Services</h2>
          </div>

          <div className="space-y-3">
            {fakeRecentServices.map((service, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{service.service}</h3>
                  <p className="font-bold text-primary">{service.cost}</p>
                </div>
                <p className="text-sm text-muted-foreground">{service.date}</p>
              </Card>
            ))}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/history">View Full History</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Maintenance Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Service Interval Progress</h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Current: {vehicle.mileage}
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              Next service: {formatNumber(fakeNextServiceMileage)} km
            </span>
          </div>

          <Progress value={Math.min(serviceProgress, 100)} className="h-3" />

          <p
            className="text-sm text-muted-foreground text-center"
            suppressHydrationWarning
          >
            {kmUntilService > 0
              ? `${formatNumber(kmUntilService)} km until next service`
              : "Service overdue"}
          </p>
        </div>
      </Card>
    </div>
  );
}
