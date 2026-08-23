import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchAllBookings, confirmBooking, rejectBooking } from '../api/adminApi';

function AdminPanel() {
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
      const data = await fetchAllBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(bookingId) {
    try {
      await confirmBooking(token, bookingId);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(bookingId) {
    try {
      await rejectBooking(token, bookingId);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="empty-state">{t('admin.loading')}</p>;

  return (
    <div>
      <h1>{t('admin.title')}</h1>
      <p className="section-lede">{t('admin.lede')}</p>

      {error && <div className="flash-error">{error}</div>}

      {bookings.length === 0 ? (
        <p className="empty-state">{t('admin.empty')}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.colResource')}</th>
                <th>{t('admin.colUser')}</th>
                <th>{t('admin.colStart')}</th>
                <th>{t('admin.colEnd')}</th>
                <th>{t('admin.colStatus')}</th>
                <th>{t('admin.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const resourceName =
                  language === 'en' ? booking.resource?.name_en || booking.resource?.name
                  : language === 'de' ? booking.resource?.name_de || booking.resource?.name
                  : booking.resource?.name;

                return (
                  <tr key={booking.id}>
                    <td>{resourceName}</td>
                    <td>{booking.user?.name}</td>
                    <td>{new Date(booking.start_time).toLocaleString(language)}</td>
                    <td>{new Date(booking.end_time).toLocaleString(language)}</td>
                    <td>
                      <span className={`badge badge-${booking.status}`}>
                        {t(`status.${booking.status}`)}
                      </span>
                    </td>
                    <td>
                      {booking.status === 'pending' && (
                        <div className="admin-actions">
                          <button className="btn-confirm" onClick={() => handleConfirm(booking.id)}>
                            {t('admin.confirm')}
                          </button>
                          <button className="btn-reject" onClick={() => handleReject(booking.id)}>
                            {t('admin.reject')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;