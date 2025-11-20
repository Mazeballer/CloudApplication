"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Calendar,
  CheckCircle,
  MapPin,
  Star,
  DollarSign,
  Timer,
  Wrench,
  Zap,
  Hammer,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { createServiceBooking } from "@/lib/serviceRecord";
import { useWorkshops } from "@/contexts/WorkshopContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useServices } from "@/contexts/ServiceContext";

const formatDuration = (totalMinutes: number) => {
  if (totalMinutes === 0) return "0 mins";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let parts = [];
  if (hours > 0) {
    parts.push(`${hours} hr`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} mins`);
  }

  return parts.join(" ");
};

function convertTo24h(time12h: string) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = (parseInt(hours) + 12).toString();

  return `${hours.padStart(2, "0")}:${minutes}`;
}

// Helper function to get the icon component based on category
const getCategoryIcon = (category: string, className: string) => {
  switch (category) {
    case "Maintenance":
      return <Wrench className={className} />;
    case "Diagnostics":
      return <Zap className={className} />;
    case "Repair":
      return <Hammer className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

function formatTime12h(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

function generateTimeSlots(start: string, end: string) {
  const slots = [];
  let current = new Date(`2000-01-01T${start}`);
  const endDate = new Date(`2000-01-01T${end}`);

  while (current <= endDate) {
    const hh = current.getHours().toString().padStart(2, "0");
    const mm = current.getMinutes().toString().padStart(2, "0");
    slots.push(formatTime12h(`${hh}:${mm}`));
    current.setMinutes(current.getMinutes() + 60); // 1-hour interval
  }

  return slots;
}

export function BookServiceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [closedMessage, setClosedMessage] = useState("");

  // 🚀 Load workshops & vehicles from context
  const { workshops, loading: loadingWorkshops } = useWorkshops();
  const { vehicles, loading: loadingVehicles } = useVehicles();
  const { servicesByWorkshop, loading: loadingServices } = useServices();

  console.log(workshops);

  const services = selectedWorkshop
    ? servicesByWorkshop[selectedWorkshop.id] || []
    : [];

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setSelectedService(null); // reset service when selecting workshop
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedWorkshop ||
      !selectedService ||
      !selectedVehicle ||
      !selectedDate ||
      !selectedTime
    ) {
      console.error("Please fill in all required fields");
      return;
    }

    const user = getCurrentUser();

    const payload = {
      vehicleId: selectedVehicle.id, // make sure you pass ID not string
      workshopProfileId: selectedWorkshop.id,
      serviceId: selectedService.id,
      serviceDate: new Date(
        `${selectedDate}T${convertTo24h(selectedTime)}`
      ).toISOString(),
      serviceMileage: parseInt(selectedVehicle.mileage.replace(/[^0-9]/g, "")),
      remarks: notes,

      serviceName: selectedService.name,
      servicePrice: selectedService.price,

      status: "Scheduled",
    };

    await createServiceBooking(payload);

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  useEffect(() => {
    if (!selectedDate || !selectedWorkshop) return;

    const d = new Date(selectedDate);
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });

    const dayHours = selectedWorkshop.hours?.hoursByDay?.find(
      (d: any) => d.day === dayName
    );

    if (!dayHours || !dayHours.isOpen) {
      setClosedMessage(`This workshop is closed on ${dayName}.`);
      setTimeSlots([]);
      return;
    }

    setClosedMessage("");
    const slots = generateTimeSlots(dayHours.startTime, dayHours.endTime);
    setTimeSlots(slots);
  }, [selectedDate, selectedWorkshop]);

  // ✔ Success screen
  if (submitted) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">
          Service Booked Successfully!
        </h2>
        <p className="text-muted-foreground mb-6">
          Your appointment at {selectedWorkshop?.name} has been confirmed for{" "}
          {selectedDate} at {selectedTime}.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Map */}
        <Card className="overflow-hidden h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </Card>

        {/* Workshop List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Workshop</h3>

          {loadingWorkshops && (
            <p className="text-muted-foreground">Loading workshops...</p>
          )}

          {!loadingWorkshops &&
            workshops.map((workshop: any) => (
              <Card
                key={workshop.id}
                className={`group relative p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedWorkshop?.id === workshop.id
                    ? "ring-2 ring-primary shadow-md bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleWorkshopSelect(workshop)}
              >
                {/* Selected Indicator */}
                {selectedWorkshop?.id === workshop.id && (
                  <div className="absolute top-3 right-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Workshop Name & Location */}
                  <div className="pr-10">
                    <h4 className="font-bold text-lg mb-1.5 group-hover:text-primary transition-colors">
                      {workshop.name}
                    </h4>
                    <span className="line-clamp-2">
                      {[
                        workshop.address?.street,
                        workshop.address?.city,
                        workshop.address?.state,
                        workshop.address?.postcode,
                        workshop.address?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50" />

                  {/* Rating & Hours */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">
                        {workshop.rating}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        rating
                      </span>
                    </div>

                    {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" />
                      <span>{workshop.hours}</span>
                    </div> */}
                  </div>

                  {/* Selected Badge */}
                  {selectedWorkshop?.id === workshop.id && (
                    <Badge className="w-full justify-center" variant="default">
                      ✓ Workshop Selected
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        {/* Service Selection */}
        {selectedWorkshop && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Services at {selectedWorkshop.name}
            </h3>

            {loadingServices ? (
              <p className="text-muted-foreground">
                Loading available services...
              </p>
            ) : services.length === 0 ? (
              <p className="text-muted-foreground">
                No services have been added to this workshop yet.
              </p>
            ) : (
              <div
                // 1. Replace space-y-4 with grid classes
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
              >
                {services.map((service: any) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    // Optional: Add col-span-1 for clarity in the grid
                    className={`col-span-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Name and Category Badge */}
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(
                          service.category,
                          selectedService?.id === service.id
                            ? "h-6 w-6 text-primary"
                            : "h-6 w-6 text-muted-foreground"
                        )}
                        <div>
                          <p className="font-semibold text-base">
                            {service.name}
                          </p>
                          <Badge
                            className={
                              service.category === "Maintenance"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : service.category === "Diagnostics"
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : service.category === "Repair"
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                            }
                          >
                            {service.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Details and Price */}
                      <div className="text-right space-y-1">
                        <p className="font-bold text-lg text-primary">
                          RM {service.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>{formatDuration(service.durationMinutes)}</span>
                          {selectedService?.id === service.id && (
                            <CheckCircle className="h-5 w-5 text-primary ml-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Booking Form */}
        {selectedService && selectedWorkshop && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicles */}
              <div className="space-y-2">
                <Label>Select Vehicle *</Label>

                {loadingVehicles ? (
                  <p className="text-muted-foreground">Loading vehicles...</p>
                ) : (
                  <Select
                    required
                    value={selectedVehicle?.id || ""}
                    onValueChange={(vehicleId) => {
                      const vehicle = vehicles.find((v) => v.id === vehicleId);
                      setSelectedVehicle(vehicle);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model} ({v.plate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Preferred Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label>Preferred Time *</Label>

                  {closedMessage ? (
                    <p className="text-red-600 text-sm">{closedMessage}</p>
                  ) : (
                    <div
                      className="
                        grid 
                        grid-cols-[repeat(auto-fill,minmax(100px,1fr))] 
                        gap-3
                      "
                    >
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}

                      {timeSlots.length === 0 && (
                        <p className="text-muted-foreground text-sm col-span-full">
                          No available time slots.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="012-3456789"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special requests..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Confirm Booking
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
