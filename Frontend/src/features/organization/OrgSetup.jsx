import React, { useState, useEffect } from 'react';
import { departmentService, categoryService, employeeService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Building,
  Tags,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  ShieldAlert,
  Search,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import clsx from 'clsx';

export const OrgSetup = () => {
  const { user } = useAuthStore();
  const { showToast } = useUiStore();
  const [activeTab, setActiveTab] = useState('DEPARTMENTS');

  // State
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modals state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHeadName, setDeptHeadName] = useState('');

  const [catName, setCatName] = useState('');
  const [catCode, setCatCode] = useState('');
  const [depreciationRate, setDepreciationRate] = useState(15);

  const [targetRole, setTargetRole] = useState('EMPLOYEE');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depts, cats, emps] = await Promise.all([
        departmentService.getDepartments(),
        categoryService.getCategories(),
        employeeService.getEmployees()
      ]);
      setDepartments(depts);
      setCategories(cats);
      setEmployees(emps);
    } catch (err) {
      showToast('Error loading organization structure', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Department Handlers
  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await departmentService.updateDepartment(selectedItem.id, { name: deptName, code: deptCode, headName: deptHeadName });
        showToast(`Department ${deptName} updated successfully`, 'success');
      } else {
        await departmentService.createDepartment({ name: deptName, code: deptCode, headName: deptHeadName });
        showToast(`Department ${deptName} created`, 'success');
      }
      setIsDeptModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Department operation failed', 'error');
    }
  };

  const handleDeleteDepartment = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete department ${name}?`)) return;
    try {
      await departmentService.deleteDepartment(id);
      showToast(`Department ${name} removed`, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Category Handlers
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await categoryService.updateCategory(selectedItem.id, { name: catName, code: catCode, depreciationRate: Number(depreciationRate) });
        showToast(`Category ${catName} updated`, 'success');
      } else {
        await categoryService.createCategory({ name: catName, code: catCode, depreciationRate: Number(depreciationRate) });
        showToast(`Category ${catName} created`, 'success');
      }
      setIsCatModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Role Promotion Handler
  const handlePromoteRole = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await employeeService.updateEmployeeRole(selectedItem.id, targetRole);
      showToast(`Promoted ${selectedItem.name} to ${targetRole}!`, 'success');
      setIsRoleModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Organization & RBAC Setup
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage enterprise departments, asset classifications, and employee role governance.
          </p>
        </div>

        {/* Action Button based on active tab */}
        <div>
          {activeTab === 'DEPARTMENTS' && (
            <Button
              variant="odoo"
              icon={Plus}
              onClick={() => {
                setSelectedItem(null);
                setDeptName('');
                setDeptCode('');
                setDeptHeadName('');
                setIsDeptModalOpen(true);
              }}
            >
              Add Department
            </Button>
          )}
          {activeTab === 'CATEGORIES' && (
            <Button
              variant="odoo"
              icon={Plus}
              onClick={() => {
                setSelectedItem(null);
                setCatName('');
                setCatCode('');
                setDepreciationRate(15);
                setIsCatModalOpen(true);
              }}
            >
              Add Asset Category
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
        <button
          onClick={() => setActiveTab('DEPARTMENTS')}
          className={clsx(
            'flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all',
            activeTab === 'DEPARTMENTS'
              ? 'border-[#714B67] text-[#714B67] dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Building className="w-4 h-4" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={clsx(
            'flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all',
            activeTab === 'CATEGORIES'
              ? 'border-[#714B67] text-[#714B67] dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Tags className="w-4 h-4" />
          <span>Asset Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EMPLOYEES')}
          className={clsx(
            'flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all',
            activeTab === 'EMPLOYEES'
              ? 'border-[#714B67] text-[#714B67] dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Users className="w-4 h-4" />
          <span>Employee Directory & Promotions ({employees.length})</span>
        </button>
      </div>

      {/* TAB A: DEPARTMENTS */}
      {activeTab === 'DEPARTMENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="primary" className="mb-2">{dept.code}</Badge>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dept.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Head of Department: <strong className="text-slate-800 dark:text-slate-200">{dept.headName || 'Not Assigned'}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedItem(dept);
                      setDeptName(dept.name);
                      setDeptCode(dept.code);
                      setDeptHeadName(dept.headName || '');
                      setIsDeptModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#714B67] hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Active Assets Assigned:</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {dept.assetCount || 14} Items
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB B: CATEGORIES */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow border-t-4 border-t-[#4F46E5]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {cat.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{cat.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedItem(cat);
                      setCatName(cat.name);
                      setCatCode(cat.code);
                      setDepreciationRate(cat.depreciationRate || 15);
                      setIsCatModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#714B67] hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Standard Depreciation Rate: <strong className="text-slate-800 dark:text-slate-200">{cat.depreciationRate}% / Year</strong>
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB C: EMPLOYEES & ROLE PROMOTION */}
      {activeTab === 'EMPLOYEES' && (
        <Card title="Enterprise Employee Directory & Role Promotion Governance">
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Work Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Current Role Privilege</th>
                  <th className="py-3 px-4 text-right">RBAC Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {emp.name ? emp.name.split(' ').map((n) => n[0]).join('') : 'EM'}
                      </div>
                      {emp.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">{emp.email}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium text-xs">{emp.departmentName || 'Engineering'}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          emp.role === 'ADMIN'
                            ? 'primary'
                            : emp.role === 'ASSET_MANAGER'
                            ? 'warning'
                            : emp.role === 'DEPARTMENT_HEAD'
                            ? 'info'
                            : 'default'
                        }
                      >
                        {emp.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={UserCheck}
                        onClick={() => {
                          setSelectedItem(emp);
                          setTargetRole(emp.role);
                          setIsRoleModalOpen(true);
                        }}
                      >
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Department Modal */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title={selectedItem ? 'Edit Department' : 'Register New Department'}
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Department Name
            </label>
            <input
              type="text"
              required
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              placeholder="e.g. Quality Assurance"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Department Code
            </label>
            <input
              type="text"
              required
              value={deptCode}
              onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
              placeholder="e.g. DEPT-QA"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Head of Department Name
            </label>
            <input
              type="text"
              value={deptHeadName}
              onChange={(e) => setDeptHeadName(e.target.value)}
              placeholder="e.g. Dr. Ramesh Verma"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsDeptModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="odoo">Save Department</Button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={selectedItem ? 'Edit Asset Category' : 'Create Asset Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Networking Gear"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Category Code Prefix
            </label>
            <input
              type="text"
              required
              value={catCode}
              onChange={(e) => setCatCode(e.target.value.toUpperCase())}
              placeholder="e.g. CAT-NET"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Annual Depreciation Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={depreciationRate}
              onChange={(e) => setDepreciationRate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsCatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="odoo">Save Category</Button>
          </div>
        </form>
      </Modal>

      {/* Role Promotion Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={`Manage Role for ${selectedItem?.name}`}
      >
        <form onSubmit={handlePromoteRole} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Promoting an employee grants them additional permissions across the AssetFlow ERP system according to the role matrix.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Select New Access Role Privilege
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-semibold cursor-pointer"
            >
              <option value="EMPLOYEE">EMPLOYEE (Requisitions, check-ins only)</option>
              <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD (Department allocations & approvals)</option>
              <option value="ASSET_MANAGER">ASSET_MANAGER (Full lifecycle, maintenance, QR generation)</option>
              <option value="ADMIN">ADMIN (System-wide superuser privilege)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="odoo">Apply Role Update</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
