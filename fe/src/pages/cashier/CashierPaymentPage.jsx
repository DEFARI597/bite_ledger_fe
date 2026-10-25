import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Package,
  ShoppingBag,
  Receipt,
  UtensilsCrossed,
  Printer,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import CashierHeader from "../../components/headers/CashierHeader";
import { usePosCart } from "../../context/PosCartContext";
import { getProductImageUrl } from "../../utils/image.util";
import { ROUTES } from "../../constants/roles";
import orderService from "../../services/orderService";

export function CashierPaymentPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalQuantity,
    totalAmount,
  } = usePosCart();

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cashGiven, setCashGiven] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const cashAmount = parseFloat(cashGiven) || 0;
  const changeAmount = Math.max(0, cashAmount - totalAmount);

  const handleProcessPayment = async () => {
    setErrorMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage("Keranjang pesanan masih kosong.");
      return;
    }

    if (paymentMethod === "CASH") {
      if (cashGiven === "" || cashAmount < totalAmount) {
        setErrorMessage("Uang yang diterima kurang dari total pembayaran.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      const payload = {
        paymentMethod: paymentMethod.toLowerCase(),
        status: "pending",
        items: cartItems.map((item) => ({
          productId: String(item.product.id),
          quantity: item.quantity,
        })),
      };

      const res = await orderService.createOrder(payload);
      const orderData = res.data;

      orderData.cashGiven = cashAmount;
      orderData.changeAmount = changeAmount;

      setCompletedOrder(orderData);
      setPaymentSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Failed to process payment:", err);
      const msg =
        err.data?.message ||
        err.message ||
        "Gagal memproses pembayaran. Periksa koneksi backend.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <CashierHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.CASHIER)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/50 transition-all font-bold text-xs shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali Pilih Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status Pesanan:</span>
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
              {paymentSuccess ? "Selesai Diproses" : `${totalQuantity} Menu dalam Keranjang`}
            </span>
          </div>
        </div>

        {paymentSuccess && completedOrder ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-emerald-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            {/* Header Sukses */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Pembayaran Berhasil!
              </h2>
              <p className="text-xs text-gray-500">
                Pesanan telah tercatat dan otomatis diteruskan ke antrean dapur.
              </p>
            </div>

            {/* Nomor Antrean / Order ID Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-orange-100">
                  Nomor Antrean Pesanan
                </span>
                <div className="text-3xl font-black tracking-tight mt-0.5">
                  #{String(completedOrder.id).padStart(4, "0")}
                </div>
              </div>
              <div className="text-right text-xs text-orange-100">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs font-bold text-white text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  Antrean Dapur
                </span>
                <div className="mt-1 text-[11px]">
                  {new Date(completedOrder.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </div>
              </div>
            </div>

            {/* Detail Struk Pembelian */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60 space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-500 pb-2 border-b border-gray-200/80">
                <span>Kasir: <strong className="text-gray-900">{completedOrder.user?.name || "Kasir"}</strong></span>
                <span className="uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {completedOrder.paymentMethod}
                </span>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-gray-700">Daftar Menu:</div>
                <div className="divide-y divide-gray-200/70">
                  {(completedOrder.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="py-1.5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900">{item.quantity}x</span>
                        <span className="font-semibold text-gray-800">{item.productName}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Total Tagihan:</span>
                  <span className="font-black text-sm text-gray-900">
                    {formatRupiah(completedOrder.totalAmount)}
                  </span>
                </div>

                {completedOrder.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Uang Diterima:</span>
                      <span className="font-bold text-gray-800">
                        {formatRupiah(completedOrder.cashGiven || completedOrder.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold text-xs pt-1 border-t border-dashed border-gray-200">
                      <span>Kembalian:</span>
                      <span className="font-black text-sm">
                        {formatRupiah(completedOrder.changeAmount || 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                <span>Cetak Struk Pesanan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentSuccess(false);
                  setCompletedOrder(null);
                  navigate(ROUTES.CASHIER);
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buat Pesanan Baru</span>
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4 border border-orange-200 shadow-xs">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Keranjang Pesanan Masih Kosong
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Silakan kembali ke katalog menu dan pilih produk yang ingin dibeli pelanggan.
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CASHIER)}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Pilih Menu Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Rincian Menu Pesanan</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Periksa kembali menu dan takaran pesanan sebelum pembayaran
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Kosongkan
                </button>
              </div>

              <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
                {cartItems.map((item) => {
                  const product = item.product;
                  const imageUrl = getProductImageUrl(product.imageUrl);
                  const subtotal = item.quantity * Number(product.sellingPrice || 0);

                  return (
                    <div
                      key={product.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-orange-50/20 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-50/60 border border-gray-200 shrink-0 flex items-center justify-center relative shadow-2xs">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-orange-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {product.category || "Menu"}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs font-bold text-orange-600 mt-0.5">
                            {formatRupiah(product.sellingPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Kurangi"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-8 text-center text-xs font-black text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Tambah"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right w-24">
                          <span className="font-black text-gray-900 text-sm">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-5 space-y-5">
                <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-600" />
                  <span>Ringkasan Tagihan</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} Item)</span>
                    <span className="font-bold text-gray-900">{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pajak Restoran (PB1)</span>
                    <span className="font-semibold text-gray-400">Termasuk</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
                    <span className="text-xl font-black text-orange-600">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${paymentMethod === "CASH"
                        ? "border-orange-500 bg-orange-50/70 text-orange-700 shadow-2xs ring-1 ring-orange-500 font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Banknote className="w-5 h-5 text-orange-600" />
                      <span className="text-xs">Tunai</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("QRIS")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${paymentMethod === "QRIS"
                        ? "border-orange-500 bg-orange-50/70 text-orange-700 shadow-2xs ring-1 ring-orange-500 font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <QrCode className="w-5 h-5 text-orange-600" />
                      <span className="text-xs">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("DEBIT")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${paymentMethod === "DEBIT"
                        ? "border-orange-500 bg-orange-50/70 text-orange-700 shadow-2xs ring-1 ring-orange-500 font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <span className="text-xs">Debit/EDC</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "CASH" && (
                  <div className="space-y-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Uang Diterima:</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={cashGiven}
                          onChange={(e) => setCashGiven(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCashGiven(String(totalAmount))}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:border-orange-300 cursor-pointer"
                      >
                        Uang Pas
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashGiven("50000")}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:border-orange-300 cursor-pointer"
                      >
                        50.000
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashGiven("100000")}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:border-orange-300 cursor-pointer"
                      >
                        100.000
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-500">Kembalian:</span>
                      <span
                        className={`font-black ${cashAmount >= totalAmount ? "text-emerald-600 text-sm" : "text-gray-400"
                          }`}
                      >
                        {formatRupiah(changeAmount)}
                      </span>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={
                    isProcessing ||
                    (paymentMethod === "CASH" && (cashGiven === "" || cashAmount < totalAmount))
                  }
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Memproses Pembayaran...</span>
                  ) : (
                    <span>Konfirmasi Pembayaran ({formatRupiah(totalAmount)})</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CashierPaymentPage;
