import React, { useState, useEffect } from 'react';
import { assetService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AssetModal } from './AssetModal';
import { AssetDrawer } from './AssetDrawer';
import {
  Search,
  Filter,
  Plus,
  Box,
  Tag,
  Building,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  RefreshCw
} from 'lucide-react';

export const AssetDirectory = () => {
  const { user } = useAuthStore();
  const { openModal, showToast } = useUiStore();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' or 'GRID'

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAssets();
      setAssets(data);
    } catch (err) {
      showToast('Error loading enterprise inventory fleet', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDeleteAsset = async (id, tag) => {
    if (!window.confirm(`Are you certain you want to retire and remove asset ${tag} from active inventory?`)) return;
    try {
      await assetService.deleteAsset(id);
      showToast(`Asset ${tag} successfully removed from active fleet`, 'success');
      fetchAssets();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleQuickMaintenance = (asset) => {
    showToast(`Opening Maintenance Ticket workflow for ${asset.assetTag}...`, 'info');
  };

  const handleQuickAllocate = (asset) => {
    showToast(`Initiating Check-out workflow for ${asset.assetTag}...`, 'info');
  };

  // Filtered Assets list
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'ALL' || asset.departmentName === selectedDepartment;
    const matchesStatus = selectedStatus === 'ALL' || asset.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus;
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Enterprise Asset Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete master catalog of hardware, equipment, machinery, and facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'TABLE' ? 'GRID' : 'TABLE')}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            title={viewMode === 'TABLE' ? 'Switch to Grid View' : 'Switch to Table View'}
          >
            {viewMode === 'TABLE' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchAssets}
            className="hidden sm:inline-flex"
          >
            Refresh
          </Button>

          {canManage && (
            <Button
              variant="odoo"
              icon={Plus}
              onClick={() => {
                setAssetToEdit(null);
                setIsModalOpen(true);
              }}
            >
              Register Asset Profile
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asset tag, name, or VIN..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="ALL">All Categories ({assets.length})</option>
              <option value="Laptops">Laptops & Compute</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
              <option value="Fleet Vehicles">Fleet Vehicles</option>
              <option value="Conference Rooms">Conference Rooms</option>
              <option value="Networking">Networking Infrastructure</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering & IT">Engineering & IT</option>
              <option value="Facilities & Ops">Facilities & Ops</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white cursor-pointer font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE (In Stock)</option>
              <option value="ALLOCATED">ALLOCATED (Assigned)</option>
              <option value="IN_MAINTENANCE">IN_MAINTENANCE (Repair)</option>
              <option value="RETIRED">RETIRED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Catalog View */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Loading inventory from MySQL via Spring Boot Adapter...</div>
      ) : filteredAssets.length === 0 ? (
        <Card className="py-12 text-center">
          <Box className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No matching assets found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or register a new asset profile.</p>
        </Card>
      ) : viewMode === 'TABLE' ? (
        /* TABLE VIEW */
        <Card className="p-0 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80">
                  <th className="py-3.5 px-4">Asset Tag & Model</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Health</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-[#714B67] dark:text-purple-300 shrink-0 font-mono text-xs">
                          {asset.assetTag.split('-')[1] || 'AST'}
                        </div>
                        <div>
                          <div className="text-sm group-hover:text-[#714B67] dark:group-hover:text-purple-300 transition-colors">
                            {asset.name}
                          </div>
                          <div className="text-xs font-mono text-slate-400">{asset.assetTag}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                      {asset.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {asset.departmentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {asset.condition || 'GOOD'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          (asset.healthScore ?? 100) > 75
                            ? 'success'
                            : (asset.healthScore ?? 100) > 40
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {asset.healthScore ?? 100}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          asset.status === 'AVAILABLE'
                            ? 'success'
                            : asset.status === 'ALLOCATED'
                            ? 'info'
                            : asset.status === 'IN_MAINTENANCE'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {asset.status}
                      </Badge>
                    </td>
                    <td
                      className="py-3.5 px-4 text-right space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canManage && (
                        <>
                          <button
                            onClick={() => {
                              setAssetToEdit(asset);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#714B67] hover:bg-purple-50 dark:hover:bg-purple-950/40"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user?.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteAsset(asset.id, asset.assetTag)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Retire Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              onClick={() => {
                setSelectedAsset(asset);
                setIsDrawerOpen(true);
              }}
              className="hover:shadow-lg hover:border-[#714B67] dark:hover:border-purple-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-[#714B67] dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                    {asset.assetTag}
                  </span>
                  <Badge
                    variant={
                      asset.status === 'AVAILABLE'
                        ? 'success'
                        : asset.status === 'ALLOCATED'
                        ? 'info'
                        : asset.status === 'IN_MAINTENANCE'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {asset.status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {asset.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Category: <strong className="text-slate-700 dark:text-slate-300">{asset.category}</strong>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{asset.departmentName}</span>
                <div className="flex gap-2">
                   <span className={`font-bold ${(asset.healthScore ?? 100) < 40 ? 'text-red-500' : (asset.healthScore ?? 100) < 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
                     Health: {asset.healthScore ?? 100}%
                   </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Supporting Registration & Profile Edit Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={assetToEdit}
        onSaved={fetchAssets}
      />

      {/* Supporting Slide-Out Detailed Drawer */}
      <AssetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        asset={selectedAsset}
        onEdit={(a) => {
          setAssetToEdit(a);
          setIsModalOpen(true);
        }}
        onAllocate={handleQuickAllocate}
        onMaintenance={handleQuickMaintenance}
      />
    </div>
  );
};
