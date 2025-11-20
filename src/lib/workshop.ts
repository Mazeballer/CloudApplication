export async function getWorkshops() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workshop/getAllWorkshops`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch workshops");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return [];
    }
}

export async function getCurrentWorkshops(email: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/workshop/user/${email}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch workshops");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return [];
    }
}


