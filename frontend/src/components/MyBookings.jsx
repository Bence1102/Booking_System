import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchMyBookings, cancelBooking } from '../api/bookingApi';

function MyBookings() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await fetchMyBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    try {
      await cancelBooking(token, bookingId);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="empty-state">{t('myBookings.loading')}</p>;

  return (
    <div>
      <h1>{t('myBookings.title')}</h1>
      <p className="section-lede">{t('myBookings.lede')}</p>

      {error && <div className="flash-error">{error}</div>}

      {bookings.length === 0 ? (
        <p className="empty-state">{t('myBookings.empty')}</p>
      ) : (
        bookings.map((booking) => {
          const resourceName =
            language === 'en' ? booking.resource?.name_en || booking.resource?.name
            : language === 'de' ? booking.resource?.name_de || booking.resource?.name
            : booking.resource?.name;

          return (
            <div className="ticket" key={booking.id}>
              <div className="ticket-main">
                <div className="ticket-resource">{resourceName}</div>
                <div className="ticket-time">
                  {new Date(booking.start_time).toLocaleString(language)}
                  <span className="arrow">→</span>
                  {new Date(booking.end_time).toLocaleString(language)}
                </div>

                {booking.status !== 'cancelled' && (
                  <div className="ticket-actions">
                    <button className="btn-cancel" onClick={() => handleCancel(booking.id)}>
                      {t('myBookings.cancel')}
                    </button>
                  </div>
                )}
              </div>

              <div className="ticket-stub">
                <span className={`stamp stamp-${booking.status}`}>
                  {t(`status.${booking.status}`)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyBookings;