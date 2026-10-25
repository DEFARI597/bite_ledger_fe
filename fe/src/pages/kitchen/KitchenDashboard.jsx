import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/common/Sidebar";
import KitchenHeader from "../../components/headers/KitchenHeader";
import KitchenOrderCard from "../../components/kitchen/KitchenOrderCard";
import orderService from "../../services/orderService";
import {
  AlertTriangle,
  CookingPot,
  Flame,
  CheckCircle2,
  RefreshCw,
  Boxes,
  Clock,
  Inbox,
} from "lucide-react";

export function KitchenDashboard() {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = useState("queue");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const redirectAlert = location.state?.alert;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ queue: 0, production: 0, history: 0 });

  const getStatusForTab = (tab) => {
    switch (tab) {
      case "queue":
        return "pending";
      case "production":
        return "cooking";
      case "history":
        return "completed";
      default:
        return "pending";
    }
  };

  const fetchOrders = useCallback(async () => {
    if (currentTab === "inventory") {
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const status = getStatusForTab(currentTab);
      const res = await orderService.getOrders({ status, limit: 50 });
      const list = res.data?.orders || [];
      setOrders(list);

      const [pendingRes, cookingRes, completedRes] = await Promise.allSettled([
        orderService.getOrders({ status: "pending", limit: 1 }),
        orderService.getOrders({ status: "cooking", limit: 1 }),
        orderService.getOrders({ status: "completed", limit: 1 }),
      ]);

      setStats({
        queue: pendingRes.status === "fulfilled" ? pendingRes.value.data?.pagination?.total || 0 : 0,
        production: cookingRes.status === "fulfilled" ? cookingRes.value.data?.pagination?.total || 0 : 0,
        history: completedRes.status === "fulfilled" ? completedRes.value.data?.pagination?.total || 0 : 0,
      });
    } catch (err) {
      console.error("Failed to fetch kitchen orders:", err);
      setError("Gagal memuat antrean pesanan dapur. Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();

    const timer = setInterval(() => {
      fetchOrders();
    }, 8000);

    return () => clearInterval(timer);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(err.data?.message || err.message || "Gagal memperbarui status pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case "queue":
        return {
          title: "Antrean Pesanan Masak",
          desc: "Daftar pesanan baru yang menunggu diproses dan disiapkan dapur",
          badge: `${orders.length} Menunggu`,
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "production":
        return {
          title: "Status Proses Memasak",
          desc: "Pesanan yang sedang aktif dimasak oleh koki/staf dapur",
          badge: `${orders.length} Sedang Dimasak`,
          badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
        };
      case "history":
        return {
          title: "Riwayat Pesanan Selesai",
          desc: "Pesanan yang telah selesai dimasak dan disajikan ke pelanggan",
          badge: `${orders.length} Selesai`,
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "inventory":
        return {
          title: "Bahan Baku & Dapur",
          desc: "Informasi ketersediaan bahan baku untuk persiapan masak",
          badge: "Bahan Baku",
          badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        };
      default:
        return { title: "Operasional Dapur", desc: "", badge: "", badgeColor: "" };
    }
  };

  const tabInfo = getTabTitle();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header tailored for Kitchen role */}
      <KitchenHeader
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
        cookingCount={stats.production}
        readyCount={stats.history}
      />

      <div className="flex-1 flex min-w-0">
        <Sidebar
          variant="kitchen"
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/50">
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {redirectAlert && (
              <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800 mb-0.5">Pemberitahuan Hak Akses:</div>
                  <p>{redirectAlert.message}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {tabInfo.title}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tabInfo.badgeColor}`}
                  >
                    {tabInfo.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tabInfo.desc}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    fetchOrders();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  title="Segarkan Antrean"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="font-bold underline hover:text-red-900 cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {currentTab === "inventory" ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <Boxes className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Katalog Bahan Baku Dapur</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Stok bahan baku diperbarui secara berkala oleh manajemen inventaris. Silakan hubungi
                  staf gudang jika ada bahan baku yang menipis.
                </p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-64 rounded-2xl bg-white border border-gray-200 p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="h-4 w-full bg-gray-100 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-2xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-200 shadow-xs">
                  <CookingPot className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Belum Ada Pesanan di Tab Ini
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Pesanan baru dari kasir otomatis akan muncul di sini secara real-time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Periksa Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                    isUpdating={isUpdating}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default KitchenDashboard;
