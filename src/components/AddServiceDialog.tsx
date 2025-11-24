'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { addService } from '@/lib/service';

interface AddServiceDialogProps {
  workshopId: string;
  onServiceAdded?: () => void;
}

const serviceCategories = ['Maintenance', 'Diagnostics', 'Repair'];

// Must match backend ComponentType enum names
const COMPONENT_TYPES = [
  { value: 'EngineOil', label: 'Engine oil' },
  { value: 'BrakePads', label: 'Brake pads' },
  { value: 'Tyres', label: 'Tyres' },
  { value: 'Battery', label: 'Battery' },
  { value: 'AirFilter', label: 'Air filter' },
  { value: 'CabinFilter', label: 'Cabin filter' },
  { value: 'Coolant', label: 'Coolant system' },
  { value: 'SparkPlugs', label: 'Spark plugs' },
  { value: 'TransmissionFluid', label: 'Transmission fluid' },
];

export function AddServiceDialog({
  workshopId,
  onServiceAdded,
}: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>(serviceCategories[0]);

  // new, multi select components
  const [componentTypes, setComponentTypes] = useState<string[]>([]);

  const toggleComponent = (value: string) => {
    setComponentTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const service = {
      workshopProfileId: workshopId,
      name,
      category,
      description,
      durationMinutes: parseInt(duration, 10),
      price: parseFloat(price),
      componentTypes, // send to backend
    };

    const res = await addService(service);

    if (res.success) {
      onServiceAdded?.();
      setOpen(false);

      // reset fields
      setName('');
      setDescription('');
      setCategory(serviceCategories[0]);
      setDuration('');
      setPrice('');
      setComponentTypes([]);
    } else {
      console.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Create a service your workshop provides.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div className="space-y-2">
            <Label>Service Name *</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Full Service, Engine Oil Change"
            />
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Service Category *</Label>
            <Select required value={category} onValueChange={setCategory}>
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
            <Label>Description *</Label>
            <Textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this service includes"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration (minutes) *</Label>
            <Input
              type="number"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 60"
              min={0}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price (RM) *</Label>
            <Input
              type="number"
              required
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 120"
              min={0}
            />
          </div>

          {/* Related Components, multi select */}
          <div className="space-y-2">
            <Label>Components</Label>
            <p className="text-xs text-muted-foreground">
              Select all car components this service usually covers. For
              example, Full Service might include engine oil, brake pads and
              filters.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COMPONENT_TYPES.map((ct) => (
                <label
                  key={ct.value}
                  className="flex items-center gap-2 text-sm"
                >
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

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Service</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
