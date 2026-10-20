'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  Briefcase,
  LayoutDashboard,
  Check,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Percent,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { seedCustomers, seedEmployees } from '@/lib/seed';

const ROLE_DOCS = [
  {
    role: 'Customer',
    icon: ShoppingBag,
    tile: 'bg-pink-500/10 text-pink-600',
    description: 'Pesan Home Cleaning & Belanja Produk Nail Art',
    points: [
      'Kalkulasi harga cleaning otomatis m² & jarak radius',
      'Pesan Sekarang atau Jadwalkan slot waktu',
      'Live tracking perjalanan karyawan secara realtime di map',
      'Bayar langsung ke karyawan (Cash/QRIS/Transfer)',
      'Belanja katalog Nail Art dengan varian & kontrol stok',
    ],
  },
  {
    role: 'Employee',
    icon: Briefcase,
    tile: 'bg-emerald-500/10 text-emerald-600',
    description: 'Home Cleaning Partner (100% Gross Revenue)',
    points: [
      'Order broadcast & claim instan ("First Valid Claim Wins")',
      'Update status perjalanan ➔ Tiba ➔ In Service ➔ Selesai',
      'Wajib upload bukti foto Before & After + checklist',
      'Terima pembayaran customer langsung ke rekening/QRIS sendiri',
      'Dashboard pendapatan & kewajiban setoran bulanan (3%)',
    ],
  },
  {
    role: 'Administrator',
    icon: LayoutDashboard,
    tile: 'bg-blue-500/10 text-blue-600',
    description: 'Pusat Kontrol Bisnis & Monitoring Operasional',
    points: [
      'Monitoring realtime live map karyawan & order aktif',
      'Konfigurasi Pricing Engine (range m², free KM, rate/km)',
      'Manajemen karyawan, verifikasi rekening/QRIS & skill',
      'Monitoring settlement 3%, adjustment setoran & audit log',
      'Katalog e-commerce Nail Art & pencegahan stok minus',
    ],
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'employee' | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const login = useAppStore((state) => state.login);

  const loginAdmin = () => {
    login({
      id: 'admin1',
      name: 'Business Owner & Admin',
      email: 'admin@cleanandnail.com',
      phone: '081299998888',
      role: 'admin',
      createdAt: new Date(),
    });
    router.push('/admin');
  };

  const handleLogin = () => {
    let user: any = null;
    if (role === 'customer') {
      user = seedCustomers.find((c) => c.id === selectedUser);
    } else if (role === 'employee') {
      user = seedEmployees.find((e) => e.id === selectedUser);
    }

    if (user) {
      login(user);
      router.push(role === 'customer' ? '/customer' : '/employee');
    }
  };

  // User Selection Sub-Screen
  if (role) {
    const users = role === 'customer' ? seedCustomers : seedEmployees;
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-6 shadow-md max-w-md w-full border border-border">
          <button
            onClick={() => {
              setRole(null);
              setSelectedUser(null);
            }}
            className="text-xs text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1 font-medium"
          >
            ← Kembali ke Pilihan Role
          </button>

          <h2 className="text-xl font-bold font-serif text-text-primary mb-1">
            Pilih Akun {role === 'customer' ? 'Customer' : 'Employee Cleaning'}
          </h2>
          <p className="text-xs text-text-secondary mb-5">
            Pilih salah satu profil demo untuk langsung masuk ke aplikasi.
          </p>

          <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
            {users.map((u: any) => {
              const isSelected = selectedUser === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-border hover:border-border-primary bg-white'
                  }`}
                >
                  <img
                    src={u.photo}
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-text-primary truncate">
                        {u.name}
                      </p>
                      {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
                    </div>
                    {role === 'customer' ? (
                      <p className="text-xs text-text-secondary truncate mt-0.5">
                        {u.addresses?.[0]?.detail.substring(0, 36)}...
                      </p>
                    ) : (
                      <div className="mt-0.5">
                        <p className="text-xs text-emerald-600 font-medium">
                          {u.skills?.slice(0, 2).join(', ')}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Rekening: {u.paymentProfile?.bankName} ({u.paymentProfile?.bankAccountName})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            Masuk Sekarang <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-3">
            <Sparkles size={14} /> Platform PRD V2 Production Ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">
            Home Cleaning &amp; Nail Art Commerce
          </h1>
          <p className="text-sm text-text-secondary mt-2 max-w-xl mx-auto">
            Sistem terintegrasi untuk pemesanan cleaning on-demand, tracking live perjalanan, pembayaran langsung ke karyawan, setoran bulanan, dan e-commerce produk Nail Art.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ROLE_DOCS.map((doc) => {
            const Icon = doc.icon;
            const isCust = doc.role === 'Customer';
            const isEmp = doc.role === 'Employee';
            return (
              <div
                key={doc.role}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-xl ${doc.tile}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-text-primary">{doc.role}</h3>
                      <p className="text-[11px] text-text-muted">{doc.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 my-4">
                    {doc.points.map((pt, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  {isCust && (
                    <button
                      onClick={() => setRole('customer')}
                      className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5"
                    >
                      Buka Customer App <ArrowRight size={14} />
                    </button>
                  )}
                  {isEmp && (
                    <button
                      onClick={() => setRole('employee')}
                      className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      Buka Employee App <ArrowRight size={14} />
                    </button>
                  )}
                  {!isCust && !isEmp && (
                    <button
                      onClick={loginAdmin}
                      className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      Buka Admin Web <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights bar */}
        <div className="bg-white rounded-2xl p-5 border border-border flex flex-wrap items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span><strong>Atomic Order Claim:</strong> Mencegah rebutan order ganda</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-primary" />
            <span><strong>100% Gross Revenue:</strong> Pembayaran langsung ke karyawan</span>
          </div>
          <div className="flex items-center gap-2">
            <Percent size={18} className="text-accent" />
            <span><strong>Monthly Settlement 3%:</strong> Setoran otomatis tercatat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
