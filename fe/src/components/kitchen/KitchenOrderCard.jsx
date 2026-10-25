import React from "react";
import { Clock, CookingPot, Flame, CheckCircle2, User, ChevronRight, AlertCircle } from "lucide-react";

export function KitchenOrderCard({ order, onStatusUpdate, isUpdating = false }) {
  if (!order) return null;

  const orderTime = new Date(order.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusBadge = () => {
    switch (order.status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Dimasak
          </span>
        );
      case "cooking":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
            Sedang Dimasak
          </span>
        );
      case "ready":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            {order.status}
          </span>
        );
    }
  };

  const totalQuantity = (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-gray-900 tracking-tight">
              Pesanan #{String(order.id).padStart(4, "0")}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 shadow-2xs">
              {totalQuantity} Item
            </span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{orderTime} WIB</span>
          </div>
          <div className="flex items-center gap-1 truncate max-w-[140px]">
            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">Kasir: {order.user?.name || "Kasir POS"}</span>
          </div>
        </div>
      </div>

      {/* Card Body: Items List */}
      <div className="p-4 flex-1 space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Menu yang Harus Disiapkan
        </div>
        <ul className="divide-y divide-gray-100 text-xs">
          {(order.items || []).map((item, idx) => (
            <li key={item.id || idx} className="py-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-800 font-black text-xs flex items-center justify-center shrink-0 border border-orange-200">
                  {item.quantity}x
                </span>
                <span className="font-bold text-gray-900 text-sm truncate">
                  {item.productName || "Menu Pesanan"}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">
                {item.category || "Makanan/Minuman"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/40">
        {order.status === "pending" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusUpdate && onStatusUpdate(order.id, "cooking")}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-4 h-4" />
            <span>Mulai Masak</span>
          </button>
        )}

        {order.status === "cooking" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusUpdate && onStatusUpdate(order.id, "completed")}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tandai Selesai Masak</span>
          </button>
        )}

        {order.status === "completed" && (
          <div className="w-full py-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
            Pesanan Siap Disajikan / Telah Selesai
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenOrderCard;
