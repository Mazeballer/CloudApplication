"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader2,
  Building2,
  User,
} from "lucide-react";

interface WorkshopApplication {
  id: number;
  userId: number;
  ownerName: string;
  workshopName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  operatingHours?: {
    hoursByDay: Array<{
      day: string;
      isOpen: boolean;
      startTime?: string;
      endTime?: string;
    }>;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export function WorkshopApprovalList() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedApplication, setSelectedApplication] =
    useState<WorkshopApplication | null>(null);
  const [notes, setNotes] = useState("");

  const [applications, setApplications] = useState<WorkshopApplication[]>([
    {
      id: 1,
      userId: 101,
      ownerName: "John Smith",
      workshopName: "Premium Auto Service",
      email: "contact@premiumauto.com",
      phone: "+1 (555) 123-4567",
      address: {
        street: "123 Main Street",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
      },
      operatingHours: {
        hoursByDay: [
          { day: "Monday", isOpen: true, startTime: "08:00", endTime: "18:00" },
          {
            day: "Tuesday",
            isOpen: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            day: "Wednesday",
            isOpen: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            day: "Thursday",
            isOpen: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          { day: "Friday", isOpen: true, startTime: "08:00", endTime: "18:00" },
          {
            day: "Saturday",
            isOpen: true,
            startTime: "09:00",
            endTime: "15:00",
          },
          { day: "Sunday", isOpen: false },
        ],
      },
      status: "pending",
      createdAt: "2025-11-20T10:30:00Z",
    },
    {
      id: 2,
      userId: 102,
      ownerName: "Sarah Johnson",
      workshopName: "QuickFix Garage",
      email: "info@quickfix.com",
      phone: "+1 (555) 987-6543",
      address: {
        street: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
      },
      operatingHours: {
        hoursByDay: [
          { day: "Monday", isOpen: true, startTime: "07:00", endTime: "19:00" },
          {
            day: "Tuesday",
            isOpen: true,
            startTime: "07:00",
            endTime: "19:00",
          },
          {
            day: "Wednesday",
            isOpen: true,
            startTime: "07:00",
            endTime: "19:00",
          },
          {
            day: "Thursday",
            isOpen: true,
            startTime: "07:00",
            endTime: "19:00",
          },
          { day: "Friday", isOpen: true, startTime: "07:00", endTime: "19:00" },
          {
            day: "Saturday",
            isOpen: true,
            startTime: "08:00",
            endTime: "16:00",
          },
          { day: "Sunday", isOpen: false },
        ],
      },
      status: "pending",
      createdAt: "2025-11-22T14:15:00Z",
    },
    {
      id: 3,
      userId: 103,
      ownerName: "Michael Chen",
      workshopName: "Elite Motors Service",
      email: "service@elitemotors.com",
      phone: "+1 (555) 246-8135",
      address: {
        street: "789 Tech Drive",
        city: "San Jose",
        state: "CA",
        zipCode: "95110",
      },
      status: "approved",
      createdAt: "2025-11-18T09:00:00Z",
    },
    {
      id: 4,
      userId: 104,
      ownerName: "Emily Rodriguez",
      workshopName: "Downtown Auto Repair",
      email: "hello@downtownauto.com",
      phone: "+1 (555) 369-2580",
      address: {
        street: "321 Market Street",
        city: "Oakland",
        state: "CA",
        zipCode: "94607",
      },
      status: "rejected",
      createdAt: "2025-11-19T11:45:00Z",
    },
  ]);

  const openApproveDialog = (application: WorkshopApplication) => {
    setSelectedApplication(application);
    setActionType("approve");
    setNotes("");
    setDialogOpen(true);
  };

  const openRejectDialog = (application: WorkshopApplication) => {
    setSelectedApplication(application);
    setActionType("reject");
    setNotes("");
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;

    setLoading(selectedApplication.id);
    setDialogOpen(false);

    // TODO: Replace with actual API call to your C# backend
    // This should send the notes and trigger an email notification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              status: actionType === "approve" ? "approved" : "rejected",
            }
          : app
      )
    );

    setLoading(null);
    toast({
      title:
        actionType === "approve" ? "Workshop Approved" : "Workshop Rejected",
      description: `Email notification sent to ${selectedApplication.email}${
        notes ? " with your message" : ""
      }.`,
      variant: actionType === "approve" ? "default" : "destructive",
    });

    setSelectedApplication(null);
    setActionType(null);
    setNotes("");
  };

  const filteredApplications = applications.filter(
    (app) => app.status === activeTab
  );
  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted p-1">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
            {pendingCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary text-primary-foreground"
              >
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredApplications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  {activeTab === "pending" && (
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  )}
                  {activeTab === "approved" && (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                  {activeTab === "rejected" && (
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <p className="text-lg font-medium text-foreground mb-1">
                  No {activeTab} applications
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "pending"
                    ? "New applications will appear here"
                    : `No workshops have been ${activeTab} yet`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="overflow-hidden border hover:shadow-md transition-shadow bg-white"
              >
                <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm mt-1 ${
                            application.status === "approved"
                              ? "bg-emerald-500 text-white"
                              : application.status === "rejected"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-semibold text-foreground">
                            {application.workshopName}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                {application.ownerName}
                              </span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span>ID #{application.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize font-medium ${
                        application.status === "approved"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                          : application.status === "rejected"
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                      }`}
                    >
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <div className="h-px flex-1 bg-border"></div>
                        Contact Details
                        <div className="h-px flex-1 bg-border"></div>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            {application.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            {application.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <div className="h-px flex-1 bg-border"></div>
                        Location
                        <div className="h-px flex-1 bg-border"></div>
                      </h3>
                      <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm font-medium leading-relaxed">
                          <p>{application.address.street}</p>
                          <p className="text-muted-foreground">
                            {application.address.city},{" "}
                            {application.address.state}{" "}
                            {application.address.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {application.operatingHours && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <div className="h-px flex-1 bg-border"></div>
                        Operating Hours
                        <div className="h-px flex-1 bg-border"></div>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                        {application.operatingHours.hoursByDay.map((day) => (
                          <div
                            key={day.day}
                            className={`rounded-lg border p-3 text-center transition-all ${
                              day.isOpen
                                ? "bg-primary/5 border-primary/30 shadow-sm hover:shadow-md hover:border-primary/50"
                                : "bg-muted/30 border-border"
                            }`}
                          >
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5">
                              {day.day.slice(0, 3)}
                            </p>
                            {day.isOpen ? (
                              <div className="text-xs font-medium">
                                <p className="text-foreground">
                                  {day.startTime}
                                </p>
                                <p className="text-muted-foreground text-[10px] my-0.5">
                                  to
                                </p>
                                <p className="text-foreground">{day.endTime}</p>
                              </div>
                            ) : (
                              <p className="text-xs font-medium text-muted-foreground mt-2">
                                Closed
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                {application.status === "pending" && (
                  <CardFooter className="bg-muted/30 border-t flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => openRejectDialog(application)}
                      disabled={loading === application.id}
                      className="min-w-[120px] border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {loading === application.id && actionType === "reject" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => openApproveDialog(application)}
                      disabled={loading === application.id}
                      className="min-w-[120px] bg-primary hover:bg-primary/90 shadow-sm"
                    >
                      {loading === application.id &&
                      actionType === "approve" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approve" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Approve Workshop Application
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Reject Workshop Application
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `Approve ${selectedApplication?.workshopName}? An email notification will be sent to ${selectedApplication?.email}.`
                : `Reject ${selectedApplication?.workshopName}? An email notification will be sent to ${selectedApplication?.email}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Message to Workshop Owner{" "}
                {actionType === "reject" ? "(Required)" : "(Optional)"}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  actionType === "approve"
                    ? "Add a welcome message or any additional instructions..."
                    : "Please provide a reason for rejection..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will be included in the email notification sent to
                the workshop owner.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={actionType === "reject" && !notes.trim()}
              className={
                actionType === "approve"
                  ? "bg-primary"
                  : "bg-destructive hover:bg-destructive/90"
              }
            >
              {actionType === "approve" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Send Email
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject & Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
