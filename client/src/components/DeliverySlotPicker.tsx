// src/components/DeliverySlotPicker.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DeliverySlot } from '../types';
import { Calendar, Clock, Loader2 } from 'lucide-react';

interface DeliverySlotPickerProps {
  pincode: string;
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
}

export const DeliverySlotPicker: React.FC<DeliverySlotPickerProps> = ({
  pincode,
  selectedSlotId,
  onSelectSlot,
}) => {
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await api.get(`/delivery-slots?pincode=${pincode}`);
        setSlots(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch delivery slots');
      } finally {
        setIsLoading(false);
      }
    };

    if (pincode) {
      fetchSlots();
    }
  }, [pincode]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600 mr-2" />
        <span className="text-sm text-slate-500 font-medium">Loading available delivery slots...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center text-xs text-amber-800">
        No active delivery slots found for pincode <strong>{pincode}</strong> today. Please try another address or contact support.
      </div>
    );
  }

  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await api.get(`/delivery-slots?pincode=${pincode}`);
        const slotList = res.data.data || [];
        setSlots(slotList);
        // Auto-select first date's slot if available
        if (slotList.length > 0) {
          const uniqueDates = Array.from(new Set(slotList.map((s: DeliverySlot) => s.deliveryDate)));
          if (uniqueDates.length > 0) {
            setSelectedDate(uniqueDates[0] as string);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch delivery slots');
      } finally {
        setIsLoading(false);
      }
    };

    if (pincode) {
      fetchSlots();
    }
  }, [pincode]);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    return {
      dayOfWeek: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayAndMonth: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-sm text-on-surface-variant font-semibold">Loading available delivery slots...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 text-xs font-semibold">
        {error}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-6 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl border border-tertiary/20 text-center text-xs font-semibold">
        No active delivery slots found for pincode <strong>{pincode}</strong> today. Please try another address or contact support.
      </div>
    );
  }

  // Get unique dates
  const uniqueDates = Array.from(new Set(slots.map(s => s.deliveryDate)));

  // Filter slots for active date
  const activeDateSlots = slots.filter(s => s.deliveryDate === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
        <h2 className="font-bold text-[#121c2a] text-sm">Select Delivery Slot</h2>
      </div>

      <div className="space-y-6">
        {/* Date Picker */}
        <div>
          <p className="font-bold text-xs text-on-surface-variant mb-3 uppercase tracking-wider">Available Dates</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {uniqueDates.map((dateStr) => {
              const { dayOfWeek, dayAndMonth } = formatDateLabel(dateStr);
              const isDateSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateStr);
                    // Clear selected slot if it belongs to a different date
                    const matchedSlots = slots.filter(s => s.deliveryDate === dateStr);
                    if (matchedSlots.length > 0) {
                      onSelectSlot(matchedSlots[0].id);
                    }
                  }}
                  className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-200 ${
                    isDateSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/50'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDateSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {dayOfWeek}
                  </span>
                  <span className="text-sm font-bold text-on-surface mt-1">
                    {dayAndMonth}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <p className="font-bold text-xs text-on-surface-variant mb-3 uppercase tracking-wider">Available Time Windows</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeDateSlots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              // Determine slot period name based on time
              const isMorning = slot.startTime.toLowerCase().includes('am') || parseInt(slot.startTime) < 12;
              const slotPeriod = isMorning ? 'Morning' : 'Afternoon';
              
              return (
                <label
                  key={slot.id}
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    checked={isSelected}
                    onChange={() => onSelectSlot(slot.id)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline cursor-pointer"
                  />
                  <div className="ml-4 text-left">
                    <p className="font-bold text-on-surface text-xs">{slotPeriod}</p>
                    <p className="text-[10px] font-semibold text-on-surface-variant mt-0.5">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold uppercase ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    Free
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

