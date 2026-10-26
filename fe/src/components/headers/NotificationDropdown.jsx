import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Bell,
  BellOff,
  Boxes,
  AlertCircle,
} from 'lucide-react';
import inventoryService from '../../services/inventoryService';

export function NotificationDropdown({
  isOpen,
  onToggle,
  onClose,
  onNavigate,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof isOpen === 'boolean';
  const open = isControlled ? isOpen : internalIsOpen;

  const dropdownRef = useRef(null);

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchLowStockNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const res = await inventoryService.getRawMaterials({ lowStock: true, limit: 50 });
      const items = res.data?.rawMaterials || [];
      items.sort((a, b) => {
        if (a.stock <= 0 && b.stock > 0) return -1;
        if (b.stock <= 0 && a.stock > 0) return 1;
        return a.stock - b.stock;
      });
      setLowStockItems(items);
    } catch (err) {
      console.error('Failed to fetch low stock notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockNotifications();
    const interval = setInterval(() => {
      fetchLowStockNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchLowStockNotifications]);

  useEffect(() => {
    if (open) {
      fetchLowStockNotifications();
    }
  }, [open, fetchLowStockNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (onClose) onClose();
        if (!isControlled) setInternalIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isControlled]);

  const notifications = useMemo(() => {
    const stockNotifications = lowStockItems.map((item) => {
      const isZeroStock = Number(item.stock) <= 0;
      return {
        id: `stock-${item.id}`,
        category: 'stock',
        title: item.name,
        message: isZeroStock
          ? `stok telah habis total (0 ${item.unit}).`
          : `stok menipis, tersisa ${item.stock} ${item.unit}.`,
        isZeroStock,
        supplier: item.supplier?.name,
        unit: item.unit,
        stock: item.stock,
        minStockAlert: item.minStockAlert,
        targetTab: 'inventory',
        severity: isZeroStock ? 'critical' : 'warning',
      };
    });

    return [...stockNotifications];
  }, [lowStockItems]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative p-2 rounded-xl transition-all cursor-pointer ${open
          ? 'text-orange-600 bg-orange-50'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        title="Notifikasi & Peringatan Stok"
        aria-label="Buka notifikasi"
      >
        <Bell className="w-5 h-5 stroke-[2]" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 sm:w-92 bg-white rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-3.5 px-4 bg-white border-b border-gray-100 flex items-center justify-center relative select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 text-[15px] sm:text-base tracking-tight">
                Notifications
              </span>
              {notifications.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-2xs leading-none">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {loadingNotifications && notifications.length === 0 ? (
            <div className="py-5 px-4 space-y-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-84 overflow-y-auto bg-white">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleClose();
                    if (onNavigate && notif.targetTab) onNavigate(notif.targetTab);
                  }}
                  className="px-4 py-3 hover:bg-orange-50/40 transition-colors cursor-pointer flex items-center gap-3.5 group select-none"
                  title="Klik untuk membuka inventaris"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${notif.isZeroStock
                      ? 'bg-rose-50 text-rose-600 border-rose-200/80'
                      : 'bg-orange-50 text-orange-600 border border-orange-200/80'
                      }`}
                  >
                    {notif.isZeroStock ? (
                      <AlertCircle className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <Boxes className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-[13px] leading-snug">
                    <p className="text-gray-600">
                      <strong className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {notif.title}
                      </strong>{' '}
                      <span>{notif.message}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200/60 shadow-2xs">
                        {notif.categoryLabel}
                      </span>
                      <span>
                        {notif.isZeroStock ? `Batas: ${notif.minStockAlert} ${notif.unit}` : `Min: ${notif.minStockAlert} ${notif.unit}`}
                      </span>
                      {notif.supplier && (
                        <span className="truncate max-w-[120px]">
                          • {notif.supplier}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 px-4 text-center space-y-2 bg-white">
              <div className="w-11 h-11 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto border border-orange-100 shadow-2xs">
                <BellOff className="w-5 h-5 stroke-[1.8]" />
              </div>
              <p className="text-sm font-bold text-gray-800">
                Tidak ada notifikasi tersedia
              </p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                Saat ini belum ada notifikasi atau aktivitas baru yang memerlukan perhatian Anda.
              </p>
            </div>
          )}

          <div className="px-4 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs select-none">
            <span className="text-[11px] text-gray-400">
              {notifications.length > 0 ? `${notifications.length} peringatan stok` : 'Semua sistem aman'}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="font-medium text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
