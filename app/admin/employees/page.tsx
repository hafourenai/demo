'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  CreditCard,
  Plus,
  X,
  Edit,
  Eye,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Employee } from '@/lib/types';

export default function AdminEmployeesPage() {
  const {
    employees,
    saveEmployee,
    verifyEmployeePaymentProfile,
    updateSettlementRate,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery)
  );

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingEmployee({
      id: `emp${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      role: 'employee',
      specialization: 'Home Cleaning Specialist',
      skills: ['General Cleaning', 'Deep Cleaning'],
      rating: 5.0,
      totalJobs: 0,
      isActive: true,
      settlementRate: 3.0,
      photo: '/images/services/svc1.jpg',
      paymentProfile: {
        bankName: 'BCA',
        bankAccountNumber: '',
        bankAccountName: '',
        qrisMerchantName: '',
        isVerified: true,
      },
      createdAt: new Date().toISOString(),
    });
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || !editingEmployee.name) return;

    saveEmployee(editingEmployee as Employee);
    setEditingEmployee(null);
    setIsCreating(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Manajemen Karyawan (Cleaning Partners)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola profil partner, verifikasi rekening/QRIS untuk pembayaran langsung, dan settlement rate.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Tambah Karyawan Baru
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama, email, nomor HP karyawan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Spesialisasi &amp; Skill</th>
                  <th className="px-4 py-3">Rating &amp; Jobs</th>
                  <th className="px-4 py-3">Rekening &amp; QRIS</th>
                  <th className="px-4 py-3">Setoran Rate</th>
                  <th className="px-4 py-3">Gross Bulan Ini</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const isVerified = emp.paymentProfile?.isVerified;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photo || '/images/services/svc1.jpg'}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{emp.name}</p>
                            <p className="text-[11px] text-slate-400">{emp.phone}</p>
                            <p className="text-[10px] text-slate-400 truncate">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 block">
                          {emp.specialization || 'Home Cleaning Specialist'}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {emp.skills?.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                            >
                              {s}
                            </span>
                          ))}
                          {(emp.skills?.length || 0) > 2 && (
                            <span className="text-[9px] text-slate-400">
                              +{(emp.skills?.length || 0) - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 inline-flex items-center gap-1">
                          ★ {emp.rating}
                        </span>
                        <p className="text-[10px] text-slate-500">{emp.totalJobs} order</p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {emp.paymentProfile?.bankName || 'BCA'}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-slate-500">
                          {emp.paymentProfile?.bankAccountNumber}
                        </p>
                        <div className="mt-1">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              <ShieldCheck size={10} /> Terverifikasi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                              <AlertCircle size={10} /> Butuh Verifikasi
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                        {emp.settlementRate || 3.0}%
                      </td>

                      <td className="px-4 py-3 font-bold text-emerald-700 font-sans">
                        {formatCurrency(emp.grossRevenueMonth || 0)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            emp.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {emp.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Detail & Verifikasi Rekening"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setIsCreating(false);
                              setEditingEmployee({ ...emp });
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Edit Karyawan"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: DETAIL & VERIFIKASI REKENING */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Profil &amp; Verifikasi Rekening Partner
                </h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.photo}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedEmployee.name}</h4>
                  <p className="text-slate-500">{selectedEmployee.specialization}</p>
                  <p className="text-[11px] text-slate-400">{selectedEmployee.phone}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Rekening Pembayaran Langsung</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedEmployee.paymentProfile?.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedEmployee.paymentProfile?.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Bank:</span>
                    <strong>{selectedEmployee.paymentProfile?.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">No. Rekening:</span>
                    <strong className="font-mono">
                      {selectedEmployee.paymentProfile?.bankAccountNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Atas Nama:</span>
                    <strong>{selectedEmployee.paymentProfile?.bankAccountName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Merchant QRIS:</span>
                    <strong>{selectedEmployee.paymentProfile?.qrisMerchantName}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Status Verifikasi Admin:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !selectedEmployee.paymentProfile?.isVerified;
                      verifyEmployeePaymentProfile(selectedEmployee.id, nextState);
                      setSelectedEmployee({
                        ...selectedEmployee,
                        paymentProfile: {
                          ...selectedEmployee.paymentProfile,
                          isVerified: nextState,
                        },
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedEmployee.paymentProfile?.isVerified
                        ? 'bg-rose-50 text-danger hover:bg-rose-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {selectedEmployee.paymentProfile?.isVerified
                      ? 'Cabut Verifikasi'
                      : 'Verifikasi Rekening Ini'}
                  </button>
                </div>
              </div>

              {/* Settlement Rate Setting */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Kewajiban Setoran Bulanan (Settlement Rate)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={selectedEmployee.settlementRate || 3.0}
                    id={`rate-${selectedEmployee.id}`}
                    className="w-20 bg-white p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-center"
                  />
                  <span className="text-xs font-semibold text-slate-600">% Gross Revenue</span>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        `rate-${selectedEmployee.id}`
                      ) as HTMLInputElement;
                      if (input) {
                        updateSettlementRate(selectedEmployee.id, Number(input.value), 'admin');
                        alert('Settlement rate partner berhasil disimpan.');
                      }
                    }}
                    className="ml-auto px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black"
                  >
                    Simpan Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / CREATE EMPLOYEE */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  {isCreating ? 'Tambah Karyawan Cleaning Baru' : 'Edit Profil Karyawan'}
                </h3>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap:</label>
                  <input
                    required
                    type="text"
                    value={editingEmployee.name || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email:</label>
                    <input
                      required
                      type="email"
                      value={editingEmployee.email || ''}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, email: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor HP:</label>
                    <input
                      required
                      type="tel"
                      value={editingEmployee.phone || ''}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, phone: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Keahlian (Skills - Pisahkan Koma):
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEmployee.skills?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        skills: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="General Cleaning, Deep Cleaning, Kitchen Cleaning..."
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <h4 className="font-bold text-slate-800">Data Rekening Pembayaran</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Bank:</label>
                      <input
                        type="text"
                        value={editingEmployee.paymentProfile?.bankName || 'BCA'}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            paymentProfile: {
                              ...editingEmployee.paymentProfile!,
                              bankName: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Nomor Rekening:
                      </label>
                      <input
                        type="text"
                        value={editingEmployee.paymentProfile?.bankAccountNumber || ''}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            paymentProfile: {
                              ...editingEmployee.paymentProfile!,
                              bankAccountNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nama Pemilik Rekening:
                    </label>
                    <input
                      type="text"
                      value={editingEmployee.paymentProfile?.bankAccountName || ''}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          paymentProfile: {
                            ...editingEmployee.paymentProfile!,
                            bankAccountName: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEmployee(null)}
                    className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black"
                  >
                    Simpan Partner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
