"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, // 👈 New Import
  SelectContent, // 👈 New Import
  SelectItem, // 👈 New Import
  SelectTrigger, // 👈 New Import
  SelectValue, // 👈 New Import
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { addService } from "@/lib/service";

interface AddServiceDialogProps {
  workshopId: string;
  onServiceAdded?: () => void;
}

const serviceCategories = ["Maintenance", "Diagnostics", "Repair"];

export function AddServiceDialog({
  workshopId,
  onServiceAdded,
}: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(serviceCategories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const service = {
      workshopProfileId: workshopId,
      name,
      category,
      description,
      durationMinutes: parseInt(duration),
      price: parseFloat(price),
    };

    const res = await addService(service);

    if (res.success) {
      onServiceAdded?.();
      setOpen(false);

      // reset fields
      setName("");
      setDescription("");
      setCategory(serviceCategories[0]);
      setDuration("");
      setPrice("");
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
              placeholder="e.g. Engine Oil Change"
            />
          </div>

          {/* Service CATEGORY (NEW DROPDOWN) */}
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
            />
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
