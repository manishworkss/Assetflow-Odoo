import React, { useState, useEffect } from 'react';
import { bookingService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { BookingModal } from './BookingModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  Building2,
  Car,
  Tv
} from 'lucide-react';

export const ResourceBooking = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-07-15');
  const [filterType, setFilterType] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      showToast('Error fetching shared reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id, purpose) => {
    if (!window.confirm(`Are you sure you want to cancel the reservation for "${purpose}"?`)) return;
    try {
      await bookingService.cancelBooking(id);
      showToast('Reservation cancelled and time slot freed up!', 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterType !== 'ALL' && b.resourceType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Shared Rooms & Fleet Reservations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-overlap schedule management for conference rooms, company cars, and mobile AV carts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchBookings}>
            Sync Schedule
          </Button>
          <Button variant="odoo" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Reserve Time Slot
          </Button>
        </div>
      </div>

      {/* Filter & Quick Status Bar */}
      <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === 'ALL'
                  ? 'bg-[#714B67] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Resources ({bookings.length})
            </button>
            <button
              onClick={() => setFilterType('ROOM')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                filterType === 'ROOM'
                  ? 'bg-[#714B67] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Conference Rooms
            </button>
            <button
              onClick={() => setFilterType('VEHICLE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                filterType === 'VEHICLE'
                  ? 'bg-[#714B67] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Fleet Vehicles
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <CalendarIcon className="w-4 h-4 text-[#714B67]" />
            <span>Active Target Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Checking reservation schedule against MySQL backend...</div>
      ) : filteredBookings.length === 0 ? (
        <Card className="py-12 text-center">
          <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No active bookings scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Reserve a room or vehicle slot above.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((b) => (
            <Card
              key={b.id}
              className={`border-l-4 transition-all ${
                b.status === 'CANCELLED'
                  ? 'border-l-slate-400 opacity-60'
                  : 'border-l-[#714B67] hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={b.status === 'CANCELLED' ? 'default' : 'primary'}>{b.status}</Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                    {b.resourceName}
                  </h3>
                </div>
                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelBooking(b.id, b.purpose)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#714B67]" />
                  <span>{b.bookingDate} • {b.startTime} - {b.endTime}</span>
                </div>
                <div className="pt-1 text-slate-500 italic">"{b.purpose}"</div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Booked by:</span>
                <strong className="text-slate-800 dark:text-slate-200">{b.bookedByName || 'Vikram Sharma'}</strong>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingBookings={bookings}
        onBooked={fetchBookings}
      />
    </div>
  );
};
