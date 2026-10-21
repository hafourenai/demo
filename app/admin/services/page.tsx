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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filtered lists
  const filteredServices = cleaningServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAddons = cleaningAddons.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Katalog Layanan Home Cleaning
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola jenis layanan pembersihan, checklist operasional standar, dan pilihan add-on.
            </p>
          </div>

          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedTab === 'services' ? 'Cari layanan cleaning...' : 'Cari add-on...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20 bg-white"
            />
          </div>

          {/* Tab & Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => { setSelectedTab('services'); handleCancelServiceEdit(); handleCancelAddonEdit(); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTab === 'services'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Layanan ({cleaningServices.length})
              </button>
              <button
                onClick={() => { setSelectedTab('addons'); handleCancelServiceEdit(); handleCancelAddonEdit(); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTab === 'addons'
                    ? 'bg-white shadow-sm text-slate-900'
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
                className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  {isAddingService ? 'Tambah Layanan Cleaning Baru' : `Edit: ${serviceForm.name}`}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isAddingService ? 'Isi detail lengkap layanan pembersihan.' : 'Perbarui informasi layanan.'}
                </p>
              </div>
              <button onClick={handleCancelServiceEdit} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Nama Layanan *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="Contoh: Deep Kitchen Cleaning"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Deskripsi</label>
                  <textarea
                    rows={2}
                    value={serviceForm.description || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Jelaskan layanan ini secara singkat..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Kategori</label>
                    <select
                      value={serviceForm.category || 'Home Service'}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          category: e.target.value as CleaningService['category'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <option value="Home Service">Home Service</option>
                      <option value="Specialized Cleaning">Specialized Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Durasi (menit)</label>
                    <input
                      type="number"
                      min={30}
                      max={480}
                      value={serviceForm.duration || 120}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Badge Populer</label>
                    <select
                      value={serviceForm.popularityBadge || ''}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          popularityBadge: (e.target.value || undefined) as CleaningService['popularityBadge'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        serviceForm.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {serviceForm.isAvailable ? (
                        <><ToggleRight size={15} /> Aktif</>
                      ) : (
                        <><ToggleLeft size={15} /> Nonaktif</>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">URL Gambar</label>
                  <input
                    type="text"
                    value={serviceForm.image || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="/images/services/svc1.jpg"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              {/* Checklist Template Builder */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Template Checklist ({(serviceForm.checklistTemplate || []).length} item)
                  </label>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-3.5 space-y-2 max-h-[240px] overflow-y-auto">
                    {(serviceForm.checklistTemplate || []).length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">Belum ada item</p>
                    )}
                    {(serviceForm.checklistTemplate || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-100"
                      >
                        <span className="text-xs text-slate-700 flex items-center gap-2 flex-1 min-w-0">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="truncate">{item}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(idx)}
                          className="flex-shrink-0 text-rose-400 hover:text-rose-600 p-1"
                        >
                          <X size={14} />
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
                    placeholder="Tambah item checklist..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    disabled={!newChecklistItem.trim()}
                    className="px-3.5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Save / Cancel */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelServiceEdit}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveService}
                disabled={!serviceForm.name?.trim()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={14} /> {isAddingService ? 'Simpan Layanan' : 'Update Layanan'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ADDON ADD / EDIT FORM                      */}
        {/* ========================================== */}
        {selectedTab === 'addons' && (isAddingAddon || editingAddonId) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  {isAddingAddon ? 'Tambah Add-on Baru' : `Edit: ${addonForm.name}`}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isAddingAddon ? 'Tambahkan pilihan layanan tambahan.' : 'Perbarui informasi add-on.'}
                </p>
              </div>
              <button onClick={handleCancelAddonEdit} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Nama Add-on *</label>
                <input
                  type="text"
                  required
                  value={addonForm.name || ''}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="Contoh: Cuci Gorden"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Deskripsi</label>
                <input
                  type="text"
                  value={addonForm.description || ''}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  placeholder="Penjelasan singkat..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Harga Tambahan (Rp)</label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={addonForm.price || 0}
                  onChange={(e) => setAddonForm({ ...addonForm, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelAddonEdit}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAddon}
                disabled={!addonForm.name?.trim()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            {filteredServices.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl border shadow-xs flex flex-col justify-between overflow-hidden transition-all hover:shadow-sm ${
                    !service.isAvailable ? 'border-slate-200 opacity-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.popularityBadge && (
                      <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {service.popularityBadge}
                      </span>
                    )}
                    {!service.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">NONAKTIF</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {service.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          {service.rating}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{service.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">{service.description}</p>
                    </div>

                    {/* Duration & Availability */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock size={13} /> {service.duration} min
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleServiceAvailability(service)}
                        className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                          service.isAvailable
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {service.isAvailable ? (
                          <><ToggleRight size={13} /> Aktif</>
                        ) : (
                          <><ToggleLeft size={13} /> Nonaktif</>
                        )}
                      </button>
                    </div>

                    {/* Expandable Checklist */}
                    <button
                      type="button"
                      onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                      className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <span>Checklist ({service.checklistTemplate?.length || 0})</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] space-y-1.5 animate-fadeIn max-h-[160px] overflow-y-auto">
                        {service.checklistTemplate?.length ? (
                          <ul className="text-slate-600 space-y-1">
                            {service.checklistTemplate.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400">•</span>
                                <span className="line-clamp-2">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-400 text-center py-1.5">Belum ada checklist</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditService(service)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(service.id);
                        setConfirmDeleteType('service');
                      }}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors"
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

            {cleaningServices.length > 0 && filteredServices.length === 0 && (
              <div className="col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">Tidak ada layanan yang cocok dengan pencarian "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CLEANING ADDONS LISTING             */}
        {/* ========================================== */}
        {selectedTab === 'addons' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAddons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-slate-900 flex-1">{addon.name}</h3>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md flex-shrink-0">
                      +{formatCurrency(addon.price)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{addon.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{addon.id}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEditAddon(addon)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(addon.id);
                        setConfirmDeleteType('addon');
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition-colors"
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

            {cleaningAddons.length > 0 && filteredAddons.length === 0 && (
              <div className="col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500 font-medium">Tidak ada add-on yang cocok dengan pencarian "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
