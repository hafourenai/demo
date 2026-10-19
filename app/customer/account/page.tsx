'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, Plus, Trash2, MapPin, ArrowUpRight, LogOut, Check, X } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Button } from '@/components/common';
import { generateId } from '@/lib/utils';
import { Address } from '@/lib/types';

const labelText = (label: string) => label === 'home' ? 'Rumah' : label === 'office' ? 'Kantor' : 'Lainnya';
const blankAddress = (): Address => ({ id: '', label: 'home', recipientName: '', phone: '', detail: '', notes: '', isDefault: false });

export default function AccountPage() {
  const { currentUser, customers, orders, updateProfile, updateAddress, deleteAddress, logout } = useAppStore();
  const router = useRouter();
  const customer = customers.find(c => c.id === currentUser?.id);
  const profile = customer || currentUser;
  const [editingProfile, setEditingProfile] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const count = orders.filter(o => o.customerId === currentUser?.id).length;
  const addresses = customer?.addresses || [];
  const initials = profile?.name.split(' ').slice(0, 2).map(n => n[0]).join('') || 'A';
  return <CustomerLayout currentPage="account">
    <div className="customer-page">
      <header className="mb-7"><h1 className="text-3xl font-serif">Akun Saya</h1><p className="text-sm text-text-secondary mt-2">Kelola profil dan alamat untuk perawatan berikutnya.</p></header>
      {message && <p role="status" className="account-message"><Check size={17} />{message}<button aria-label="Tutup pemberitahuan" onClick={() => setMessage('')} className="ml-auto p-2"><X size={16} /></button></p>}
      <div className="account-layout">
        <aside className="space-y-4">
          <section className="account-panel profile-summary">
            {profile?.photo ? <img src={profile.photo} alt="" className="profile-avatar object-cover" /> : <div className="profile-avatar">{initials}</div>}
            <h2 className="text-xl font-serif mt-4 break-words">{profile?.name || 'Pelanggan'}</h2>
            <p className="text-sm text-text-secondary mt-1 break-all">{profile?.email}</p>
            <div className="account-stats"><Link href="/customer/orders"><strong>{count}</strong><span>Pesanan <ArrowUpRight size={12} /></span></Link><a href="#alamat"><strong>{addresses.length}</strong><span>Alamat tersimpan</span></a></div>
          </section>
          <button className="logout-button" onClick={() => { logout(); router.replace('/'); }}><LogOut size={18} />Keluar akun</button>
        </aside>
        <div className="space-y-6 min-w-0">
          <section className="account-panel">
            <div className="flex items-center justify-between gap-3 mb-5"><h2 className="text-lg font-semibold">Informasi pribadi</h2>{!editingProfile && <button className="account-text-action" onClick={() => { setForm({ name: profile?.name || '', email: profile?.email || '', phone: profile?.phone || '' }); setEditingProfile(true); }}><Edit2 size={15} />Ubah</button>}</div>
            {editingProfile ? <form className="account-form" onSubmit={e => { e.preventDefault(); updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() }); setEditingProfile(false); setMessage('Profil berhasil diperbarui.'); }}>
              <label>Nama lengkap<input required maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" pattern=".*\S.*" /></label>
              <label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
              <label>Nomor telepon<input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
              <div className="form-actions"><Button type="button" variant="secondary" onClick={() => setEditingProfile(false)}>Batal</Button><Button type="submit">Simpan perubahan</Button></div>
            </form> : <dl className="profile-details"><div><dt>Nama lengkap</dt><dd>{profile?.name || '—'}</dd></div><div><dt>Email</dt><dd>{profile?.email || '—'}</dd></div><div><dt>Nomor telepon</dt><dd>{profile?.phone || '—'}</dd></div></dl>}
          </section>
          <section id="alamat" className="account-panel scroll-mt-6">
            <div className="flex items-center justify-between gap-3 mb-2"><h2 className="text-lg font-semibold">Alamat Saya</h2>{!address && addresses.length < 3 && <button className="account-text-action" onClick={() => setAddress(blankAddress())}><Plus size={17} />Tambah</button>}</div>
            <p className="text-sm text-text-secondary mb-5">Alamat tujuan layanan dan pengiriman. {addresses.length}/3 alamat.</p>
            {address ? <form className="account-form" onSubmit={e => { e.preventDefault(); if (!customer) return; updateAddress(customer.id, { ...address, id: address.id || generateId(), recipientName: address.recipientName.trim(), detail: address.detail.trim() }); setAddress(null); setMessage('Alamat berhasil disimpan.'); }}>
              <h3 className="text-base font-semibold">{address.id ? 'Ubah alamat' : 'Alamat baru'}</h3>
              <label>Label alamat<select value={address.label} onChange={e => setAddress({ ...address, label: e.target.value as Address['label'] })}><option value="home">Rumah</option><option value="office">Kantor</option><option value="other">Lainnya</option></select></label>
              <div className="form-row"><label>Nama penerima<input required pattern=".*\S.*" value={address.recipientName} onChange={e => setAddress({ ...address, recipientName: e.target.value })} autoComplete="name" /></label><label>Nomor telepon<input required type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} autoComplete="tel" /></label></div>
              <label>Alamat lengkap<textarea required rows={3} value={address.detail} onChange={e => setAddress({ ...address, detail: e.target.value })} autoComplete="street-address" /></label>
              <label>Catatan <span className="font-normal text-text-muted">(opsional)</span><input value={address.notes || ''} onChange={e => setAddress({ ...address, notes: e.target.value })} placeholder="Patokan rumah, nomor lantai, atau akses masuk" /></label>
              <label className="checkbox-label"><input type="checkbox" checked={address.isDefault} onChange={e => setAddress({ ...address, isDefault: e.target.checked })} />Jadikan alamat utama</label>
              <div className="form-actions"><Button type="button" variant="secondary" onClick={() => setAddress(null)}>Batal</Button><Button type="submit" disabled={!customer || !address.detail.trim()}>Simpan alamat</Button></div>
            </form> : <div className="space-y-4">{addresses.map(a => <article key={a.id} className={`address-card ${a.isDefault ? 'is-default' : ''}`}>
              <div className="flex items-center gap-2 mb-3"><MapPin size={18} className="text-primary" /><h3 className="text-base font-semibold">{labelText(a.label)}</h3>{a.isDefault && <span className="address-badge">Utama</span>}</div>
              <p className="text-sm font-semibold break-words">{a.recipientName}<span className="font-normal text-text-secondary"> · {a.phone}</span></p><p className="text-sm text-text-secondary leading-relaxed mt-2 break-words">{a.detail}</p>{a.notes && <p className="text-xs text-text-muted mt-2 break-words">Catatan: {a.notes}</p>}
              {deleting === a.id ? <div className="address-actions"><span className="text-sm">Hapus alamat ini?</span><button className="account-text-action" onClick={() => setDeleting(null)}>Batal</button><button className="account-text-action text-danger" onClick={() => { if (customer) deleteAddress(customer.id, a.id); setDeleting(null); setMessage('Alamat berhasil dihapus.'); }}>Ya, hapus</button></div> : <div className="address-actions"><button className="account-text-action" onClick={() => setAddress({ ...a })}><Edit2 size={14} />Ubah</button><button className="account-text-action text-danger" onClick={() => setDeleting(a.id)}><Trash2 size={14} />Hapus</button>{!a.isDefault && <button className="account-text-action sm:ml-auto" onClick={() => { if (customer) updateAddress(customer.id, { ...a, isDefault: true }); setMessage('Alamat utama diperbarui.'); }}>Jadikan utama</button>}</div>}
            </article>)}{!addresses.length && <div className="py-8 text-center"><MapPin size={28} className="mx-auto text-text-muted mb-3" /><h3 className="text-base font-semibold">Belum ada alamat</h3><p className="text-sm text-text-secondary mt-2">Tambahkan alamat agar pemesanan lebih mudah.</p></div>}</div>}
          </section>
        </div>
      </div>
    </div>
  </CustomerLayout>;
}
