"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getWorkshops, getCurrentWorkshops } from "@/lib/workshop";
import { useAuth } from "@/lib/auth"; // Use your custom hook

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
  hoursByDay: Record<string, DailyHours>;
}

interface Workshop {
  id: string;
  name: string;
  address: WorkshopAddress;
  hours: WorkshopHours;
  rating: number;
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
      console.warn("User email missing. Skipping workshop refresh.");
      return;
    }

    try {
      setLoading(true);
      const data = await getWorkshops();
      const formatted = data.map((w: any) => ({
        id: w.id,
        name: w.name,
        address: w.address,
        hours: w.hours,
        rating: w.rating,
      }));

      if (userType === "Workshop") {
        const currentData = await getCurrentWorkshops(user.email);
        const workshop = currentData?.workshops?.[0];

        if (workshop) {
          const formattedCurrent = {
            id: workshop.id,
            name: workshop.name,
            address: workshop.address,
            hours: workshop.hours,
            rating: workshop.rating,
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
      setError(err.message || "Failed to load workshops");
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
  if (!ctx)
    throw new Error("useWorkshops must be used inside <WorkshopProvider>");
  return ctx;
}
