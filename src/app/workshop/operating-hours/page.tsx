'use client';

import { useEffect, useState } from 'react';
import { Clock, Save, RefreshCw } from 'lucide-react';
import { WorkshopNav } from '@/components/workshop-nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkshops } from '@/contexts/WorkshopContext';
import { notify } from '@/lib/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type DayHours = {
  open: boolean;
  start: string;
  end: string;
};

// Backend DTO types
type DailyHoursDto = {
  day: string;
  isOpen: boolean;
  startTime?: string | null;
  endTime?: string | null;
};

type WeeklyOperatingHoursDto = {
  hoursByDay: DailyHoursDto[];
};

const defaultHours: Record<DayKey, DayHours> = {
  monday: { open: true, start: '08:00', end: '18:00' },
  tuesday: { open: true, start: '10:00', end: '18:00' },
  wednesday: { open: true, start: '08:00', end: '18:00' },
  thursday: { open: true, start: '08:00', end: '18:00' },
  friday: { open: true, start: '08:00', end: '18:00' },
  saturday: { open: true, start: '09:00', end: '17:00' },
  sunday: { open: false, start: '09:00', end: '17:00' },
};

const dayNames: Record<DayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// API -> UI mapper
function dtoToUi(
  dto: WeeklyOperatingHoursDto | null | undefined
): Record<DayKey, DayHours> {
  if (!dto || !Array.isArray(dto.hoursByDay) || dto.hoursByDay.length === 0) {
    return defaultHours;
  }

  const result: Record<DayKey, DayHours> = { ...defaultHours };

  dto.hoursByDay.forEach((d) => {
    const key = d.day.toLowerCase() as DayKey;
    if (!result[key]) return;

    result[key] = {
      open: d.isOpen,
      start: d.startTime || result[key].start,
      end: d.endTime || result[key].end,
    };
  });

  return result;
}

// UI -> API mapper
function uiToDto(hours: Record<DayKey, DayHours>): WeeklyOperatingHoursDto {
  return {
    hoursByDay: (Object.keys(hours) as DayKey[]).map((day) => ({
      day,
      isOpen: hours[day].open,
      startTime: hours[day].start,
      endTime: hours[day].end,
    })),
  };
}

export default function WorkshopHoursPage() {
  const { currentWorkshop, loading: workshopLoading } = useWorkshops();

  const [hours, setHours] = useState<Record<DayKey, DayHours>>(defaultHours);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // load existing hours from backend on mount
  useEffect(() => {
    const loadHours = async () => {
      if (!currentWorkshop || !API_URL) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/workshop/${currentWorkshop.id}/hours`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('Failed to load operating hours', res.status, text);
          notify.error('Could not load operating hours');
          setLoading(false);
          return;
        }

        const data: WeeklyOperatingHoursDto = await res.json();
        setHours(dtoToUi(data));
      } catch (err) {
        console.error('Error loading operating hours', err);
        notify.error('Could not load operating hours');
      } finally {
        setLoading(false);
      }
    };

    if (!workshopLoading) {
      loadHours();
    }
  }, [currentWorkshop, workshopLoading]);

  const toggleDay = (day: DayKey) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], open: !prev[day].open },
    }));
    setSaved(false);
  };

  const updateTime = (day: DayKey, field: 'start' | 'end', value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!currentWorkshop || !API_URL) {
      notify.error('Workshop not loaded');
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      const payload = uiToDto(hours);

      const res = await fetch(
        `${API_URL}/api/workshop/${currentWorkshop.id}/hours`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('Save operating hours failed', res.status, text);
        notify.error('Failed to save changes');
        return;
      }

      setSaved(true);
      notify.success('Operating hours updated');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Save operating hours error', err);
      notify.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setHours(defaultHours);
    setSaved(false);
    notify.info('Reset to default hours');
  };

  const openDaysCount = Object.values(hours).filter((d) => d.open).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <WorkshopNav />

      <main className="container mx-auto px-18 py-8">
        {/* Header */}
        <Card className="mb-6 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Operating Hours</h1>
              <p className="text-sm text-muted-foreground">
                Manage your workshop availability and opening times
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Open {openDaysCount} days per week
          </p>
        </Card>

        {/* Operating Hours Grid */}
        <Card className="p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading operating hours...
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(hours).map(([day, data]) => {
                  const key = day as DayKey;
                  return (
                    <div
                      key={day}
                      className={`border rounded-lg p-4 transition-all ${
                        data.open ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-lg">
                          {dayNames[key]}
                        </span>

                        {/* toggle */}
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={data.open}
                              onChange={() => toggleDay(key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full bg-slate-300 peer-checked:bg-teal-600 transition-colors" />
                            <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                          </div>
                          <span className="ml-2 text-sm font-medium text-slate-700">
                            {data.open ? 'Open' : 'Closed'}
                          </span>
                        </label>
                      </div>

                      {data.open && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Start
                            </label>
                            <input
                              type="time"
                              value={data.start}
                              onChange={(e) =>
                                updateTime(key, 'start', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              End
                            </label>
                            <input
                              type="time"
                              value={data.end}
                              onChange={(e) =>
                                updateTime(key, 'end', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action buttons with teal and yellow theme */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-200">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  <Save className="w-5 h-5" />
                  {saving
                    ? 'Saving...'
                    : saved
                    ? 'Changes saved'
                    : 'Save changes'}
                </Button>

                <Button
                  type="button"
                  onClick={resetToDefault}
                  className="sm:w-auto bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset to default
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
