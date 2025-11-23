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
    address: {
      street: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
    operatingHours: {
      hoursByDay: {
        Monday: { isOpen: false, startTime: "", endTime: "" },
        Tuesday: { isOpen: false, startTime: "", endTime: "" },
        Wednesday: { isOpen: false, startTime: "", endTime: "" },
        Thursday: { isOpen: false, startTime: "", endTime: "" },
        Friday: { isOpen: false, startTime: "", endTime: "" },
        Saturday: { isOpen: false, startTime: "", endTime: "" },
        Sunday: { isOpen: false, startTime: "", endTime: "" },
      },
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (!formData.workshopName.trim()) {
      errors.workshopName = "Workshop name is required";
    }
    if (!formData.ownerName.trim()) {
      errors.ownerName = "Owner name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone.replace(/\s+/g, ""))) {
      errors.phone = "Phone number must contain only numbers";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};

    if (!formData.address.street.trim()) {
      errors.street = "Street is required";
    }
    if (!formData.address.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.address.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.address.postcode.trim()) {
      errors.postcode = "Postcode is required";
    } else if (!/^\d+$/.test(formData.address.postcode.replace(/\s+/g, ""))) {
      errors.postcode = "Postcode must contain only numbers";
    }
    if (!formData.address.country.trim()) {
      errors.country = "Country is required";
    }

    return errors;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};

    // Check if any day is open, and if so, ensure times are filled
    Object.entries(formData.operatingHours.hoursByDay).forEach(
      ([day, info]) => {
        if (info.isOpen) {
          if (!info.startTime) {
            errors[`${day}_start`] = `${day} start time is required`;
          }
          if (!info.endTime) {
            errors[`${day}_end`] = `${day} end time is required`;
          }
        }
      }
    );

    return errors;
  };

  const goNextStep = () => {
    const errors = validateStep1();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in all required fields");
      return;
    }

    setFieldErrors({});
    setError("");
    setStep(2);
  };

  const goToStep3 = () => {
    const errors = validateStep2();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in all address fields");
      return;
    }

    setFieldErrors({});
    setError("");
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateStep3();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in all required operating hours");
      return;
    }

    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const hoursArray = Object.entries(formData.operatingHours.hoursByDay).map(
      ([day, info]) => ({
        day,
        isOpen: info.isOpen,
        startTime: info.startTime,
        endTime: info.endTime,
      })
    );

    const result = await registerWorkshop(
      {
        email: formData.email,
        phone: formData.phone,
        workshopName: formData.workshopName,
        ownerName: formData.ownerName,
        address: formData.address,
        operatingHours: {
          hoursByDay: hoursArray,
        },
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
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-amber-600 to-amber-800 p-12 items-center justify-center">
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
      <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-2xl">
          <Card className="p-8 min-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-2">Register Your Workshop</h2>

            {/* Step Indicator */}
            <div className="flex items-center mb-4 gap-2">
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
              <div
                className={`flex-1 h-1 rounded ${
                  step >= 3 ? "bg-amber-600" : "bg-muted"
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
                      className={
                        fieldErrors.workshopName ? "border-red-500" : ""
                      }
                    />
                    {fieldErrors.workshopName && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.workshopName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Owner Name</Label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                      className={fieldErrors.ownerName ? "border-red-500" : ""}
                    />
                    {fieldErrors.ownerName && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.ownerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={fieldErrors.email ? "border-red-500" : ""}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={fieldErrors.phone ? "border-red-500" : ""}
                    />
                    {fieldErrors.phone && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
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
                        className={fieldErrors.password ? "border-red-500" : ""}
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
                    {fieldErrors.password && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.password}
                      </p>
                    )}
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
                      className={
                        fieldErrors.confirmPassword ? "border-red-500" : ""
                      }
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
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
                    <Label className="font-semibold mb-4">Address</Label>

                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2">Street</Label>
                        <Input
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                street: e.target.value,
                              },
                            })
                          }
                          className={fieldErrors.street ? "border-red-500" : ""}
                        />
                        {fieldErrors.street && (
                          <p className="text-sm text-red-500">
                            {fieldErrors.street}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">City</Label>
                        <Input
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                            })
                          }
                          className={fieldErrors.city ? "border-red-500" : ""}
                        />
                        {fieldErrors.city && (
                          <p className="text-sm text-red-500">
                            {fieldErrors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">State</Label>
                        <Input
                          value={formData.address.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          className={fieldErrors.state ? "border-red-500" : ""}
                        />
                        {fieldErrors.state && (
                          <p className="text-sm text-red-500">
                            {fieldErrors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">Postcode</Label>
                        <Input
                          value={formData.address.postcode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                postcode: e.target.value,
                              },
                            })
                          }
                          className={
                            fieldErrors.postcode ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.postcode && (
                          <p className="text-sm text-red-500">
                            {fieldErrors.postcode}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">Country</Label>
                        <Input
                          value={formData.address.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: e.target.value,
                              },
                            })
                          }
                          className={
                            fieldErrors.country ? "border-red-500" : ""
                          }
                        />
                        {fieldErrors.country && (
                          <p className="text-sm text-red-500">
                            {fieldErrors.country}
                          </p>
                        )}
                      </div>
                    </div>
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
                      onClick={() => {
                        setStep(1);
                        setFieldErrors({});
                        setError("");
                      }}
                    >
                      Back
                    </Button>
                    <Button type="button" className="w-1/2" onClick={goToStep3}>
                      Next
                    </Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <Label className="font-semibold">Operating Hours</Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(formData.operatingHours.hoursByDay).map(
                        ([day, info]) => (
                          <div
                            key={day}
                            className={`border rounded-lg p-4 bg-muted/40 space-y-3 shadow-sm ${
                              fieldErrors[`${day}_start`] ||
                              fieldErrors[`${day}_end`]
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            {/* Header row */}
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{day}</span>

                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={info.isOpen}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      operatingHours: {
                                        hoursByDay: {
                                          ...formData.operatingHours.hoursByDay,
                                          [day]: {
                                            ...info,
                                            isOpen: e.target.checked,
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                                Open
                              </label>
                            </div>

                            {/* Time inputs (only when open) */}
                            {info.isOpen && (
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Start
                                  </Label>
                                  <Input
                                    type="time"
                                    className={`text-sm ${
                                      fieldErrors[`${day}_start`]
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    value={info.startTime}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        operatingHours: {
                                          hoursByDay: {
                                            ...formData.operatingHours
                                              .hoursByDay,
                                            [day]: {
                                              ...info,
                                              startTime: e.target.value,
                                            },
                                          },
                                        },
                                      })
                                    }
                                  />
                                  {fieldErrors[`${day}_start`] && (
                                    <p className="text-xs text-red-500 mt-1">
                                      {fieldErrors[`${day}_start`]}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    End
                                  </Label>
                                  <Input
                                    type="time"
                                    className={`text-sm ${
                                      fieldErrors[`${day}_end`]
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    value={info.endTime}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        operatingHours: {
                                          hoursByDay: {
                                            ...formData.operatingHours
                                              .hoursByDay,
                                            [day]: {
                                              ...info,
                                              endTime: e.target.value,
                                            },
                                          },
                                        },
                                      })
                                    }
                                  />
                                  {fieldErrors[`${day}_end`] && (
                                    <p className="text-xs text-red-500 mt-1">
                                      {fieldErrors[`${day}_end`]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
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
                      onClick={() => {
                        setStep(2);
                        setFieldErrors({});
                        setError("");
                      }}
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
