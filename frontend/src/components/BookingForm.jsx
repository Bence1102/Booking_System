import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createBooking } from '../api/bookingApi';

function BookingForm({ resourceId, onSuccess }) {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBooking(token, resourceId, startTime, endTime);
      setStartTime('');
      setEndTime('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="booking-form-inline" onSubmit={handleSubmit}>
      {error && <div className="flash-error" style={{ flexBasis: '100%' }}>{error}</div>}

      <div className="field">
        <label>{t('booking.start')}</label>
        <input
          type="datetime-local"
          value={startTime}
          min={minDateTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>{t('booking.end')}</label>
        <input
          type="datetime-local"
          value={endTime}
          min={startTime || minDateTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-book" disabled={loading}>
        {loading ? t('booking.submitting') : t('booking.submit')}
      </button>
    </form>
  );
}

export default BookingForm;