import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { API_URL } from './api/config';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BookingForm from './components/BookingForm';
import ResourceCalendar from './components/ResourceCalendar';
import AdminPanel from './components/AdminPanel';
import MyBookings from './components/MyBookings';
import './App.css';

const LANGUAGES = [
  { code: 'hu', label: 'HU' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={language === lang.code ? 'active' : ''}
          onClick={() => setLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [resources, setResources] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [bookingResourceId, setBookingResourceId] = useState(null);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('resources'); // 'resources' | 'myBookings' | 'admin'
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/resources`)
      .then((response) => response.json())
      .then((data) => setResources(data));
  }, []);

  if (authLoading) {
    return <p style={{ padding: 40, fontFamily: 'IBM Plex Mono, monospace' }}>{t('common.loading')}</p>;
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-top">
            <span className="auth-eyebrow">{t('brand')}</span>
            <LanguageSwitcher />
          </div>
          <h2>{showRegister ? t('auth.registerTitle') : t('auth.loginTitle')}</h2>
          {showRegister ? <RegisterForm /> : <LoginForm />}
          <button className="auth-switch" onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          {t('brand')}<small>{t('brandTagline')}</small>
        </div>
        <div className="app-user">
          <LanguageSwitcher />
          <span>
            <strong>{user.name}</strong> · {user.role}
          </span>
          <button className="btn-ghost" onClick={logout}>{t('nav.logout')}</button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={view === 'resources' ? 'active' : ''}
          onClick={() => setView('resources')}
        >
          {t('nav.resources')}
        </button>
        <button
          className={view === 'myBookings' ? 'active' : ''}
          onClick={() => setView('myBookings')}
        >
          {t('nav.myBookings')}
        </button>
        {user.role === 'admin' && (
          <button
            className={view === 'admin' ? 'active' : ''}
            onClick={() => setView('admin')}
          >
            {t('nav.admin')}
          </button>
        )}
      </nav>

      <main className="app-main">
        {view === 'admin' && <AdminPanel />}

        {view === 'myBookings' && <MyBookings />}

        {view === 'resources' && (
          <>
            <h1>{t('resources.title')}</h1>
            <p className="section-lede">{t('resources.lede')}</p>

            <div className="category-filter">
              {['all', 'meeting', 'sport', 'creative'].map((cat) => (
                <button
                  key={cat}
                  className={categoryFilter === cat ? 'active' : ''}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {t(`category.${cat}`)}
                </button>
              ))}
            </div>

            {message && <div className="flash">{message}</div>}

            <div className="resource-grid">
              {resources
                .filter((resource) => categoryFilter === 'all' || resource.category === categoryFilter)
                .map((resource) => {
                const localizedName =
                  language === 'en' ? resource.name_en || resource.name
                  : language === 'de' ? resource.name_de || resource.name
                  : resource.name;

                const localizedDescription =
                  language === 'en' ? resource.description_en || resource.description
                  : language === 'de' ? resource.description_de || resource.description
                  : resource.description;

                return (
                  <div className="resource-card" key={resource.id}>
                    {resource.image_url && (
                      <img
                        className="resource-image"
                        src={resource.image_url}
                        alt={localizedName}
                      />
                    )}
                    <div className="resource-body">
                      <h3>{localizedName}</h3>
                      <p>{localizedDescription}</p>
                      <button
                        className="btn-book"
                        onClick={() =>
                          setBookingResourceId(
                            bookingResourceId === resource.id ? null : resource.id
                          )
                        }
                      >
                        {bookingResourceId === resource.id ? t('resources.cancel') : t('resources.book')}
                      </button>

                      {bookingResourceId === resource.id && (
                        <>
                          <ResourceCalendar resourceId={resource.id} />
                          <BookingForm
                            resourceId={resource.id}
                            onSuccess={() => {
                              setBookingResourceId(null);
                              setMessage(t('resources.successMessage'));
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;