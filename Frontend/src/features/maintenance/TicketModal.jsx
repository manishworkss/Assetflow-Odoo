import React, { useState, useEffect } from 'react';
import { maintenanceService, assetService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Wrench, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TicketModal = ({ isOpen, onClose, onCreated }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('TechCare Repair Vendor');

  useEffect(() => {
    if (isOpen) {
      const loadAssets = async () => {
        try {
          const list = await assetService.getAssets();
          setAssets(list);
          if (list.length > 0 && !selectedAssetId) setSelectedAssetId(list[0].id);
        } catch (err) {
          console.error(err);
        }
      };
      loadAssets();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const asset = assets.find((a) => String(a.id) === String(selectedAssetId));

    try {
      // 1. Create maintenance ticket
      await maintenanceService.createTicket({
        assetId: Number(selectedAssetId),
        assetName: asset?.name || 'Hardware Asset',
        assetTag: asset?.assetTag || 'AST-000',
        issueTitle,
        priority,
        description,
        assignee
      });

      // 2. Automated Workflow Coupling: Immediately set asset status to IN_MAINTENANCE
      if (selectedAssetId) {
        await assetService.updateAssetStatus(selectedAssetId, 'IN_MAINTENANCE');
      }

      showToast(`Maintenance ticket created and asset ${asset?.assetTag} marked IN_MAINTENANCE!`, 'warning');
      onClose();
      if (onCreated) onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to create ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log New Maintenance / Calibration Ticket">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
          <Wrench className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <strong className="font-bold block">Automated Workflow Coupling</strong>
            <span>Creating this ticket will automatically update the asset's status to <strong>IN_MAINTENANCE</strong> across all departments.</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Select Asset Requiring Maintenance
          </label>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.assetTag}] {a.name} — ({a.status})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Issue Title / Summary
            </label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="e.g. Battery Swelling / Screen Calibration"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Priority Severity
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer font-bold"
            >
              <option value="CRITICAL">🚨 CRITICAL (Immediate Action)</option>
              <option value="HIGH">⚠️ HIGH (Within 24 Hours)</option>
              <option value="MEDIUM">🟢 MEDIUM (Normal Queue)</option>
              <option value="LOW">ℹ️ LOW (Scheduled Routine)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Assign To Repair Technician / Vendor
          </label>
          <input
            type="text"
            required
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="e.g. Apple Authorized Care / Internal IT Hardware Team"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Detailed Diagnosis & Symptoms
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain symptoms, error codes, and physical observations..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="odoo" loading={loading} icon={Wrench}>
            Log Repair Ticket & Couple Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};
