import { API_URL } from './config';

export async function fetchResourceBookings(token, resourceId) {
  const response = await fetch(`${API_URL}/resources/${resourceId}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült lekérni a foglaltságot');
  }

  return response.json();
}