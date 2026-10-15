import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../services/userService';
import AlertBanner from '../../common/AlertBanner';
import UserHeader from './components/UserHeader';
import UserFilterBar from './components/UserFilterBar';
import UserTable from './components/UserTable';
import CreateUserModal from './modals/CreateUserModal';
import EditUserModal from './modals/EditUserModal';
import DeleteUserModal from './modals/DeleteUserModal';

export function UserManagement() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRoles = async () => {
    try {
      const res = await userService.getRoles();
      if (res.data) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        roleId: selectedRoleId,
      });

      if (res.data) {
        setUsers(res.data.users || []);
        if (res.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      showAlert(err.message || 'Gagal memuat data staf', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedRoleId]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenEdit = (user) => {
    setSelectedUserToEdit(user);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleModalSuccess = (message, type = 'success') => {
    showAlert(message, type);
    fetchUsers();
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <AlertBanner alert={alert} onClose={() => setAlert(null)} />

      <UserHeader onOpenCreate={() => setIsCreateOpen(true)} />

      <UserFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchClear={() => setSearchTerm('')}
        selectedRoleId={selectedRoleId}
        onRoleChange={(roleId) => {
          setSelectedRoleId(roleId);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        roles={roles}
        totalUsers={pagination.total}
        loading={loading}
        onRefresh={fetchUsers}
      />

      <UserTable
        users={users}
        loading={loading}
        currentUserId={currentUser?.id}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        pagination={pagination}
        onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleModalSuccess}
        roles={roles}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleModalSuccess}
        roles={roles}
        userToEdit={selectedUserToEdit}
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleModalSuccess}
        userToDelete={selectedUserToDelete}
      />
    </div>
  );
}

export default UserManagement;
