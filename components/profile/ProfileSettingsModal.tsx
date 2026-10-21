'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Clock,
  Bell,
  ShieldCheck,
  LogOut,
  X,
  ChevronRight,
  Smartphone,
  ShoppingBag,
  Briefcase,
  Sliders,
  Edit2,
  Check,
  ArrowLeft,
  Plus,
  CreditCard,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { seedCustomers, seedEmployees } from '@/lib/seed';
import { generateId } from '@/lib/utils';
import { Address } from '@/lib/types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const router = useRouter();
  const {
    currentUser,
    customers,
    employees,
    cleaningOrders,
    productOrders,
    updateProfile,
    updateAddress,
    login,
    logout,
  } = useAppStore();

  const [currentView, setCurrentView] = useState<'main' | 'edit_profile' | 'addresses' | 'employee_payment'>('main');
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [successToast, setSuccessToast] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [newAddressDetail, setNewAddressDetail] = useState('');
  const [newAddressLabel, setNewAddressLabel] = useState<'home' | 'office' | 'other'>('home');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const isCustomer = currentUser?.role === 'customer' || !currentUser?.role;
  const isEmployee = currentUser?.role === 'employee';

  const customer = customers.find((c) => c.id === currentUser?.id) || customers[0] || seedCustomers[0];
  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0] || seedEmployees[0];

  const activeUser = isEmployee ? employee : customer;
  const userPhoto = activeUser?.photo || (isEmployee ? seedEmployees[0].photo : seedCustomers[0].photo);
  const userName = activeUser?.name || (isEmployee ? 'Budi Santoso' : 'Clarissa Amanda');
  const userEmail = activeUser?.email || (isEmployee ? 'budi.cleaning@homeservice.id' : 'clarissa@gmail.com');
  const userPhone = activeUser?.phone || (isEmployee ? '081234567801' : '081298765431');

  useEffect(() => {
    if (isOpen) {
      setCurrentView('main');
      setProfileForm({
        name: userName,
        email: userEmail,
        phone: userPhone,
      });
      setIsAddingAddress(false);
      setSuccessToast('');
    }
  }, [isOpen, userName, userEmail, userPhone]);

  if (!isOpen) return null;

  const myCleanings = cleaningOrders.filter((o) => o.customerId === activeUser?.id).length;
  const myProducts = productOrders.filter((o) => o.customerId === activeUser?.id).length;
  const totalOrders = myCleanings + myProducts;
  const addresses = customer?.addresses || seedCustomers[0].addresses || [];
  const addressesCount = addresses.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
    });

    setSuccessToast('Profil berhasil diperbarui!');
    setTimeout(() => {
      setSuccessToast('');
      setCurrentView('main');
    }, 1200);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressDetail.trim()) return;

    const newAddr: Address = {
      id: generateId(),
      label: newAddressLabel,
      recipientName: userName,
      phone: userPhone,
      detail: newAddressDetail.trim(),
      latitude: -6.2146,
      longitude: 106.8451,
      isDefault: addresses.length === 0,
    };

    updateAddress(customer.id, newAddr);
    setNewAddressDetail('');
    setIsAddingAddress(false);
    setSuccessToast('Alamat baru berhasil ditambahkan!');
    setTimeout(() => setSuccessToast(''), 2000);
  };

  const handleSetDefaultAddress = (addr: Address) => {
    updateAddress(customer.id, { ...addr, isDefault: true });
    setSuccessToast(`Alamat "${addr.label.toUpperCase()}" dijadikan utama`);
    setTimeout(() => setSuccessToast(''), 1500);
  };

  const handleSwitchRole = (role: 'customer' | 'employee' | 'admin') => {
    if (role === 'customer') {
      login(seedCustomers[0]);
      onClose();
      router.push('/customer');
    } else if (role === 'employee') {
      login(seedEmployees[0]);
      onClose();
      router.push('/employee');
    } else {
      onClose();
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full sm:max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 border border-slate-100 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dynamic Title & Back Button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2">
            {currentView !== 'main' ? (
              <button
                onClick={() => setCurrentView('main')}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <ArrowLeft size={16} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User size={16} />
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {currentView === 'main'
                  ? 'Pengaturan & Akun'
                  : currentView === 'edit_profile'
                  ? 'Edit Data Diri'
                  : currentView === 'addresses'
                  ? 'Kelola Alamat Saya'
                  : 'Info Rekening Mitra'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isEmployee ? 'Mitra Cleaning Specialist' : 'Pelanggan Clean & Nail'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Global Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-1.5 animate-fadeIn">
            <Check size={14} /> {successToast}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: MAIN COMPREHENSIVE HUB                           */}
        {/* ======================================================== */}
        {currentView === 'main' && (
          <>
            {/* User Card Profile Summary */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-br from-pink-50/50 via-white to-rose-50/30">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-sm bg-white p-0.5">
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-slate-900 truncate">{userName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      {isEmployee ? 'Mitra' : 'Customer'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{userEmail}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{userPhone}</p>
                </div>
                <button
                  onClick={() => setCurrentView('edit_profile')}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Edit2 size={12} /> Edit
                </button>
              </div>

              {/* Quick Summary Chips */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-200/60 text-center">
                {isCustomer ? (
                  <>
                    <div
                      onClick={() => setCurrentView('addresses')}
                      className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs cursor-pointer hover:border-primary/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-900 block">{addressesCount} Alamat</span>
                      <span className="text-[10px] text-primary font-medium">Kelola &rarr;</span>
                    </div>
                    <Link
                      href="/customer/orders"
                      onClick={onClose}
                      className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs hover:border-primary/40 transition-colors block"
                    >
                      <span className="text-xs font-bold text-slate-900 block">{totalOrders} Pesanan</span>
                      <span className="text-[10px] text-primary font-medium">Lihat &rarr;</span>
                    </Link>
                    <div className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs">
                      <span className="text-xs font-bold text-emerald-600 block">Aktif</span>
                      <span className="text-[10px] text-slate-400">Status Akun</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs">
                      <span className="text-xs font-bold text-amber-600 block">⭐ {employee?.rating || 4.9}</span>
                      <span className="text-[10px] text-slate-400">Rating Mitra</span>
                    </div>
                    <Link
                      href="/employee/history"
                      onClick={onClose}
                      className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs block hover:border-primary/40"
                    >
                      <span className="text-xs font-bold text-slate-900 block">{employee?.totalJobs || 184} Jobs</span>
                      <span className="text-[10px] text-primary font-medium">Histori &rarr;</span>
                    </Link>
                    <div className="p-2 rounded-xl bg-white/80 border border-slate-100 shadow-xs">
                      <span className="text-xs font-bold text-emerald-600 block">100% Gross</span>
                      <span className="text-[10px] text-slate-400">Penerimaan</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-slate-100 px-4 pt-2 bg-white">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
                  activeTab === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Menu &amp; Fitur Akun
                {activeTab === 'profile' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
                  activeTab === 'settings' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Pengaturan Umum
                {activeTab === 'settings' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-[46vh]">
              {activeTab === 'profile' && (
                <div className="space-y-3">
                  {/* Customer Links */}
                  {isCustomer ? (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        Aktivitas &amp; Alamat
                      </span>

                      {/* Manage Addresses inside modal */}
                      <button
                        type="button"
                        onClick={() => setCurrentView('addresses')}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                            <MapPin size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Kelola Alamat Tersimpan</h4>
                            <p className="text-[10px] text-slate-400">
                              {addressesCount} alamat tersimpan untuk booking cleaning
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-400" />
                      </button>

                      {/* Order History */}
                      <Link
                        href="/customer/orders"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Clock size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Riwayat Pesanan Saya</h4>
                            <p className="text-[10px] text-slate-400">Semua pesanan cleaning &amp; produk nail art</p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-400" />
                      </Link>

                      {/* Cart Shortcut */}
                      <Link
                        href="/customer/checkout"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <ShoppingBag size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Keranjang Belanja Nail Art</h4>
                            <p className="text-[10px] text-slate-400">Checkout perlengkapan &amp; aksesoris kuku</p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-400" />
                      </Link>
                    </div>
                  ) : (
                    /* Employee Links */
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        Menu Finansial &amp; Pekerjaan
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentView('employee_payment')}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                            <CreditCard size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Rekening Penerimaan 100%</h4>
                            <p className="text-[10px] text-slate-400">
                              {employee?.paymentProfile?.bankName || 'BCA'} - {employee?.paymentProfile?.bankAccountNumber || '5210984421'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-400" />
                      </button>

                      <Link
                        href="/employee/history"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Clock size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Settlement Bulanan (3%)</h4>
                            <p className="text-[10px] text-slate-400">Kewajiban setoran bagi hasil ke platform</p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-slate-400" />
                      </Link>
                    </div>
                  )}

                  {/* Quick Role Switcher Box */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 block mb-2">
                      Ganti Akun Demo Instan
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSwitchRole('customer')}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCustomer
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <ShoppingBag size={14} className="mx-auto mb-1" />
                        <span className="text-[11px] block">Customer</span>
                      </button>
                      <button
                        onClick={() => handleSwitchRole('employee')}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isEmployee
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <Briefcase size={14} className="mx-auto mb-1" />
                        <span className="text-[11px] block">Employee</span>
                      </button>
                      <button
                        onClick={() => handleSwitchRole('admin')}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-center transition-all"
                      >
                        <Sliders size={14} className="mx-auto mb-1 text-slate-500" />
                        <span className="text-[11px] block">Admin Web</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-3">
                  {/* Notification Toggle */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Bell size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Notifikasi Pesanan &amp; Promo</h4>
                        <p className="text-[10px] text-slate-400">Pemberitahuan update status order real-time</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        notificationsEnabled ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* PWA Mobile Mode Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone size={15} className="text-primary" />
                        <h4 className="text-xs font-bold text-slate-800">Mode Aplikasi HP (PWA)</h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Siap Diinstal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Aplikasi ini dapat langsung dipasang ke layar utama HP Anda dengan tampilan layar penuh tanpa browser bar.
                    </p>
                  </div>

                  {/* Security & System Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-800">Keamanan &amp; Arsitektur</h4>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p className="flex justify-between">
                        <span>Platform:</span>
                        <strong className="text-slate-700">Home Cleaning &amp; Nail Art (V2)</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Model Komisi:</span>
                        <strong className="text-slate-700">100% Gross ke Mitra</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Settlement Platform:</span>
                        <strong className="text-slate-700">3% Bulanan</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut size={14} /> Keluar dari Akun (Logout)
              </button>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: EDIT PROFILE INLINE FORM                         */}
        {/* ======================================================== */}
        {currentView === 'edit_profile' && (
          <form onSubmit={handleSaveProfile} className="p-5 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentView('main')}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: ADDRESSES MANAGER                                */}
        {/* ======================================================== */}
        {currentView === 'addresses' && (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Daftar Alamat ({addresses.length}/3)</span>
              {!isAddingAddress && addresses.length < 3 && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Tambah Alamat
                </button>
              )}
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddNewAddress} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tambah Alamat Baru</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex gap-2">
                  {(['home', 'office', 'other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddressLabel(lbl)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-colors ${
                        newAddressLabel === lbl
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {lbl === 'home' ? 'Rumah' : lbl === 'office' ? 'Kantor' : 'Lainnya'}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={2}
                  value={newAddressDetail}
                  onChange={(e) => setNewAddressDetail(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Simpan Alamat
                </button>
              </form>
            )}

            {/* Address List */}
            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    addr.isDefault
                      ? 'border-primary/40 bg-pink-50/30 ring-1 ring-primary/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                        {addr.label === 'home' ? 'Rumah' : addr.label === 'office' ? 'Kantor' : 'Lainnya'}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          Alamat Utama
                        </span>
                      )}
                    </div>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr)}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Jadikan Utama
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-snug mt-1">{addr.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: EMPLOYEE PAYMENT REKENING INFO                   */}
        {/* ======================================================== */}
        {currentView === 'employee_payment' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CreditCard size={16} className="text-emerald-700" /> Penerimaan Pembayaran 100% Gross
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Setiap pembayaran dari customer disalurkan 100% ke rekening pribadi mitra tanpa potongan di depan.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nama Bank:</span>
                <strong className="text-slate-900">{employee?.paymentProfile?.bankName || 'BCA'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nomor Rekening:</span>
                <strong className="text-slate-900 font-mono">{employee?.paymentProfile?.bankAccountNumber || '5210984421'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Atas Nama:</span>
                <strong className="text-slate-900">{employee?.paymentProfile?.bankAccountName || userName}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status QRIS Mitra:</span>
                <strong className="text-emerald-700 font-bold">Terverifikasi Aktif ✓</strong>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('main')}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
