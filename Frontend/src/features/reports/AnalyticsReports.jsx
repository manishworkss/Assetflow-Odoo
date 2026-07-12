import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useUiStore } from '../../store/uiStore';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  PieChart as PieIcon,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsReports = () => {
  const { showToast } = useUiStore();
  const [timeRange, setTimeRange] = useState('6M');
  const [loading, setLoading] = useState(false);

  // Recharts Data Sets
  const utilizationTrendsData = [
    { month: 'Feb', activeAllocations: 85, targetCapacity: 100, maintenanceDown: 8 },
    { month: 'Mar', activeAllocations: 92, targetCapacity: 100, maintenanceDown: 12 },
    { month: 'Apr', activeAllocations: 110, targetCapacity: 120, maintenanceDown: 6 },
    { month: 'May', activeAllocations: 135, targetCapacity: 140, maintenanceDown: 9 },
    { month: 'Jun', activeAllocations: 154, targetCapacity: 160, maintenanceDown: 15 },
    { month: 'Jul', activeAllocations: 168, targetCapacity: 175, maintenanceDown: 11 },
  ];

  const categoryDistribution = [
    { name: 'Hardware / Laptops', value: 45, color: '#714B67' },
    { name: 'Server & IT Infra', value: 25, color: '#017E84' },
    { name: 'AV & Office Equipment', value: 18, color: '#3B82F6' },
    { name: 'Fleet & Vehicles', value: 12, color: '#F59E0B' },
  ];

  const bookingHeatmapData = [
    { day: 'Mon', conferenceRooms: 18, fleetVehicles: 6 },
    { day: 'Tue', conferenceRooms: 24, fleetVehicles: 9 },
    { day: 'Wed', conferenceRooms: 28, fleetVehicles: 11 },
    { day: 'Thu', conferenceRooms: 22, fleetVehicles: 8 },
    { day: 'Fri', conferenceRooms: 15, fleetVehicles: 14 },
    { day: 'Sat', conferenceRooms: 3, fleetVehicles: 2 },
  ];

  const handleExportCSV = (reportTitle) => {
    showToast(`Executive summary "${reportTitle}" compiled & downloaded as Excel / CSV sheet!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#714B67]" />
            <span>Executive Analytics & Intelligence</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time fleet utilization trends, category cost breakdowns, and shared resource occupancy heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-bold">
            {['30D', '3M', '6M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === t
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button variant="odoo" icon={FileSpreadsheet} onClick={() => handleExportCSV('Full Q3 Asset Intelligence Workbook')}>
            Export Workbook
          </Button>
        </div>
      </div>

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-500">Average Fleet Utilization</span>
          <div className="text-2xl font-black text-[#714B67] dark:text-purple-400 mt-1">94.2%</div>
          <span className="text-xs text-emerald-600 font-medium">↑ +3.8% vs last quarter</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-500">Total Asset Valuation</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">$482,500</div>
          <span className="text-xs text-slate-400">Net book value post depreciation</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-500">Mean Time To Repair (MTTR)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">1.8 Days</div>
          <span className="text-xs text-emerald-600 font-medium">↓ -0.4d turnaround efficiency</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-500">Audit Verification Rate</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.4%</div>
          <span className="text-xs text-slate-400">Across 186 total tracked items</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Utilization vs Capacity Line/Bar */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                6-Month Asset Requisition & Capacity Trends
              </h3>
              <p className="text-xs text-slate-500">Active allocations vs target fleet threshold</p>
            </div>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV('Utilization Trends')}>
              CSV
            </Button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="activeAllocations" name="Active Check-outs" fill="#714B67" radius={[6, 6, 0, 0]} />
                <Bar dataKey="maintenanceDown" name="In Maintenance Downtime" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Category Distribution Pie Chart */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Fleet Category Portfolio Composition
              </h3>
              <p className="text-xs text-slate-500">Share of total active inventory count</p>
            </div>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV('Category Breakdown')}>
              CSV
            </Button>
          </div>

          <div className="h-72 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Shared Booking Heatmap / Weekly Occupancy */}
        <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Shared Rooms & Fleet Weekly Booking Volume Heatmap
              </h3>
              <p className="text-xs text-slate-500">Daily reservation frequency across conference rooms & vehicles</p>
            </div>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV('Weekly Booking Volume')}>
              CSV
            </Button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingHeatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="conferenceRooms" name="Conference Rooms Bookings" stroke="#714B67" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="fleetVehicles" name="Fleet Vehicles Bookings" stroke="#017E84" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
