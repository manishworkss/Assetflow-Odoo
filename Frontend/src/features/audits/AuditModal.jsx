import React, { useState, useEffect } from 'react';
import { auditService, assetService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ClipboardCheck, QrCode, AlertTriangle, CheckCircle2, Search, FileDown } from 'lucide-react';

export const AuditModal = ({ isOpen, onClose, auditCycle, onCompleted }) => {
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [searchTag, setSearchTag] = useState('');

  // Local verification map: { assetId: { status: 'VERIFIED' | 'MISSING' | 'MISMATCH', notes: '' } }
  const [verificationMap, setVerificationMap] = useState({});

  useEffect(() => {
    if (isOpen) {
      const loadAssets = async () => {
        try {
          const list = await assetService.getAssets();
          setAssets(list);
          // Initialize map with default 'PENDING'
          const initialMap = {};
          list.forEach((a) => {
            initialMap[a.id] = { status: 'PENDING', notes: '' };
          });
          setVerificationMap(initialMap);
        } catch (err) {
          console.error(err);
        }
      };
      loadAssets();
    }
  }, [isOpen]);

  const handleSetVerification = (id, status) => {
    setVerificationMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], status }
    }));
  };

  const handleSimulateScan = () => {
    if (!searchTag.trim()) {
      showToast('Please enter or scan an asset tag (e.g. AST-001)', 'warning');
      return;
    }
    const found = assets.find(
      (a) => a.assetTag.toLowerCase() === searchTag.trim().toLowerCase()
    );
    if (found) {
      handleSetVerification(found.id, 'VERIFIED');
      showToast(`Tag ${found.assetTag} (${found.name}) verified present!`, 'success');
      setSearchTag('');
    } else {
      showToast(`Asset Tag '${searchTag}' not found in active inventory registry!`, 'error');
    }
  };

  const handleSubmitAudit = async () => {
    setLoading(true);
    try {
      const verifiedCount = Object.values(verificationMap).filter((v) => v.status === 'VERIFIED').length;
      const missingCount = Object.values(verificationMap).filter((v) => v.status === 'MISSING').length;
      const mismatchCount = Object.values(verificationMap).filter((v) => v.status === 'MISMATCH').length;

      await auditService.createAudit({
        cycleName: auditCycle?.title || 'Q3 FY26 Physical Verification Cycle',
        date: new Date().toISOString().split('T')[0],
        verifiedCount,
        missingCount,
        mismatchCount,
        discrepancies: Object.entries(verificationMap)
          .filter(([_, val]) => val.status === 'MISSING' || val.status === 'MISMATCH')
          .map(([id, val]) => {
            const a = assets.find((ast) => String(ast.id) === String(id));
            return {
              assetId: a?.id,
              assetTag: a?.assetTag,
              assetName: a?.name,
              issueType: val.status,
              notes: val.notes
            };
          })
      });

      showToast('Audit physical verification batch completed and discrepancy report compiled!', 'success');
      onClose();
      if (onCompleted) onCompleted();
    } catch (err) {
      showToast(err.message || 'Audit batch submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifiedList = Object.entries(verificationMap).filter(([_, v]) => v.status === 'VERIFIED');
  const missingList = Object.entries(verificationMap).filter(([_, v]) => v.status === 'MISSING' || v.status === 'MISMATCH');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Execute Physical Asset Audit Checklist">
      <div className="space-y-4">
        {/* Quick QR Scanner / Tag Input Bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#714B67]" />
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Scan or type barcode / asset tag (e.g. AST-001)..."
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>
          <Button type="button" variant="odoo" size="sm" onClick={handleSimulateScan}>
            Verify Scan
          </Button>
        </div>

        {/* Audit Progress Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="block text-slate-500">Verified Present</span>
            <strong className="text-base text-emerald-600 font-black">{verifiedList.length}</strong>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
            <span className="block text-slate-500">Discrepancy / Missing</span>
            <strong className="text-base text-rose-600 font-black">{missingList.length}</strong>
          </div>
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="block text-slate-500">Pending Check</span>
            <strong className="text-base text-slate-700 dark:text-slate-300 font-black">
              {assets.length - verifiedList.length - missingList.length}
            </strong>
          </div>
        </div>

        {/* Verification Checklist Table */}
        <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Tag & Name</th>
                <th className="py-2.5 px-3">Assigned / Dept</th>
                <th className="py-2.5 px-3 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assets.map((a) => {
                const current = verificationMap[a.id]?.status || 'PENDING';
                return (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      <div>{a.name}</div>
                      <span className="font-mono text-slate-400 text-[10px]">{a.assetTag}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      <div>{a.assignedTo || 'Unassigned'}</div>
                      <span className="text-[10px] text-slate-400">{a.departmentName}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleSetVerification(a.id, 'VERIFIED')}
                        className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                          current === 'VERIFIED'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetVerification(a.id, 'MISSING')}
                        className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                          current === 'MISSING'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50'
                        }`}
                      >
                        Missing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetVerification(a.id, 'MISMATCH')}
                        className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                          current === 'MISMATCH'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50'
                        }`}
                      >
                        Misplaced
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="odoo" loading={loading} icon={ClipboardCheck} onClick={handleSubmitAudit}>
            Finalize & Generate Discrepancy Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
