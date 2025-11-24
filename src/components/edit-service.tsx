'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  componentTypes?: string[];
}

const serviceCategories = ['Maintenance', 'Diagnostics', 'Repair'];

// Values must match backend enum names exactly
const COMPONENT_TYPES = [
  { value: 'EngineOil', label: 'Engine oil' },
  { value: 'BrakePads', label: 'Brake pads' },
  { value: 'Tyres', label: 'Tyres' }, // <- fixed value here
  { value: 'Battery', label: 'Battery' },
  { value: 'AirFilter', label: 'Air filter' },
  { value: 'CabinFilter', label: 'Cabin filter' },
  { value: 'Coolant', label: 'Coolant system' },
  { value: 'SparkPlugs', label: 'Spark plugs' },
  { value: 'TransmissionFluid', label: 'Transmission fluid' },
];

export function EditServiceDialog({
  service,
  onUpdated,
}: {
  service: Service;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(service.name);
  const [category, setCategory] = useState(service.category);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [durationMinutes, setDurationMinutes] = useState(
    service.durationMinutes
  );

  const [componentTypes, setComponentTypes] = useState<string[]>(
    service.componentTypes ?? []
  );

  // When dialog opens, reset form from latest service props
  const resetFormFromService = () => {
    setName(service.name);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes);
    setComponentTypes(service.componentTypes ?? []);
  };

  const toggleComponent = (value: string) => {
    setComponentTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${service.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            description,
            price,
            durationMinutes,
            componentTypes,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('Update service failed', res.status, text);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        console.error('Update service returned success = false', data);
        return;
      }

      onUpdated();
      setOpen(false);
    } catch (err) {
      console.error('Update service error', err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          resetFormFromService();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-4 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="service-name">Service Name</Label>
          <Input
            id="service-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Service Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (RM)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value || '0'))}
            min={0}
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={durationMinutes}
            onChange={(e) =>
              setDurationMinutes(parseInt(e.target.value || '0', 10))
            }
            min={0}
          />
        </div>

        {/* Components multi select */}
        <div className="space-y-2">
          <Label>Components</Label>
          <p className="text-xs text-muted-foreground">
            Update which car components this service covers
          </p>
          <div className="grid grid-cols-2 gap-2">
            {COMPONENT_TYPES.map((ct) => (
              <label key={ct.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-600 rounded border border-muted-foreground/40"
                  checked={componentTypes.includes(ct.value)}
                  onChange={() => toggleComponent(ct.value)}
                />
                <span>{ct.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
