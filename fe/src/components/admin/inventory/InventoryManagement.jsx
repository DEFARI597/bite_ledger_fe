import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertBanner from '../../common/AlertBanner';
import InventoryHeader from './components/InventoryHeader';
import InventoryStats from './components/InventoryStats';
import InventoryFilterBar from './components/InventoryFilterBar';
import RawMaterialTable from './components/RawMaterialTable';

import CreateRawMaterialPage from './pages/CreateRawMaterialPage';
import EditRawMaterialPage from './pages/EditRawMaterialPage';
import AdjustStockPage from './pages/AdjustStockPage';
import DeleteRawMaterialModal from './modals/DeleteRawMaterialModal';

import inventoryService from '../../../services/inventoryService';
import supplierService from '../../../services/supplierService';
import { ROUTES } from '../../../constants/roles';

export function InventoryManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreateRoute =
    location.pathname === ROUTES.ADMIN_INVENTORY_CREATE || location.pathname === '/admin/inventory/create';
  const [internalViewMode, setInternalViewMode] = useState('list');
  const viewMode = isCreateRoute ? 'create_material' : internalViewMode;

  // Data states
  const [materials, setMaterials] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  // Loading states
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Pagination states
  const [materialPagination, setMaterialPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Filters & Search
  const [materialSearch, setMaterialSearch] = useState('');
  const [debouncedMaterialSearch, setDebouncedMaterialSearch] = useState('');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('');

  // Overall statistics (unfiltered totals to keep total asset value stable)
  const [overallTotalAssetValue, setOverallTotalAssetValue] = useState(0);
  const [overallLowStockCount, setOverallLowStockCount] = useState(0);
  const [overallTotalMaterials, setOverallTotalMaterials] = useState(0);

  // Modals & Selected Entities
  const [isDeleteMaterialOpen, setIsDeleteMaterialOpen] = useState(false);
  const [selectedMaterialToEdit, setSelectedMaterialToEdit] = useState(null);
  const [selectedMaterialToAdjust, setSelectedMaterialToAdjust] = useState(null);
  const [selectedMaterialToDelete, setSelectedMaterialToDelete] = useState(null);

  // Alert Banner
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaterialSearch(materialSearch);
      setMaterialPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [materialSearch]);

  // Fetch Suppliers for material filtering
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await supplierService.getSuppliers({
        limit: 100,
      });

      if (res.data) {
        setAllSuppliers(res.data.suppliers || []);
      }
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    }
  }, []);

  // Fetch overall statistics (unfiltered) to keep latest total asset value
  const fetchOverallStats = useCallback(async () => {
    try {
      const res = await inventoryService.getRawMaterials({
        limit: 100,
      });

      if (res.data && res.data.rawMaterials) {
        const totalVal = res.data.rawMaterials.reduce(
          (acc, m) => acc + Number(m.stock || 0) * Number(m.costPerUnit || 0),
          0
        );
        const lowCount = res.data.rawMaterials.filter((m) => m.isLowStock).length;
        setOverallTotalAssetValue(totalVal);
        setOverallLowStockCount(lowCount);
        if (res.data.pagination?.total) {
          setOverallTotalMaterials(res.data.pagination.total);
        } else {
          setOverallTotalMaterials(res.data.rawMaterials.length);
        }
      }
    } catch (err) {
      console.error('Failed to load overall stats:', err);
    }
  }, []);

  // Fetch Raw Materials
  const fetchMaterials = useCallback(async () => {
    setLoadingMaterials(true);
    try {
      const res = await inventoryService.getRawMaterials({
        page: materialPagination.page,
        limit: materialPagination.limit,
        search: debouncedMaterialSearch,
        supplierId: selectedSupplierFilter,
      });

      if (res.data) {
        setMaterials(res.data.rawMaterials || []);
        if (res.data.pagination) {
          setMaterialPagination((prev) => ({
            ...prev,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }

        // If unfiltered, also update latest total asset value
        if (!selectedSupplierFilter && !debouncedMaterialSearch) {
          const unfilteredVal = (res.data.rawMaterials || []).reduce(
            (acc, m) => acc + Number(m.stock || 0) * Number(m.costPerUnit || 0),
            0
          );
          if (unfilteredVal > 0) {
            setOverallTotalAssetValue(unfilteredVal);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load raw materials:', err);
      showAlert(err.message || 'Gagal memuat bahan baku', 'error');
    } finally {
      setLoadingMaterials(false);
    }
  }, [
    materialPagination.page,
    materialPagination.limit,
    debouncedMaterialSearch,
    selectedSupplierFilter,
  ]);

  // Initial loads
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    fetchOverallStats();
  }, [fetchOverallStats]);

  // Aggregate stats - keep overall total asset value stable regardless of supplier filter
  const stats = useMemo(() => {
    const currentVal = materials.reduce(
      (acc, m) => acc + Number(m.stock || 0) * Number(m.costPerUnit || 0),
      0
    );
    const lowCount = materials.filter((m) => m.isLowStock).length;

    return {
      totalMaterials: overallTotalMaterials || materialPagination.total || materials.length,
      lowStockCount: overallLowStockCount || lowCount,
      totalSuppliers: allSuppliers.length,
      totalInventoryValue: overallTotalAssetValue || currentVal,
    };
  }, [
    materials,
    materialPagination.total,
    allSuppliers.length,
    overallTotalAssetValue,
    overallLowStockCount,
    overallTotalMaterials,
  ]);

  // Handlers for Materials
  const handleOpenEditMaterial = (item) => {
    setSelectedMaterialToEdit(item);
    setInternalViewMode('edit_material');
  };

  const handleBackFromEditMaterial = () => {
    setSelectedMaterialToEdit(null);
    setInternalViewMode('list');
  };

  const handleSuccessEditMaterial = (msg) => {
    setSelectedMaterialToEdit(null);
    setInternalViewMode('list');
    showAlert(msg);
    fetchMaterials();
    fetchOverallStats();
  };

  const handleOpenAdjustStock = (item) => {
    setSelectedMaterialToAdjust(item);
    setInternalViewMode('adjust_stock');
  };

  const handleBackFromAdjustStock = () => {
    setSelectedMaterialToAdjust(null);
    setInternalViewMode('list');
  };

  const handleSuccessAdjustStock = (msg) => {
    setSelectedMaterialToAdjust(null);
    setInternalViewMode('list');
    showAlert(msg);
    fetchMaterials();
    fetchOverallStats();
  };

  const handleOpenDeleteMaterial = (item) => {
    setSelectedMaterialToDelete(item);
    setIsDeleteMaterialOpen(true);
  };

  // Handlers for Materials Navigation
  const handleOpenCreateMaterial = () => {
    setInternalViewMode('create_material');
    navigate(ROUTES.ADMIN_INVENTORY_CREATE);
  };

  const handleBackFromCreateMaterial = () => {
    setInternalViewMode('list');
    navigate(ROUTES.ADMIN);
  };

  const handleSuccessCreateMaterial = (msg) => {
    setInternalViewMode('list');
    navigate(ROUTES.ADMIN);
    showAlert(msg);
    fetchMaterials();
    fetchOverallStats();
  };

  if (viewMode === 'create_material') {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />
        <CreateRawMaterialPage
          onBack={handleBackFromCreateMaterial}
          onSuccess={handleSuccessCreateMaterial}
          initialSuppliers={allSuppliers}
        />
      </div>
    );
  }

  if (viewMode === 'edit_material' && selectedMaterialToEdit) {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />
        <EditRawMaterialPage
          material={selectedMaterialToEdit}
          onBack={handleBackFromEditMaterial}
          onSuccess={handleSuccessEditMaterial}
          initialSuppliers={allSuppliers}
        />
      </div>
    );
  }

  if (viewMode === 'adjust_stock' && selectedMaterialToAdjust) {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />
        <AdjustStockPage
          material={selectedMaterialToAdjust}
          onBack={handleBackFromAdjustStock}
          onSuccess={handleSuccessAdjustStock}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <AlertBanner alert={alert} onClose={() => setAlert(null)} />

      {/* Header */}
      <InventoryHeader
        onOpenCreateMaterial={handleOpenCreateMaterial}
        lowStockCount={stats.lowStockCount}
      />

      {/* Stats Cards */}
      <InventoryStats
        totalMaterials={stats.totalMaterials}
        lowStockCount={stats.lowStockCount}
        totalSuppliers={stats.totalSuppliers}
        totalInventoryValue={stats.totalInventoryValue}
      />

      {/* Filter Bar & Table */}
      <div className="space-y-4">
        <InventoryFilterBar
          searchTerm={materialSearch}
          onSearchChange={setMaterialSearch}
          onSearchClear={() => setMaterialSearch('')}
          selectedSupplierId={selectedSupplierFilter}
          onSupplierChange={(val) => {
            setSelectedSupplierFilter(val);
            setMaterialPagination((prev) => ({ ...prev, page: 1 }));
          }}
          suppliers={allSuppliers}
          totalItems={materialPagination.total}
          loading={loadingMaterials}
          onRefresh={fetchMaterials}
        />

        <RawMaterialTable
          materials={materials}
          loading={loadingMaterials}
          onEdit={handleOpenEditMaterial}
          onAdjustStock={handleOpenAdjustStock}
          onDelete={handleOpenDeleteMaterial}
          pagination={materialPagination}
          onPageChange={(p) => setMaterialPagination((prev) => ({ ...prev, page: p }))}
        />
      </div>

      {/* Confirmation Dialog for Delete Material */}
      <DeleteRawMaterialModal
        isOpen={isDeleteMaterialOpen}
        onClose={() => setIsDeleteMaterialOpen(false)}
        onSuccess={(msg) => {
          showAlert(msg);
          fetchMaterials();
          fetchOverallStats();
        }}
        material={selectedMaterialToDelete}
      />
    </div>
  );
}

export default InventoryManagement;
