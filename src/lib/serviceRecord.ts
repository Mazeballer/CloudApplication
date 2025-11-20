export async function createServiceBooking(data: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/serviceRecord/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        console.error(await res.text());
        throw new Error("Failed to create service booking");
    }

    return await res.json();
}

export async function getAllServiceRecords() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/serviceRecord/all`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!res.ok) {
        console.error(await res.text());
        throw new Error("Failed to fetch service records");
    }

    return await res.json();
}
