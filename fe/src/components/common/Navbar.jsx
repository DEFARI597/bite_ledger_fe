import React, { useState, useEffect } from 'react';
import { LogOut, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ title = 'Bite Ledger', subtitle = 'POS & Operation Suite' }) {
  const { user, role, logout } = useAuth();
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

  return (
    <header
      className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3.5 transition-all shadow-md"
      style={{
        background: 'linear-gradient(135deg, #ea6c00 0%, #f97316 50%, #fb923c 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand section */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.4)' }}
          >
            <UtensilsCrossed className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#fff',
                }}
              >
                <Sparkles className="w-2.5 h-2.5" /> v1.0
              </span>
            </div>
            <p className="text-xs text-orange-100 font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Live Clock Indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
            }}
          >
            <Clock className="w-3.5 h-3.5 text-orange-100" />
            <span className="font-mono">{currentTime} WIB</span>
          </div>

          {/* User Profile */}
          {user && (
            <div
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3"
              style={{ borderLeft: '1px solid rgba(255,255,255,0.3)' }}
            >
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-white tracking-tight leading-tight">
                  {user.name}
                </div>
                <div className="text-[11px] text-orange-100 leading-tight">{user.email}</div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              color: '#fff',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.30)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            }}
            title="Keluar dari sesi"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
