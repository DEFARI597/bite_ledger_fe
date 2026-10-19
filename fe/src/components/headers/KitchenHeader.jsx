import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Clock,
  Bell,
  Volume2,
  VolumeX,
  CookingPot,
  Flame,
  CheckCircle2,
  LogOut,
  Check,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants/roles';

// Pixel-perfect SVG Flags for language switcher
function USFlag({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`${className} rounded-xs shadow-2xs shrink-0`} viewBox="0 0 741 390">
      <rect width="741" height="390" fill="#b22234" />
      <path d="M0,30H741M0,90H741M0,150H741M0,210H741M0,270H741M0,330H741" stroke="#fff" strokeWidth="30" />
      <rect width="296.4" height="210" fill="#3c3b6e" />
      <g fill="#fff">
        <circle cx="25" cy="20" r="7" /><circle cx="75" cy="20" r="7" /><circle cx="125" cy="20" r="7" /><circle cx="175" cy="20" r="7" /><circle cx="225" cy="20" r="7" /><circle cx="275" cy="20" r="7" />
        <circle cx="50" cy="40" r="7" /><circle cx="100" cy="40" r="7" /><circle cx="150" cy="40" r="7" /><circle cx="200" cy="40" r="7" /><circle cx="250" cy="40" r="7" />
        <circle cx="25" cy="60" r="7" /><circle cx="75" cy="60" r="7" /><circle cx="125" cy="60" r="7" /><circle cx="175" cy="60" r="7" /><circle cx="225" cy="60" r="7" /><circle cx="275" cy="60" r="7" />
        <circle cx="50" cy="80" r="7" /><circle cx="100" cy="80" r="7" /><circle cx="150" cy="80" r="7" /><circle cx="200" cy="80" r="7" /><circle cx="250" cy="80" r="7" />
        <circle cx="25" cy="100" r="7" /><circle cx="75" cy="100" r="7" /><circle cx="125" cy="100" r="7" /><circle cx="175" cy="100" r="7" /><circle cx="225" cy="100" r="7" /><circle cx="275" cy="100" r="7" />
        <circle cx="50" cy="120" r="7" /><circle cx="100" cy="120" r="7" /><circle cx="150" cy="120" r="7" /><circle cx="200" cy="120" r="7" /><circle cx="250" cy="120" r="7" />
        <circle cx="25" cy="140" r="7" /><circle cx="75" cy="140" r="7" /><circle cx="125" cy="140" r="7" /><circle cx="175" cy="140" r="7" /><circle cx="225" cy="140" r="7" /><circle cx="275" cy="140" r="7" />
        <circle cx="50" cy="160" r="7" /><circle cx="100" cy="160" r="7" /><circle cx="150" cy="160" r="7" /><circle cx="200" cy="160" r="7" /><circle cx="250" cy="160" r="7" />
        <circle cx="25" cy="180" r="7" /><circle cx="75" cy="180" r="7" /><circle cx="125" cy="180" r="7" /><circle cx="175" cy="180" r="7" /><circle cx="225" cy="180" r="7" /><circle cx="275" cy="180" r="7" />
      </g>
    </svg>
  );
}

function IDFlag({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`${className} rounded-xs shadow-2xs shrink-0`} viewBox="0 0 3 2">
      <rect width="3" height="1" fill="#e70011" />
      <rect y="1" width="3" height="1" fill="#ffffff" />
    </svg>
  );
}

export function KitchenHeader({
  onToggleSidebar,
  isSidebarCollapsed = false,
  pendingTicketsCount = 3,
  cookingCount = 2,
  readyCount = 4,
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const isAdminOrSuperAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

  // Real-time live clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('biteledger_lang') || 'ID';
  });

  // Profile avatar photo uses /default-avatar.svg directly
  const avatarUrl = user?.avatar || user?.photo || '/default-avatar.svg';

  // Click-outside dismissal refs
  const alertsRef = useRef(null);
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setIsAlertsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('biteledger_lang', lang);
    setIsLanguageOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200/90 shadow-2xs">
        <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: Sidebar Toggle & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                title={isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                aria-label="Toggle Sidebar Menu"
              >
                <Menu className="w-5 h-5 stroke-[2.2]" />
              </button>
            )}

            {/* Logo Bite Ledger */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => navigate(ROUTES.KITCHEN)}
              title="Kitchen Display System - Bite Ledger"
            >
              <img
                src="/biteledger_logo.svg"
                alt="Bite Ledger Logo"
                className="h-7 sm:h-8 w-auto object-contain shrink-0"
              />
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold uppercase tracking-wider">
                <CookingPot className="w-3.5 h-3.5 text-orange-600" />
                Dapur
              </span>
            </div>

            {/* Live Operational Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Dapur Aktif</span>
            </div>
          </div>

          {/* CENTER: Kitchen Ticket Metrics Summary & Live Clock */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Prep Stats */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-xl text-xs">
              <span className="flex items-center gap-1 text-gray-600 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Masak: <strong className="text-gray-900 font-bold">{cookingCount}</strong>
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-gray-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Siap: <strong className="text-emerald-700 font-bold">{readyCount}</strong>
              </span>
            </div>

            {/* Real-time Clock */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50/60 border border-orange-200/70 text-orange-800 text-xs font-medium"
              title="Waktu Operasional Real-time"
            >
              <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="font-mono font-bold tracking-tight text-[12px] sm:text-xs">
                {currentTime || '00:00:00'} <span className="text-[10px] font-semibold text-orange-600">WIB</span>
              </span>
            </div>
          </div>

          {/* RIGHT: Alert buzzer, Sound toggle, Language, and Profile Photo Avatar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Sound Buzzer Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                soundEnabled
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              }`}
              title={soundEnabled ? 'Suara Bel Pesanan Aktif' : 'Suara Bel Dinonaktifkan'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Notification / Tickets Alert Bell */}
            <div className="relative" ref={alertsRef}>
              <button
                type="button"
                onClick={() => setIsAlertsOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                  isAlertsOpen
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Tiket Pesanan Dapur"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                {pendingTicketsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                  </span>
                )}
              </button>

              {/* Alert Popover */}
              {isAlertsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CookingPot className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900 text-sm">Antrian Tiket Dapur</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                      {pendingTicketsCount} Menunggu
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    <div className="p-3 hover:bg-orange-50/40 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900">Meja #04 • #ORD-8821</span>
                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">2 mnt</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">2x Ayam Geprek Sambal Matah (Level 3), 1x Nasi Putih</p>
                    </div>
                    <div className="p-3 hover:bg-orange-50/40 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900">Takeaway #07 • #ORD-8820</span>
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">6 mnt</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">1x Sup Iga Sapi Rempah, 2x Es Teh Manis</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen((prev) => !prev)}
                className="p-1.5 sm:p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
                title={`Pilih Bahasa (${selectedLanguage})`}
              >
                {selectedLanguage === 'ID' ? <IDFlag /> : <USFlag />}
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ID')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer ${
                      selectedLanguage === 'ID' ? 'text-orange-600 font-bold bg-orange-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <IDFlag />
                      <span>Indonesia</span>
                    </span>
                    {selectedLanguage === 'ID' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('EN')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer ${
                      selectedLanguage === 'EN' ? 'text-orange-600 font-bold bg-orange-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <USFlag />
                      <span>English</span>
                    </span>
                    {selectedLanguage === 'EN' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* CIRCULAR PROFILE PHOTO AVATAR ON RIGHT */}
            <div className="relative pl-1 sm:pl-2" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="group relative flex items-center focus:outline-hidden cursor-pointer"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                title={`${user?.name || 'Staf Dapur'} (Klik untuk profil & ganti foto)`}
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={user?.name || 'Kitchen Staff'}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-orange-500 transition-all shadow-xs"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.svg';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt={user?.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/30 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.svg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-sm truncate">
                          {user?.name || 'Staf Dapur Restoran'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.email || 'kitchen@biteledger.com'}
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            <CookingPot className="w-2.5 h-2.5" />
                            {role === ROLES.SUPER_ADMIN
                              ? 'SUPER ADMIN (DAPUR)'
                              : role === ROLES.ADMIN
                                ? 'ADMIN (DAPUR)'
                                : 'KITCHEN CREW'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isAdminOrSuperAdmin && (
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate(ROUTES.ADMIN);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LayoutGrid className="w-4 h-4 text-blue-500" />
                        <span>Beralih ke Dashboard Admin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate(ROUTES.CASHIER);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-500" />
                        <span>Buka Terminal Kasir</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Keluar Sistem</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default KitchenHeader;
