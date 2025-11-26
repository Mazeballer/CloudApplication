'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface WorkshopAddress {
  street: string;
  city: string;
  state: string;
  postcode?: string;
  country?: string;
}

interface OperatingDay {
  day: string;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
}

interface WorkshopOperatingHours {
  hoursByDay: OperatingDay[];
}

interface WorkshopApplication {
  id: string;
  userId: string;
  ownerName: string;
  workshopName: string;
  email: string;
  phone: string;
  address: WorkshopAddress;
  operatingHours?: WorkshopOperatingHours;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvalNotes?: string | null;
}

export function WorkshopApprovalList() {
  const { toast } = useToast();

  const [applications, setApplications] = useState<WorkshopApplication[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'pending' | 'approved' | 'rejected'
  >('pending');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null
  );
  const [selectedApplication, setSelectedApplication] =
    useState<WorkshopApplication | null>(null);
  const [notes, setNotes] = useState('');

  // Load applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      if (!API_BASE_URL) {
        setListLoading(false);
        toast({
          title: 'Configuration error',
          description:
            'NEXT_PUBLIC_API_URL is not set. Please configure your API base url.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setListLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/admin/workshops`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load workshop applications');
        }

        const data: WorkshopApplication[] = await res.json();
        setApplications(data);
      } catch (err: any) {
        console.error(err);
        toast({
          title: 'Error loading applications',
          description: err?.message ?? 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setListLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  const openApproveDialog = (application: WorkshopApplication) => {
    setSelectedApplication(application);
    setActionType('approve');
    setNotes('');
    setDialogOpen(true);
  };

  const openRejectDialog = (application: WorkshopApplication) => {
    setSelectedApplication(application);
    setActionType('reject');
    setNotes('');
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    if (!API_BASE_URL) return;

    try {
      setLoadingActionId(selectedApplication.id);
      setDialogOpen(false);

      const endpoint = actionType === 'approve' ? 'approve' : 'reject';

      const res = await fetch(
        `${API_BASE_URL}/api/admin/workshops/${selectedApplication.id}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to update workshop status');
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? {
                ...app,
                status: actionType === 'approve' ? 'approved' : 'rejected',
                approvalNotes: notes || app.approvalNotes,
              }
            : app
        )
      );

      toast({
        title:
          actionType === 'approve' ? 'Workshop approved' : 'Workshop rejected',
        description: `Notification prepared for ${selectedApplication.email}${
          notes ? ' with your message' : ''
        }.`,
        variant: actionType === 'approve' ? 'default' : 'destructive',
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Action failed',
        description: err?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingActionId(null);
      setSelectedApplication(null);
      setActionType(null);
      setNotes('');
    }
  };

  const filteredApplications = applications.filter(
    (app) => app.status === activeTab
  );
  const pendingCount = applications.filter(
    (app) => app.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as 'pending' | 'approved' | 'rejected')
        }
        className="w-full"
      >
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
          {listLoading && applications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading applications...
                </p>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  {activeTab === 'pending' && (
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  )}
                  {activeTab === 'approved' && (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                  {activeTab === 'rejected' && (
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <p className="text-lg font-medium text-foreground mb-1">
                  No {activeTab} applications
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'pending'
                    ? 'New applications will appear here'
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
                            application.status === 'approved'
                              ? 'bg-emerald-500 text-white'
                              : application.status === 'rejected'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500 text-white'
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
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
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
                        application.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                          : application.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200'
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
                        <div className="h-px flex-1 bg-border" />
                        Contact Details
                        <div className="h-px flex-1 bg-border" />
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
                        <div className="h-px flex-1 bg-border" />
                        Location
                        <div className="h-px flex-1 bg-border" />
                      </h3>
                      <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm font-medium leading-relaxed">
                          <p>{application.address.street}</p>
                          <p className="text-muted-foreground">
                            {application.address.city},{' '}
                            {application.address.state}{' '}
                            {application.address.postcode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {application.operatingHours && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        Operating Hours
                        <div className="h-px flex-1 bg-border" />
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                        {application.operatingHours.hoursByDay.map((day) => (
                          <div
                            key={day.day}
                            className={`rounded-lg border p-3 text-center transition-all ${
                              day.isOpen
                                ? 'bg-primary/5 border-primary/30 shadow-sm hover:shadow-md hover:border-primary/50'
                                : 'bg-muted/30 border-border'
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
                      Applied on{' '}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                {application.status === 'pending' && (
                  <CardFooter className="bg-muted/30 border-t flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => openRejectDialog(application)}
                      disabled={loadingActionId === application.id}
                      className="min-w-[120px] border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {loadingActionId === application.id &&
                      actionType === 'reject' ? (
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
                      disabled={loadingActionId === application.id}
                      className="min-w-[120px] bg-primary hover:bg-primary/90 shadow-sm"
                    >
                      {loadingActionId === application.id &&
                      actionType === 'approve' ? (
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
              {actionType === 'approve' ? (
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
              {actionType === 'approve'
                ? `Approve ${selectedApplication?.workshopName}? An email notification will be sent to ${selectedApplication?.email}.`
                : `Reject ${selectedApplication?.workshopName}? An email notification will be sent to ${selectedApplication?.email}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Message to Workshop Owner{' '}
                {actionType === 'reject' ? '(Required)' : '(Optional)'}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  actionType === 'approve'
                    ? 'Add a welcome message or any additional instructions...'
                    : 'Please provide a reason for rejection...'
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
              disabled={actionType === 'reject' && !notes.trim()}
              className={
                actionType === 'approve'
                  ? 'bg-primary'
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              {actionType === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve &amp; Send Email
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject &amp; Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
