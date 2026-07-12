import React from 'react';
import { Drawer } from '../../components/common/Drawer';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  Box,
  Tag,
  Calendar,
  DollarSign,
  Building,
  QrCode,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Send,
  History,
  Share2,
  Edit,
  ArrowRight
} from 'lucide-react';

export const AssetDrawer = ({ isOpen, onClose, asset, onEdit, onAllocate, onMaintenance }) => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();

  if (!asset) return null;

  const handlePrintQR = () => {
    showToast(`Generating printable QR Code & Barcode for ${asset.assetTag}...`, 'success');
  };

  const canManage = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-[#714B67] dark:text-purple-300">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{asset.name}</h3>
              <Badge
                variant={
                  asset.status === 'AVAILABLE'
                    ? 'success'
                    : asset.status === 'ALLOCATED'
                    ? 'info'
                    : asset.status === 'IN_MAINTENANCE'
                    ? 'warning'
                    : 'default'
                }
              >
                {asset.status}
              </Badge>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{asset.assetTag}</span>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          {canManage && asset.status === 'AVAILABLE' && (
            <Button
              variant="odoo"
              size="sm"
              icon={CheckCircle2}
              onClick={() => {
                onClose();
                onAllocate(asset);
              }}
            >
              Allocate Asset
            </Button>
          )}
          {canManage && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => {
                onClose();
                onEdit(asset);
              }}
            >
              Edit Profile
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={Wrench}
            onClick={() => {
              onClose();
              onMaintenance(asset);
            }}
          >
            Raise Ticket
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={QrCode}
            onClick={handlePrintQR}
            title="Download QR Sticker"
          >
            QR Code
          </Button>
        </div>

        {/* QR & Barcode Section */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scannable Asset Tag</p>
            <p className="text-sm font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">
              {asset.assetTag} • {asset.serialNumber || 'SN-UNKNOWN'}
            </p>
            <span className="text-[10px] text-slate-400">Scan via mobile camera or barcode gun for instant audits</span>
          </div>
          <div className="w-16 h-16 bg-white rounded-xl border border-slate-300 flex items-center justify-center p-1.5 shadow-2xs">
            <QrCode className="w-full h-full text-slate-800" />
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Specifications & Lifecycle</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Category</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{asset.category}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Department</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{asset.departmentName}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Condition</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{asset.condition || 'GOOD'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Acquisition Value</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">${asset.purchasePrice || 1800}</span>
            </div>
          </div>
        </div>

        {/* Current Allocation Information if allocated */}
        {asset.status === 'ALLOCATED' && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">Active Assignment</span>
              <Badge variant="info">In Custody</Badge>
            </div>
            <div className="text-sm text-slate-800 dark:text-slate-200">
              Assigned to: <strong className="font-bold">{asset.assignedToName || 'Rohan Mehta'}</strong>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Allocated On: {asset.allocationDate || '2026-06-15'}</span>
              <span>Expected Return: {asset.expectedReturnDate || '2026-09-15'}</span>
            </div>
          </div>
        )}

        {/* Lifecycle Notes */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Notes & History Logs</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
            {asset.notes || 'No specific maintenance warnings or warranty restrictions noted.'}
          </p>
        </div>

        {/* Audit & Verification History */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Recent Verification Audit
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Q2 Verified</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/30">
            <span>Last Physical Audit: {asset.lastAuditDate || '2026-06-01'}</span>
            <span>Auditor: Aditi Rao</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
