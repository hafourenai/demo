# PRODUCT REQUIREMENTS DOCUMENT (PRD) V2

## Home Cleaning & Nail Art Commerce Platform

**Versi:** 2.0  
**Status:** Production-Ready Requirement  
**Platform:** Customer Mobile App, Employee Mobile App, Admin Web  
**Target Utama:** Android  
**Admin Platform:** Web Dashboard  
**Primary Business:** Home Cleaning Service  
**Secondary Business:** Nail Art Product Commerce

---

# 1. Product Overview

Aplikasi merupakan platform layanan **home cleaning on-demand** dan **e-commerce produk Nail Art**.

Sistem terdiri dari tiga aplikasi utama:

1. **Customer App**
2. **Employee App**
3. **Admin Web Dashboard**

Customer dapat memesan layanan home cleaning berdasarkan ukuran rumah, lokasi, jadwal, serta tambahan layanan tertentu.

Order home cleaning akan dikirim secara realtime kepada employee yang memenuhi kriteria.

Employee yang paling cepat mengambil order akan memperoleh pekerjaan tersebut.

Setelah order diterima, customer dapat melihat informasi employee dan melakukan **live tracking posisi employee selama perjalanan menuju lokasi customer**.

Selain layanan cleaning, Customer App menyediakan katalog produk Nail Art dalam beberapa kategori dengan pola transaksi seperti marketplace/e-commerce.

Seluruh sistem terhubung menggunakan backend, database, authentication, payment record, notification, location service, dan realtime communication yang sama.

---

# 2. Product Objective

Tujuan aplikasi adalah:

1. Mempermudah customer memesan layanan home cleaning.
2. Memberikan transparansi harga cleaning.
3. Menghitung harga berdasarkan ukuran rumah dan jarak.
4. Mendistribusikan order secara realtime kepada employee.
5. Memungkinkan customer melakukan live tracking employee.
6. Mendukung pembayaran langsung kepada employee.
7. Mencatat pendapatan employee secara otomatis.
8. Menghitung kewajiban setoran employee kepada perusahaan.
9. Mempermudah perusahaan memonitor operasional.
10. Menyediakan marketplace produk Nail Art.
11. Memberikan transparansi transaksi melalui invoice.
12. Menyediakan sistem yang dapat dikembangkan menjadi layanan multi-area dan multi-branch.

---

# 3. System Architecture Overview

Sistem terdiri dari:

## 3.1 Customer App

Aplikasi Android yang digunakan customer untuk:

- Memesan cleaning.
- Membeli Nail Art.
- Melakukan pembayaran.
- Live tracking employee.
- Mengelola alamat.
- Melihat transaksi.
- Memberikan rating.
- Melihat invoice.

---

## 3.2 Employee App

Aplikasi Android khusus employee cleaning.

Digunakan untuk:

- Menerima order.
- Mengambil order.
- Navigasi menuju customer.
- Mengirim lokasi realtime.
- Mengubah status pekerjaan.
- Upload foto before/after.
- Mengelola pembayaran.
- Melihat pendapatan.
- Melihat kewajiban settlement.
- Melihat rating.

---

## 3.3 Admin Web

Digunakan Administrator / Owner untuk:

- Monitoring order.
- Monitoring employee.
- Mengatur customer.
- Mengatur harga.
- Mengatur employee.
- Mengatur katalog Nail Art.
- Mengatur stok.
- Mengatur promo.
- Monitoring pembayaran.
- Monitoring settlement.
- Melihat laporan.
- Mengelola seluruh konfigurasi sistem.

---

# 4. User Roles

Sistem memiliki tiga role utama.

## 4.1 Customer

Customer merupakan pengguna yang:

- Memesan home cleaning.
- Membeli produk Nail Art.
- Melakukan checkout.
- Melakukan pembayaran.
- Melacak employee.
- Memberikan rating dan review.

---

## 4.2 Employee

Employee hanya menangani **Home Cleaning**.

Employee tidak menangani Nail Art.

Akun Employee hanya dapat dibuat oleh Administrator.

Employee tidak dapat melakukan registrasi mandiri.

Employee memiliki:

- Nama.
- Foto.
- Nomor HP.
- Email.
- Alamat.
- Rating.
- Skill.
- Riwayat pekerjaan.
- Pendapatan.
- Rekening bank.
- QRIS.
- Status pembayaran.
- Status settlement.

---

## 4.3 Administrator / Owner

Administrator memiliki akses tertinggi dan dapat mengelola seluruh data operasional.

---

# 5. Customer App Navigation

Navigasi utama:

**Home | Cleaning | Belanja | Pesanan | Akun**

---

# 6. Employee App Navigation

Navigasi utama:

**Home | Order | Pekerjaan | Pendapatan | Akun**

---

# 7. Admin Web Navigation

Menu utama:

- Dashboard
- Cleaning Orders
- Product Orders
- Customers
- Employees
- Employee Settlement
- Cleaning Services
- Pricing Rules
- Nail Art Products
- Categories
- Inventory
- Promotions
- Payments
- Invoices
- Ratings & Reviews
- Reports
- Settings

---

# 8. Authentication

## 8.1 Customer

Customer dapat login menggunakan:

### Nomor HP + OTP

Flow:

Nomor HP  
→ Kirim OTP  
→ Masukkan OTP  
→ Verifikasi  
→ Login

Customer juga dapat login menggunakan:

**Google Account**

---

## 8.2 Employee

Employee menggunakan nomor HP dan OTP.

Namun akun harus terlebih dahulu dibuat oleh administrator.

Flow:

Admin membuat akun  
→ Employee menerima nomor terdaftar  
→ Login nomor HP  
→ OTP  
→ Authentication berhasil.

---

## 8.3 Administrator

Admin login menggunakan email dan password.

Disarankan menggunakan:

- Multi-factor authentication.
- Role-based authorization.
- Session expiration.

---

# 9. Customer Profile

Customer memiliki:

- Nama.
- Nomor HP.
- Email.
- Foto profil.

Customer dapat mengubah informasi profil tertentu.

---

# 10. Customer Address

Customer dapat menyimpan maksimal:

**3 alamat**

Jenis label:

- Rumah.
- Kantor.
- Lainnya.

Informasi alamat:

- Nama penerima.
- Nomor HP.
- Alamat lengkap.
- Detail tambahan.
- Latitude.
- Longitude.
- Label alamat.
- Catatan lokasi.

Customer dapat menggunakan:

**Gunakan Lokasi Saat Ini**

atau memilih titik melalui map.

---

# 11. Home Cleaning Service

Home Cleaning merupakan layanan utama aplikasi.

Customer dapat memilih:

- Pesan Sekarang.
- Jadwalkan.

---

# 12. Jenis Cleaning

Admin dapat membuat jenis layanan cleaning.

Contoh:

- General Cleaning.
- Deep Cleaning.
- Kitchen Cleaning.
- Bathroom Cleaning.
- Apartment Cleaning.
- Office Cleaning.

Jenis layanan dapat dikembangkan tanpa perubahan source code melalui Admin Web.

---

# 13. Skill Employee

Walaupun seluruh employee merupakan cleaning worker, skill dapat dibedakan berdasarkan kompetensi.

Contoh:

- General Cleaning.
- Deep Cleaning.
- Kitchen Cleaning.
- Bathroom Cleaning.
- Office Cleaning.

Employee hanya menerima order yang sesuai skill.

---

# 14. Cleaning Property Information

Saat melakukan booking, customer wajib mengisi informasi properti.

Minimal:

- Jenis properti.
- Luas bangunan.
- Jumlah lantai.
- Jumlah kamar.
- Jumlah kamar mandi.

Contoh jenis properti:

- Rumah.
- Apartemen.
- Kos.
- Kantor.

Parameter harga utama menggunakan:

**Luas bangunan**

Informasi lainnya digunakan sebagai informasi workload dan dapat digunakan untuk future pricing rules.

---

# 15. Cleaning Pricing Engine

Harga cleaning dihitung otomatis oleh sistem.

Formula utama:

**Total Cleaning Price = Base Price + Distance Fee + Add-ons + Service Fee - Discount**

Semua komponen bersifat configurable oleh admin.

---

# 16. Base Price Berdasarkan Ukuran Rumah

Admin menentukan range ukuran rumah dan harga dasar.

Contoh konfigurasi:

### 0–50 m²

Rp100.000

### 51–100 m²

Rp175.000

### 101–150 m²

Rp250.000

### 151–200 m²

Rp325.000

### >200 m²

Harga dihitung menggunakan rule lanjutan atau custom rate.

Nilai tersebut hanya contoh.

Admin dapat mengubah seluruh nilai melalui Pricing Rules.

---

# 17. Distance Fee

Sistem menghitung jarak antara lokasi employee / lokasi operasional dengan alamat customer sesuai business configuration.

Biaya perjalanan menggunakan aturan jarak.

Contoh:

### 0–3 KM

Gratis.

### >3 KM

Tambahan biaya per kilometer.

Contoh:

Rp5.000 / KM.

Admin dapat mengatur:

- Free radius.
- Rate per kilometer.
- Maximum radius.
- Tiered pricing.

---

# 18. Distance Pricing Example

Customer berjarak:

7 KM.

Free distance:

3 KM.

Jarak berbayar:

4 KM.

Rate:

Rp5.000/KM.

Distance Fee:

**Rp20.000**

---

# 19. Add-On Cleaning

Admin dapat membuat layanan tambahan.

Contoh:

- Tambahan kamar mandi.
- Bersihkan kulkas.
- Bersihkan jendela.
- Kitchen deep cleaning.
- Sofa cleaning.
- Balcony cleaning.

Setiap add-on memiliki harga.

---

# 20. Pricing Breakdown

Customer harus dapat melihat breakdown harga sebelum checkout.

Contoh:

Cleaning 80 m²  
Rp175.000

Distance Fee  
Rp20.000

Bathroom Add-On  
Rp25.000

Discount  
-Rp20.000

**Total**
Rp200.000

Tidak diperbolehkan hanya menampilkan total tanpa breakdown.

---

# 21. Admin Pricing Rules

Admin dapat mengatur:

- Range luas bangunan.
- Base price.
- Free distance.
- Price per kilometer.
- Maximum service radius.
- Add-on price.
- Service fee.
- Discount formula.
- Minimum order.
- Maximum order.
- Holiday surcharge jika dibutuhkan.

Seluruh perubahan harus tercatat melalui audit log.

---

# 22. Booking Type

Customer dapat memilih:

## Pesan Sekarang

Order langsung masuk ke sistem pencarian employee.

---

## Jadwalkan

Customer memilih:

- Tanggal.
- Slot waktu.

Contoh:

09:00  
10:00  
11:00  
13:00  
14:00  
15:00  
16:00

Admin dapat mengatur slot.

---

# 23. Scheduled Order Logic

Scheduled order tidak langsung dikirim ke employee apabila jadwal masih jauh.

Order masuk ke:

**Scheduled Queue**

Sistem akan mulai mendistribusikan order mendekati appointment.

Contoh:

60–90 menit sebelum jadwal.

Nilai ini harus configurable.

---

# 24. Order Eligibility

Employee dapat menerima order apabila:

1. Akun aktif.
2. Sedang berada dalam jadwal kerja.
3. Tidak sedang menangani order lain.
4. Skill sesuai.
5. Berada dalam radius eligible.
6. Tidak sedang cuti.
7. Tidak diblokir oleh admin.

---

# 25. Employee Availability

Employee tidak harus memiliki tombol manual Online / Offline.

Availability dihitung dari:

- Jadwal kerja.
- Order aktif.
- Cuti.
- Status akun.
- Status operasional.

Status internal:

**Available**

**Assigned**

**On The Way**

**Arrived**

**In Service**

**Unavailable**

---

# 26. Employee Work Schedule

Admin mengatur jadwal employee.

Contoh:

Senin  
09:00–18:00

Selasa  
09:00–18:00

Employee dapat memiliki:

- Shift.
- Hari kerja.
- Hari libur.
- Cuti.

---

# 27. Realtime Order Distribution

Ketika customer membuat order:

1. Sistem mengambil koordinat customer.
2. Sistem mencari employee eligible.
3. Filter berdasarkan skill.
4. Filter berdasarkan availability.
5. Filter berdasarkan radius.
6. Order dikirim realtime.
7. Employee melihat tombol:

**AMBIL ORDER**

---

# 28. Order Claim

Sistem menggunakan mekanisme:

**First Valid Claim Wins**

Contoh:

Employee A dan B menerima order bersamaan.

Employee A menekan pada 10:00:01.200.

Employee B menekan pada 10:00:01.350.

Server berhasil mengubah:

`OPEN → ASSIGNED`

untuk Employee A.

Employee B mendapat:

> Order telah diambil employee lain.

---

# 29. Atomic Claim Requirement

Claim harus dilakukan di backend.

Tidak cukup hanya menghilangkan tombol pada frontend.

Backend harus menggunakan:

- Atomic transaction.
- Conditional update.
- Database lock.
- Transaction isolation.

Satu order hanya boleh memiliki satu employee.

---

# 30. Expanding Search Radius

Apabila tidak ada employee mengambil order dalam waktu tertentu:

Radius pencarian dapat diperluas.

Contoh:

0–2 menit:

5 KM.

Setelah 2 menit:

Radius diperluas sesuai konfigurasi.

Customer menerima:

> Karyawan kami sedang sibuk. Mohon maaf jika waktu tunggu sedikit lebih lama.

Order tetap aktif.

---

# 31. Cleaning Order Status

Status utama:

### Pending Payment

Apabila metode pembayaran membutuhkan pembayaran awal.

### Searching Employee

Sistem mencari employee.

### Employee Assigned

Employee berhasil memperoleh pekerjaan.

### On The Way

Employee menuju lokasi.

### Arrived

Employee tiba.

### In Service

Cleaning sedang dilakukan.

### Completed

Cleaning selesai.

### Cancelled by Customer

Customer membatalkan.

### Cancelled by Admin

Admin membatalkan.

---

# 32. Live Tracking

Live tracking hanya aktif setelah employee menekan:

**Mulai Perjalanan**

Tracking berhenti setelah:

**Saya Sudah Tiba**

Employee tidak dilacak sepanjang hari.

---

# 33. Live Location Flow

Employee:

Employee Assigned  
→ Mulai Perjalanan

Status:

`ASSIGNED → ON_THE_WAY`

Employee App mulai mengirim:

- Latitude.
- Longitude.
- Timestamp.
- Accuracy.

Customer menerima data tersebut secara realtime.

---

# 34. Customer Live Tracking Screen

Customer melihat:

- Map.
- Lokasi customer.
- Posisi employee.
- Route.
- Estimated Time of Arrival.
- Nama employee.
- Foto employee.
- Rating employee.
- Jumlah pekerjaan selesai.
- Status perjalanan.

Contoh:

> Budi sedang menuju lokasi Anda.

> Estimasi tiba 12 menit.

---

# 35. Tracking Privacy

Location tracking hanya boleh dilakukan ketika:

- Employee memiliki order aktif.
- Status order On The Way.

Tidak diperbolehkan melakukan tracking employee di luar order.

---

# 36. Arrival

Employee menekan:

**Saya Sudah Tiba**

Status:

`ON_THE_WAY → ARRIVED`

Live tracking dihentikan.

Customer mendapatkan notification.

---

# 37. Before Cleaning Evidence

Sebelum memulai cleaning, employee wajib upload foto kondisi awal.

Minimal:

1 foto.

Admin dapat mengatur jumlah minimum.

Status belum dapat berubah ke In Service jika foto required belum tersedia.

---

# 38. Start Cleaning

Setelah foto before:

Employee menekan:

**Mulai Pekerjaan**

Status:

`ARRIVED → IN_SERVICE`

Timestamp disimpan.

---

# 39. Cleaning Checklist

Employee dapat melihat checklist pekerjaan.

Contoh:

- Menyapu.
- Mengepel.
- Membersihkan debu.
- Membersihkan kamar mandi.
- Membersihkan area tambahan.

Checklist dapat berbeda berdasarkan layanan.

---

# 40. After Cleaning Evidence

Sebelum order selesai, employee wajib upload:

**Foto After**

Order tidak dapat ditandai Completed apabila foto required belum lengkap.

---

# 41. Complete Cleaning

Employee menekan:

**Selesaikan Pekerjaan**

Status:

`IN_SERVICE → COMPLETED`

Customer menerima notifikasi.

---

# 42. Customer Rating

Setelah selesai, customer dapat memberi:

- Rating 1–5.
- Review.
- Feedback.

Rating memengaruhi profil employee.

---

# 43. Cancellation Rules

## Sebelum Employee Assigned

Customer dapat membatalkan order.

---

## Setelah Employee Assigned

Customer tetap dapat cancel.

Customer wajib memilih alasan.

---

## Setelah Employee On The Way

Customer mendapat warning:

> Employee sedang menuju lokasi Anda. Apakah Anda yakin ingin membatalkan pesanan?

Untuk versi awal tidak wajib ada cancellation fee.

Namun event tetap dicatat untuk future rule.

---

# 44. Payment Model

Pembayaran layanan cleaning langsung diberikan kepada employee.

Perusahaan tidak menerima dana transaksi secara langsung.

Metode pembayaran:

- Cash.
- QRIS.
- Transfer Bank.

---

# 45. Employee Payment Profile

Setiap employee memiliki data pembayaran.

Data:

- Nama bank.
- Nomor rekening.
- Nama pemilik rekening.
- QRIS.
- Nama merchant / pemilik QRIS.
- Status verifikasi.

---

# 46. Payment Data Security

Nomor rekening dan QRIS tidak boleh dapat diubah sembarangan.

Recommended flow:

Employee request perubahan  
→ Admin review  
→ Admin approve  
→ Data aktif.

Semua perubahan dicatat.

---

# 47. Cash Payment Flow

Customer memilih Cash.

Setelah layanan selesai:

Customer membayar employee.

Employee menekan:

**Pembayaran Diterima**

Payment status:

`UNPAID → PAID`

---

# 48. QRIS Payment Flow

Customer memilih QRIS.

Setelah employee terpilih:

Customer melihat QRIS milik employee.

Customer melakukan pembayaran.

Apabila belum menggunakan payment verification otomatis:

Customer dapat upload bukti pembayaran.

Employee kemudian melakukan konfirmasi.

Status:

`WAITING_CONFIRMATION → PAID`

---

# 49. Bank Transfer Flow

Customer melihat:

- Nama bank.
- Nomor rekening.
- Nama pemilik.

Customer melakukan transfer.

Customer dapat upload bukti bayar.

Employee mengkonfirmasi pembayaran.

---

# 50. Payment Status

Payment status dipisahkan dari order status.

Contoh:

Order:

`IN_SERVICE`

Payment:

`UNPAID`

atau:

Order:

`COMPLETED`

Payment:

`PAID`

---

# 51. Payment Verification

Untuk fase awal:

QRIS dan transfer dapat menggunakan manual confirmation.

Future integration dapat menggunakan:

- Payment Gateway.
- Bank API.
- QRIS API.

Namun requirement saat ini:

Dana tetap masuk langsung ke employee.

---

# 52. Invoice

Setiap transaksi harus menghasilkan invoice.

Invoice diberikan untuk:

- Cleaning.
- Nail Art Product Order.

---

# 53. Cleaning Invoice

Format nomor:

`INV-CLN-YYYYMMDD-XXXX`

Contoh:

`INV-CLN-20261020-0021`

Invoice memuat:

- Invoice number.
- Customer.
- Employee.
- Tanggal.
- Layanan.
- Ukuran rumah.
- Base price.
- Distance fee.
- Add-on.
- Discount.
- Total.
- Metode pembayaran.
- Payment status.
- Order status.

---

# 54. Product Invoice

Format:

`INV-PRD-YYYYMMDD-XXXX`

Invoice mencakup:

- Customer.
- Produk.
- Variasi.
- Qty.
- Harga.
- Discount.
- Delivery cost.
- Total.
- Payment method.
- Status.

---

# 55. Employee Revenue

Employee menerima:

**100% nilai layanan sebagai Gross Revenue.**

Tidak terdapat potongan langsung per transaksi oleh perusahaan.

---

# 56. Monthly Settlement

Employee memiliki kewajiban menyetor sebagian pendapatan kepada perusahaan.

Default:

**3% dari total Gross Revenue bulanan**

Nilai 3% dapat diubah oleh administrator.

---

# 57. Settlement Formula

Formula:

**Settlement Due = Monthly Gross Revenue × Settlement Percentage**

Contoh:

Gross Revenue:

Rp10.000.000

Settlement:

3%

Settlement Due:

Rp300.000

Estimated Net:

Rp9.700.000

---

# 58. Employee Income Dashboard

Employee dapat melihat:

### Hari Ini

Rp350.000

### Bulan Ini

Rp10.000.000

### Settlement Rate

3%

### Kewajiban Setoran

Rp300.000

### Estimasi Pendapatan Bersih

Rp9.700.000

---

# 59. Settlement Status

Status:

- Pending.
- Partially Paid.
- Paid.
- Overdue.
- Waived.

Admin dapat menentukan status.

---

# 60. Settlement Payment

Employee melakukan pembayaran settlement di luar transaksi customer.

Admin kemudian mencatat:

- Tanggal.
- Nominal.
- Metode.
- Bukti.
- Status.

Future version dapat memiliki settlement payment gateway.

---

# 61. Settlement Adjustment

Admin dapat melakukan adjustment.

Contoh:

- Potongan khusus.
- Pengurangan fee.
- Correction.
- Penyesuaian bulan tertentu.

Setiap perubahan harus memiliki:

- Alasan.
- Admin ID.
- Timestamp.

---

# 62. Employee Settlement Report

Admin dapat melihat:

- Gross revenue.
- Settlement rate.
- Settlement due.
- Paid amount.
- Remaining amount.
- Status.
- Due date.

---

# 63. Nail Art Commerce

Nail Art merupakan bagian e-commerce.

Tidak menggunakan employee cleaning.

Flow menyerupai marketplace.

---

# 64. Nail Art Categories

Produk dapat memiliki banyak kategori.

Contoh:

- Press-On Nails.
- Fake Nails.
- Nail Sticker.
- Nail Accessories.
- Nail Tools.
- Nail Polish.
- Gel Nail.
- Nail Care.
- Decoration.
- Starter Kit.

Admin dapat membuat kategori baru.

---

# 65. Nail Art Product

Produk memiliki:

- Nama.
- Foto.
- SKU.
- Kategori.
- Harga.
- Promo price.
- Stock.
- Variasi.
- Description.
- Rating.
- Reviews.
- Best Seller status.

---

# 66. Product Variants

Produk dapat memiliki variasi.

Contoh:

### Size

S  
M  
L

### Color

Pink  
White  
Black

### Design

Minimalist  
Floral  
Luxury

Setiap variasi dapat memiliki:

- SKU.
- Price.
- Stock.

---

# 67. Wishlist

Customer dapat:

- Add wishlist.
- Remove wishlist.
- Move to cart.

---

# 68. Shopping Cart

Keranjang dapat memiliki banyak produk.

Customer dapat:

- Menambah item.
- Menghapus item.
- Mengubah quantity.
- Memilih variant.
- Menggunakan promo.

---

# 69. Product Checkout

Flow:

Product  
→ Product Detail  
→ Select Variant  
→ Add to Cart  
→ Cart  
→ Address  
→ Shipping  
→ Promo  
→ Payment  
→ Confirmation

---

# 70. Nail Art Order Status

Status:

### Waiting Payment

### Paid

### Processing

### Packed

### Shipped

### Completed

### Cancelled

---

# 71. Product Shipping

Untuk fase awal, shipment tracking tidak harus realtime.

Admin dapat memasukkan:

- Courier name.
- Tracking number.
- Shipping status.

Future version dapat integrate logistic provider API.

---

# 72. Product Payment

Pembayaran produk dapat menggunakan:

- Cash jika bisnis mendukung COD.
- QRIS.
- Transfer.

Admin dapat menentukan rekening pembayaran produk secara terpisah dari employee cleaning.

Catatan:

Payment data employee hanya digunakan untuk transaksi cleaning.

---

# 73. Product Review

Customer dapat memberikan:

- Rating.
- Review text.
- Product photo jika diperlukan.

Review tersedia setelah order Completed.

---

# 74. Best Seller

Produk dapat mendapatkan label:

**Best Seller**

Label dapat:

- Ditentukan otomatis berdasarkan penjualan.
- Di-override admin.

---

# 75. Cleaning Popularity

Home Cleaning package dapat memiliki label:

- Most Popular.
- Recommended.
- Best Value.

Admin dapat mengatur label.

---

# 76. Promotions

Sistem mendukung:

### Percentage Discount

20%.

### Nominal Discount

Rp25.000.

### Voucher Code

CLEAN20.

---

# 77. Promo Scope

Promo dapat berlaku untuk:

- Cleaning.
- Nail Art Product.
- Category.
- Specific Product.
- Specific Customer.
- Minimum transaction.
- Time period.

---

# 78. Customer Order History

Customer melihat:

**Berjalan**

dan

**Sudah Selesai**

Order menggunakan label:

**CLEANING**

atau

**PRODUK**

---

# 79. Customer Order Detail

Cleaning detail menampilkan:

- Employee.
- Status.
- Map jika tracking aktif.
- Pricing.
- Payment.
- Before/after photos.
- Invoice.

Product detail menampilkan:

- Items.
- Shipping.
- Payment.
- Invoice.

---

# 80. Employee Profile

Customer dapat melihat:

- Foto wajah.
- Nama.
- Rating.
- Jumlah pekerjaan selesai.
- Skill.
- Review.

Tidak perlu menampilkan:

- Kendaraan.
- Plat nomor.

---

# 81. Employee Dashboard

Dashboard employee menampilkan:

- Order available.
- Active job.
- Completed today.
- Gross income today.
- Gross income month.
- Settlement due.
- Rating.

---

# 82. Employee Order Card

Card order menampilkan:

- Service.
- Property size.
- Customer area.
- Distance.
- Estimated earning.
- Schedule.
- Add-ons.

Tombol:

**AMBIL ORDER**

---

# 83. Admin Dashboard

Dashboard menampilkan:

- Cleaning Orders Today.
- Active Cleaning.
- Searching Employee.
- Available Employees.
- Busy Employees.
- Product Orders.
- Revenue Volume.
- Settlement Due.
- Settlement Paid.
- Top Employee.
- Top Nail Art Product.
- Most Ordered Cleaning.

---

# 84. Admin Realtime Map

Admin dapat melihat map operasional.

Status marker:

**Available Employee**

**On The Way**

**In Service**

**Active Customer Order**

Map digunakan untuk monitoring operasional.

---

# 85. Employee Management

Admin dapat:

- Add employee.
- Edit employee.
- Deactivate employee.
- Set skill.
- Set schedule.
- Manage payment profile.
- Manage QRIS.
- Manage bank account.
- View rating.
- View revenue.
- View settlement.
- View active order.

---

# 86. Customer Management

Admin dapat melihat:

- Nama.
- Nomor HP.
- Email.
- Registration date.
- Order count.
- Order history.

Admin tidak perlu mengakses informasi sensitif yang tidak diperlukan.

---

# 87. Inventory

Admin mengelola stok Nail Art.

Features:

- Current stock.
- Stock in.
- Stock out.
- Minimum stock.
- Low stock warning.

---

# 88. Reports

Admin dapat melihat:

## Cleaning

- Total order.
- Completed order.
- Cancelled order.
- Gross transaction value.
- Popular service.
- Average order.
- Average distance.
- Employee performance.

## Employee

- Gross revenue.
- Settlement due.
- Settlement paid.
- Rating.
- Jobs completed.

## Nail Art

- Product sales.
- Best seller.
- Stock movement.
- Revenue.
- Category performance.

---

# 89. Notifications

Customer:

- Order dibuat.
- Employee ditemukan.
- Employee berangkat.
- Employee hampir tiba.
- Employee tiba.
- Cleaning dimulai.
- Cleaning selesai.
- Payment confirmation.
- Product processing.
- Product shipped.
- Promo.

Employee:

- New order.
- Order won.
- Order lost.
- Upcoming scheduled order.
- Payment confirmed.
- Settlement reminder.

Admin:

- Order tidak mendapatkan employee.
- Settlement overdue.
- Low stock.
- Failed payment.
- Critical operational issue.

---

# 90. Chat

Customer dan Employee dapat memiliki chat setelah order berhasil diambil.

Chat hanya tersedia untuk cleaning.

Recommended lifecycle:

`ASSIGNED → COMPLETED + 24 hours`

Admin dapat mengatur retention.

---

# 91. Call Feature

Customer dapat menghubungi employee.

Untuk privacy, future version disarankan menggunakan:

- Number masking.
- In-app voice.

Tahap awal dapat menggunakan nomor employee jika business menyetujui.

---

# 92. Realtime Requirements

Realtime digunakan untuk:

- Order broadcast.
- Order claim.
- Status cleaning.
- Employee location.
- Customer tracking.
- Employee availability.
- Notifications.

---

# 93. Location Update

Saat On The Way, Employee App mengirim lokasi berkala.

Interval harus mempertimbangkan:

- Battery.
- Accuracy.
- Data usage.

Recommended dynamic interval:

5–15 detik ketika bergerak.

Lebih jarang ketika stationary.

---

# 94. Offline Handling

Jika koneksi Employee App terputus:

- Lokasi terakhir tetap ditampilkan.
- Customer diberi status location delayed.
- App mencoba reconnect.
- Status order tidak boleh berubah sembarangan.

---

# 95. Non-Functional Requirements

## Performance

- Fast app launch.
- Realtime notification rendah latency.
- Order claim cepat.
- Smooth map tracking.

## Scalability

Arsitektur harus dapat berkembang ke:

- Banyak employee.
- Banyak area.
- Multi-branch.

## Availability

Critical service seperti:

- Booking.
- Claim.
- Payment.
- Tracking.

harus memiliki error handling.

---

# 96. Security Requirements

Wajib menggunakan:

- Role-based access control.
- Token authentication.
- Encrypted communication HTTPS.
- Secure password hashing.
- OTP expiration.
- Rate limiting.
- Server-side validation.
- Secure file upload.
- Authorization per resource.

---

# 97. Payment Data Security

Informasi rekening:

- Tidak boleh tampil ke employee lain.
- Tidak boleh tampil sebelum order assigned.
- Perubahan wajib diaudit.

---

# 98. Location Security

Location employee hanya dapat diakses oleh:

- Customer pemilik active order.
- Admin berwenang.
- Employee sendiri.

---

# 99. Audit Log

Admin actions penting harus disimpan.

Contoh:

- Pricing changes.
- Settlement adjustment.
- Employee bank changes.
- QRIS changes.
- Order cancellation.
- Manual payment confirmation.

---

# 100. Recommended Technical Stack

## Customer App

Flutter.

## Employee App

Flutter.

Kedua aplikasi dapat menggunakan shared package / shared codebase component.

---

## Admin Web

Next.js / React.

---

## Backend

Pilihan:

- Node.js / NestJS.
- Supabase.
- PostgreSQL.

Untuk sistem production dengan business rules kompleks, disarankan backend API terstruktur.

---

## Database

PostgreSQL.

---

## Realtime

- WebSocket.
- Supabase Realtime.
- Socket.io.

---

## Maps

- Google Maps Platform.
- Mapbox.

---

## Notification

Firebase Cloud Messaging.

---

## Storage

Untuk foto before/after:

- Cloud storage.
- Signed URLs.
- Secure object access.

---

# 101. Core Database Entities

Entitas utama:

### User

### Customer

### Employee

### EmployeeSkill

### EmployeeSchedule

### EmployeePaymentAccount

### CustomerAddress

### CleaningService

### PricingRule

### CleaningAddon

### CleaningOrder

### CleaningOrderStatusHistory

### EmployeeLocation

### Payment

### Invoice

### EmployeeRevenue

### EmployeeSettlement

### Product

### ProductCategory

### ProductVariant

### Inventory

### Cart

### ProductOrder

### ProductOrderItem

### Promotion

### Review

### Notification

---

# 102. Critical Business Rules

1. Satu cleaning order hanya dapat dimiliki satu employee.
2. Employee hanya boleh memiliki satu active cleaning job pada satu waktu kecuali admin mengubah rule.
3. Live tracking hanya berjalan pada status On The Way.
4. Customer hanya dapat melihat lokasi employee untuk order miliknya.
5. Employee wajib upload before/after sesuai rule.
6. Harga cleaning dihitung oleh server.
7. Client tidak boleh menentukan harga sendiri.
8. Settlement menggunakan gross revenue.
9. Settlement percentage dapat diubah admin.
10. Historical settlement tidak boleh berubah otomatis ketika percentage baru diterapkan.
11. Setiap order memiliki invoice unik.
12. Payment status terpisah dari order status.
13. QRIS/rekening cleaning mengikuti employee assigned.
14. Produk Nail Art tidak memiliki hubungan dengan employee cleaning.
15. Stock tidak boleh menjadi negatif.

---

# 103. Settlement Versioning

Perubahan settlement rate hanya berlaku sesuai effective date.

Contoh:

September:

3%.

Mulai November:

4%.

Transaksi September tetap menggunakan 3%.

Ini penting untuk menjaga laporan historis.

---

# 104. Pricing Versioning

Harga juga harus memiliki versioning.

Jika admin mengubah harga pada tanggal 20:

Order tanggal 19 tidak boleh berubah.

Harga disimpan sebagai snapshot ketika checkout.

---

# 105. Invoice Immutability

Invoice yang sudah diterbitkan tidak boleh diedit langsung.

Apabila ada correction:

Gunakan adjustment / revised invoice mechanism.

---

# 106. MVP Production Scope

## Customer App

Wajib:

- Authentication.
- Profile.
- Address.
- Cleaning booking.
- Dynamic pricing.
- Schedule.
- Payment.
- Live tracking.
- Employee profile.
- Order history.
- Invoice.
- Rating.
- Nail Art catalog.
- Cart.
- Checkout.
- Product order.

---

## Employee App

Wajib:

- Authentication.
- Order realtime.
- Claim.
- Active job.
- Navigation.
- Live tracking.
- Before/after.
- Status update.
- Payment account.
- Revenue.
- Settlement.
- Rating.

---

## Admin Web

Wajib:

- Dashboard.
- Employee management.
- Customer management.
- Order management.
- Pricing rule.
- Settlement management.
- Product management.
- Inventory.
- Payments.
- Invoice.
- Reports.

---

# 107. Phase 2 / Future Scope

Dapat dikembangkan setelah production stabil:

- Multi-branch.
- Multi-city.
- Automatic routing.
- AI cleaning estimation.
- Payment gateway.
- Auto QRIS verification.
- Bank API.
- Logistic API.
- Membership.
- Loyalty.
- Subscription cleaning.
- Referral.
- Corporate cleaning.
- Dynamic surge pricing.
- Advanced employee scheduling.
- Automated settlement.
- Customer support ticket.
- Fraud detection.

---

# 108. Acceptance Criteria

Sistem dianggap siap production apabila minimal:

1. Customer dapat melakukan booking cleaning.
2. Harga dihitung otomatis berdasarkan luas dan jarak.
3. Customer dapat melihat breakdown harga.
4. Order dikirim realtime kepada employee eligible.
5. Hanya satu employee dapat claim.
6. Employee dapat memulai perjalanan.
7. Customer dapat live tracking.
8. Tracking berhenti ketika employee tiba.
9. Employee dapat upload before.
10. Employee dapat memulai pekerjaan.
11. Employee dapat upload after.
12. Employee dapat menyelesaikan order.
13. Customer dapat membayar Cash/QRIS/Transfer.
14. QRIS dan rekening mengikuti employee assigned.
15. Invoice dihasilkan.
16. Pendapatan employee tercatat.
17. Settlement bulanan terhitung.
18. Admin dapat mengubah settlement rate.
19. Admin dapat mengubah pricing rules.
20. Historical order tidak berubah ketika pricing berubah.
21. Customer dapat membeli Nail Art.
22. Stock Nail Art terkontrol.
23. Customer dapat melihat status product order.
24. Admin dapat melihat laporan operasional.
25. Role access berjalan dengan benar.
26. Sistem mencegah duplicate claim.
27. Sistem mencegah negative inventory.
28. Semua transaksi penting tercatat melalui audit log.

---

# 109. Product Summary

Produk terdiri dari tiga platform utama:

### Customer App

Berfungsi sebagai aplikasi pemesanan home cleaning sekaligus marketplace produk Nail Art.

### Employee App

Berfungsi sebagai aplikasi operasional cleaning worker untuk menerima pekerjaan, melakukan live tracking, mengelola pekerjaan, pembayaran, pendapatan, serta settlement.

### Admin Web

Berfungsi sebagai pusat kontrol bisnis untuk mengatur harga, employee, customer, settlement, order, produk, pembayaran, serta laporan.

Model bisnis cleaning menggunakan sistem pembayaran langsung dari customer kepada employee.

Employee memperoleh **100% gross revenue** dari transaksi dan memiliki kewajiban settlement bulanan kepada perusahaan sebesar **3% secara default**, yang dapat dikonfigurasi oleh administrator.

Harga cleaning dihitung menggunakan formula berdasarkan **ukuran rumah, jarak customer, add-on, service fee, dan promo**.

Produk Nail Art diperlakukan sebagai e-commerce multi-kategori yang sepenuhnya terpisah dari operasional employee cleaning.

PRD V2 ini menjadi dasar utama untuk pengembangan Customer App, Employee App, Admin Web, database architecture, API specification, UI/UX design, dan quality assurance.