# 💅 Salon & Beauty Home Service Commerce Platform

Aplikasi demo **mobile-first web** untuk platform salon berbasis home service dengan sistem realtime order management.

## 🎯 Fitur Utama

### Customer (Mobile App)
- ✅ Login dengan dummy credentials
- ✅ Dashboard dengan banner promo & layanan populer
- ✅ Katalog Layanan dengan variasi harga
- ✅ Mini E-commerce (Produk, Wishlist, Keranjang)
- ✅ Checkout dengan promo & multiple payment methods
- ✅ Order tracking realtime
- ✅ Manajemen alamat (max 3 alamat)
- ✅ Rating & review
- ✅ Order history

### Employee (Mobile App)
- ✅ Dashboard dengan statistik
- ✅ Order tersedia dengan atomic claiming (first-come, first-served)
- ✅ Order management (status updates)
- ✅ Komisi tracking (20% dari harga layanan)
- ✅ Rating & history pekerjaan
- ✅ Profile management

### Administrator (Desktop Dashboard)
- ✅ KPI Dashboard
- ✅ Customer management
- ✅ Employee management
- ✅ Service management
- ✅ Product management
- ✅ Promo management
- ✅ Order monitoring & filtering
- ✅ Reports & analytics

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Akses aplikasi: **http://localhost:3000**

## 🔐 Demo Credentials

### Customer
Pilih dari 10+ dummy customers (nama & nomor telepon ditampilkan di login screen)

### Employee
Pilih dari 8 dummy employees (Hair Stylist, Nail Artist, Makeup Artist, Beautician)

### Administrator
Username: Admin (otomatis tersedia)

## 📱 Routes

### Customer App
- `/` - Login
- `/customer` - Dashboard
- `/customer/services` - Layanan
- `/customer/products` - Produk
- `/customer/checkout` - Checkout
- `/customer/orders` - History pesanan
- `/customer/orders/[id]` - Detail order
- `/customer/account` - Profile & alamat

### Employee App
- `/employee` - Dashboard
- `/employee/available` - Order tersedia
- `/employee/active` - Order aktif
- `/employee/history` - Riwayat
- `/employee/account` - Profile

### Admin Dashboard
- `/admin` - Dashboard KPI
- `/admin/customers` - Kelola customer
- `/admin/employees` - Kelola karyawan
- `/admin/services` - Kelola layanan
- `/admin/products` - Kelola produk
- `/admin/promos` - Kelola promo
- `/admin/orders` - Monitoring order
- `/admin/reports` - Laporan & analytics
- `/admin/settings` - Pengaturan

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (dengan localStorage persistence)
- **Icons**: Lucide React
- **Utilities**: date-fns, axios

## 💾 Data Storage

- **Demo Mode**: LocalStorage (Zustand persist)
- **Seed Data**: 8 employees, 12 services, 20 products, 6 promos, 4 bundles
- **No Database Required**: Semua data in-memory dengan persistence

## 🔑 Key Features Implementation

### Atomic Order Claim
```typescript
// Hanya 1 karyawan yang bisa mengklaim 1 order
claimOrder(orderId: string, employeeId: string): boolean
// Return true jika berhasil, false jika sudah diambil orang lain
```

### Realtime Status Updates
- Status order berubah otomatis di customer view
- Komisi dihitung real-time
- Availability karyawan updated otomatis

### Mobile-First Design
- Full responsive layout
- Bottom navigation untuk customer & employee
- Card-based interface
- Modal & bottom sheet patterns
- Touch-friendly buttons & inputs

## 📊 Seed Data

### 8 Karyawan
- 3 Hair Stylist
- 2 Nail Artist
- 1 Makeup Artist
- 2 Beautician

### 12 Layanan
Hair Spa, Hair Cut, Hair Coloring, Hair Treatment, Facial, Manicure, Pedicure, Nail Art, Makeup, Eyelash Treatment, Creambath, Scalp Treatment

### 20 Produk
Hair care, skin care, makeup, nail care, beauty tools

### 6 Promo
- 20% discount (WELCOME20)
- Rp50K nominal (WEEKEND50)
- 15% product promo (BEAUTY15)
- 25% bundle discount (BUNDLE25)
- 30% flash sale (FLASH30)
- Rp40K referral (REFER40)

## 🎯 Acceptance Criteria Status

✅ Customer dapat login
✅ Customer dapat melihat layanan
✅ Customer dapat melihat produk
✅ Customer dapat menggunakan keranjang
✅ Customer dapat menyimpan alamat
✅ Customer dapat membuat booking
✅ Karyawan dapat melihat order
✅ Karyawan dapat mengambil order
✅ Hanya satu karyawan dapat mengambil satu order (atomic)
✅ Status order berubah secara realtime
✅ Customer dapat melihat karyawan
✅ Customer dapat membatalkan order
✅ Customer dapat memberikan rating
✅ Administrator dapat melihat seluruh order
✅ Administrator dapat mengelola layanan
✅ Administrator dapat mengelola produk
✅ Administrator dapat mengelola karyawan
✅ Tampilan customer responsif di smartphone
✅ Aplikasi dapat diakses melalui URL
✅ Demo mampu menunjukkan complete customer journey

## 📝 Notes

- Payment adalah simulasi (tidak ada transaksi nyata)
- OTP menggunakan mock/dummy
- GPS tracking adalah mock location
- Chat fitur ditampilkan sebagai "coming soon"
- Semua komisi dihitung otomatis (20% dari harga layanan)

## 🚢 Deployment

Siap untuk deploy ke **Vercel**:

```bash
# Push ke git
git add .
git commit -m "Initial salon app"
git push

# Deploy via Vercel CLI atau web UI
vercel
```

## 📞 Support

Untuk pertanyaan atau issues, silakan buka issue di repository.

---

**Version**: 1.0.0 | **Status**: MVP Demo Ready | **Last Updated**: 2026-10-17
