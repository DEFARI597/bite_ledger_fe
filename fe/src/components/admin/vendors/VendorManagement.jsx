import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertBanner from '../../common/AlertBanner';
import VendorHeader from './components/VendorHeader';
import VendorStats from './components/VendorStats';
import VendorTable from './components/VendorTable';
import CreateVendorPage from './pages/CreateVendorPage';
import EditVendorPage from './pages/EditVendorPage';
import DeleteVendorModal from './modals/DeleteVendorModal';
import supplierService from '../../../services/supplierService';
import { ROUTES } from '../../../constants/roles';

export function VendorManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreateRoute =
    location.pathname === ROUTES.ADMIN_VENDORS_CREATE || location.pathname === '/admin/vendors/create';
  const [internalViewMode, setInternalViewMode] = useState('list');
  const viewMode = isCreateRoute ? 'create' : internalViewMode;

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVendorToEdit, setSelectedVendorToEdit] = useState(null);
  const [selectedVendorToDelete, setSelectedVendorToDelete] = useState(null);

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supplierService.getSuppliers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      });

      if (res.data) {
        setVendors(res.data.suppliers || []);
        if (res.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load vendors:', err);
      showAlert(err.message || 'Gagal memuat data vendor', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const stats = useMemo(() => {
    const withPhone = vendors.filter((v) => Boolean(v.phone && v.phone.trim())).length;
    const withPic = vendors.filter((v) => Boolean(v.contactPerson && v.contactPerson.trim())).length;
    const withAddress = vendors.filter((v) => Boolean(v.address && v.address.trim())).length;
    return {
      totalVendors: pagination.total || vendors.length,
      vendorsWithPhone: withPhone,
      vendorsWithPic: withPic,
      vendorsWithAddress: withAddress,
    };
  }, [vendors, pagination.total]);

  const handleOpenCreateVendor = () => {
    setInternalViewMode('create');
    navigate(ROUTES.ADMIN_VENDORS_CREATE);
  };

  const handleOpenEditVendor = (vendor) => {
    setSelectedVendorToEdit(vendor);
    setInternalViewMode('edit');
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    setSelectedVendorToEdit(null);
    if (location.pathname !== ROUTES.ADMIN_VENDORS) {
      navigate(ROUTES.ADMIN_VENDORS);
    }
  };

  const handleSuccessAction = (msg) => {
    handleBackToList();
    showAlert(msg);
    fetchVendors();
  };

  const handleOpenDeleteVendor = (vendor) => {
    setSelectedVendorToDelete(vendor);
    setIsDeleteOpen(true);
  };

  if (viewMode === 'create') {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />
        <CreateVendorPage
          onBack={handleBackToList}
          onSuccess={handleSuccessAction}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && selectedVendorToEdit) {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />
        <EditVendorPage
          vendor={selectedVendorToEdit}
          onBack={handleBackToList}
          onSuccess={handleSuccessAction}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      <AlertBanner alert={alert} onClose={() => setAlert(null)} />

      {/* Header */}
      <VendorHeader
        onOpenCreateVendor={handleOpenCreateVendor}
        totalVendors={stats.totalVendors}
      />

      {/* Stats Cards */}
      <VendorStats
        totalVendors={stats.totalVendors}
        vendorsWithPhone={stats.vendorsWithPhone}
        vendorsWithPic={stats.vendorsWithPic}
        vendorsWithAddress={stats.vendorsWithAddress}
      />

      {/* Vendor Table */}
      <VendorTable
        vendors={vendors}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchClear={() => setSearchTerm('')}
        onEdit={handleOpenEditVendor}
        onDelete={handleOpenDeleteVendor}
        pagination={pagination}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        onRefresh={fetchVendors}
      />

      {/* Confirmation Delete Dialog */}
      <DeleteVendorModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={(msg) => {
          showAlert(msg);
          fetchVendors();
        }}
        vendor={selectedVendorToDelete}
      />
    </div>
  );
}

export default VendorManagement;

