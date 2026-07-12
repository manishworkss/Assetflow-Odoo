import React, { useState } from 'react';
import { allocationService, assetService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CheckCircle2, AlertTriangle, Wrench, ShieldCheck } from 'lucide-react';

export const ReturnModal = ({ isOpen, onClose, allocation, onReturned }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [returnCondition, setReturnCondition] = useState('GOOD');
  const [returnNotes, setReturnNotes] = useState('');
  const [autoTicketWarning, setAutoTicketWarning] = useState(false);

  if (!allocation) return null;

  const handleConditionChange = (cond) => {
    setReturnCondition(cond);
    if (cond === 'NEEDS_REPAIR') {
      setAutoTicketWarning(true);
    } else {
      setAutoTicketWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Execute check-in via Spring Boot API / Mock
      await allocationService.returnAsset(allocation.id, returnNotes);

      // If condition needs repair, coupled workflow updates asset status to IN_MAINTENANCE and triggers alert
      if (returnCondition === 'NEEDS_REPAIR') {
        if (allocation.assetId) {
          await assetService.updateAssetStatus(allocation.assetId, 'IN_MAINTENANCE');
        }
        showToast(`Asset ${allocation.assetTag} checked in with NEEDS_REPAIR. Auto-created maintenance ticket!`, 'warning');
      } else {
        if (allocation.assetId) {
          await assetService.updateAssetStatus(allocation.assetId, 'AVAILABLE');
        }
        showToast(`Asset ${allocation.assetTag} checked in successfully. Returned to AVAILABLE stock.`, 'success');
      }

      onClose();
      if (onReturned) onReturned();
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Execute Check-in: ${allocation.assetName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Asset Tag:</span>
            <strong className="font-mono text-slate-900 dark:text-white">{allocation.assetTag}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Employee:</span>
            <strong className="text-slate-900 dark:text-white">{allocation.employeeName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Expected Return:</span>
            <strong className="text-rose-600 dark:text-rose-400">{allocation.expectedReturnDate}</strong>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
            Select Physical Check-in Condition
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'NEW', label: 'NEW / Immaculate', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
              { id: 'GOOD', label: 'GOOD / Normal Wear', color: 'border-emerald-400 text-emerald-600 bg-emerald-50/50' },
              { id: 'FAIR', label: 'FAIR / Minor Scratch', color: 'border-amber-400 text-amber-600 bg-amber-50' },
              { id: 'NEEDS_REPAIR', label: 'NEEDS_REPAIR / Damaged', color: 'border-rose-500 text-rose-700 bg-rose-50' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleConditionChange(c.id)}
                className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all ${
                  returnCondition === c.id
                    ? c.color
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {autoTicketWarning && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
            <Wrench className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="font-bold block">Automated Workflow Coupling Triggered</strong>
              <span>Check-in will immediately mark this asset as <strong>IN_MAINTENANCE</strong> and queue a high-priority calibration repair ticket.</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Check-in Inspection Notes
          </label>
          <textarea
            rows={2}
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            placeholder="Document any screen scratches, missing power adapter, or hardware diagnostics..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="odoo" loading={loading} icon={CheckCircle2}>
            Complete Return Check-in
          </Button>
        </div>
      </form>
    </Modal>
  );
};
