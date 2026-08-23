import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchResourceBookings } from '../api/resourceApi';

const LOCALE_MAP = { hu: 'hu-HU', en: 'en-US', de: 'de-DE' };

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateKeysInRange(startIso, endIso) {
  const keys = [];
  const start = new Date(startIso);
  const end = new Date(endIso);
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= last) {
    keys.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

function ResourceCalendar({ resourceId }) {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const locale = LOCALE_MAP[language] || 'hu-HU';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDayKey, setSelectedDayKey] = useState(toDateKey(new Date()));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchResourceBookings(token, resourceId)
      .then((data) => {
        if (!cancelled) setBookings(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resourceId, token]);

  // Map of dateKey -> highest-priority status ('confirmed' beats 'pending')
  const busyMap = useMemo(() => {
    const map = {};
    for (const booking of bookings) {
      const keys = getDateKeysInRange(booking.start_time, booking.end_time);
      for (const key of keys) {
        if (map[key] !== 'confirmed') {
          map[key] = booking.status;
        }
      }
    }
    return map;
  }, [bookings]);

  const slotsForSelectedDay = useMemo(() => {
    return bookings.filter((booking) =>
      getDateKeysInRange(booking.start_time, booking.end_time).includes(selectedDayKey)
    );
  }, [bookings, selectedDayKey]);

  function goToPrevMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  }, [locale]);

  const monthLabel = monthCursor.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div className="resource-calendar">
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={goToPrevMonth}>‹</button>
        <span className="calendar-month-label">{monthLabel}</span>
        <button type="button" className="calendar-nav" onClick={goToNextMonth}>›</button>
      </div>

      {loading ? (
        <p className="empty-state" style={{ padding: '20px 0' }}>{t('calendar.loading')}</p>
      ) : (
        <>
          <div className="calendar-grid">
            {weekdayLabels.map((label) => (
              <div className="calendar-weekday" key={label}>{label}</div>
            ))}

            {cells.map((day, idx) => {
              if (day === null) {
                return <div className="calendar-cell calendar-cell-empty" key={`blank-${idx}`} />;
              }
              const dateKey = toDateKey(new Date(year, month, day));
              const status = busyMap[dateKey];
              const isSelected = dateKey === selectedDayKey;

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`calendar-cell${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedDayKey(dateKey)}
                >
                  {day}
                  {status && <span className={`calendar-dot dot-${status}`} />}
                </button>
              );
            })}
          </div>

          <div className="calendar-daylist">
            <strong>
              {(() => {
                const [y, m, d] = selectedDayKey.split('-').map(Number);
                return new Date(y, m - 1, d).toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                });
              })()}
            </strong>

            {slotsForSelectedDay.length === 0 ? (
              <p className="empty-state" style={{ padding: '10px 0' }}>{t('calendar.noBookings')}</p>
            ) : (
              <ul className="calendar-slot-list">
                {slotsForSelectedDay.map((booking) => (
                  <li key={booking.id}>
                    <span className={`badge badge-${booking.status}`}>
                      {t(`status.${booking.status}`)}
                    </span>
                    {' '}
                    {new Date(booking.start_time).toLocaleString(locale)}
                    {' → '}
                    {new Date(booking.end_time).toLocaleString(locale)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ResourceCalendar;