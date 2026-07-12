import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  Bell,
  ShieldAlert,
  CheckCircle2,
  Wrench,
  User,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Download,
  Trash2
} from 'lucide-react';

export const ActivityLogs = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  const [logs, setLogs] = useState([
    {
      id: 101,
      type: 'ALLOCATION',
      severity: 'INFO',
      title: 'MacBook Pro M3 Max checked out',
      details: 'Assigned to Priya Patel (Engineering) by Vikram Sharma. Return due: 2026-09-15.',
      timestamp: 'Just now',
      user: 'Vikram Sharma (ASSET_MANAGER)'
    },
    {
      id: 102,
      type: 'MAINTENANCE',
      severity: 'WARNING',
      title: 'Automated Status Coupling: IN_MAINTENANCE',
      details: 'Dell UltraSharp 32" checked in with condition NEEDS_REPAIR. Auto-created repair ticket #12.',
      timestamp: '14 mins ago',
      user: 'Priya Patel (EMPLOYEE)'
    },
    {
      id: 103,
      type: 'RBAC_SECURITY',
      severity: 'CRITICAL',
      title: 'Role Promotion: Employee promoted to Department Head',
      details: 'Ananya Iyer (Marketing) role elevated to DEPARTMENT_HEAD by system administrator.',
      timestamp: '1 hour ago',
      user: 'Vikram Sharma (ADMIN)'
    },
    {
      id: 104,
      type: 'BOOKING_VALIDATOR',
      severity: 'WARNING',
      title: 'Double-Booking Prevention Blocked',
      details: 'Zero-Overlap Validator prevented conflict on Executive Conference Room A for 14:00-15:30.',
      timestamp: '3 hours ago',
      user: 'System Engine'
    },
    {
      id: 105,
      type: 'AUDIT',
      severity: 'SUCCESS',
      title: 'Physical Audit Batch Completed',
      details: 'Q3 FY26 verification finalized. 186 items scanned, 98.4% accuracy, zero critical losses.',
      timestamp: 'Yesterday',
      user: 'Vikram Sharma (ASSET_MANAGER)'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const handleClearLogs = () => {
    if (!window.confirm('Clear all non-critical notifications from your feed?')) return;
    setLogs(logs.filter((l) => l.severity === 'CRITICAL'));
    showToast('Non-critical notification feed cleared!', 'success');
  };

  const handleExportTrail = () => {
    showToast('Full system security audit trail downloaded as compliance CSV!', 'success');
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterSeverity !== 'ALL' && l.severity !== filterSeverity) return false;
    return true;
  });

  const getLogIcon = (type, severity) => {
    if (severity === 'CRITICAL') return <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />;
    if (severity === 'WARNING') return <Wrench className="w-5 h-5 text-amber-500 shrink-0" />;
    if (severity === 'SUCCESS') return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    return <Bell className="w-5 h-5 text-[#714B67] shrink-0" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#714B67]" />
            <span>Activity Logs & Notification Feed</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time audit trail, RBAC security events, and automated workflow triggers across the ERP portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Trash2} onClick={handleClearLogs}>
            Clear Feed
          </Button>
          <Button variant="odoo" icon={Download} onClick={handleExportTrail}>
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* Filter & Search Card */}
      <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterSeverity === 'ALL'
                  ? 'bg-[#714B67] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Events ({logs.length})
            </button>
            <button
              onClick={() => setFilterSeverity('CRITICAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterSeverity === 'CRITICAL'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              🚨 Critical RBAC ({logs.filter((l) => l.severity === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setFilterSeverity('WARNING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterSeverity === 'WARNING'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              ⚠️ Workflow & Warnings ({logs.filter((l) => l.severity === 'WARNING').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by action, user, or hardware..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card className="py-12 text-center">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No activity logs found</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust search filter above to view system trail.</p>
          </Card>
        ) : (
          filteredLogs.map((l) => (
            <Card
              key={l.id}
              className={`p-4 bg-white dark:bg-slate-900 border transition-all hover:shadow-md flex items-start gap-4 ${
                l.severity === 'CRITICAL'
                  ? 'border-l-4 border-l-rose-500 border-rose-200/60 dark:border-rose-900/40'
                  : l.severity === 'WARNING'
                  ? 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800'
                  : 'border-l-4 border-l-[#714B67] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl mt-0.5">
                {getLogIcon(l.type, l.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {l.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {l.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {l.details}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Triggered by: <strong className="text-slate-700 dark:text-slate-300">{l.user}</strong></span>
                  <Badge variant={l.severity === 'CRITICAL' ? 'overdue' : l.severity === 'WARNING' ? 'warning' : 'info'}>
                    {l.type}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
