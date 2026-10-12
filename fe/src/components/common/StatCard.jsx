import React from 'react';

export function StatCard({ title, value, change, isPositive = true, icon: Icon, color = 'indigo', subtitle }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      icon: 'text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      icon: 'text-cyan-400',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.border} border`}>
            <Icon className={`w-4 h-4 ${scheme.icon}`} />
          </div>
        )}
      </div>

      <div>
        <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
          {change && (
            <span
              className={`font-semibold ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
