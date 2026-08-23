import { API_URL } from './config';

export async function fetchAllBookings(token) {
  const response = await fetch(`${API_URL}/admin/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült lekérni a foglalásokat');
  }

  return response.json();
}

export async function confirmBooking(token, bookingId) {
  const response = await fetch(`${API_URL}/admin/bookings/${bookingId}/confirm`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült jóváhagyni a foglalást');
  }

  return response.json();
}

export async function rejectBooking(token, bookingId) {
  const response = await fetch(`${API_URL}/admin/bookings/${bookingId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült elutasítani a foglalást');
  }

  return response.json();
}