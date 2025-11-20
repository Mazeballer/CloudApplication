"use client";

import { usePathname } from "next/navigation";
import { VehiclesProvider } from "@/contexts/VehiclesContext";
import { WorkshopProvider } from "@/contexts/WorkshopContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { ServiceRecordProvider } from "@/contexts/ServiceRecordContext";

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT receive the providers
  const excludeProviders = ["/workshop/login", "/workshop/signup"];

  // If the current path is one of the excluded pages → return children WITHOUT providers
  if (excludeProviders.includes(pathname)) {
    return <>{children}</>;
  }

  // Default → wrap with providers
  return (
    <VehiclesProvider>
      <WorkshopProvider>
        <ServiceProvider>
          <ServiceRecordProvider>{children}</ServiceRecordProvider>
        </ServiceProvider>
      </WorkshopProvider>
    </VehiclesProvider>
  );
}
