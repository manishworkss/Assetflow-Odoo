import React, { useState, useEffect } from 'react';
import { allocationService, assetService, employeeService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Box, User, Calendar, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export const AllocateModal = ({ isOpen, onClose, onAllocated }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('2026-09-15');
  const [notes, setNotes] = useState('');
  const [conflictError, setConflictError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [allAssets, allEmps] = await Promise.all([
            assetService.getAssets(),
            employeeService.getEmployees()
          ]);
          // Filter to show available assets primarily, or all for conflict demo
          setAssets(allAssets);
          setEmployees(allEmps);
          if (allAssets.length > 0) setSelectedAssetId(allAssets[0].id);
          if (allEmps.length > 0) setSelectedEmployeeId(allEmps[0].id);
          setConflictError(null);
        } catch (err) {
          console.error(err);
        }
      };
      loadOptions();
    }
  }, [isOpen]);

  const handleAssetChange = (assetId) => {
    setSelectedAssetId(assetId);
    setConflictError(null);
    const asset = assets.find((a) => String(a.id) === String(assetId));
    if (asset && asset.status !== 'AVAILABLE') {
      setConflictError(`[Conflict Prevention Engine] Warning: Asset '${asset.name}' is currently ${asset.status}. Double allocation is blocked.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setConflictError(null);

    const asset = assets.find((a) => String(a.id) === String(selectedAssetId));
    const emp = employees.find((em) => String(em.id) === String(selectedEmployeeId));

    if (asset && asset.status !== 'AVAILABLE') {
      setConflictError(`[Double-Allocation Prevention] Asset ${asset.assetTag} is already ${asset.status}. You must return or reassign it first!`);
      setLoading(false);
      return;
    }

    try {
      await allocationService.allocateAsset({
        assetId: Number(selectedAssetId),
        assetName: asset?.name || 'Selected Asset',
        assetTag: asset?.assetTag || 'AST-000',
        employeeId: Number(selectedEmployeeId),
        employeeName: emp?.name || 'Assigned Employee',
        departmentName: emp?.departmentName || 'Engineering & IT',
        expectedReturnDate,
        notes
      });

      showToast(`Successfully allocated ${asset?.name} to ${emp?.name}!`, 'success');
      onClose();
      if (onAllocated) onAllocated();
    } catch (err) {
      if (err.message?.includes('conflict') || err.message?.includes('already')) {
        setConflictError(err.message);
      } else {
        showToast(err.message || 'Allocation failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSelectedAsset = assets.find((a) => String(a.id) === String(selectedAssetId));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Requisition / Allocate Asset to Employee">
      <form onSubmit={handleSubmit} className="space-y-4">
        {conflictError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Double-Allocation Prevention Validator Triggered</strong>
              <span>{conflictError}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Select Asset from Fleet
          </label>
          <select
            value={selectedAssetId}
            onChange={(e) => handleAssetChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.assetTag}] {a.name} — ({a.status})
              </option>
            ))}
          </select>
          {currentSelectedAsset && (
            <div className="mt-2 text-xs flex items-center justify-between text-slate-500 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg">
              <span>Current Condition: <strong className="text-emerald-600">{currentSelectedAsset.condition}</strong></span>
              <Badge variant={currentSelectedAsset.status === 'AVAILABLE' ? 'success' : 'warning'}>
                {currentSelectedAsset.status}
              </Badge>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Assign to Employee / Requisitioner
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
          >
            {employees.map((em) => (
              <option key={em.id} value={em.id}>
                {em.name} — ({em.departmentName || 'Engineering'}) [{em.role}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Expected Return Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              required
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Allocation & Purpose Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Assigned for Q3 client deployment bootcamp..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="odoo"
            loading={loading}
            icon={ArrowRight}
            disabled={!!conflictError}
          >
            Confirm Requisition Check-out
          </Button>
        </div>
      </form>
    </Modal>
  );
};
