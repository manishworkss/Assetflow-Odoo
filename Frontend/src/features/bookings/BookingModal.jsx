import React, { useState, useEffect } from 'react';
import { bookingService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Calendar, Clock, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export const BookingModal = ({ isOpen, onClose, existingBookings, onBooked }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);

  // Form state
  const [resourceId, setResourceId] = useState('1');
  const [date, setDate] = useState('2026-07-15');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [purpose, setPurpose] = useState('');
  const [conflictError, setConflictError] = useState(null);

  const resources = [
    { id: '1', name: 'Executive Conference Room A (12 Seats)', type: 'ROOM' },
    { id: '2', name: 'Conference Room B - Innovation Lab (8 Seats)', type: 'ROOM' },
    { id: '3', name: 'Fleet Vehicle - Toyota Prius Hybrid (DL-01-AB-1234)', type: 'VEHICLE' },
    { id: '4', name: 'Projector & Mobile AV Cart #03', type: 'EQUIPMENT' }
  ];

  // Zero-Overlap Time Slot Validator
  const validateZeroOverlap = (resId, targetDate, start, end) => {
    setConflictError(null);
    if (!existingBookings || existingBookings.length === 0) return true;

    // Convert times "HH:MM" to minutes from midnight for interval overlap check
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const targetStart = toMinutes(start);
    const targetEnd = toMinutes(end);

    if (targetEnd <= targetStart) {
      setConflictError('End time must be after start time.');
      return false;
    }

    const overlap = existingBookings.find((b) => {
      if (String(b.resourceId) !== String(resId)) return false;
      if (b.bookingDate !== targetDate) return false;
      if (b.status === 'CANCELLED') return false;

      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return targetStart < bEnd && targetEnd > bStart;
    });

    if (overlap) {
      setConflictError(
        `[Zero-Overlap Time Slot Validator Blocked] Conflict with booking by ${overlap.bookedByName} from ${overlap.startTime} to ${overlap.endTime} for purpose: "${overlap.purpose}". Please select a different time or resource!`
      );
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (isOpen) {
      validateZeroOverlap(resourceId, date, startTime, endTime);
    }
  }, [resourceId, date, startTime, endTime, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateZeroOverlap(resourceId, date, startTime, endTime)) {
      return;
    }

    setLoading(true);
    const resObj = resources.find((r) => r.id === resourceId);

    try {
      await bookingService.createBooking({
        resourceId: Number(resourceId),
        resourceName: resObj?.name || 'Shared Resource',
        bookingDate: date,
        startTime,
        endTime,
        purpose
      });

      showToast(`Successfully reserved ${resObj?.name} for ${date} (${startTime}-${endTime})!`, 'success');
      onClose();
      if (onBooked) onBooked();
    } catch (err) {
      setConflictError(err.message || 'Booking validation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reserve Shared Room, Vehicle, or AV Equipment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {conflictError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Zero-Overlap Time Slot Validator Triggered</strong>
              <span>{conflictError}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Select Shared Resource
          </label>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Reservation Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              End Time
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Meeting / Trip Purpose
          </label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Q3 Strategic Roadmap Review with Board of Directors"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="odoo"
            loading={loading}
            icon={ArrowRight}
            disabled={!!conflictError}
          >
            Confirm Reservation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
