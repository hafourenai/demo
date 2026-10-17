'use client';

import { useState } from 'react';
import { Edit2, Plus, Trash2, MapPin } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button, EmptyState } from '@/components/common';
import { generateId } from '@/lib/utils';
import { Address } from '@/lib/types';

const labelText = (label: string) =>
  label === 'home' ? 'Rumah' : label === 'office' ? 'Kantor' : 'Lainnya';

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

  const emptyAddress: Partial<Address> = {
    label: 'home',
    recipientName: '',
    phone: '',
    detail: '',
    notes: '',
    isDefault: false,
  };

  const [addressForm, setAddressForm] = useState<Partial<Address>>(emptyAddress);

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
    setAddressForm(emptyAddress);
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

  const inputClass =
    'w-full mt-1 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm';

  return (
    <CustomerLayout currentPage="account">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-serif font-bold text-text-primary">Akun Saya</h1>

        {/* Profile Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-semibold text-text-primary">Profil</h3>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors duration-base"
              aria-label="Edit profil"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Edit2 size={18} />
            </button>
          </div>

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Nomor HP</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Simpan Perubahan
              </Button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-text-muted text-xs font-semibold">Nama</p>
                <p className="font-semibold text-text-primary mt-1">{currentUser?.name}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs font-semibold">Email</p>
                <p className="font-semibold text-text-primary mt-1">{currentUser?.email}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs font-semibold">Nomor HP</p>
                <p className="font-semibold text-text-primary mt-1">{currentUser?.phone}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Address Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-semibold text-text-primary">Alamat Saya</h3>
            {!addingAddress && customer?.addresses.length! < 3 && (
              <button
                onClick={() => {
                  setAddingAddress(true);
                  setEditingAddressId(null);
                  setAddressForm(emptyAddress);
                }}
                className="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors duration-base"
                aria-label="Tambah alamat"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          {addingAddress ? (
            <Card className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Label</label>
                <select
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="home">Rumah</option>
                  <option value="office">Kantor</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Nama Penerima</label>
                <input
                  type="text"
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Nomor HP</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Detail Alamat</label>
                <textarea
                  value={addressForm.detail}
                  onChange={(e) => setAddressForm({ ...addressForm, detail: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary">Catatan</label>
                <input
                  type="text"
                  value={addressForm.notes}
                  onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                  placeholder="Contoh: Dekat masjid"
                  className={inputClass}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Jadikan alamat utama</span>
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
                      <h4 className="font-serif font-semibold text-text-primary">
                        {labelText(address.label)}
                        {address.isDefault && (
                          <span className="badge badge-primary text-xs ml-2">Utama</span>
                        )}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">{address.detail}</p>
                      <p className="text-xs text-text-muted mt-1">{address.recipientName} • {address.phone}</p>
                      {address.notes && (
                        <p className="text-xs text-text-muted mt-1">Catatan: {address.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-1 hover:bg-canvas-alt rounded-md transition-colors duration-base"
                      aria-label="Edit alamat"
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <Edit2 size={16} className="text-text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress()}
                      className="p-1 hover:bg-danger/10 rounded-md transition-colors duration-base"
                      aria-label="Hapus alamat"
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </Card>
              ))}
              {customer?.addresses.length === 0 && (
                <EmptyState title="Belum ada alamat" description="Tambahkan alamat untuk memesan layanan home service" />
              )}
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </CustomerLayout>
  );
}