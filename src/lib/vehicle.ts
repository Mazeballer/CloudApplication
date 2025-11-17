const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function addVehicle(vehicle: any, email: string) {
    const res = await fetch(`${API_URL}/api/vehicles/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            plate: vehicle.plate,
            mileage: vehicle.mileage,
            image: vehicle.image,
            email: email,
        }),
    });

    return res.json();
}

export async function getVehiclesByEmail(email: string) {
    const safeEmail = encodeURIComponent(email);
    const res = await fetch(`${API_URL}/api/vehicles/user/${safeEmail}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
}
