import React from 'react';
import { Mail, Pencil, Trash2 } from 'lucide-react';
import { formatRoleLabel, formatDate } from '../utils/userFormatters';

export function UserTableRow({ user, isCurrentSelf = false, onEdit, onDelete }) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <tr className="hover:bg-orange-50/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
            style={{
              background: '#fff7ed',
              color: '#ea580c',
              border: '1.5px solid #fed7aa',
            }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
              <span>{user.name}</span>
              {isCurrentSelf && (
                <span className="text-[10px] font-medium text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded">
                  Anda
                </span>
              )}
            </div>
            <div className="text-gray-500 text-xs truncate flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 font-medium text-gray-800">
        {formatRoleLabel(user.role)}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Aktif
        </span>
      </td>

      <td className="px-6 py-4 text-gray-500 text-xs">
        {formatDate(user.createdAt)}
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(user)}
            title="Edit data staf"
            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(user)}
            disabled={isCurrentSelf}
            title={isCurrentSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus akses staf'}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isCurrentSelf
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
