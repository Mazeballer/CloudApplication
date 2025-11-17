"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { registerWorkshop } from "@/lib/auth"; // <-- IMPORTANT

export default function WorkshopSignupPage() {
  const router = useRouter();

  // ⭐ MULTI-STEP
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    workshopName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    hours: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const goNextStep = () => {
    if (!formData.workshopName || !formData.email || !formData.phone) {
      return setError("Please complete all required fields.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await registerWorkshop(
      {
        email: formData.email,
        phone: formData.phone,
        workshopName: formData.workshopName,
        ownerName: formData.ownerName,
        address: formData.address,
        hours: formData.hours,
      },
      formData.password
    );

    if (result.success) {
      router.push("/workshop/login?registered=true");
    } else {
      setError(result.error || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-amber-600 to-amber-800 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl">
              <Wrench className="h-8 w-8 text-amber-600" />
            </div>
            <span className="text-3xl font-bold">AutoCare+ Workshop</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Grow Your Workshop Business
          </h1>
          <p className="text-amber-100 text-lg">
            Manage appointments, track services, and grow your customer base
            with our powerful workshop management platform.
          </p>
        </div>
      </div>

      {/* MAIN FORM */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">Register Your Workshop</h2>

            {/* Step Indicator */}
            <div className="flex items-center mb-6">
              <div
                className={`flex-1 h-1 rounded ${
                  step >= 1 ? "bg-amber-600" : "bg-muted"
                }`}
              />
              <div
                className={`flex-1 h-1 rounded ${
                  step >= 2 ? "bg-amber-600" : "bg-muted"
                }`}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Workshop Name</Label>
                    <Input
                      value={formData.workshopName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workshopName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Owner Name</Label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="button" className="w-full" onClick={goNextStep}>
                    Next
                  </Button>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Operating Hours</Label>
                    <Input
                      placeholder="Mon–Fri 9am–6pm, Sat 9am–3pm"
                      value={formData.hours}
                      onChange={(e) =>
                        setFormData({ ...formData, hours: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4" />
                        ) : (
                          <Eye className="h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-1/2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register Workshop"}
                    </Button>
                  </div>
                </>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/workshop/login"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
