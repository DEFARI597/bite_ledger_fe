import React from 'react';
import { Users, RefreshCw } from 'lucide-react';
import UserTableRow from './UserTableRow';
import UserPagination from './UserPagination';

export function UserTable({
  users = [],
  loading = false,
  currentUserId,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-50/60 border-b border-orange-100 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3.5">Pengguna</th>
              <th className="px-6 py-3.5">Peran</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Terdaftar</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                  <span>Memuat data staf...</span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="font-medium text-gray-600">Tidak ada anggota tim ditemukan</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Coba ganti kata kunci pencarian atau filter peran Anda.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((item) => {
                const isCurrentSelf = currentUserId?.toString() === item.id?.toString();
                return (
                  <UserTableRow
                    key={item.id}
                    user={item}
                    isCurrentSelf={isCurrentSelf}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <UserPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          loading={loading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default UserTable;
