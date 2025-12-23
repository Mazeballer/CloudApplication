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
import { Car } from "lucide-react";
import { addVehicle } from "@/lib/vehicle";

interface AddVehicleDialogProps {
  onAddVehicle: (vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
    mileage: number;
    image: string;
    email: string;
    color: string;
    purchaseDate: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [color, setColor] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return console.error("User email missing");

    let image = "";

    // 1️⃣ Upload image if exists
    // Using Supabase Storage
    // if (imageFile) {
    //   const fd = new FormData();
    //   fd.append("file", imageFile);

    //   const uploadRes = await fetch("/api/upload", {
    //     method: "POST",
    //     body: fd,
    //   });

    //   const uploadData = await uploadRes.json();
    //   image = uploadData.key; // ★ store object key instead
    // }

    // Using AWS S3 Presigned URL
    if (imageFile) {
      const presignRes = await fetch("/api/upload-aws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: imageFile.name,
          fileType: imageFile.type,
          fileSize: imageFile.size,
        }),
      });

      if (!presignRes.ok) {
        console.error("Failed to get presigned URL");
        return;
      }

      const { uploadUrl, key } = await presignRes.json();

      // 2️⃣ Upload file directly to S3
      const uploadToS3 = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": imageFile.type,
        },
        body: imageFile,
      });

      if (!uploadToS3.ok) {
        console.error("Failed to upload to S3");
        return;
      }

      image = key; // store S3 object key (vehicles/xxx.jpg)
    }

    // 2️⃣ Create vehicle object
    const vehicle = {
      make,
      model,
      year: parseInt(year),
      plate,
      mileage: parseInt(mileage),
      image, // ★ send storage key (e.g. vehicles/xxx.jpg)
      email: userEmail,
      color,
      purchaseDate,
    };

    // 3️⃣ Send to your C# API
    const result = await addVehicle(vehicle, userEmail);

    if (result.success) {
      onAddVehicle(vehicle);
      setOpen(false);
    } else {
      console.error("Failed:", result.error);
    }

    // Reset form
    setMake("");
    setModel("");
    setYear("");
    setPlate("");
    setMileage("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview
    }
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
            Fill in your vehicle information to add it to your garage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manufacturer */}
            <div className="space-y-2">
              <Label>Manufacturer *</Label>
              <Select value={make} onValueChange={setMake} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {popularMakes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Camry"
                required
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label>Year *</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label>License Plate *</Label>
              <Input
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="e.g., ABC1234"
                required
              />
            </div>

            {/* Mileage */}
            <div className="space-y-2">
              <Label>Mileage (km) *</Label>
              <Input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g., 45000"
                required
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Color *</Label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., White / Black / Silver"
                required
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label>Purchase Date *</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Vehicle Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            )}
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
            <Button type="submit">Add Vehicle</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
