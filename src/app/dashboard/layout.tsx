'use client';

import { VehiclesProvider } from '@/contexts/VehiclesContext';
import { WorkshopProvider } from '@/contexts/WorkshopContext';
import { ServiceProvider } from '@/contexts/ServiceContext';
import { ServiceRecordProvider } from '@/contexts/ServiceRecordContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
