import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MessageSquare,
  Mail,
  Search,
  LogOut,
  Check,
  ShoppingBag,
  CookingPot,
  Bell,
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

export function AdminHeader({
  onToggleSidebar,
  isSidebarCollapsed = false,
  onNavigate,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  // Dropdown states
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('biteledger_lang') || 'EN';
  });

  // Profile avatar photo uses /default-avatar.svg directly
  const avatarUrl = user?.avatar || user?.photo || '/default-avatar.svg';

  // Dropdown refs for click-outside dismissal
  const messagesRef = useRef(null);
  const mailRef = useRef(null);
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(event.target)) {
        setIsMailOpen(false);
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

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full px-4 sm:px-6 bg-white border-b border-gray-200/90 shadow-2xs transition-all select-none"
        style={{ height: '64px' }}
      >
        <div className="h-full flex items-center justify-between gap-3">
          {/* ================= LEFT SECTION ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
              title={isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* 2. Chat / Comments with Glowing Red Dot */}
            <div className="relative" ref={messagesRef}>
              <button
                type="button"
                onClick={() => {
                  setIsMessagesOpen((prev) => !prev);
                  setIsMailOpen(false);
                  setIsProfileOpen(false);
                  setIsLanguageOpen(false);
                }}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${isMessagesOpen
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                title="Pesan & Notifikasi Pesanan"
              >
                <MessageSquare className="w-5 h-5 stroke-[2]" />
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              </button>

              {/* Chat / Notifications Popover */}
              {isMessagesOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900 text-sm">Notifikasi & Aktivitas</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                      3 Baru
                    </span>
                  </div>
                  <div className="py-8 px-4 text-center">
                    <p className="text-xs font-medium text-gray-500">Fitur ini sedang dalam perkembangan</p>
                  </div>
                  <div className="px-4 pt-2 border-t border-gray-100 text-center">
                    <button
                      type="button"
                      onClick={() => setIsMessagesOpen(false)}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      Tutup Notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Mail / Inquiries with Glowing Red Dot */}
            <div className="relative" ref={mailRef}>
              <button
                type="button"
                onClick={() => {
                  setIsMailOpen((prev) => !prev);
                  setIsMessagesOpen(false);
                  setIsProfileOpen(false);
                  setIsLanguageOpen(false);
                }}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${isMailOpen
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                title="Kotak Masuk & Surel Sistem"
              >
                <Mail className="w-5 h-5 stroke-[2]" />
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              </button>

              {/* Mail Popover */}
              {isMailOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900 text-sm">Kotak Surat Masuk</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      Sistem Resto
                    </span>
                  </div>
                  <div className="py-8 px-4 text-center">
                    <p className="text-xs font-medium text-gray-500">Fitur ini sedang dalam perkembangan</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= CENTER SECTION (BRAND LOGO) ================= */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none transition-transform hover:scale-102"
            onClick={() => onNavigate && onNavigate('overview')}
            title="BiteLedger Admin Suite"
          >
            <img
              src="/biteledger_logo.svg"
              alt="BiteLedger Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* 1. Search Pill Input (Search for...) */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for..."
                className="w-32 sm:w-48 md:w-56 pl-3.5 pr-8 py-1.5 text-xs sm:text-sm bg-gray-50/80 text-gray-800 placeholder-gray-400 border border-gray-300/80 rounded-full focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* 2. PROFILE PHOTO AVATAR */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsMessagesOpen(false);
                  setIsMailOpen(false);
                  setIsLanguageOpen(false);
                }}
                className="relative flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all cursor-pointer group"
                title={`Profil Pengguna: ${user?.name || 'Admin'}`}
                aria-label="User profile photo menu"
              >
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Foto Profil'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white ring-1 ring-gray-200 group-hover:ring-orange-400 transition-all shadow-xs"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.svg';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl}
                        alt={user?.name || 'Foto'}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-200 shadow-xs"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.svg';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {user?.name || 'Store Administrator'}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@biteledger.com'}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                        {isSuperAdmin ? 'Super Admin' : 'Store Manager (Admin)'}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="px-2 py-2 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate(ROUTES.CASHIER);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer text-left"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>Buka Layar Kasir (POS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate(ROUTES.KITCHEN);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer text-left"
                    >
                      <CookingPot className="w-4 h-4 text-rose-500" />
                      <span>Buka Layar Dapur (KDS)</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="px-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Sesi (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. COUNTRY / LANGUAGE FLAG */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLanguageOpen((prev) => !prev);
                  setIsMessagesOpen(false);
                  setIsMailOpen(false);
                  setIsProfileOpen(false);
                }}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1"
                title={`Pilih Bahasa: ${selectedLanguage}`}
              >
                {selectedLanguage === 'ID' ? <IDFlag /> : <USFlag />}
              </button>

              {/* Language Switcher Dropdown */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
                    Pilih Bahasa
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('EN')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-orange-50 transition-colors cursor-pointer text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <USFlag />
                      <span>English (US)</span>
                    </div>
                    {selectedLanguage === 'EN' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ID')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-orange-50 transition-colors cursor-pointer text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <IDFlag />
                      <span>Indonesia (ID)</span>
                    </div>
                    {selectedLanguage === 'ID' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default AdminHeader;
