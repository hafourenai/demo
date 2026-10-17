'use client';

import { useState } from 'react';
import { Edit2, Plus, Trash2, MapPin } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button } from '@/components/common';
import { generateId } from '@/lib/utils';
import { Address } from '@/lib/types';

export default function AccountPage() {
  const { currentUser, customers, updateAddress } = useAppStore();
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const customer = customers.find((c) => c.id === currentUser?.id);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    label: 'home',
    recipientName: '',
    phone: '',
    detail: '',
    notes: '',
    isDefault: false,
  });

  const handleSaveProfile = () => {
    setEditingProfile(false);
    // In a real app, this would update the user
  };

  const handleSaveAddress = () => {
    if (!addressForm.detail || !addressForm.recipientName) {
      alert('Isi semua field yang diperlukan');
      return;
    }

    const address: Address = {
      id: editingAddressId || generateId(),
      label: (addressForm.label as any) || 'home',
      recipientName: addressForm.recipientName,
      phone: addressForm.phone || '',
      detail: addressForm.detail,
      notes: addressForm.notes,
      isDefault: addressForm.isDefault || false,
    };

    updateAddress(customer?.id || '', address);
    setAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({
      label: 'home',
      recipientName: '',
      phone: '',
      detail: '',
      notes: '',
      isDefault: false,
    });
  };

  const handleDeleteAddress = () => {
    if (confirm('Hapus alamat ini?')) {
      // In a real app, implement delete
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm(address);
    setAddingAddress(true);
  };

  return (
    <CustomerLayout currentPage="account">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Akun Saya</h1>

        {/* Profile Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Profil</h3>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-primary hover:bg-primary/10 p-2 rounded transition"
            >
              <Edit2 size={18} />
            </button>
          </div>

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Nomor HP</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Simpan Perubahan
              </Button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 text-xs font-semibold">Nama</p>
                <p className="font-semibold text-gray-800 mt-1">{currentUser?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold">Email</p>
                <p className="font-semibold text-gray-800 mt-1">{currentUser?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold">Nomor HP</p>
                <p className="font-semibold text-gray-800 mt-1">{currentUser?.phone}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Address Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Alamat Saya</h3>
            {!addingAddress && customer?.addresses.length! < 3 && (
              <button
                onClick={() => {
                  setAddingAddress(true);
                  setEditingAddressId(null);
                  setAddressForm({
                    label: 'home',
                    recipientName: '',
                    phone: '',
                    detail: '',
                    notes: '',
                    isDefault: false,
                  });
                }}
                className="text-primary hover:bg-primary/10 p-2 rounded transition"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          {addingAddress ? (
            <Card className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">Label</label>
                <select
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value as any })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="home">Rumah</option>
                  <option value="office">Kantor</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Nama Penerima</label>
                <input
                  type="text"
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Nomor HP</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Detail Alamat</label>
                <textarea
                  value={addressForm.detail}
                  onChange={(e) => setAddressForm({ ...addressForm, detail: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Catatan</label>
                <input
                  type="text"
                  value={addressForm.notes}
                  onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                  placeholder="Contoh: Dekat masjid"
                  className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Jadikan alamat utama</span>
              </label>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    setAddingAddress(false);
                    setEditingAddressId(null);
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button onClick={handleSaveAddress} className="flex-1">
                  Simpan
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {customer?.addresses.map((address) => (
                <Card key={address.id} className="flex gap-3 justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {address.label === 'home' ? '🏠 Rumah' : address.label === 'office' ? '🏢 Kantor' : '📍 Lainnya'}
                        {address.isDefault && (
                          <span className="badge badge-primary text-xs ml-2">Utama</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{address.detail}</p>
                      <p className="text-xs text-gray-500 mt-1">{address.recipientName} • {address.phone}</p>
                      {address.notes && (
                        <p className="text-xs text-gray-500 mt-1">Catatan: {address.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress()}
                      className="p-1 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </Card>
              ))}
              {customer?.addresses.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-4">Belum ada alamat</p>
              )}
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </CustomerLayout>
  );
}
