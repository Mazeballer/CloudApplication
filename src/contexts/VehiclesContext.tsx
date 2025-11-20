"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getVehiclesByEmail } from "@/lib/vehicle";
import { useAuth } from "@/lib/auth";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  mileage: string;
  image: string;
  color: string;
  purchaseDate: string;
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
  const { user, isLoading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refreshVehicles = async () => {
    // Don't fetch if no user email
    if (!user?.email) {
      setVehicles([]);
      setTotalVehicles(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getVehiclesByEmail(user.email);

      const formatted = data.vehicles.map((v: any) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year,
        plate: v.plateNumber,
        mileage: `${v.currentMileage.toLocaleString()} km`,
        image: v.image || "/placeholder.svg",
        color: v.color,
        purchaseDate: v.purchaseDate,
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
    // Wait for auth to finish loading
    if (authLoading) return;

    // Only fetch vehicles if user is authenticated
    if (user?.email) {
      refreshVehicles();
    } else {
      // Clear vehicles if no user
      setVehicles([]);
      setTotalVehicles(0);
      setLoading(false);
    }
  }, [authLoading, user?.email]); // Re-run when auth state changes

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
