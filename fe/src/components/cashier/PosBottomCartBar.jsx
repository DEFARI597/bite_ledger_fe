import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { usePosCart } from '../../context/PosCartContext';
import { ROUTES } from '../../constants/roles';

export function PosBottomCartBar() {
  const navigate = useNavigate();
  const { totalQuantity, totalAmount } = usePosCart();

  if (totalQuantity === 0) return null;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <button
          type="button"
          onClick={() => navigate(ROUTES.CASHIER_PAYMENT || '/payment')}
          className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer border border-white/20 animate-in slide-in-from-bottom-4 duration-300 group select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  Keranjang Pesanan
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white text-xs font-black shadow-xs">
                  {totalQuantity} Item
                </span>
              </div>
              <p className="text-[11px] text-orange-100 hidden sm:block">
                Ketuk untuk lanjut ke rincian pesanan & pembayaran
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-orange-200">Total Tagihan</p>
              <p className="text-base sm:text-xl font-black text-white">
                {formatRupiah(totalAmount)}
              </p>
            </div>

            <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 group-hover:bg-orange-50 transition-colors">
              <span>Lihat Pesanan & Bayar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default PosBottomCartBar;
