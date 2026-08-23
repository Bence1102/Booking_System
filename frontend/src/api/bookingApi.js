const API_URL = 'http://127.0.0.1:8000/api';

export async function fetchMyBookings(token) {
  const response = await fetch(`${API_URL}/bookings`, {
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

export async function createBooking(token, resourceId, startTime, endTime) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resource_id: resourceId,
      start_time: startTime,
      end_time: endTime,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Foglalás sikertelen');
  }

  return data;
}

export async function cancelBooking(token, bookingId) {
  const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Nem sikerült lemondani a foglalást');
  }

  return response.json();
}