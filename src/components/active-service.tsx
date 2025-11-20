"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useServiceRecords } from "@/contexts/ServiceRecordContext";

export function ActiveService() {
  const { user } = useAuth();
  const { recordsByUser, loading } = useServiceRecords();
  const [activeItems, setActiveItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user || loading) return;

    const userRecords = recordsByUser[user.id] || [];

    const active = userRecords
      .filter((r) => r.status === "Active") // ⭐ your active status
      .map((r) => ({
        service: r.serviceName,
        vehicle: r.vehicleName,
        workshop: r.workshopName,
        date: new Date(r.serviceDate).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        icon: Clock,
      }));

    setActiveItems(active);
  }, [recordsByUser, loading, user]);

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Active Services</h2>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : activeItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No active services</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{item.service}</h3>
                    <Badge variant="secondary">in progress</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.vehicle}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Location: {item.workshop}
                  </p>

                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
