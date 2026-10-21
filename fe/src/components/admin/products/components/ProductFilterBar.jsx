import { Search, X, Filter } from 'lucide-react';

export function ProductFilterBar({
  searchTerm = '',
  onSearchChange,
  onClearSearch,
  selectedCategory = 'ALL',
  onSelectCategory,
  categories = [],
  statusFilter = 'ALL',
  onStatusFilterChange,
  totalItems = 0,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
      {/* Top row: Search input & Status Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama menu produk..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-gray-50/50"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Hanya Aktif</option>
              <option value="INACTIVE">Hanya Nonaktif</option>
            </select>
          </div>

          <span className="text-xs font-semibold text-gray-400 whitespace-nowrap hidden sm:inline">
            Total: {totalItems} menu
          </span>
        </div>
      </div>

      {/* Bottom row: Dynamic Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight shrink-0 mr-1">
            Kategori:
          </span>

          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Semua ({totalItems})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductFilterBar;
