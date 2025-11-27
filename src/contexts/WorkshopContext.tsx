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

export interface DailyHours {
  day: string; // "monday", "tuesday", ...
  isOpen: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface WorkshopHours {
  hoursByDay: DailyHours[];
}

export interface Workshop {
  id: string;
  name: string;
  address: WorkshopAddress;
  hours: WorkshopHours;
  rating: number;

  // extra fields for map and filters
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null;
  approvalStatus?: string | null;
}

interface WorkshopContextType {
  workshops: Workshop[];
  currentWorkshop: Workshop | null;
  totalWorkshops: number;
  loading: boolean;
  error: string | null;
  refreshWorkshops: () => Promise<void>;
}

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type DayName = (typeof DAY_ORDER)[number];

function normaliseHours(input: any[]): DailyHours[] {
  const map = new Map<DayName, DailyHours>();

  for (const h of input || []) {
    if (!h) continue;
    const key = String(h.day ?? '').toLowerCase() as DayName;
    if (!DAY_ORDER.includes(key)) continue;

    map.set(key, {
      day: key,
      isOpen: Boolean(h.isOpen),
      startTime: h.startTime ?? null,
      endTime: h.endTime ?? null,
    });
  }

  // Always return all 7 days in order
  return DAY_ORDER.map((day) => {
    return (
      map.get(day) ?? {
        day,
        isOpen: false,
        startTime: null,
        endTime: null,
      }
    );
  });
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

      // 1) all workshops for drivers
      const data = await getWorkshops();

      const formatted: Workshop[] = data.map((w: any) => {
        const rawHours = w.operatingHours ?? w.OperatingHours ?? w.hours ?? {};
        const rawHoursByDay: DailyHours[] =
          rawHours.hoursByDay ?? rawHours.HoursByDay ?? [];

        const hoursByDay = normaliseHours(rawHoursByDay);

        return {
          id: w.id ?? w.Id,
          name: w.name ?? w.workshopName ?? w.WorkshopName,
          address: w.address,
          hours: { hoursByDay },
          rating: w.rating ?? w.Rating ?? 0,
          latitude: w.latitude ?? w.geoLatitude ?? w.GeoLatitude ?? null,
          longitude: w.longitude ?? w.geoLongitude ?? w.GeoLongitude ?? null,
          status: w.status ?? w.approvalStatus ?? w.ApprovalStatus ?? null,
          approvalStatus: w.approvalStatus ?? w.ApprovalStatus ?? null,
        };
      });

      // 2) current workshop for workshop owner
      if (userType === 'Workshop') {
        const currentData = await getCurrentWorkshops(user.email);
        const workshop = currentData?.workshops?.[0];

        if (workshop) {
          const rawHours =
            workshop.operatingHours ??
            workshop.OperatingHours ??
            workshop.hours ??
            {};

          const rawHoursByDay: DailyHours[] =
            rawHours.hoursByDay ?? rawHours.HoursByDay ?? [];

          const hoursByDay = normaliseHours(rawHoursByDay);

          const formattedCurrent: Workshop = {
            id: workshop.id ?? workshop.Id,
            name:
              workshop.name ?? workshop.workshopName ?? workshop.WorkshopName,
            address: workshop.address,
            hours: { hoursByDay },
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
