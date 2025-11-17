"use client";

import { VehiclesProvider } from "@/contexts/VehiclesContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VehiclesProvider>{children}</VehiclesProvider>;
}
