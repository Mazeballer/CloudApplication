'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getWorkshopService,
  addService,
  getAllWorkshopServices,
} from '@/lib/service';
import { useAuth } from '@/lib/auth';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  status: 'Active' | 'Inactive';
  componentTypes?: string[];
}

interface WorkshopServiceGroup {
  workshopId: string;
  services: Service[];
}

interface ServiceContextType {
  servicesForCurrentWorkshop: Service[];
  totalCurrentServices: number;
  servicesByWorkshop: Record<string, Service[]>;
  allWorkshopServices: WorkshopServiceGroup[];
  loading: boolean;
  error: string | null;
  refreshCurrentWorkshopServices: () => Promise<void>;
  refreshAllWorkshopServices: () => Promise<void>;
  addNewService: (service: any) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const { user, userType, isLoading: authLoading } = useAuth();

  const [servicesForCurrentWorkshop, setServicesForCurrentWorkshop] = useState<
    Service[]
  >([]);
  const [totalCurrentServices, setTotalCurrentServices] = useState(0);
  const [servicesByWorkshop, setServicesByWorkshop] = useState<
    Record<string, Service[]>
  >({});
  const [allWorkshopServices, setAllWorkshopServices] = useState<
    WorkshopServiceGroup[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCurrentWorkshopServices = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getWorkshopService(user.email);

      const formatted = (data.services ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        durationMinutes: s.durationMinutes,
        price: s.price,
        status: s.status ?? 'Active',
        componentTypes: s.componentTypes ?? [],
      }));

      setServicesForCurrentWorkshop(formatted);
      setTotalCurrentServices(formatted.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load current workshop services');
    } finally {
      setLoading(false);
    }
  };

  const refreshAllWorkshopServices = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkshopServices();

      const mapped: Record<string, Service[]> = {};

      Array.isArray(data) &&
        data.forEach((group: any) => {
          const workshopId = group.workshopProfileId;

          mapped[workshopId] = group.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            durationMinutes: s.durationMinutes,
            price: s.price,
            status: s.status ?? 'Active',
            componentTypes: s.componentTypes ?? [],
          }));
        });

      setServicesByWorkshop(mapped);

      const formatted: WorkshopServiceGroup[] = Object.entries(mapped).map(
        ([workshopId, services]) => ({
          workshopId,
          services,
        })
      );

      setAllWorkshopServices(formatted);
    } catch (err: any) {
      setError(err.message || 'Failed to load services for all workshops');
    } finally {
      setLoading(false);
    }
  };

  const addNewService = async (service: any) => {
    await addService(service);
    await refreshCurrentWorkshopServices();
  };

  useEffect(() => {
    if (authLoading) return;
    if (userType === 'Workshop') {
      refreshCurrentWorkshopServices();
    }
    refreshAllWorkshopServices();
  }, [authLoading, userType, user?.email]);

  return (
    <ServiceContext.Provider
      value={{
        servicesForCurrentWorkshop,
        totalCurrentServices,
        servicesByWorkshop,
        allWorkshopServices,
        loading,
        error,
        refreshCurrentWorkshopServices,
        refreshAllWorkshopServices,
        addNewService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx)
    throw new Error('useServices must be used inside <ServiceProvider>');
  return ctx;
}
