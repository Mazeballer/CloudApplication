"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getVehiclesByEmail } from "@/lib/vehicle";
import { getCurrentUser } from "@/lib/auth";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  mileage: string;
  image: string;
  status: string;
  nextService: string;
}

interface VehiclesContextType {
  vehicles: Vehicle[];
  totalVehicles: number;
  loading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextType | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refreshVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = getCurrentUser();
      if (!user) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      const data = await getVehiclesByEmail(user.email);

      const formatted = data.vehicles.map((v: any) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year,
        plate: v.plateNumber,
        mileage: `${v.currentMileage.toLocaleString()} km`,
        image: v.image || "/placeholder.svg",
        status: "good",
        nextService: "Not scheduled",
      }));

      setVehicles(formatted);
      setTotalVehicles(data.count);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  return (
    <VehiclesContext.Provider
      value={{ vehicles, totalVehicles, loading, error, refreshVehicles }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) {
    throw new Error("useVehicles must be used inside <VehiclesProvider>");
  }
  return ctx;
}
