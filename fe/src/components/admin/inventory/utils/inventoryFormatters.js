export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatStock = (stock, unit = '') => {
  if (stock === undefined || stock === null || isNaN(stock)) return '0 ' + unit;
  const num = Number(stock);
  const formatted = num % 1 === 0 ? num.toString() : num.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
};

export const getStockStatus = (stock, minStockAlert) => {
  const current = Number(stock || 0);
  const min = Number(minStockAlert || 0);

  if (current <= 0) {
    return {
      status: 'empty',
      label: 'Habis',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      dotClass: 'bg-red-500',
    };
  }

  if (current <= min) {
    return {
      status: 'low',
      label: 'Stok Menipis',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
    };
  }

  return {
    status: 'safe',
    label: 'Stok Aman',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  };
};
