'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, Plus, Trash2, MapPin, ArrowUpRight, LogOut, Check, X, Navigation } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Button } from '@/components/common';
import { generateId } from '@/lib/utils';
import { Address } from '@/lib/types';

const labelText = (label: string) =>
  label === 'home' ? 'Rumah' : label === 'office' ? 'Kantor' : 'Lainnya';

const blankAddress = (): Address => ({
  id: '',
  label: 'home',
  recipientName: '',
  phone: '',
  detail: '',
  latitude: -6.2088,
  longitude: 106.8456,
  notes: '',
  isDefault: false,
});

export default function AccountPage() {
  const {
    currentUser,
    customers,
    cleaningOrders,
    productOrders,
    updateProfile,
    updateAddress,
    deleteAddress,
    logout,
  } = useAppStore();

  const router = useRouter();
  const customer = customers.find((c) => c.id === currentUser?.id);
  const profile = customer || currentUser;

  const [editingProfile, setEditingProfile] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const myCleanings = cleaningOrders.filter((o) => o.customerId === currentUser?.id).length;
  const myProducts = productOrders.filter((o) => o.customerId === currentUser?.id).length;
  const totalOrders = myCleanings + myProducts;
  const addresses = customer?.addresses || [];
  const initials =
    profile?.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') || 'U';

  const handleUseCurrentLocation = () => {
    if (address) {
      setAddress({
        ...address,
        latitude: -6.2146,
        longitude: 106.8451,
        detail: address.detail ? `${address.detail} (GPS Aktif)` : 'Area Jl. Rasuna Said, Jakarta Selatan (Titik GPS)',
      });
      setMessage('Koordinat lokasi saat ini berhasil diisi.');
    }
  };

  return (
    <CustomerLayout currentPage="account">
      <div className="customer-page">
        <header className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-text-primary">Akun Saya</h1>
          <p className="text-xs text-text-secondary mt-1">
            Kelola profil, riwayat, dan alamat untuk pemesanan cleaning &amp; Nail Art.
          </p>
        </header>

        {message && (
          <p role="status" className="account-message">
            <Check size={16} />
            {message}
            <button
              aria-label="Tutup pemberitahuan"
              onClick={() => setMessage('')}
              className="ml-auto p-1"
            >
              <X size={15} />
            </button>
          </p>
        )}

        <div className="account-layout">
          <aside className="space-y-4">
            <section className="account-panel profile-summary">
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt=""
                  className="profile-avatar object-cover"
                />
              ) : (
                <div className="profile-avatar">{initials}</div>
              )}
              <h2 className="text-base font-serif font-bold mt-3 break-words text-text-primary">
                {profile?.name || 'Pelanggan'}
              </h2>
              <p className="text-xs text-text-secondary break-all">{profile?.email}</p>
              <p className="text-xs text-text-muted">{profile?.phone}</p>

              <div className="account-stats mt-4">
                <Link href="/customer/orders">
                  <strong>{totalOrders}</strong>
                  <span>Pesanan <ArrowUpRight size={11} /></span>
                </Link>
                <a href="#alamat">
                  <strong>{addresses.length}</strong>
                  <span>Alamat tersimpan</span>
                </a>
              </div>
            </section>

            <button
              className="logout-button"
              onClick={() => {
                logout();
                router.replace('/demo');
              }}
            >
              <LogOut size={16} /> Keluar / Switch Role
            </button>
          </aside>

          <div className="space-y-5 min-w-0">
            {/* Informasi Pribadi */}
            <section className="account-panel">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-sm font-bold text-text-primary">Informasi Pribadi</h2>
                {!editingProfile && (
                  <button
                    className="account-text-action text-xs"
                    onClick={() => {
                      setForm({
                        name: profile?.name || '',
                        email: profile?.email || '',
                        phone: profile?.phone || '',
                      });
                      setEditingProfile(true);
                    }}
                  >
                    <Edit2 size={13} /> Ubah
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form
                  className="account-form text-xs"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile({
                      name: form.name.trim(),
                      email: form.email.trim(),
                      phone: form.phone.trim(),
                    });
                    setEditingProfile(false);
                    setMessage('Profil berhasil diperbarui.');
                  }}
                >
                  <label>
                    Nama lengkap
                    <input
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    Nomor telepon
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      autoComplete="tel"
                    />
                  </label>
                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingProfile(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" size="sm">
                      Simpan perubahan
                    </Button>
                  </div>
                </form>
              ) : (
                <dl className="profile-details text-xs">
                  <div>
                    <dt>Nama lengkap</dt>
                    <dd>{profile?.name || '—'}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{profile?.email || '—'}</dd>
                  </div>
                  <div>
                    <dt>Nomor telepon</dt>
                    <dd>{profile?.phone || '—'}</dd>
                  </div>
                </dl>
              )}
            </section>

            {/* Alamat Customer (Maksimal 3 Alamat - PRD Section 10) */}
            <section id="alamat" className="account-panel scroll-mt-6">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h2 className="text-sm font-bold text-text-primary">
                  Daftar Alamat (Maks. 3 Alamat)
                </h2>
                {!address && addresses.length < 3 && (
                  <button
                    className="account-text-action text-xs"
                    onClick={() => setAddress(blankAddress())}
                  >
                    <Plus size={14} /> Tambah Alamat
                  </button>
                )}
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Digunakan untuk estimasi radius penjemputan cleaning &amp; tujuan kurir. Tersimpan {addresses.length}/3 alamat.
              </p>

              {address ? (
                <form
                  className="account-form text-xs"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customer) return;
                    updateAddress(customer.id, {
                      ...address,
                      id: address.id || generateId(),
                      recipientName: address.recipientName.trim(),
                      detail: address.detail.trim(),
                      latitude: Number(address.latitude) || -6.2088,
                      longitude: Number(address.longitude) || 106.8456,
                    });
                    setAddress(null);
                    setMessage('Alamat berhasil disimpan.');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-text-primary">
                      {address.id ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-[11px] text-primary flex items-center gap-1 font-semibold hover:underline"
                    >
                      <Navigation size={13} /> Gunakan Lokasi Saat Ini
                    </button>
                  </div>

                  <label>
                    Label alamat
                    <select
                      value={address.label}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          label: e.target.value as Address['label'],
                        })
                      }
                    >
                      <option value="home">Rumah</option>
                      <option value="office">Kantor</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </label>

                  <div className="form-row">
                    <label>
                      Nama penerima
                      <input
                        required
                        value={address.recipientName}
                        onChange={(e) =>
                          setAddress({ ...address, recipientName: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Nomor telepon
                      <input
                        required
                        type="tel"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Alamat lengkap
                    <textarea
                      required
                      rows={2}
                      value={address.detail}
                      onChange={(e) =>
                        setAddress({ ...address, detail: e.target.value })
                      }
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <label>
                      Latitude (Koordinat)
                      <input
                        type="number"
                        step="0.0001"
                        value={address.latitude}
                        onChange={(e) =>
                          setAddress({ ...address, latitude: Number(e.target.value) })
                        }
                      />
                    </label>
                    <label>
                      Longitude (Koordinat)
                      <input
                        type="number"
                        step="0.0001"
                        value={address.longitude}
                        onChange={(e) =>
                          setAddress({ ...address, longitude: Number(e.target.value) })
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Catatan lokasi (opsional)
                    <input
                      value={address.notes || ''}
                      onChange={(e) =>
                        setAddress({ ...address, notes: e.target.value })
                      }
                      placeholder="Warna pagar, lantai unit, patokan gang"
                    />
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={address.isDefault}
                      onChange={(e) =>
                        setAddress({ ...address, isDefault: e.target.checked })
                      }
                    />
                    Jadikan sebagai alamat utama
                  </label>

                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setAddress(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!customer || !address.detail.trim()}
                    >
                      Simpan Alamat
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <article
                      key={a.id}
                      className={`address-card ${a.isDefault ? 'is-default' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-primary" />
                        <h3 className="text-xs font-bold uppercase">{labelText(a.label)}</h3>
                        {a.isDefault && <span className="address-badge">Utama</span>}
                      </div>

                      <p className="text-xs font-semibold text-text-primary">
                        {a.recipientName}{' '}
                        <span className="font-normal text-text-secondary">· {a.phone}</span>
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed mt-1">
                        {a.detail}
                      </p>
                      {a.notes && (
                        <p className="text-[11px] text-text-muted mt-1">Catatan: {a.notes}</p>
                      )}

                      {deleting === a.id ? (
                        <div className="address-actions mt-3 pt-2 border-t border-border">
                          <span className="text-xs">Hapus alamat ini?</span>
                          <button
                            className="account-text-action text-xs"
                            onClick={() => setDeleting(null)}
                          >
                            Batal
                          </button>
                          <button
                            className="account-text-action text-xs text-danger"
                            onClick={() => {
                              if (customer) deleteAddress(customer.id, a.id);
                              setDeleting(null);
                              setMessage('Alamat berhasil dihapus.');
                            }}
                          >
                            Ya, hapus
                          </button>
                        </div>
                      ) : (
                        <div className="address-actions mt-3 pt-2 border-t border-border">
                          <button
                            className="account-text-action text-xs"
                            onClick={() => setAddress({ ...a })}
                          >
                            <Edit2 size={12} /> Ubah
                          </button>
                          <button
                            className="account-text-action text-xs text-danger"
                            onClick={() => setDeleting(a.id)}
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                          {!a.isDefault && (
                            <button
                              className="account-text-action text-xs sm:ml-auto"
                              onClick={() => {
                                if (customer)
                                  updateAddress(customer.id, {
                                    ...a,
                                    isDefault: true,
                                  });
                                setMessage('Alamat utama diperbarui.');
                              }}
                            >
                              Jadikan utama
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  ))}

                  {addresses.length === 0 && (
                    <div className="py-8 text-center bg-canvas rounded-xl border border-dashed border-border p-4">
                      <MapPin size={24} className="mx-auto text-text-muted mb-2" />
                      <h3 className="text-xs font-bold text-text-primary">Belum ada alamat</h3>
                      <p className="text-xs text-text-secondary mt-1">
                        Tambahkan alamat Anda (maks. 3 alamat).
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
