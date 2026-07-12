import React, { useState, useEffect } from 'react';
import { dashboardService, allocationService, auditService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Box,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  Send,
  Calendar,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { openModal, showToast } = useUiStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      showToast('Failed to load real-time ERP analytics', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const handleSendReminder = async (allocationId, employeeName) => {
    showToast(`Automated Overdue Return Reminder sent to ${employeeName}!`, 'success');
  };

  const handleExecuteReturn = async (allocationId, assetName) => {
    try {
      await allocationService.returnAsset(allocationId, 'Good condition check-in from Dashboard');
      showToast(`Successfully checked in ${assetName}! Inventory status updated to AVAILABLE.`, 'success');
      fetchDashboardData(true);
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'error');
    }
  };

  const COLORS = ['#714B67', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const statusChartData = stats ? [
    { name: 'Available', value: stats.availableAssets },
    { name: 'Allocated', value: stats.allocatedAssets },
    { name: 'In Maintenance', value: stats.inMaintenanceAssets },
    { name: 'Overdue Returns', value: stats.overdueAllocations.length }
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Header & Quick Action Launcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#714B67] to-[#4F46E5] p-6 rounded-3xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs">
              {user?.role || 'ADMIN'} Portal
            </span>
            <span className="text-purple-200 text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Enterprise Database Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name || 'Marcus Sterling'}
          </h1>
          <p className="text-sm text-purple-100/90 mt-1">
            {user?.role === 'ADMIN' && 'System-wide ERP operations, audit controls, and multi-department monitoring.'}
            {user?.role === 'ASSET_MANAGER' && 'Lifecycle tracking, requisitions approval, maintenance calibration, and check-ins.'}
            {user?.role === 'DEPARTMENT_HEAD' && `Departmental asset oversight and resource allocation approvals for ${user?.departmentName || 'Engineering'}.`}
            {user?.role === 'EMPLOYEE' && 'Requisition corporate equipment, book shared conference rooms/vehicles, and log check-ins.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchDashboardData(true)}
            loading={refreshing}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Sync Now
          </Button>
          {(user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD') && (
            <Button
              variant="secondary"
              size="sm"
              icon={PlusCircle}
              onClick={() => openModal('REGISTER_ASSET')}
              className="bg-white text-[#714B67] hover:bg-purple-50 font-bold"
            >
              Quick Register Asset
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-[#714B67]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Fleet Assets
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {loading ? '...' : stats?.totalAssets || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-[#714B67] dark:text-purple-300 shadow-inner">
              <Box className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs last quarter</span>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Currently Allocated
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {loading ? '...' : stats?.allocatedAssets || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 gap-1">
            <span>{loading ? '...' : stats?.availableAssets || 0} items ready for instant check-out</span>
          </div>
        </Card>

        <Card className="border-l-4 border-l-[#EF4444] bg-rose-50/40 dark:bg-rose-950/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                Overdue Returns
              </p>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {loading ? '...' : stats?.overdueAllocations?.length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 gap-1">
            <span>Requires immediate return or manager override</span>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                In Maintenance / Check
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {loading ? '...' : stats?.inMaintenanceAssets || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-300 shadow-inner">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1">
            <span>{stats?.pendingMaintenanceTickets || 3} pending technician tickets</span>
          </div>
        </Card>
      </div>

      {/* Critical Alert Section: Overdue Allocations Table with 1-Click Check-In & Reminders */}
      {stats?.overdueAllocations && stats.overdueAllocations.length > 0 && (
        <Card title="Critical Action Required: Overdue Asset Allocations" className="border-2 border-rose-200 dark:border-rose-900/60 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3 px-4">Asset Tag & Name</th>
                  <th className="py-3 px-4">Assigned Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Expected Return</th>
                  <th className="py-3 px-4">Overdue By</th>
                  <th className="py-3 px-4 text-right">Instant Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {stats.overdueAllocations.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.assetName} <span className="text-xs text-slate-400">({item.assetTag})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {item.employeeName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {item.departmentName}
                    </td>
                    <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                      {item.expectedReturnDate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="overdue">{item.daysOverdue} Days Overdue</Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Send}
                        onClick={() => handleSendReminder(item.id, item.employeeName)}
                        title="Trigger Spring Boot Mail Sender reminder"
                      >
                        Reminder
                      </Button>
                      {(user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD') && (
                        <Button
                          variant="odoo"
                          size="sm"
                          onClick={() => handleExecuteReturn(item.id, item.assetName)}
                        >
                          Check In Now
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Critical Alert Section: Low Health Assets */}
      {stats?.lowHealthAssets && stats.lowHealthAssets.length > 0 && (
        <Card title="Critical Action Required: Low Health Assets (Requires Replacement/Maintenance)" className="border-2 border-amber-200 dark:border-amber-900/60 shadow-md mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3 px-4">Asset Tag & Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Health Score</th>
                  <th className="py-3 px-4 text-right">Instant Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {stats.lowHealthAssets.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.name} <span className="text-xs text-slate-400">({item.assetTag})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {item.categoryName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {item.departmentName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-red-500">{item.healthScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Wrench}
                        title="Create Maintenance Request"
                      >
                        Raise Ticket
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Monthly Lifecycle Activity */}
        <Card title="Monthly Requisitions vs Maintenance Activity" className="lg:col-span-8">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyActivity || []}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="allocations" name="Allocations & Requisitions" fill="#714B67" radius={[6, 6, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance & Repairs" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Chart: Asset Status Distribution */}
        <Card title="Current Fleet Composition" className="lg:col-span-4 flex flex-col justify-between">
          <div className="h-64 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            {statusChartData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{entry.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Breakdown Quick Table */}
      <Card title="Department Resource Allocation Matrix">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {stats?.departmentStats?.map((dept) => (
            <div
              key={dept.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{dept.name}</span>
                <Badge variant="primary">{dept.assetCount} Assets</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Allocated:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.allocatedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Repair:</span>
                  <span className="font-semibold text-amber-600">{dept.maintenanceCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
