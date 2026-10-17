'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Briefcase,
  LayoutDashboard,
  AlertTriangle,
  Check,
  PlayCircle,
  Sparkles,
  Lock,
  Clock,
  Users,
  Package,
  Ticket,
  BarChart3,
  Zap,
  Smartphone,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { seedCustomers, seedEmployees } from '@/lib/seed';

const ROLE_DOCS = [
  {
    role: 'Customer',
    icon: ShoppingBag,
    tile: 'bg-primary/10 text-primary',
    points: [
      'Katalog layanan (dengan varian) & produk',
      'Keranjang, checkout, alamat pengiriman',
      'Lacak status pesanan secara real-time',
      'Promo, bundle, wishlist',
    ],
  },
  {
    role: 'Employee',
    icon: Briefcase,
    tile: 'bg-accent/10 text-accent',
    points: [
      'Lihat daftar order yang tersedia',
      'Ambil order — siapa cepat dia dapat',
      'Kelola order aktif sampai selesai',
      'Komisi otomatis 20% per order',
    ],
  },
  {
    role: 'Administrator',
    icon: LayoutDashboard,
    tile: 'bg-text-primary/10 text-text-primary',
    points: [
      'Dashboard KPI & aktivitas order',
      'Kelola customer, karyawan, layanan, produk, promo',
      'Pantau & filter semua order',
      'Laporan penjualan',
      'Khusus role admin, silahkan akses dari laptop untuk pengalaman yang lebih baik',
    ],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'employee' | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const login = useAppStore((state) => state.login);

  const loginAdmin = () => {
    login({
      id: 'admin1',
      name: 'Administrator',
      email: 'admin@salon.com',
      phone: '0812999999',
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

  // ---------- User selection screen ----------
  if (role) {
    const users = role === 'customer' ? seedCustomers : seedEmployees;
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-card rounded-lg p-8 shadow-md max-w-md w-full border border-border-primary">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-1">
            {role === 'customer' ? 'Pilih Akun Customer' : 'Pilih Akun Karyawan'}
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Ini data dummy — pilih salah satu untuk masuk.
          </p>

          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full p-3 rounded-sm text-left transition-colors duration-base ${
                  selectedUser === user.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-bg-alt text-text-primary hover:bg-primary/10'
                }`}
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>{user.name}</span>
                  {selectedUser === user.id && <Check size={16} />}
                </div>
                <div className="text-xs opacity-75">{user.phone}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setRole(null);
                setSelectedUser(null);
              }}
              className="flex-1 py-3 px-4 bg-bg-alt text-text-primary rounded-sm font-semibold hover:bg-primary/10 transition-colors duration-base"
            >
              Kembali
            </button>
            <button
              onClick={handleLogin}
              disabled={!selectedUser}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-sm font-semibold hover:bg-primary-dark transition-colors duration-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Landing + documentation screen ----------
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="min-h-screen flex justify-center p-4 py-8">
        <div className="w-full max-w-3xl space-y-4">
          {/* Hero + Demo notice */}
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-md border border-border-primary">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-text-primary">Salon &amp; Beauty</h1>
                <p className="text-sm text-text-secondary">Home Service Beauty &amp; Commerce Platform</p>
              </div>
            </div>

            {/* Demo notice */}
            <div className="mt-5 bg-warning/10 border border-warning/20 rounded-md p-4">
              <div className="flex items-center gap-2 text-warning font-bold text-sm">
                <AlertTriangle size={18} />
                Ini Versi DEMO — bukan aplikasi produksi
              </div>
              <ul className="mt-2 text-sm text-text-secondary space-y-1">
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-warning" />
                  Semua data hanya <strong>contoh (dummy)</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-warning" />
                  <span>
                    <strong>Tidak ada pembayaran asli</strong> — tidak ada uang sungguhan yang
                    berpindah.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-warning" />
                  Data tersimpan di <strong>browser kamu (localStorage)</strong> dan bisa direset
                  kapan saja.
                </li>
              </ul>
              <p className="mt-3 text-xs text-text-muted">
                Tujuan halaman ini: memperagakan <strong>alur &amp; fitur</strong>, bukan tampilan
                akhir.
              </p>
            </div>

            {/* Role quick login */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-text-primary mb-3">Masuk sebagai:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setRole('customer')}
                  className="flex items-center gap-3 py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors duration-base"
                >
                  <ShoppingBag size={18} />
                  <span className="text-left leading-tight">
                    Customer
                    <span className="block text-[11px] font-normal opacity-90">lihat / pesan</span>
                  </span>
                </button>
                <button
                  onClick={() => setRole('employee')}
                  className="flex items-center gap-3 py-3 px-4 bg-accent text-white rounded-md font-semibold hover:bg-accent-light transition-colors duration-base"
                >
                  <Briefcase size={18} />
                  <span className="text-left leading-tight">
                    Employee
                    <span className="block text-[11px] font-normal opacity-90">ambil order</span>
                  </span>
                </button>
                <button
                  onClick={loginAdmin}
                  className="flex items-center gap-3 py-3 px-4 bg-text-primary text-white rounded-md font-semibold hover:opacity-90 transition-opacity duration-base"
                >
                  <LayoutDashboard size={18} />
                  <span className="text-left leading-tight">
                    Administrator
                    <span className="block text-[11px] font-normal opacity-90">langsung masuk</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Key feature highlight */}
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-md border border-border-primary">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-primary" />
              <h2 className="text-lg font-serif font-bold text-text-primary">Fitur Utama yang Bisa Dicoba</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROLE_DOCS.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.role} className="rounded-md border border-border-primary bg-bg-alt p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-sm ${doc.tile} flex items-center justify-center`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-text-primary">{doc.role}</span>
                    </div>
                    <ul className="space-y-2">
                      {doc.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                          <Check size={15} className="mt-0.5 text-primary flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Signature feature */}
            <div className="mt-4 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-md p-4">
              <Zap size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="font-bold text-text-primary">Sistem Ambil Order Anti-Bentrok</p>
                <p className="mt-0.5">
                  Saat beberapa karyawan menekan &quot;Ambil Order&quot; pada order yang sama,
                  hanya <strong>satu</strong> yang berhasil — karyawan lain langsung melihat pesan
                  &quot;sudah diambil&quot;. (first-come, first-served)
                </p>
              </div>
            </div>
          </div>

          {/* How to try */}
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-md border border-border-primary">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle size={20} className="text-primary" />
              <h2 className="text-lg font-serif font-bold text-text-primary">Cara Mencoba (1 menit)</h2>
            </div>
            <ol className="space-y-3">
              {[
                {
                  icon: ShoppingBag,
                  title: 'Masuk sebagai Customer',
                  desc: 'Pesan satu layanan hingga checkout.',
                },
                {
                  icon: Briefcase,
                  title: 'Masuk sebagai Employee (tab/browser lain)',
                  desc: 'Buka menu order tersedia, lalu klik "Ambil Order".',
                },
                {
                  icon: BarChart3,
                  title: 'Masuk sebagai Admin',
                  desc: 'Lihat order & data ter-update di dashboard.',
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary flex items-center gap-1.5 text-sm">
                        <Icon size={15} className="text-text-muted" />
                        {step.title}
                      </p>
                      <p className="text-sm text-text-secondary">{step.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
              <Smartphone size={14} />
              Tips: buka Customer &amp; Employee di <strong>dua tab/jendela berbeda</strong> untuk
              melihat data tersinkron antar tab.
            </div>
          </div>

          {/* Small stats strip to build confidence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Users, label: '10+ Customer', sub: 'data contoh' },
              { icon: Briefcase, label: '8 Karyawan', sub: 'siap diuji' },
              { icon: Package, label: '12 Layanan', sub: '+ 20 produk' },
              { icon: Ticket, label: '6 Promo', sub: '+ 4 bundle' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-card rounded-md p-3 shadow-sm border border-border-primary flex items-center gap-2"
                >
                  <Icon size={18} className="text-primary flex-shrink-0" />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-text-primary">{s.label}</p>
                    <p className="text-[11px] text-text-muted">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 text-text-muted text-xs py-2">
            <Lock size={13} />
            Demo Version • Tidak ada pembayaran asli • Data dummy
            <Clock size={13} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
