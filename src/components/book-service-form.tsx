'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Calendar,
  CheckCircle,
  Star,
  Timer,
  Wrench,
  Zap,
  Hammer,
} from 'lucide-react';

import type { LatLngExpression } from 'leaflet';

import { getCurrentUser } from '@/lib/auth';
import { createServiceBooking } from '@/lib/serviceRecord';
import { useWorkshops } from '@/contexts/WorkshopContext';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useServices } from '@/contexts/ServiceContext';

// Load Leaflet map only on client
const WorkshopMap = dynamic(
  () => import('@/components/workshop-map').then((m) => m.WorkshopMap),
  { ssr: false }
);

const formatDuration = (totalMinutes: number) => {
  if (totalMinutes === 0) return '0 mins';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (minutes > 0) parts.push(`${minutes} mins`);

  return parts.join(' ');
};

function convertTo24h(time12h: string) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = (parseInt(hours) + 12).toString();

  return `${hours.padStart(2, '0')}:${minutes}`;
}

const getCategoryIcon = (category: string, className: string) => {
  switch (category) {
    case 'Maintenance':
      return <Wrench className={className} />;
    case 'Diagnostics':
      return <Zap className={className} />;
    case 'Repair':
      return <Hammer className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

function formatTime12h(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${suffix}`;
}

function generateTimeSlots(start: string, end: string) {
  const slots: string[] = [];
  let current = new Date(`2000-01-01T${start}`);
  const endDate = new Date(`2000-01-01T${end}`);

  while (current <= endDate) {
    const hh = current.getHours().toString().padStart(2, '0');
    const mm = current.getMinutes().toString().padStart(2, '0');
    slots.push(formatTime12h(`${hh}:${mm}`));
    current.setMinutes(current.getMinutes() + 60);
  }

  return slots;
}

// basic Haversine in km
function distanceKm(a: LatLngExpression, b: LatLngExpression) {
  const [lat1, lon1] = a as [number, number];
  const [lat2, lon2] = b as [number, number];

  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const la1 = toRad(lat1);
  const la2 = toRad(lat2);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function BookServiceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [closedMessage, setClosedMessage] = useState('');

  // map related
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const { workshops, loading: loadingWorkshops } = useWorkshops();
  const { vehicles, loading: loadingVehicles } = useVehicles();
  const { servicesByWorkshop, loading: loadingServices } = useServices();

  // only approved workshops are visible to drivers
  const visibleWorkshops = useMemo(
    () =>
      (workshops || []).filter((w: any) => {
        const status =
          w.status ?? w.approvalStatus ?? w.approvalStatus?.toString?.() ?? '';
        return status.toString().toLowerCase() === 'approved';
      }),
    [workshops]
  );

  // nearest 5 workshops based on user location (if we have coords)
  const nearestWorkshops = useMemo(() => {
    if (userLocation) {
      const withCoords = visibleWorkshops.filter(
        (w: any) => w.latitude && w.longitude
      );

      if (withCoords.length > 0) {
        return withCoords
          .map((w: any) => ({
            workshop: w,
            distance: distanceKm(userLocation, [
              w.latitude as number,
              w.longitude as number,
            ]),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)
          .map((x) => x.workshop);
      }
    }

    // fallback: just first 5 approved
    return visibleWorkshops.slice(0, 5);
  }, [visibleWorkshops, userLocation]);

  const services = selectedWorkshop
    ? (servicesByWorkshop[selectedWorkshop.id] || []).filter(
        (s: any) => s.status === 'Active'
      )
    : [];

  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setSelectedService(null);
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
      console.error('Please fill in all required fields');
      return;
    }

    const user = getCurrentUser();

    const payload = {
      userId: user?.id,
      vehicleId: selectedVehicle.id,
      workshopProfileId: selectedWorkshop.id,
      serviceId: selectedService.id,
      serviceDate: new Date(
        `${selectedDate}T${convertTo24h(selectedTime)}`
      ).toISOString(),
      serviceMileage: parseInt(selectedVehicle.mileage.replace(/[^0-9]/g, '')),
      remarks: notes,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      status: 'Request',
    };

    await createServiceBooking(payload);

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  // operating hours and time slots
  useEffect(() => {
    if (!selectedDate || !selectedWorkshop) return;

    const d = new Date(selectedDate);
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'long' });

    const dayHours = selectedWorkshop.hours?.hoursByDay?.find(
      (x: any) => x.day === dayName
    );

    if (!dayHours || !dayHours.isOpen) {
      setClosedMessage(`This workshop is closed on ${dayName}.`);
      setTimeSlots([]);
      return;
    }

    setClosedMessage('');
    const slots = generateTimeSlots(dayHours.startTime, dayHours.endTime);
    setTimeSlots(slots);
  }, [selectedDate, selectedWorkshop]);

  // geolocate user
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setLocationError('Unable to retrieve your location.');
      }
    );
  }, []);

  const defaultCenter: LatLngExpression = [3.139, 101.6869];

  const mapCenter: LatLngExpression = (() => {
    if (
      selectedWorkshop &&
      selectedWorkshop.latitude &&
      selectedWorkshop.longitude
    ) {
      return [selectedWorkshop.latitude, selectedWorkshop.longitude];
    }

    if (userLocation) return userLocation;

    const firstWithCoords = nearestWorkshops.find(
      (w: any) => w.latitude && w.longitude
    );
    if (firstWithCoords) {
      return [firstWithCoords.latitude, firstWithCoords.longitude];
    }

    return defaultCenter;
  })();

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
          Your appointment at {selectedWorkshop?.name} has been confirmed for{' '}
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
        {/* Map with nearest 5 workshops */}
        <Card className="overflow-hidden h-80">
          <WorkshopMap
            center={mapCenter}
            workshops={nearestWorkshops}
            userLocation={userLocation}
          />
          {locationError && (
            <p className="px-4 py-2 text-xs text-muted-foreground">
              {locationError}
            </p>
          )}
        </Card>

        {/* Workshop List: nearest 5 only */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Workshop</h3>

          {loadingWorkshops && (
            <p className="text-muted-foreground">Loading workshops...</p>
          )}

          {!loadingWorkshops &&
            nearestWorkshops.map((workshop: any) => (
              <Card
                key={workshop.id}
                className={`group relative p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedWorkshop?.id === workshop.id
                    ? 'ring-2 ring-primary shadow-md bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleWorkshopSelect(workshop)}
              >
                {selectedWorkshop?.id === workshop.id && (
                  <div className="absolute top-3 right-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
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
                        .join(', ')}
                    </span>
                  </div>

                  <div className="border-t border-border/50" />

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
                  </div>

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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {services.map((service: any) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`col-span-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-md'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(
                          service.category,
                          selectedService?.id === service.id
                            ? 'h-6 w-6 text-primary'
                            : 'h-6 w-6 text-muted-foreground'
                        )}
                        <div>
                          <p className="font-semibold text-base">
                            {service.name}
                          </p>
                          <Badge
                            className={
                              service.category === 'Maintenance'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : service.category === 'Diagnostics'
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : service.category === 'Repair'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            }
                          >
                            {service.category}
                          </Badge>
                        </div>
                      </div>

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

        {selectedService && selectedWorkshop && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Vehicle *</Label>

                {loadingVehicles ? (
                  <p className="text-muted-foreground">Loading vehicles...</p>
                ) : (
                  <Select
                    required
                    value={selectedVehicle?.id || ''}
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
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Time *</Label>

                {closedMessage ? (
                  <p className="text-red-600 text-sm">{closedMessage}</p>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? 'default' : 'outline'}
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
