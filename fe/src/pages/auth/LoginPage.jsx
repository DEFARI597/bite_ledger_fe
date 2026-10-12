import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Shield,
  CreditCard,
  Layers,
} from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Email dan kata sandi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const destination = location.state?.from?.pathname || result.defaultRoute || '/admin';
      navigate(destination, { replace: true });
    } else {
      setLocalError(result.error);
    }
  };

  const displayError = localError || authError;

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ background: '#ffffff' }}
    >
      {/* ===== LEFT PANEL — Brand & Info ===== */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #c2410c 0%, #ea580c 35%, #f97316 70%, #fb923c 100%)',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div
          className="absolute bottom-20 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
            >
              <UtensilsCrossed className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight leading-none">
                Bite Ledger
              </div>
              <div className="text-xs text-orange-100 font-medium mt-0.5">
                F&B Operation Suite
              </div>
            </div>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Kelola restoran Anda<br />
            <span style={{ color: '#fed7aa' }}>lebih cerdas.</span>
          </h2>
          <p className="text-sm text-orange-100 leading-relaxed max-w-xs">
            Platform manajemen operasional F&B terintegrasi — dari kasir POS
            hingga laporan keuangan dan inventori bahan baku.
          </p>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 text-[11px] text-orange-200">
          Bite Ledger F&B Suite • Sistem Manajemen Operasional
        </div>
      </div>

      {/* ===== RIGHT PANEL — Login Form ===== */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-12 lg:py-0">
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl mb-3"
            style={{
              background: 'linear-gradient(135deg, #ea580c, #f97316)',
            }}
          >
            <UtensilsCrossed className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Bite Ledger</h1>
          <p className="text-xs text-gray-500 mt-1">Sistem Manajemen Operasional F&B</p>
        </div>

        <div className="w-full max-w-sm xl:max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Masuk ke Akun Anda
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gunakan kredensial yang telah diberikan oleh administrator
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div
              className="mb-5 p-3.5 rounded-xl flex items-start gap-3 text-xs"
              style={{
                background: '#fff1f2',
                border: '1.5px solid #fecaca',
                color: '#dc2626',
              }}
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{displayError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5"
                style={{ color: '#374151' }}
              >
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4" style={{ color: '#9ca3af' }} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@biteledger.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans transition-all outline-none"
                  style={{
                    background: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    color: '#111827',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1.5px solid #f97316';
                    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1.5px solid #e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5"
                style={{ color: '#374151' }}
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: '#9ca3af' }} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-mono transition-all outline-none"
                  style={{
                    background: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    color: '#111827',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1.5px solid #f97316';
                    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1.5px solid #e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer"
                  style={{ color: '#9ca3af' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: isSubmitting
                  ? '#fdba74'
                  : 'linear-gradient(135deg, #ea6c00 0%, #f97316 50%, #fb923c 100%)',
                boxShadow: '0 4px 20px rgba(234, 108, 0, 0.35)',
              }}
              onMouseEnter={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(234, 108, 0, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(234, 108, 0, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>



          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-6">
            Bite Ledger F&B Suite • Terhubung ke Backend Service API Gateway
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
