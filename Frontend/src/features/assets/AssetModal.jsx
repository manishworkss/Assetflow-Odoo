import React, { useState, useEffect } from 'react';
import { assetService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal as CommonModal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Box, Tag, DollarSign, Calendar, FileText, CheckCircle } from 'lucide-react';

export const AssetModal = ({ isOpen, onClose, assetToEdit, onSaved }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [departmentName, setDepartmentName] = useState('Engineering & IT');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [condition, setCondition] = useState('NEW');
  const [purchasePrice, setPurchasePrice] = useState('1800');
  const [purchaseDate, setPurchaseDate] = useState('2026-01-15');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name || '');
      setAssetTag(assetToEdit.assetTag || '');
      setCategory(assetToEdit.category || 'Laptops');
      setDepartmentName(assetToEdit.departmentName || 'Engineering & IT');
      setSerialNumber(assetToEdit.serialNumber || '');
      setStatus(assetToEdit.status || 'AVAILABLE');
      setCondition(assetToEdit.condition || 'GOOD');
      setPurchasePrice(String(assetToEdit.purchasePrice || '1800'));
      setPurchaseDate(assetToEdit.purchaseDate || '2026-01-15');
      setNotes(assetToEdit.notes || '');
    } else {
      setName('');
      setAssetTag(`AST-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Laptops');
      setDepartmentName('Engineering & IT');
      setSerialNumber(`SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setStatus('AVAILABLE');
      setCondition('NEW');
      setPurchasePrice('1800');
      setPurchaseDate('2026-06-01');
      setNotes('');
    }
  }, [assetToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      assetTag,
      category,
      departmentName,
      serialNumber,
      status,
      condition,
      purchasePrice: Number(purchasePrice),
      purchaseDate,
      notes
    };

    try {
      if (assetToEdit && assetToEdit.id) {
        await assetService.updateAsset(assetToEdit.id, payload);
        showToast(`Asset ${assetTag} successfully updated!`, 'success');
      } else {
        await assetService.createAsset(payload);
        showToast(`New Asset ${assetTag} registered into ERP database!`, 'success');
      }
      onClose();
      if (onSaved) onSaved();
    } catch (err) {
      showToast(err.message || 'Error saving asset profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={assetToEdit ? `Edit Asset Profile (${assetTag})` : 'Register New Enterprise Asset'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Asset Name / Model
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dell XPS 16 AI Laptop"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Asset Tag ID (Barcode)
            </label>
            <input
              type="text"
              required
              value={assetTag}
              onChange={(e) => setAssetTag(e.target.value.toUpperCase())}
              placeholder="e.g. AST-LT-012"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Laptops">Laptops & Compute</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
              <option value="Fleet Vehicles">Fleet Vehicles</option>
              <option value="Conference Rooms">Conference Rooms</option>
              <option value="Networking">Networking Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Department Ownership
            </label>
            <select
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Engineering & IT">Engineering & IT</option>
              <option value="Facilities & Ops">Facilities & Ops</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Serial Number (VIN / SN)
            </label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
              placeholder="e.g. SN-982341X"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="AVAILABLE">AVAILABLE (In Stock)</option>
              <option value="ALLOCATED">ALLOCATED (Assigned)</option>
              <option value="IN_MAINTENANCE">IN_MAINTENANCE (Repair)</option>
              <option value="RETIRED">RETIRED (Disposed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Physical Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="NEW">NEW / Brand New</option>
              <option value="GOOD">GOOD / Normal Wear</option>
              <option value="FAIR">FAIR / Operational</option>
              <option value="NEEDS_REPAIR">NEEDS_REPAIR / Faulty</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Purchase Cost ($ USD)
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 1800"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Acquisition Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Asset Lifecycle Notes & Specifications
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Include warranty details, calibration schedules, or exact hardware specs..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="odoo" loading={loading} icon={CheckCircle}>
            {assetToEdit ? 'Update Asset Record' : 'Register Asset profile'}
          </Button>
        </div>
      </form>
    </CommonModal>
  );
};
