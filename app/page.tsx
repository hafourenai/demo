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
    color: 'from-pink-500 to-pink-600',
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
    color: 'from-purple-500 to-purple-600',
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
    color: 'from-gray-700 to-gray-900',
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
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {role === 'customer' ? 'Pilih Akun Customer' : 'Pilih Akun Karyawan'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Ini data dummy — pilih salah satu untuk masuk.
          </p>

          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full p-3 rounded-lg text-left transition ${
                  selectedUser === user.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Kembali
            </button>
            <button
              onClick={handleLogin}
              disabled={!selectedUser}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="min-h-screen flex justify-center p-4 py-8">
        <div className="w-full max-w-3xl space-y-4">
          {/* Hero + Demo notice */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Salon &amp; Beauty</h1>
                <p className="text-sm text-gray-600">Home Service Beauty &amp; Commerce Platform</p>
              </div>
            </div>

            {/* Demo notice */}
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle size={18} />
                Ini Versi DEMO — bukan aplikasi produksi
              </div>
              <ul className="mt-2 text-sm text-amber-800/90 space-y-1">
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0" />
                  Semua data hanya <strong>contoh (dummy)</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Tidak ada pembayaran asli</strong> — tidak ada uang sungguhan yang
                    berpindah.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 flex-shrink-0" />
                  Data tersimpan di <strong>browser kamu (localStorage)</strong> dan bisa direset
                  kapan saja.
                </li>
              </ul>
              <p className="mt-3 text-xs text-amber-700/90">
                Tujuan halaman ini: memperagakan <strong>alur &amp; fitur</strong>, bukan tampilan
                akhir.
              </p>
            </div>

            {/* Role quick login */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Masuk sebagai:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setRole('customer')}
                  className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <ShoppingBag size={18} />
                  <span className="text-left leading-tight">
                    Customer
                    <span className="block text-[11px] font-normal opacity-90">lihat / pesan</span>
                  </span>
                </button>
                <button
                  onClick={() => setRole('employee')}
                  className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-secondary to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <Briefcase size={18} />
                  <span className="text-left leading-tight">
                    Employee
                    <span className="block text-[11px] font-normal opacity-90">ambil order</span>
                  </span>
                </button>
                <button
                  onClick={loginAdmin}
                  className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold hover:shadow-lg transition"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-gray-800">Fitur Utama yang Bisa Dicoba</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROLE_DOCS.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.role} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${doc.color} flex items-center justify-center`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <span className="font-bold text-gray-800">{doc.role}</span>
                    </div>
                    <ul className="space-y-2">
                      {doc.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
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
            <div className="mt-4 flex items-start gap-3 bg-pink-50 border border-pink-100 rounded-2xl p-4">
              <Zap size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-gray-800">Sistem Ambil Order Anti-Bentrok</p>
                <p className="mt-0.5">
                  Saat beberapa karyawan menekan &quot;Ambil Order&quot; pada order yang sama,
                  hanya <strong>satu</strong> yang berhasil — karyawan lain langsung melihat pesan
                  &quot;sudah diambil&quot;. (first-come, first-served)
                </p>
              </div>
            </div>
          </div>

          {/* How to try */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-gray-800">Cara Mencoba (1 menit)</h2>
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
                      <p className="font-semibold text-gray-800 flex items-center gap-1.5 text-sm">
                        <Icon size={15} className="text-gray-500" />
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
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
                  className="bg-white/90 backdrop-blur rounded-2xl p-3 shadow-lg flex items-center gap-2"
                >
                  <Icon size={18} className="text-primary flex-shrink-0" />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-gray-800">{s.label}</p>
                    <p className="text-[11px] text-gray-500">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 text-white/90 text-xs py-2">
            <Lock size={13} />
            Demo Version • Tidak ada pembayaran asli • Data dummy
            <Clock size={13} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
