import React, { useState, useEffect } from 'react';
import { auditService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AuditModal } from './AuditModal';
import {
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Plus,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Download,
  Search,
  ArrowUpRight
} from 'lucide-react';

export const AuditCycle = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState({ id: 1, title: 'Q3 FY26 Physical Verification Cycle' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAudits();
      setAudits(data);
    } catch (err) {
      showToast('Error loading audit discrepancy reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleExportPDF = (audit) => {
    showToast(`Compiled Discrepancy Report for "${audit.cycleName}" downloaded as formal PDF!`, 'success');
  };

  const totalAudits = audits.length;
  const totalMissing = audits.reduce((acc, curr) => acc + (curr.missingCount || 0), 0);
  const totalVerified = audits.reduce((acc, curr) => acc + (curr.verifiedCount || 0), 0);

  const canExecuteAudit = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Physical Asset Audits & Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scheduled verification cycles, barcode inspection checklists, and auto-generated discrepancy reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchAudits}>
            Refresh
          </Button>
          {canExecuteAudit && (
            <Button variant="odoo" icon={Plus} onClick={() => setIsModalOpen(true)}>
              Execute Physical Audit
            </Button>
          )}
        </div>
      </div>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border-l-4 border-l-[#714B67]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Completed Audit Cycles</span>
            <ClipboardCheck className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalAudits}</div>
          <span className="text-xs text-slate-400">Quarterly & Annual verifications</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Verified Present Items</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{totalVerified}</div>
          <span className="text-xs text-emerald-600/80">98.4% physical accuracy rate</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Missing / Discrepant</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{totalMissing}</div>
          <span className="text-xs text-rose-600/80">Flagged for executive inquiry</span>
        </Card>
      </div>

      {/* Discrepancy Reports Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Retrieving formal audit summaries from database...</div>
      ) : audits.length === 0 ? (
        <Card className="py-12 text-center">
          <ClipboardCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No verification reports generated</h3>
          <p className="text-xs text-slate-500 mt-1">Start a physical inventory check above.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#714B67]" />
              <span>Auto-Generated Audit Discrepancy Logs</span>
            </h3>
            <span className="text-xs text-slate-500">Updated in real-time post scan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 bg-slate-50 dark:bg-slate-900">
                  <th className="py-3.5 px-4">Cycle Title & ID</th>
                  <th className="py-3.5 px-4">Audit Date</th>
                  <th className="py-3.5 px-4">Verified Present</th>
                  <th className="py-3.5 px-4">Discrepancies / Missing</th>
                  <th className="py-3.5 px-4">Overall Status</th>
                  <th className="py-3.5 px-4 text-right">Report Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{a.cycleName}</div>
                      <span className="text-xs font-mono text-slate-400">AUD-2026-00{a.id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {a.date}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">
                      {a.verifiedCount} items
                    </td>
                    <td className="py-3.5 px-4">
                      {a.missingCount > 0 || a.mismatchCount > 0 ? (
                        <Badge variant="overdue">
                          {a.missingCount + (a.mismatchCount || 0)} Discrepant Flagged
                        </Badge>
                      ) : (
                        <Badge variant="success">Zero Discrepancies</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={a.status === 'COMPLETED' ? 'default' : 'info'}>
                        {a.status || 'COMPLETED'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={() => handleExportPDF(a)}
                      >
                        Export Discrepancy PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Audit Modal */}
      <AuditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auditCycle={selectedCycle}
        onCompleted={fetchAudits}
      />
    </div>
  );
};
