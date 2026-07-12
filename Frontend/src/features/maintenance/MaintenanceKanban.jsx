import React, { useState, useEffect } from 'react';
import { maintenanceService, assetService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { TicketModal } from './TicketModal';
import {
  Wrench,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  User,
  Tag,
  ShieldCheck
} from 'lucide-react';

export const MaintenanceKanban = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await maintenanceService.getTickets();
      setTickets(data);
    } catch (err) {
      showToast('Error loading maintenance kanban board', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAdvanceStatus = async (ticket, nextStatus) => {
    try {
      await maintenanceService.updateTicketStatus(ticket.id, nextStatus);

      // Automated Workflow Coupling: If moving to COMPLETED or RESOLVED, restore asset to AVAILABLE!
      if (nextStatus === 'COMPLETED' || nextStatus === 'RESOLVED') {
        if (ticket.assetId) {
          await assetService.updateAssetStatus(ticket.assetId, 'AVAILABLE');
        }
        showToast(`Ticket #${ticket.id} closed! Asset ${ticket.assetTag} automatically returned to AVAILABLE inventory.`, 'success');
      } else if (nextStatus === 'IN_PROGRESS') {
        if (ticket.assetId) {
          await assetService.updateAssetStatus(ticket.assetId, 'IN_MAINTENANCE');
        }
        showToast(`Ticket #${ticket.id} moved to IN_PROGRESS calibration.`, 'info');
      }

      fetchTickets();
    } catch (err) {
      showToast(err.message || 'Failed to update ticket status', 'error');
    }
  };

  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'PENDING');
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS');
  const completedTickets = tickets.filter((t) => t.status === 'COMPLETED' || t.status === 'RESOLVED');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="overdue">🚨 CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="warning">⚠️ HIGH</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Maintenance & Calibration Kanban
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated status coupling between active repair tickets and asset availability stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchTickets}>
            Sync Board
          </Button>
          <Button variant="odoo" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Log Repair Ticket
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Loading maintenance pipelines from Java service...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1: OPEN / NEW */}
          <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Queued / Open
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                {openTickets.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {openTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No open tickets in queue
                </div>
              ) : (
                openTickets.map((t) => (
                  <Card key={t.id} className="p-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-[#714B67] dark:text-purple-400">
                        #{t.id} • {t.assetTag}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {t.issueTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {t.description || 'Hardware diagnostics check required.'}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 truncate max-w-[140px]">👤 {t.assignee}</span>
                      <Button
                        variant="odoo"
                        size="sm"
                        icon={ArrowRight}
                        onClick={() => handleAdvanceStatus(t, 'IN_PROGRESS')}
                      >
                        Start Repair
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Column 2: IN_PROGRESS */}
          <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  In Progress / Calibration
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                {inProgressTickets.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {inProgressTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No repairs currently active
                </div>
              ) : (
                inProgressTickets.map((t) => (
                  <Card key={t.id} className="p-4 bg-white dark:bg-slate-800 shadow-sm border-l-4 border-l-blue-500 border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        #{t.id} • {t.assetTag}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {t.issueTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {t.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 truncate max-w-[140px]">🔧 {t.assignee}</span>
                      <Button
                        variant="odoo"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleAdvanceStatus(t, 'COMPLETED')}
                        title="Close ticket and restore asset to AVAILABLE"
                      >
                        Resolve & Restore
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Column 3: RESOLVED / COMPLETED */}
          <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Completed & QA Verified
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                {completedTickets.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {completedTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No completed tickets recorded
                </div>
              ) : (
                completedTickets.map((t) => (
                  <Card key={t.id} className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm border border-emerald-200 dark:border-emerald-900 opacity-80">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        #{t.id} • {t.assetTag}
                      </span>
                      <Badge variant="success">Resolved</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-snug line-through">
                      {t.issueTitle}
                    </h4>
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                      <span>Restored to Stock</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchTickets}
      />
    </div>
  );
};
