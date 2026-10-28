import React from 'react';
import { LayoutGrid, Ban } from 'lucide-react';

export function PosCategoryFilter({
  categories = [],
  selectedCategory = 'ALL',
  onSelectCategory,
  categoryCounts = {},
  totalCount = 0,
  outOfStockCount = 0,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
      <button
        type="button"
        onClick={() => onSelectCategory('ALL')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs ${selectedCategory === 'ALL'
            ? 'bg-orange-600 text-white shadow-orange-500/20 shadow-md ring-2 ring-orange-500/20'
            : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-orange-50/50 hover:border-orange-200'
          }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Semua Menu</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedCategory === 'ALL'
              ? 'bg-white/25 text-white'
              : 'bg-gray-100 text-gray-600'
            }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Dynamic Category Pills */}
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer shrink-0 shadow-2xs ${isSelected
                ? 'bg-orange-600 text-white shadow-orange-500/20 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-orange-50/50 hover:border-orange-200'
              }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected
                  ? 'bg-white/25 text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              {count}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onSelectCategory('OUT_OF_STOCK')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer shrink-0 shadow-2xs ${selectedCategory === 'OUT_OF_STOCK'
            ? 'bg-red-600 text-white shadow-red-500/20 shadow-md ring-2 ring-red-500/20'
            : 'bg-white text-red-600 border border-red-200/90 hover:bg-red-50/70 hover:border-red-300'
          }`}
      >
        <Ban className="w-3.5 h-3.5" />
        <span>Habis</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedCategory === 'OUT_OF_STOCK'
              ? 'bg-white/25 text-white'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {outOfStockCount}
        </span>
      </button>
    </div>
  );
}

export default PosCategoryFilter;
