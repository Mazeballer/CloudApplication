"use client";

import { Card } from "@/components/ui/card";
import { Car, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";

export function DashboardOverview() {
  const { user } = useAuth();
  const { vehicles } = useVehicles();
  const { recordsByUser, loading } = useServiceRecords();

  const [stats, setStats] = useState({
    totalVehicles: 0,
    servicesDue: 0,
    activeBookings: 0,
    servicesCompleted: 0,
  });

  useEffect(() => {
    if (!user || loading) return;

    const userRecords = recordsByUser[user.id] || [];

    // STATUS LOGIC
    const servicesDue = userRecords.filter(
      (r) => r.status === "Scheduled"
    ).length;

    const servicesCompleted = userRecords.filter(
      (r) => r.status === "Completed"
    ).length;

    const activeBookings = userRecords.filter(
      (r) => r.status === "Active"
    ).length;

    setStats({
      totalVehicles: vehicles.length,
      servicesDue,
      activeBookings,
      servicesCompleted,
    });
  }, [vehicles, user, recordsByUser, loading]);

  const statItems = [
    {
      label: "Total Vehicles",
      value: stats.totalVehicles.toString(),
      icon: Car,
      color: "text-primary",
    },
    {
      label: "Services Due",
      value: stats.servicesDue.toString(),
      icon: Wrench,
      color: "text-amber-500",
    },
    {
      label: "Active / Upcoming",
      value: stats.activeBookings.toString(),
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      label: "Services Completed",
      value: stats.servicesCompleted.toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
