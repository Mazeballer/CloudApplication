export function estimateNextOilChange(records: any[], currentMileage: number, oilIntervalKm = 5000) {
    if (!records || records.length < 2) {
        return { hasEnoughData: false };
    }

    // Sort by date
    const sorted = [...records].sort(
        (a, b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime()
    );

    console.log("Sorted: ", sorted)

    const old = sorted[sorted.length - 2];
    const recent = sorted[sorted.length - 1];

    console.log("Old: ", old, "New: ", recent);

    const date1 = new Date(old.serviceDate);
    const date2 = new Date(recent.serviceDate);

    console.log("Date1: ", date1, "Date2: ", date2);

    const daysDifference =
        (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);

    console.log("Day:", daysDifference);
    if (daysDifference <= 0) {
        return { error: "Invalid date difference" };
    }

    const mileageDifference = recent.serviceMileage - old.serviceMileage;
    const dailyMileage = mileageDifference / daysDifference;

    const nextTargetMileage = currentMileage + oilIntervalKm;
    const remainingMileage = nextTargetMileage - currentMileage;

    const estimatedDays = remainingMileage / dailyMileage;

    const nextDate = new Date(date2);
    nextDate.setDate(nextDate.getDate() + estimatedDays);

    return {
        hasEnoughData: true,
        dailyMileage,
        nextTargetMileage,
        nextDate,
    };
}
