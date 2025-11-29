"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

export interface ServiceItemInput {
  itemName: string;
  unitPrice: number;
  quantity: number;
}

interface WorkshopService {
  id: string;
  name: string;
  price: number;
}

export function InvoiceItemsDialog({
  onSubmit,
  workshopServices,
  currentMileage,
  children,
}: {
  onSubmit: (payload: {
    newMileage: number;
    items: ServiceItemInput[];
  }) => void;

  workshopServices: WorkshopService[]; // <-- injected from page
  currentMileage: number; // <-- injected from page (vehicle.currentMileage)
  children: React.ReactNode;
}) {
  // invoice items
  const [items, setItems] = useState<ServiceItemInput[]>([]);

  // new mileage input
  const [newMileage, setNewMileage] = useState<number>(currentMileage);

  // ==========================
  // Add manual item
  // ==========================
  const addManualItem = () => {
    setItems([...items, { itemName: "", unitPrice: 0, quantity: 1 }]);
  };

  // ==========================
  // Add from workshop service
  // ==========================
  const addFromService = (serviceId: string) => {
    const svc = workshopServices.find((s) => s.id === serviceId);
    if (!svc) return;

    setItems([
      ...items,
      {
        itemName: svc.name,
        unitPrice: svc.price,
        quantity: 1,
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof ServiceItemInput,
    value: any
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Finalize Invoice</DialogTitle>
          <DialogDescription>
            Update vehicle mileage and add service items for this invoice.
          </DialogDescription>
        </DialogHeader>

        {/* ==========================
            MILEAGE INPUT
        ========================== */}
        <div className="mb-6">
          <Label>Current Mileage (km)</Label>
          <Input
            type="number"
            min={0}
            className="mt-2"
            value={newMileage}
            onChange={(e) => setNewMileage(Number(e.target.value))}
          />
        </div>

        {/* ==========================
            ADD FROM SERVICE
        ========================== */}
        <div className="space-y-2 mb-6">
          <Label>Add Item From Workshop Services</Label>
          <select
            className="border rounded-md p-2 w-full bg-white text-sm"
            onChange={(e) => {
              if (e.target.value !== "") {
                addFromService(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Select Service...</option>
            {workshopServices.map((svc, i) => (
              <option key={svc.id} value={svc.id}>
                {svc.name} — RM{svc.price}
              </option>
            ))}
          </select>
        </div>

        {/* ==========================
            LIST OF ITEMS
        ========================== */}
        <div className="space-y-5 max-h-[350px] overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items added yet.
            </p>
          )}

          {items.map((item, i) => (
            <div key={i} className="relative p-4 rounded-lg border bg-muted/20">
              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeItem(i)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                aria-label="Remove item"
              >
                <X className="h-4 w-4" />
              </button>

              {/* FORM INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col gap-1">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="Service Item"
                    value={item.itemName}
                    onChange={(e) => updateItem(i, "itemName", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Unit Price (RM)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(i, "unitPrice", Number(e.target.value))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(i, "quantity", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addManualItem} className="w-full">
            + Add Manual Item
          </Button>
        </div>

        {/* ==========================
            SUBMIT
        ========================== */}
        <DialogFooter>
          <Button
            onClick={() =>
              onSubmit({
                newMileage,
                items,
              })
            }
            className="w-full"
          >
            Generate Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
