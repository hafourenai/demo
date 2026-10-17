# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Aplikasi Home Service Salon & Beauty Commerce

**Versi:** 1.0  
**Status:** Draft untuk Demo / MVP  
**Platform Demo:** Mobile-First Web Application  
**Deployment Rekomendasi:** Vercel  
**Target Device Utama:** Smartphone  
**Role Utama:** Customer, Karyawan, Administrator / Owner  

---

# 1. Product Overview

Aplikasi ini merupakan platform digital untuk layanan salon berbasis home service yang memungkinkan customer memesan layanan kecantikan ke rumah, membeli produk kecantikan, serta memantau status pesanan melalui satu aplikasi.

Selain melayani customer, aplikasi juga memiliki sistem operasional untuk karyawan salon. Ketika terdapat permintaan home service, sistem akan mendistribusikan informasi order secara realtime kepada karyawan yang memenuhi syarat berdasarkan jenis skill dan jarak.

Karyawan yang paling cepat mengambil order akan mendapatkan pekerjaan tersebut.

Administrator atau Owner memiliki akses ke dashboard khusus untuk melakukan monitoring terhadap customer, karyawan, produk, layanan, promo, transaksi, serta aktivitas operasional aplikasi.

Versi awal aplikasi dibuat sebagai **demo berbasis web yang dirancang mobile-first**, sehingga ketika diakses melalui smartphone memiliki tampilan dan pengalaman seperti aplikasi mobile.

---

# 2. Tujuan Produk

Tujuan utama produk adalah menyediakan satu platform yang mampu:

1. Mempermudah customer memesan layanan salon ke rumah.
2. Mempermudah customer membeli produk kecantikan.
3. Mempercepat proses distribusi order kepada karyawan.
4. Memberikan sistem monitoring kepada administrator.
5. Memberikan pengalaman pemesanan yang cepat dan sederhana.
6. Menyediakan sistem realtime untuk proses perebutan order karyawan.
7. Memberikan transparansi status pemesanan kepada customer.
8. Menjadi prototype atau demo awal sebelum dikembangkan menjadi aplikasi production.

---

# 3. Target User

Aplikasi memiliki tiga kelompok pengguna utama.

## 3.1 Customer

Customer merupakan pengguna utama aplikasi yang melakukan pemesanan layanan dan pembelian produk.

Customer dapat:

- Membuat akun.
- Login menggunakan nomor HP dan OTP.
- Login menggunakan akun Gmail.
- Mengatur profil.
- Menyimpan maksimal 3 alamat.
- Melihat layanan.
- Membeli produk.
- Menambahkan produk ke wishlist.
- Menambahkan produk ke keranjang.
- Memesan layanan home service.
- Memesan layanan sekarang.
- Menjadwalkan layanan.
- Membeli bundle layanan dan produk.
- Menggunakan promo.
- Melakukan pembayaran simulasi.
- Membatalkan pesanan.
- Melihat status order.
- Melihat informasi karyawan.
- Memberikan rating dan review.
- Melihat history transaksi.

---

# 4. User Roles

## 4.1 Customer

Customer merupakan pengguna yang menggunakan aplikasi untuk melakukan transaksi.

Hak akses utama:

- Mengakses dashboard customer.
- Mengelola profil.
- Mengelola alamat.
- Melihat layanan.
- Melihat produk.
- Melakukan pemesanan.
- Membatalkan pemesanan.
- Melakukan checkout.
- Menggunakan voucher.
- Melihat status pesanan.
- Memberikan review.

---

## 4.2 Karyawan

Karyawan merupakan pekerja salon yang dapat menerima order home service.

Karyawan tidak dapat melakukan registrasi secara mandiri.

Akun hanya dapat dibuat melalui administrator setelah calon karyawan melakukan proses pendaftaran atau verifikasi secara langsung melalui head office.

Karyawan memiliki:

- Nama.
- Nomor HP.
- Email.
- Foto profil.
- Role pekerjaan.
- Skill.
- Rating.
- Jumlah pekerjaan.
- History pekerjaan.
- Informasi komisi.

Contoh role karyawan:

- Hair Stylist.
- Nail Artist.
- Makeup Artist.
- Beautician.

Seorang karyawan dapat memiliki lebih dari satu skill.

---

## 4.3 Administrator / Owner

Administrator merupakan role dengan akses tertinggi.

Administrator dapat:

- Melihat seluruh aktivitas sistem.
- Mengelola customer.
- Mengelola karyawan.
- Membuat akun karyawan.
- Mengatur role karyawan.
- Mengatur skill karyawan.
- Mengatur layanan.
- Mengatur variasi layanan.
- Mengatur bundle.
- Mengelola produk.
- Mengatur stok.
- Mengatur promo.
- Mengelola order.
- Melihat komisi.
- Melihat laporan.
- Monitoring transaksi.
- Melihat statistik aplikasi.

---

# 5. Platform dan Interface

Aplikasi demo menggunakan dua jenis tampilan utama.

## 5.1 Customer dan Karyawan

Customer dan karyawan menggunakan interface **mobile-first**.

Contoh URL:

`app.domain.com`

Desain dibuat menyerupai aplikasi mobile dengan:

- Bottom navigation.
- Full-screen layout.
- Card interface.
- Bottom sheet.
- Modal.
- Toast notification.
- Skeleton loading.
- Status indicator.
- Responsive layout.

---

## 5.2 Administrator

Administrator menggunakan dashboard web desktop.

Contoh URL:

`admin.domain.com`

Dashboard administrator menggunakan sidebar navigation.

Menu utama:

- Dashboard.
- Customer.
- Karyawan.
- Layanan.
- Produk.
- Pesanan.
- Promo.
- Laporan.
- Pengaturan.

---

# 6. Navigasi Customer

Navigasi utama customer terdiri dari:

**Home | Layanan | Produk | Pesanan | Akun**

---

# 7. Dashboard Customer

Dashboard merupakan halaman pertama setelah customer login.

Dashboard menampilkan:

## 7.1 Header

- Foto profil.
- Nama customer.
- Lokasi aktif.
- Notification icon.

Contoh:

> Selamat pagi, Sarah  
> Rumah — Bogor

---

## 7.2 Search

Customer dapat mencari:

- Layanan.
- Produk.
- Kategori.

---

## 7.3 Banner Promo

Banner menampilkan promo aktif.

Contoh:

> Diskon 20% Home Service  
> Weekend Beauty Deal

---

## 7.4 Kategori Layanan

Contoh:

- Hair Care.
- Nail Care.
- Makeup.
- Facial.
- Treatment.

---

## 7.5 Layanan Paling Sering Dipesan

Menampilkan layanan populer berdasarkan data dummy demo.

---

## 7.6 Best Seller Product

Menampilkan produk yang paling banyak dibeli.

---

## 7.7 Bundle

Menampilkan paket layanan + produk.

Contoh:

**Hair Spa Package**

Hair Spa + Premium Hair Serum.

---

## 7.8 Order Aktif

Apabila customer memiliki order aktif, dashboard menampilkan informasi:

- Nama layanan.
- Nama karyawan.
- Status.
- Estimasi kedatangan.
- Tombol lihat detail.

Contoh:

> Hair Spa Home Service  
> Sarah sedang menuju lokasi Anda  
> Estimasi 12 menit

---

# 8. Authentication Customer

Customer dapat melakukan login menggunakan:

## 8.1 Nomor HP + OTP

Flow:

Nomor HP  
→ Kirim OTP  
→ Masukkan OTP  
→ Verifikasi  
→ Login berhasil

---

## 8.2 Google / Gmail

Customer dapat login menggunakan akun Google.

Untuk versi demo, autentikasi dapat menggunakan simulasi atau provider development.

---

# 9. Customer Profile

Informasi customer terdiri dari:

- Nama.
- Nomor HP.
- Email.
- Foto profil.

Customer dapat melakukan perubahan informasi profil.

---

# 10. Address Management

Customer dapat menyimpan maksimal **3 alamat**.

Setiap alamat memiliki:

- Label alamat.
- Nama penerima.
- Nomor HP.
- Detail alamat.
- Lokasi map.
- Pin lokasi.
- Catatan.

Label alamat:

- Rumah.
- Kantor.
- Lainnya.

Customer dapat:

- Menambahkan alamat.
- Mengedit alamat.
- Menghapus alamat.
- Menentukan alamat utama.

Customer juga dapat menggunakan:

**Gunakan Lokasi Saat Ini**

untuk menentukan lokasi melalui GPS.

---

# 11. Layanan

Halaman layanan menampilkan seluruh jenis treatment yang tersedia.

Setiap layanan memiliki:

- Nama.
- Foto.
- Deskripsi.
- Harga.
- Durasi.
- Kategori.
- Rating.
- Variasi layanan.
- Informasi home service.

Harga menggunakan sistem **fixed price**.

---

# 12. Variasi Layanan

Layanan dapat memiliki beberapa variasi.

Contoh:

## Hair Treatment

Short Hair  
Rp100.000

Medium Hair  
Rp125.000

Long Hair  
Rp150.000

---

# 13. Bundle

Bundle dapat terdiri dari:

**Layanan + Produk**

Contoh:

### Hair Recovery Package

Hair Spa  
+  
Hair Serum Premium

Harga normal:

Rp250.000

Harga bundle:

Rp210.000

---

# 14. Pemesanan Home Service

Customer memiliki dua metode pemesanan.

## 14.1 Pesan Sekarang

Customer meminta layanan dilakukan sesegera mungkin.

Flow:

Pilih layanan  
→ Pilih variasi  
→ Pesan sekarang  
→ Pilih alamat  
→ Checkout  
→ Pembayaran  
→ Mencari karyawan

---

## 14.2 Jadwalkan

Customer dapat memilih tanggal dan slot waktu.

Contoh slot:

09:00  
10:00  
11:00  
13:00  
14:00  
15:00  
16:00

Slot yang tidak tersedia akan ditampilkan dalam kondisi disabled.

---

# 15. Home Service Order Flow

Flow utama:

Customer memilih layanan  
→ Customer memilih variasi  
→ Pilih Pesan Sekarang / Jadwalkan  
→ Pilih alamat  
→ Customer melakukan checkout  
→ Customer memilih pembayaran  
→ Order dibuat  
→ Status menjadi **Menunggu Karyawan**  
→ Sistem mencari karyawan eligible  
→ Order dikirim ke karyawan  
→ Karyawan mengambil order  
→ Customer menerima informasi karyawan  
→ Karyawan menuju lokasi  
→ Karyawan tiba  
→ Layanan dikerjakan  
→ Layanan selesai  
→ Customer memberikan rating.

---

# 16. Status Order Layanan

Order memiliki status:

### Menunggu Karyawan

Belum ada karyawan yang mengambil pekerjaan.

### Diterima Karyawan

Order berhasil diambil oleh seorang karyawan.

### Menuju Lokasi

Karyawan sedang menuju lokasi customer.

### Tiba di Lokasi

Karyawan telah sampai.

### Sedang Dikerjakan

Layanan sedang dilakukan.

### Selesai

Layanan selesai.

### Dibatalkan Customer

Customer membatalkan pesanan.

### Dibatalkan Admin

Administrator membatalkan transaksi.

---

# 17. Sistem Pembatalan Customer

Customer dapat membatalkan order.

## Sebelum order diambil karyawan

Customer dapat langsung membatalkan order.

Tidak diperlukan persetujuan administrator.

---

## Setelah order diambil

Customer masih dapat membatalkan order tetapi wajib memilih alasan.

Contoh alasan:

- Salah memilih layanan.
- Salah alamat.
- Jadwal berubah.
- Menunggu terlalu lama.
- Lainnya.

---

# 18. Sistem Realtime Order Karyawan

Sistem order menggunakan konsep **first come, first served**.

Order akan didistribusikan kepada karyawan yang memenuhi persyaratan.

---

# 19. Kriteria Karyawan Eligible

Karyawan dianggap eligible apabila:

1. Skill sesuai dengan layanan.
2. Tidak sedang mengerjakan order lain.
3. Berada dalam radius pencarian.
4. Akun aktif.

---

# 20. Radius Pencarian Karyawan

Radius awal:

**5 KM**

Apabila tidak ada karyawan yang mengambil order dalam waktu tertentu, sistem dapat memperluas radius pencarian.

Contoh:

0–2 menit:

Radius 5 KM.

Setelah 2 menit:

Radius diperluas.

Order tetap aktif.

---

# 21. Alert Customer

Apabila proses pencarian membutuhkan waktu lebih lama:

> Karyawan kami sedang sibuk. Mohon maaf jika waktu tunggu sedikit lebih lama.

---

# 22. Sistem Perebutan Order

Semua karyawan eligible akan mendapatkan informasi order.

Contoh:

Karyawan A  
Karyawan B  
Karyawan C

Ketiganya melihat:

**ORDER BARU**

Service: Hair Spa  
Lokasi: 2.4 KM  
Harga: Rp150.000

Tombol:

**AMBIL ORDER**

---

# 23. Atomic Order Claim

Hanya satu karyawan dapat memenangkan order.

Flow:

Order Status:

`OPEN`

Karyawan A menekan Ambil Order.

Server melakukan claim.

Status:

`OPEN → ASSIGNED`

Apabila berhasil:

Karyawan A:

> Order berhasil diambil.

Karyawan lainnya:

> Maaf, order telah diambil karyawan lain.

Tombol **Ambil Order** otomatis hilang.

Backend wajib menggunakan atomic transaction / locking untuk mencegah dua karyawan mendapatkan order yang sama.

---

# 24. Availability Karyawan

Karyawan tidak memiliki tombol Online / Offline.

Availability dihitung secara otomatis oleh sistem.

Status:

### Available

Karyawan tidak memiliki order aktif.

### Busy

Karyawan sedang menangani order.

Administrator dapat melihat:

Total Karyawan: 8  
Available: 5  
Busy: 3

---

# 25. Dashboard Karyawan

Dashboard karyawan menampilkan:

- Order tersedia.
- Order aktif.
- Pekerjaan hari ini.
- Order selesai.
- Rating.
- Komisi.

Contoh:

Order Tersedia: 4  
Order Aktif: 1  
Selesai Hari Ini: 3  
Rating: 4.8  
Komisi Hari Ini: Rp180.000

---

# 26. Navigasi Karyawan

Bottom Navigation:

**Home | Order Tersedia | Order Saya | Riwayat | Akun**

---

# 27. Order Tersedia

Karyawan hanya melihat order yang sesuai dengan skill mereka.

Card order menampilkan:

- Nama layanan.
- Lokasi.
- Jarak.
- Harga.
- Estimasi durasi.
- Waktu order.
- Tombol Ambil Order.

---

# 28. Order Aktif Karyawan

Setelah mengambil order, karyawan dapat mengubah status:

Diterima  
→ Menuju Lokasi  
→ Tiba  
→ Sedang Dikerjakan  
→ Selesai

Setiap perubahan status dikirim secara realtime ke customer.

---

# 29. Profil Karyawan

Customer dapat melihat profil karyawan setelah order diterima.

Profil menampilkan:

- Foto.
- Nama.
- Role.
- Skill.
- Rating.
- Jumlah pekerjaan.
- Review customer.

Contoh:

**Sarah Amelia**

Hair Stylist

Skill:

Hair Spa  
Hair Coloring  
Hair Treatment

Rating:

⭐ 4.9

137 pekerjaan selesai.

---

# 30. Rating Karyawan

Setelah layanan selesai, customer dapat memberikan:

Rating:

1–5 bintang.

Review:

Teks komentar.

Contoh:

> Pelayanannya ramah dan hasil hair treatment sangat bagus.

Rating tersebut menjadi bagian dari profil karyawan.

---

# 31. Komisi Karyawan

Karyawan memperoleh komisi dari setiap layanan.

Untuk demo:

Komisi default dapat menggunakan simulasi **20% dari nilai layanan**.

Contoh:

Nilai layanan:

Rp200.000

Komisi:

Rp40.000

Karyawan dapat melihat:

- Komisi hari ini.
- Komisi minggu ini.
- Riwayat komisi.

---

# 32. Produk

Halaman produk merupakan mini e-commerce.

Customer dapat:

- Melihat produk.
- Mencari produk.
- Melihat detail.
- Memilih jumlah.
- Wishlist.
- Keranjang.
- Checkout.
- Menggunakan promo.
- Review.

---

# 33. Informasi Produk

Setiap produk memiliki:

- Nama.
- Foto.
- Harga.
- Harga promo.
- Stok.
- Kategori.
- Deskripsi.
- Rating.
- Review.
- Status Best Seller.

---

# 34. Kategori Produk

Contoh:

- Hair Care.
- Skin Care.
- Nail Care.
- Makeup.
- Beauty Tools.

---

# 35. Wishlist

Customer dapat menyimpan produk ke wishlist.

Customer dapat:

- Menambahkan wishlist.
- Menghapus wishlist.
- Memindahkan produk ke keranjang.

---

# 36. Keranjang

Keranjang wajib tersedia sebelum proses checkout.

Customer dapat:

- Menambahkan produk.
- Mengurangi produk.
- Menambah kuantitas.
- Mengurangi kuantitas.
- Menghapus item.
- Menggunakan promo.
- Melihat subtotal.

---

# 37. Stok Produk

Setiap produk memiliki stok.

Apabila stok:

`0`

maka produk memiliki status:

**Habis**

Tombol tambah ke keranjang menjadi disabled.

---

# 38. Checkout Produk

Flow:

Produk  
→ Detail Produk  
→ Tambah Keranjang  
→ Keranjang  
→ Checkout  
→ Pilih alamat  
→ Pilih promo  
→ Pilih pembayaran  
→ Konfirmasi  
→ Order berhasil

---

# 39. Delivery Produk

Untuk demo, proses pengiriman hanya menggunakan status sederhana.

Tidak terdapat integrasi dengan kurir pihak ketiga.

Status dapat berupa:

Diproses  
→ Dalam Pengiriman  
→ Selesai

---

# 40. Combined Order

Customer dapat melakukan checkout gabungan:

**Layanan + Produk**

Contoh:

Hair Spa  
+  
Hair Serum.

Customer melihat satu transaksi.

Namun sistem menyimpan dua fulfillment:

### Layanan

Status:

Sedang Dikerjakan.

### Produk

Status:

Dalam Pengiriman.

---

# 41. Promo

Sistem mendukung tiga jenis promo.

## Percentage Discount

Contoh:

20% OFF.

---

## Nominal Discount

Contoh:

Potongan Rp25.000.

---

## Voucher Code

Contoh:

`BEAUTY20`

---

# 42. Promo Rules

Promo dapat memiliki:

- Nama.
- Kode.
- Jenis.
- Nominal.
- Minimal transaksi.
- Masa berlaku.
- Produk tertentu.
- Layanan tertentu.
- Bundle tertentu.

---

# 43. Pembayaran

Pembayaran pada versi demo bersifat simulasi.

Metode:

- Cash.
- Transfer / Virtual Account.
- QRIS.

Tidak terdapat transaksi uang nyata.

---

# 44. Payment Simulation

Contoh:

Customer memilih QRIS.

Aplikasi menampilkan QR dummy.

Customer menekan:

**Simulasikan Pembayaran Berhasil**

Status:

Payment Success.

---

# 45. History Customer

Halaman Pesanan memiliki dua tab utama.

## Berjalan

Menampilkan transaksi aktif.

---

## Sudah Selesai

Menampilkan transaksi yang telah selesai.

---

Setiap card memiliki label:

**LAYANAN**

**PRODUK**

**BUNDLE**

---

# 46. Chat Customer dan Karyawan

Chat ditampilkan sebagai bagian dari konsep produk.

Namun untuk versi demo fitur chat tidak diaktifkan secara penuh.

Ketika customer membuka fitur:

> Fitur chat belum tersedia pada versi demo.

Hal ini bertujuan menunjukkan bahwa chat merupakan bagian dari product roadmap.

---

# 47. Dashboard Administrator

Administrator memiliki dashboard desktop.

Dashboard menampilkan KPI:

- Total Customer.
- Total Karyawan.
- Karyawan Available.
- Karyawan Busy.
- Order Hari Ini.
- Order Berlangsung.
- Penjualan Produk.
- Pendapatan Hari Ini.

---

# 48. Customer Management

Administrator dapat melihat:

- Nama.
- Nomor HP.
- Email.
- Tanggal registrasi.

Administrator hanya membutuhkan informasi umum customer.

---

# 49. Employee Management

Administrator dapat:

- Membuat akun karyawan.
- Mengedit akun.
- Menonaktifkan akun.
- Mengatur role.
- Mengatur skill.
- Melihat rating.
- Melihat jumlah pekerjaan.
- Melihat komisi.

---

# 50. Service Management

Administrator dapat:

- Membuat layanan.
- Mengedit layanan.
- Menghapus layanan.
- Mengatur harga.
- Mengatur kategori.
- Mengatur variasi.
- Mengatur durasi.
- Mengatur status layanan.

---

# 51. Bundle Management

Administrator dapat:

- Membuat bundle.
- Memilih layanan.
- Memilih produk.
- Mengatur harga.
- Mengatur promo.

---

# 52. Product Management

Administrator dapat:

- Menambahkan produk.
- Mengubah produk.
- Menghapus produk.
- Mengatur kategori.
- Mengatur harga.
- Mengatur stok.
- Mengatur promo.
- Menentukan Best Seller.

---

# 53. Order Management

Administrator dapat melihat seluruh order.

Filter berdasarkan:

- Status.
- Customer.
- Karyawan.
- Tanggal.
- Layanan.
- Produk.

Administrator juga dapat:

- Membatalkan order.
- Melihat detail.
- Melakukan intervensi apabila order terlalu lama menunggu.

---

# 54. Promo Management

Administrator dapat:

- Membuat promo.
- Mengubah promo.
- Menonaktifkan promo.
- Mengatur periode promo.

---

# 55. Laporan

Untuk versi demo, laporan dibuat sederhana.

Contoh:

- Order harian.
- Penjualan produk.
- Pendapatan.
- Layanan populer.
- Produk best seller.
- Karyawan dengan rating tertinggi.

---

# 56. Notification

Customer dapat menerima notifikasi:

- Order berhasil dibuat.
- Karyawan ditemukan.
- Karyawan menuju lokasi.
- Karyawan tiba.
- Layanan selesai.
- Produk dikirim.
- Promo baru.

Karyawan dapat menerima:

- Order baru.
- Order berhasil diambil.
- Order diambil karyawan lain.

---

# 57. Realtime Requirement

Beberapa bagian sistem harus menggunakan komunikasi realtime.

Terutama:

- Order baru.
- Claim order.
- Status order.
- Perubahan ketersediaan karyawan.
- Notification.

Teknologi yang dapat digunakan:

- WebSocket.
- Supabase Realtime.
- Firebase.
- Socket.io.

Pemilihan teknologi final disesuaikan dengan backend yang digunakan.

---

# 58. Performance Requirement

Karena terdapat sistem perebutan order, response claim harus dibuat secepat mungkin.

Target demo:

- Response UI cepat.
- Event realtime diterima tanpa refresh.
- Tombol order hilang segera setelah order diambil.
- Backend mencegah duplicate claim.

---

# 59. Security Requirement

Sistem wajib memiliki:

- Authentication.
- Role-based access control.
- Session management.
- Server-side validation.
- Protection terhadap unauthorized access.

Customer tidak boleh mengakses endpoint administrator.

Karyawan tidak boleh mengakses data karyawan lain tanpa authorization.

---

# 60. Demo Limitations

Versi demo tidak wajib memiliki:

- Payment gateway asli.
- OTP SMS production.
- Tracking GPS realtime penuh.
- Integrasi kurir.
- Chat realtime aktif.
- Push notification production.
- Sistem settlement keuangan.
- Refund otomatis.

Fitur tersebut dapat ditampilkan dalam UI sebagai gambaran konsep.

---

# 61. MVP Demo Scope

Demo minimal harus mampu menunjukkan satu alur utama secara penuh.

## Customer

Login  
→ Dashboard  
→ Pilih Layanan  
→ Pilih Variasi  
→ Pesan Sekarang / Jadwalkan  
→ Pilih Alamat  
→ Checkout  
→ Simulasi Pembayaran  
→ Mencari Karyawan

---

## Karyawan

Login  
→ Melihat Order  
→ Ambil Order  
→ Mengubah Status

---

## Customer

Status berubah realtime  
→ Melihat Profil Karyawan  
→ Order Selesai  
→ Memberikan Rating.

---

## Administrator

Login  
→ Dashboard  
→ Melihat customer  
→ Melihat karyawan  
→ Melihat order.

---

# 62. Seed Data Demo

Untuk membuat aplikasi terasa hidup, demo menggunakan data dummy.

## Karyawan

8 karyawan.

Contoh:

- 3 Hair Stylist.
- 2 Nail Artist.
- 1 Makeup Artist.
- 2 Beautician.

---

## Layanan

12 layanan.

Contoh:

- Hair Spa.
- Hair Cut.
- Hair Coloring.
- Hair Treatment.
- Facial.
- Manicure.
- Pedicure.
- Nail Art.
- Makeup.
- Eyelash Treatment.
- Creambath.
- Scalp Treatment.

---

## Produk

20 produk kecantikan.

---

## Promo

6 promo aktif.

---

## Bundle

Minimal 4 bundle.

---

## Customer

Minimal 10 akun dummy.

---

# 63. Acceptance Criteria

Demo dianggap berhasil apabila:

1. Customer dapat login.
2. Customer dapat melihat layanan.
3. Customer dapat melihat produk.
4. Customer dapat menggunakan keranjang.
5. Customer dapat menyimpan alamat.
6. Customer dapat membuat booking.
7. Karyawan dapat melihat order.
8. Karyawan dapat mengambil order.
9. Hanya satu karyawan dapat mengambil satu order.
10. Status order berubah secara realtime.
11. Customer dapat melihat karyawan.
12. Customer dapat membatalkan order.
13. Customer dapat memberikan rating.
14. Administrator dapat melihat seluruh order.
15. Administrator dapat mengelola layanan.
16. Administrator dapat mengelola produk.
17. Administrator dapat mengelola karyawan.
18. Tampilan customer responsif di smartphone.
19. Aplikasi dapat diakses melalui URL deployment.
20. Demo mampu menunjukkan satu complete customer journey.

---

# 64. Recommended Technical Architecture

Untuk versi demo:

### Frontend

Next.js / React.

### Styling

Tailwind CSS.

### Hosting

Vercel.

### Database

PostgreSQL / Supabase.

### Authentication

Supabase Auth / Firebase Auth.

### Realtime

Supabase Realtime / WebSocket.

### Map

Google Maps / Mapbox.

### Storage

Supabase Storage / Cloudinary.

---

# 65. Future Development

Apabila produk dilanjutkan ke production, pengembangan selanjutnya dapat mencakup:

- Native mobile application.
- Android APK.
- iOS application.
- Push notification.
- Real OTP.
- Payment gateway.
- Live GPS tracking.
- Chat realtime.
- Automatic employee matching.
- Delivery integration.
- Advanced analytics.
- Loyalty points.
- Membership.
- Referral program.
- Subscription.
- Multi-branch management.

---

# 66. Product Success Indicator

Untuk versi demo, keberhasilan produk tidak diukur berdasarkan jumlah transaksi nyata.

Keberhasilan diukur berdasarkan kemampuan aplikasi untuk:

- Menjelaskan konsep bisnis.
- Mendemonstrasikan customer journey.
- Menampilkan interaksi realtime.
- Memberikan pengalaman seperti aplikasi mobile.
- Menunjukkan kesiapan sistem untuk dikembangkan lebih lanjut.

---

# 67. Kesimpulan

Aplikasi ini dirancang sebagai platform salon dan beauty commerce berbasis home service dengan tiga role utama yaitu Customer, Karyawan, dan Administrator.

Customer dapat melakukan pemesanan layanan serta pembelian produk.

Karyawan dapat menerima pekerjaan menggunakan sistem realtime dan first-come-first-served.

Administrator dapat melakukan monitoring seluruh aktivitas dan mengelola data operasional.

Versi demo akan dibuat dalam bentuk **mobile-first web application** dan dapat di-deploy melalui Vercel sehingga dapat langsung diakses menggunakan smartphone tanpa instalasi.

Pendekatan ini dipilih agar proses validasi produk lebih cepat, mudah didemonstrasikan, serta tetap dapat dikembangkan menjadi PWA maupun aplikasi Android di tahap berikutnya.