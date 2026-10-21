'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, generateId } from '@/lib/utils';
import {
  Clock,
  Star,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { CleaningService, CleaningAddon } from '@/lib/types';

// Blank templates
const blankService = (): Partial<CleaningService> => ({
  name: '',
  description: '',
  category: 'Home Service',
  duration: 120,
  image: '/images/services/svc1.jpg',
  rating: 5.0,
  isAvailable: true,
  popularityBadge: undefined,
  checklistTemplate: [],
});

const blankAddon = (): Partial<CleaningAddon> => ({
  name: '',
  description: '',
  price: 50000,
});

export default function AdminServicesPage() {
  const {
    cleaningServices,
    cleaningAddons,
    addCleaningService,
    updateCleaningService,
    deleteCleaningService,
    addCleaningAddon,
    updateCleaningAddon,
    deleteCleaningAddon,
  } = useAppStore();

  const [selectedTab, setSelectedTab] = useState<'services' | 'addons'>('services');

  // Service editing
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<CleaningService>>(blankService());
  const [isAddingService, setIsAddingService] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Addon editing
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [addonForm, setAddonForm] = useState<Partial<CleaningAddon>>(blankAddon());
  const [isAddingAddon, setIsAddingAddon] = useState(false);

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<'service' | 'addon'>('service');

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ====== SERVICE HANDLERS ======
  const handleStartEditService = (service: CleaningService) => {
    setEditingServiceId(service.id);
    setServiceForm({ ...service });
    setIsAddingService(false);
  };

  const handleStartAddService = () => {
    setIsAddingService(true);
    setEditingServiceId(null);
    setServiceForm(blankService());
    setNewChecklistItem('');
  };

  const handleSaveService = () => {
    if (!serviceForm.name?.trim()) return;

    if (isAddingService) {
      const newService: CleaningService = {
        id: `cln-${generateId()}`,
        name: serviceForm.name!.trim(),
        description: serviceForm.description?.trim() || '',
        category: serviceForm.category || 'Home Service',
        duration: serviceForm.duration || 120,
        image: serviceForm.image || '/images/services/svc1.jpg',
        rating: serviceForm.rating || 5.0,
        isAvailable: serviceForm.isAvailable ?? true,
        popularityBadge: serviceForm.popularityBadge,
        checklistTemplate: serviceForm.checklistTemplate || [],
      };
      addCleaningService(newService);
      showToast(`Layanan "${newService.name}" berhasil ditambahkan!`);
    } else if (editingServiceId) {
      updateCleaningService(editingServiceId, {
        name: serviceForm.name!.trim(),
        description: serviceForm.description?.trim(),
        category: serviceForm.category,
        duration: serviceForm.duration,
        image: serviceForm.image,
        rating: serviceForm.rating,
        isAvailable: serviceForm.isAvailable,
        popularityBadge: serviceForm.popularityBadge,
        checklistTemplate: serviceForm.checklistTemplate,
      });
      showToast(`Layanan "${serviceForm.name}" berhasil diperbarui!`);
    }

    setIsAddingService(false);
    setEditingServiceId(null);
    setServiceForm(blankService());
  };

  const handleCancelServiceEdit = () => {
    setIsAddingService(false);
    setEditingServiceId(null);
    setServiceForm(blankService());
  };

  const handleDeleteService = (id: string) => {
    const svc = cleaningServices.find((s) => s.id === id);
    deleteCleaningService(id);
    showToast(`Layanan "${svc?.name}" berhasil dihapus.`);
    setConfirmDeleteId(null);
  };

  const handleToggleServiceAvailability = (service: CleaningService) => {
    updateCleaningService(service.id, { isAvailable: !service.isAvailable });
    showToast(`Layanan "${service.name}" ${!service.isAvailable ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setServiceForm({
      ...serviceForm,
      checklistTemplate: [...(serviceForm.checklistTemplate || []), newChecklistItem.trim()],
    });
    setNewChecklistItem('');
  };

  const removeChecklistItem = (idx: number) => {
    setServiceForm({
      ...serviceForm,
      checklistTemplate: (serviceForm.checklistTemplate || []).filter((_, i) => i !== idx),
    });
  };

  // ====== ADDON HANDLERS ======
  const handleStartEditAddon = (addon: CleaningAddon) => {
    setEditingAddonId(addon.id);
    setAddonForm({ ...addon });
    setIsAddingAddon(false);
  };

  const handleStartAddAddon = () => {
    setIsAddingAddon(true);
    setEditingAddonId(null);
    setAddonForm(blankAddon());
  };

  const handleSaveAddon = () => {
    if (!addonForm.name?.trim()) return;

    if (isAddingAddon) {
      const newAddon: CleaningAddon = {
        id: `addon-${generateId()}`,
        name: addonForm.name!.trim(),
        description: addonForm.description?.trim() || '',
        price: addonForm.price || 50000,
      };
      addCleaningAddon(newAddon);
      showToast(`Add-on "${newAddon.name}" berhasil ditambahkan!`);
    } else if (editingAddonId) {
      updateCleaningAddon(editingAddonId, {
        name: addonForm.name!.trim(),
        description: addonForm.description?.trim(),
        price: addonForm.price,
      });
      showToast(`Add-on "${addonForm.name}" berhasil diperbarui!`);
    }

    setIsAddingAddon(false);
    setEditingAddonId(null);
    setAddonForm(blankAddon());
  };

  const handleCancelAddonEdit = () => {
    setIsAddingAddon(false);
    setEditingAddonId(null);
    setAddonForm(blankAddon());
  };

  const handleDeleteAddon = (id: string) => {
    const addon = cleaningAddons.find((a) => a.id === id);
    deleteCleaningAddon(id);
    showToast(`Add-on "${addon?.name}" berhasil dihapus.`);
    setConfirmDeleteId(null);
  };

  const isEditingOrAdding = isAddingService || !!editingServiceId || isAddingAddon || !!editingAddonId;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
            <Check size={14} /> {toast}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Data yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    confirmDeleteType === 'service'
                      ? handleDeleteService(confirmDeleteId)
                      : handleDeleteAddon(confirmDeleteId)
                  }
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Katalog Layanan Home Cleaning
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola jenis layanan pembersihan, checklist operasional standar, dan pilihan add-on.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => { setSelectedTab('services'); handleCancelServiceEdit(); handleCancelAddonEdit(); }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTab === 'services'
                    ? 'bg-white shadow-sm text-pink-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Layanan ({cleaningServices.length})
              </button>
              <button
                onClick={() => { setSelectedTab('addons'); handleCancelServiceEdit(); handleCancelAddonEdit(); }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTab === 'addons'
                    ? 'bg-white shadow-sm text-pink-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Add-on ({cleaningAddons.length})
              </button>
            </div>

            {/* Add Button */}
            {!isEditingOrAdding && (
              <button
                onClick={selectedTab === 'services' ? handleStartAddService : handleStartAddAddon}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus size={14} /> Tambah {selectedTab === 'services' ? 'Layanan' : 'Add-on'}
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* SERVICE ADD / EDIT FORM                    */}
        {/* ========================================== */}
        {selectedTab === 'services' && (isAddingService || editingServiceId) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-pink-600" />
                {isAddingService ? 'Tambah Layanan Cleaning Baru' : `Edit: ${serviceForm.name}`}
              </h2>
              <button onClick={handleCancelServiceEdit} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Layanan *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="Contoh: Deep Kitchen Cleaning"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi</label>
                  <textarea
                    rows={2}
                    value={serviceForm.description || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Jelaskan layanan ini secara singkat..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                    <select
                      value={serviceForm.category || 'Home Service'}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          category: e.target.value as CleaningService['category'],
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="Home Service">Home Service</option>
                      <option value="Specialized Cleaning">Specialized Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Durasi (menit)</label>
                    <input
                      type="number"
                      min={30}
                      max={480}
                      value={serviceForm.duration || 120}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Badge Populer</label>
                    <select
                      value={serviceForm.popularityBadge || ''}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          popularityBadge: (e.target.value || undefined) as CleaningService['popularityBadge'],
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="">Tanpa Badge</option>
                      <option value="Most Popular">Most Popular</option>
                      <option value="Recommended">Recommended</option>
                      <option value="Best Value">Best Value</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setServiceForm({ ...serviceForm, isAvailable: !serviceForm.isAvailable })
                      }
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        serviceForm.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {serviceForm.isAvailable ? (
                        <><ToggleRight size={16} /> Aktif Ditawarkan</>
                      ) : (
                        <><ToggleLeft size={16} /> Nonaktif</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checklist Template Builder */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Template Checklist Pekerjaan ({(serviceForm.checklistTemplate || []).length} item)
                  </label>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2 max-h-[200px] overflow-y-auto">
                    {(serviceForm.checklistTemplate || []).length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-2">Belum ada item checklist</p>
                    )}
                    {(serviceForm.checklistTemplate || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs"
                      >
                        <span className="text-slate-700 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          {item}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(idx)}
                          className="text-rose-400 hover:text-rose-600 p-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                    placeholder="Tambah item checklist baru..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    disabled={!newChecklistItem.trim()}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL Gambar</label>
                  <input
                    type="text"
                    value={serviceForm.image || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="/images/services/svc1.jpg"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCancelServiceEdit}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveService}
                disabled={!serviceForm.name?.trim()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-40"
              >
                <Save size={14} /> {isAddingService ? 'Simpan Layanan Baru' : 'Update Layanan'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ADDON ADD / EDIT FORM                      */}
        {/* ========================================== */}
        {selectedTab === 'addons' && (isAddingAddon || editingAddonId) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900">
                {isAddingAddon ? '+ Tambah Add-on Baru' : `Edit: ${addonForm.name}`}
              </h2>
              <button onClick={handleCancelAddonEdit} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Add-on *</label>
                <input
                  type="text"
                  required
                  value={addonForm.name || ''}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="Contoh: Cuci Gorden"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={addonForm.description || ''}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  placeholder="Penjelasan singkat..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Harga Tambahan (Rp)</label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={addonForm.price || 0}
                  onChange={(e) => setAddonForm({ ...addonForm, price: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCancelAddonEdit}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAddon}
                disabled={!addonForm.name?.trim()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-40"
              >
                <Save size={14} /> {isAddingAddon ? 'Simpan Add-on' : 'Update Add-on'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 1: CLEANING SERVICES LISTING           */}
        {/* ========================================== */}
        {selectedTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaningServices.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                    !service.isAvailable ? 'border-slate-200 opacity-60' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {service.popularityBadge && (
                        <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {service.popularityBadge}
                        </span>
                      )}
                      {!service.isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                            NONAKTIF
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {service.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          {service.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">{service.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{service.description}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={13} /> {service.duration} Menit
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleServiceAvailability(service)}
                          className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors ${
                            service.isAvailable
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {service.isAvailable ? (
                            <><ToggleRight size={14} /> Aktif</>
                          ) : (
                            <><ToggleLeft size={14} /> Nonaktif</>
                          )}
                        </button>
                      </div>

                      {/* Expandable Checklist */}
                      <button
                        type="button"
                        onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                        className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                      >
                        <span>Checklist ({service.checklistTemplate?.length || 0} item)</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isExpanded && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1 animate-fadeIn">
                          {service.checklistTemplate?.length ? (
                            <ul className="text-slate-600 space-y-0.5">
                              {service.checklistTemplate.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-400 text-center py-1">Belum ada item checklist</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditService(service)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(service.id);
                        setConfirmDeleteType('service');
                      }}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {cleaningServices.length === 0 && (
              <div className="col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">Belum ada layanan cleaning terdaftar.</p>
                <button
                  onClick={handleStartAddService}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  + Tambah Layanan Pertama
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CLEANING ADDONS LISTING             */}
        {/* ========================================== */}
        {selectedTab === 'addons' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cleaningAddons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{addon.name}</h3>
                    <span className="text-xs font-bold text-pink-600 font-sans">
                      +{formatCurrency(addon.price)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{addon.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">ID: {addon.id}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEditAddon(addon)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(addon.id);
                        setConfirmDeleteType('addon');
                      }}
                      className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cleaningAddons.length === 0 && (
              <div className="col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">Belum ada add-on terdaftar.</p>
                <button
                  onClick={handleStartAddAddon}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  + Tambah Add-on Pertama
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
