export async function addService(service: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to add service" };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function getWorkshopService(email: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/workshop/${email}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch service for workshop. ");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching workshop's service:", error);
    return [];
  }
}

export interface Service {
  id: string;
  workshopProfileId: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  price: number;
  status: string;
}

export interface GroupedServiceResponse {
  workshopProfileId: string;
  services: Service[];
}

export async function getAllWorkshopServices(): Promise<
  Record<string, Service[]>
> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/all-workshops`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch all workshop services.");
    }

    // The API returns a list of grouped objects: [{ workshopProfileId: 'guid', services: [...] }, ...]
    const groupedList: GroupedServiceResponse[] = await res.json();

    // Convert the list into the required Record<string, Service[]> dictionary format
    const servicesByWorkshop: Record<string, Service[]> = groupedList.reduce(
      (acc, group) => {
        acc[group.workshopProfileId] = group.services;
        return acc;
      },
      {} as Record<string, Service[]> // Initialize as empty record
    );

    return servicesByWorkshop;
  } catch (error) {
    console.error("Error fetching all services grouped by workshop:", error);
    return {}; // Return an empty object on failure
  }
}
