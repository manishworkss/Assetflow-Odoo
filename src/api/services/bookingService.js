import { apiClient } from '../client';
import { mockBookings, mockAssets } from '../mockData';
import { useAuthStore } from '../../store/authStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const bookingService = {
  /**
   * Aligned with Teammate Phase 5: GET /api/bookings
   */
  getBookings: async (resourceId = null) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (resourceId) {
        return mockBookings.filter((b) => Number(b.resourceId) === Number(resourceId));
      }
      return [...mockBookings];
    }
    const params = resourceId ? { resourceId } : {};
    return apiClient.get('/bookings', { params });
  },

  /**
   * Aligned with Teammate Phase 5: POST /api/bookings
   * Enforces business rule: No overlapping bookings allowed for the same shared resource!
   */
  createBooking: async ({ resourceId, startTime, endTime, purpose }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      
      // Check resource existence and shared status
      const resource = mockAssets.find((a) => Number(a.id) === Number(resourceId));
      if (!resource) throw new Error('Shared resource not found');
      if (!resource.isSharedBookable) {
        throw new Error(`Asset ${resource.name} is not configured as a shared bookable resource`);
      }

      // Check for exact time overlap against existing bookings
      const newStart = new Date(startTime).getTime();
      const newEnd = new Date(endTime).getTime();

      if (newStart >= newEnd) {
        throw new Error('End time must be after start time');
      }

      const hasOverlap = mockBookings.some((b) => {
        if (Number(b.resourceId) !== Number(resourceId) || b.status === 'CANCELLED') return false;
        const existStart = new Date(b.startTime).getTime();
        const existEnd = new Date(b.endTime).getTime();
        // Overlap formula: (startA < endB) && (endA > startB)
        return newStart < existEnd && newEnd > existStart;
      });

      if (hasOverlap) {
        throw new Error(`Booking Conflict: ${resource.name} is already booked during this time slot! Please select another time.`);
      }

      const currentUser = useAuthStore.getState().user || { id: 1, name: 'Manish Kumar', departmentName: 'Engineering & IT' };
      const newBooking = {
        id: Date.now(),
        resourceName: resource.name,
        resourceId: Number(resourceId),
        bookedById: currentUser.id,
        bookedByName: currentUser.name,
        departmentName: currentUser.departmentName || 'Engineering & IT',
        startTime,
        endTime,
        status: 'UPCOMING',
        purpose: purpose || 'Resource Booking'
      };
      mockBookings.unshift(newBooking);
      return newBooking;
    }
    return apiClient.post('/bookings', { resourceId, startTime, endTime, purpose });
  },

  cancelBooking: async (bookingId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = mockBookings.findIndex((b) => Number(b.id) === Number(bookingId));
      if (index === -1) throw new Error('Booking not found');
      mockBookings[index].status = 'CANCELLED';
      return mockBookings[index];
    }
    return apiClient.put(`/bookings/${bookingId}/cancel`);
  }
};
