'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getWorkshops, getCurrentWorkshops } from '@/lib/workshop';
import { useAuth } from '@/lib/auth';

interface WorkshopAddress {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface DailyHours {
  day: string;
  isOpen: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface WorkshopHours {
  // make this an array so it works with hours.hoursByDay.map(...)
  hoursByDay: DailyHours[];
}

export interface Workshop {
  id: string;
  name: string;
  address: WorkshopAddress;
  hours: WorkshopHours;
  rating: number;

  // new fields for maps and filtering
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null; // could be "Approved" or "Pending"
  approvalStatus?: string | null; // in case backend uses this
}

interface WorkshopContextType {
  workshops: Workshop[];
  currentWorkshop: Workshop | null;
  totalWorkshops: number;
  loading: boolean;
  error: string | null;
  refreshWorkshops: () => Promise<void>;
}

const WorkshopContext = createContext<WorkshopContextType | null>(null);

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const { user, userType, isLoading: authLoading } = useAuth();

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null);
  const [totalWorkshops, setTotalWorkshops] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkshops = async () => {
    if (!user?.email) {
      console.warn('User email missing. Skipping workshop refresh.');
      return;
    }

    try {
      setLoading(true);

      // get all workshops for driver side
      const data = await getWorkshops();

      const formatted: Workshop[] = data.map((w: any) => ({
        id: w.id,
        name: w.name ?? w.workshopName ?? w.WorkshopName,
        address: w.address,
        // API usually returns operatingHours from the controller
        hours: w.operatingHours ?? w.hours ?? { hoursByDay: [] },
        rating: w.rating ?? 0,
        latitude: w.latitude ?? w.geoLatitude ?? w.GeoLatitude ?? null,
        longitude: w.longitude ?? w.geoLongitude ?? w.GeoLongitude ?? null,
        status: w.status ?? w.approvalStatus ?? w.ApprovalStatus ?? null,
        approvalStatus: w.approvalStatus ?? w.ApprovalStatus ?? null,
      }));

      // if logged in as workshop, also load their own profile
      if (userType === 'Workshop') {
        const currentData = await getCurrentWorkshops(user.email);
        const workshop = currentData?.workshops?.[0];

        if (workshop) {
          const formattedCurrent: Workshop = {
            id: workshop.id ?? workshop.Id,
            name:
              workshop.name ?? workshop.workshopName ?? workshop.WorkshopName,
            address: workshop.address,
            hours: workshop.operatingHours ??
              workshop.OperatingHours ??
              workshop.hours ?? { hoursByDay: [] },
            rating: workshop.rating ?? workshop.Rating ?? 0,
            latitude:
              workshop.latitude ??
              workshop.geoLatitude ??
              workshop.GeoLatitude ??
              null,
            longitude:
              workshop.longitude ??
              workshop.geoLongitude ??
              workshop.GeoLongitude ??
              null,
            status:
              workshop.status ??
              workshop.approvalStatus ??
              workshop.ApprovalStatus ??
              null,
            approvalStatus:
              workshop.approvalStatus ?? workshop.ApprovalStatus ?? null,
          };

          setCurrentWorkshop(formattedCurrent);
        }
      } else {
        setCurrentWorkshop(null);
      }

      setWorkshops(formatted);
      setTotalWorkshops(formatted.length);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load workshops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (user?.email) {
      refreshWorkshops();
    }
  }, [authLoading, user?.email, userType]);

  return (
    <WorkshopContext.Provider
      value={{
        workshops,
        currentWorkshop,
        totalWorkshops,
        loading,
        error,
        refreshWorkshops,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshops() {
  const ctx = useContext(WorkshopContext);
  if (!ctx) {
    throw new Error('useWorkshops must be used inside <WorkshopProvider>');
  }
  return ctx;
}
