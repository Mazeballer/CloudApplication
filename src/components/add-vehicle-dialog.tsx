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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Upload } from "lucide-react";

interface AddVehicleDialogProps {
  onAddVehicle: (vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
    mileage: string;
    vin: string;
    image?: string;
  }) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const popularMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Mazda",
  "Subaru",
  "Kia",
  "Lexus",
  "Tesla",
];

export function AddVehicleDialog({ onAddVehicle }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [mileage, setMileage] = useState("");
  const [vin, setVin] = useState("");
  const [imagePreview, setImagePreview] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddVehicle({
      make,
      model,
      year: parseInt(year),
      plate,
      mileage,
      vin,
      image:
        imagePreview ||
        `/placeholder.svg?height=200&width=300&query=${make} ${model}`,
    });

    // Reset form
    setMake("");
    setModel("");
    setYear("");
    setPlate("");
    setMileage("");
    setVin("");
    setImagePreview(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Car className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter your vehicle details to add it to your garage
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make */}
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Select value={make} onValueChange={setMake} required>
                <SelectTrigger id="make">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {popularMakes.map((makeName) => (
                    <SelectItem key={makeName} value={makeName}>
                      {makeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Camry"
                required
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((yearNum) => (
                    <SelectItem key={yearNum} value={yearNum.toString()}>
                      {yearNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="plate">License Plate *</Label>
              <Input
                id="plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="e.g., ABC-1234"
                required
              />
            </div>

            {/* Mileage */}
            <div className="space-y-2">
              <Label htmlFor="mileage">Current Mileage (km) *</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g., 45000"
                required
              />
            </div>

            {/* VIN */}
            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Optional)</Label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="17-character VIN"
                maxLength={17}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Vehicle Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
