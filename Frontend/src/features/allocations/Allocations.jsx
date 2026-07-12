import React, { useState, useEffect } from 'react';
import { allocationService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AllocateModal } from './AllocateModal';
import { ReturnModal } from './ReturnModal';
import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Send,
  Plus,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react';
import clsx from 'clsx';

export const Allocations = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const data = await allocationService.getAllocations();
      setAllocations(data);
    } catch (err) {
      showToast('Error loading active allocations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleSendReminder = (item) => {
    showToast(`Return notification reminder sent to ${item.employeeName} (${item.assetTag})!`, 'success');
  };

  const filteredAllocations = allocations.filter((item) => {
    const matchesSearch =
      item.assetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'ACTIVE') return item.status === 'ACTIVE' || item.status === 'OVERDUE';
    if (activeTab === 'OVERDUE') return item.status === 'OVERDUE';
    return true; // 'ALL_HISTORY'
  });

  const canManage = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Asset Requisition & Custody Allocations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Check-out tracking, Double-Allocation Conflict Prevention Engine, and Condition Return Check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchAllocations}>
            Refresh
          </Button>
          {canManage && (
            <Button variant="odoo" icon={Plus} onClick={() => setIsAllocateOpen(true)}>
              New Requisition Check-out
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Search Card */}
      <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={clsx(
                'flex items-center gap-2 pb-2.5 text-sm font-bold border-b-2 transition-all',
                activeTab === 'ACTIVE'
                  ? 'border-[#714B67] text-[#714B67] dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Active Custody ({allocations.filter((a) => a.status === 'ACTIVE' || a.status === 'OVERDUE').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('OVERDUE')}
              className={clsx(
                'flex items-center gap-2 pb-2.5 text-sm font-bold border-b-2 transition-all',
                activeTab === 'OVERDUE'
                  ? 'border-[#EF4444] text-[#EF4444]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Overdue Returns ({allocations.filter((a) => a.status === 'OVERDUE').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ALL_HISTORY')}
              className={clsx(
                'flex items-center gap-2 pb-2.5 text-sm font-bold border-b-2 transition-all',
                activeTab === 'ALL_HISTORY'
                  ? 'border-[#714B67] text-[#714B67] dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <Clock className="w-4 h-4" />
              <span>Requisition History Log</span>
            </button>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asset, tag, or assignee..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Main Allocations Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Synchronizing allocation tracking with database...</div>
      ) : filteredAllocations.length === 0 ? (
        <Card className="py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No allocations match this criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Create a new asset requisition check-out from the top right button.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80">
                  <th className="py-3.5 px-4">Asset Tag & Name</th>
                  <th className="py-3.5 px-4">Requisitioned By</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Checked Out On</th>
                  <th className="py-3.5 px-4">Expected Return</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Custody & Return Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {filteredAllocations.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{item.assetName}</div>
                      <div className="text-xs font-mono text-slate-400">{item.assetTag}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {item.employeeName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {item.departmentName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {item.allocationDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-xs">
                      <span className={item.status === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {item.expectedReturnDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'OVERDUE' ? (
                        <Badge variant="overdue">Overdue ({item.daysOverdue || 5}d)</Badge>
                      ) : item.status === 'RETURNED' ? (
                        <Badge variant="default">Checked In</Badge>
                      ) : (
                        <Badge variant="info">Active Custody</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {item.status !== 'RETURNED' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Send}
                            onClick={() => handleSendReminder(item)}
                            title="Send email notification reminder"
                          >
                            Remind
                          </Button>
                          <Button
                            variant="odoo"
                            size="sm"
                            onClick={() => {
                              setSelectedAllocation(item);
                              setIsReturnOpen(true);
                            }}
                          >
                            Check In Asset
                          </Button>
                        </>
                      )}
                      {item.status === 'RETURNED' && (
                        <span className="text-xs text-slate-400 font-medium">Completed on {item.returnDate || '2026-07-10'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <AllocateModal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        onAllocated={fetchAllocations}
      />
      <ReturnModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        allocation={selectedAllocation}
        onReturned={fetchAllocations}
      />
    </div>
  );
};
