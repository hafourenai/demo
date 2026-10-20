'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShoppingBag, Truck, Tag, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency, generateId, generateInvoiceNumber } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductOrder, PaymentMethod } from '@/lib/types';
import { PaymentGatewayModal } from '@/components/payment/PaymentGatewayModal';
import { seedCustomers } from '@/lib/seed';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    currentUser,
    cart,
    removeFromCart,
    updateCartItem,
    clearCart,
    promos,
    customers,
    createProductOrder,
    login,
  } = useAppStore();

  const customer = customers.find((c) => c.id === currentUser?.id) || customers[0] || seedCustomers[0];
  const addresses = (customer?.addresses && customer.addresses.length > 0) ? customer.addresses : seedCustomers[0].addresses;

  // Auto-login fallback for demo testing if currentUser is null
  useEffect(() => {
    if (!currentUser && customer) {
      login(customer);
    }
  }, [currentUser, customer, login]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Shipping courier options (PRD Section 71)
  const [courier, setCourier] = useState<{ name: string; cost: number }>({
    name: 'SiCepat BEST Express',
    cost: 15000,
  });

  // Promo code
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>('NAILCANTIK');
  const [customPromoInput, setCustomPromoInput] = useState<string>('');

  const activePromo = promos.find(
    (p) =>
      p.code.toUpperCase() === selectedPromoCode.toUpperCase() &&
      p.isActive &&
      p.applicableTo.includes('product')
  );

  // Payment method (PRD Section 72: Company account)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGateway, setShowGateway] = useState(false);
  const [pendingInvoiceNumber, setPendingInvoiceNumber] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (activePromo) {
    if (!activePromo.minTransaction || subtotal >= activePromo.minTransaction) {
      discount =
        activePromo.type === 'percentage'
          ? Math.round((subtotal * activePromo.value) / 100)
          : activePromo.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + courier.cost - discount);

  const handleCheckout = () => {
    const targetAddress = activeAddress || addresses[0];

    if (!targetAddress) {
      alert('Silakan pilih atau tambahkan alamat pengiriman.');
      router.push('/customer/account');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang belanja kosong');
      return;
    }

    const inv = generateInvoiceNumber('PRD');
    setPendingInvoiceNumber(inv);
    setShowGateway(true);
  };

  const handleGatewaySuccess = () => {
    setShowGateway(false);
    setIsProcessing(true);
    setErrorMessage('');

    const activeUser = currentUser || customer || seedCustomers[0];
    const targetAddress = activeAddress || addresses[0];

    const newOrder: ProductOrder = {
      orderType: 'product',
      id: generateId(),
      invoiceNumber: pendingInvoiceNumber || generateInvoiceNumber('PRD'),
      customerId: activeUser.id,
      customerName: activeUser.name,
      customerPhone: activeUser.phone,
      items: cart.map((c) => ({
        productId: c.itemId,
        productName: c.productName || 'Produk Nail Art',
        variantId: c.variantId,
        variantName: c.variantName,
        price: c.price,
        quantity: c.quantity,
        image: c.image || '/images/products/prod1.jpg',
      })),
      address: targetAddress,
      courierName: courier.name,
      shippingCost: courier.cost,
      subtotal,
      discount,
      total: grandTotal,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = createProductOrder(newOrder);

    if (!res.success) {
      setIsProcessing(false);
      setErrorMessage(res.message || 'Gagal memproses pesanan.');
      return;
    }

    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/customer/orders/${newOrder.id}`);
    }, 600);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <CustomerLayout currentPage="products">
        <div className="customer-page space-y-4">
          <Link
            href="/customer/products"
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
          <div className="bg-white rounded-2xl border border-border p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-base font-bold text-text-primary">Keranjang Belanja Kosong</h2>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              Anda belum menambahkan produk Nail Art ke keranjang.
            </p>
            <Link
              href="/customer/products"
              className="inline-block mt-2 py-2 px-5 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors shadow-sm"
            >
              Mulai Belanja Nail Art
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout currentPage="products">
      <div className="customer-page space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Link
            href="/customer/products"
            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-primary"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-lg font-bold font-serif text-text-primary">
            Checkout Pesanan Nail Art
          </h1>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-danger font-medium">
            {errorMessage}
          </div>
        )}

        {/* Cart Item Review */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Daftar Barang ({cart.length})
            </h2>
            <button
              onClick={clearCart}
              className="text-[11px] text-danger hover:underline font-semibold"
            >
              Kosongkan
            </button>
          </div>

          <div className="divide-y divide-border">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                <img
                  src={item.image || '/images/products/prod1.jpg'}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover bg-canvas-alt flex-shrink-0 border border-border"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-text-primary truncate">
                    {item.productName || 'Produk'}
                  </h3>
                  {item.variantName && (
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      Varian: {item.variantName}
                    </span>
                  )}
                  <span className="text-xs font-bold text-primary block mt-1">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-text-muted hover:text-danger p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1.5 bg-canvas-alt px-2 py-0.5 rounded-lg border border-border">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      className="text-xs font-bold text-text-primary px-1"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      className="text-xs font-bold text-text-primary px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Alamat Pengiriman (Maks. 3 Alamat)
            </h2>
            <Link href="/customer/account" className="text-xs font-semibold text-primary">
              Kelola
            </Link>
          </div>

          <div className="space-y-2">
            {addresses.map((addr) => {
              const isSelected = addr.id === activeAddress?.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/5 ring-1 ring-accent'
                      : 'border-border bg-white hover:border-border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary uppercase">
                      {addr.label} • {addr.recipientName}
                    </span>
                    <span className="text-[10px] text-text-muted">{addr.phone}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{addr.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Courier Selection */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Opsi Ekspedisi / Kurir
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'SiCepat BEST Express', cost: 15000, est: '1-2 Hari' },
              { name: 'JNE YES Reguler', cost: 18000, est: '1 Hari Sampai' },
            ].map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setCourier({ name: opt.name, cost: opt.cost })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  courier.name === opt.name
                    ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-sm'
                    : 'border-border bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Truck size={14} className="text-accent" />
                  {opt.name}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-text-muted">{opt.est}</span>
                  <span className="font-bold text-accent">{formatCurrency(opt.cost)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Promo Voucher */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Voucher Belanja
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Kode promo (e.g. NAILCANTIK)"
              value={customPromoInput}
              onChange={(e) => setCustomPromoInput(e.target.value)}
              className="flex-1 bg-canvas-alt px-3 py-2 rounded-xl border border-border text-xs uppercase focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (customPromoInput) setSelectedPromoCode(customPromoInput);
              }}
              className="px-4 py-2 bg-text-primary text-white text-xs font-semibold rounded-xl"
            >
              Terapkan
            </button>
          </div>
          {activePromo && (
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <Tag size={12} /> Voucher <strong>{activePromo.code}</strong> aktif ({activePromo.name})
            </p>
          )}
        </section>

        {/* Payment Method */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Metode Pembayaran (E-Commerce Platform)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-3 rounded-xl border text-left transition-all ${
                paymentMethod === 'qris'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border bg-white'
              }`}
            >
              <span className="font-bold text-xs text-text-primary block">QRIS Platform</span>
              <span className="text-[10px] text-text-muted">Scan GoPay, OVO, BCA, dll.</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-xl border text-left transition-all ${
                paymentMethod === 'transfer'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border bg-white'
              }`}
            >
              <span className="font-bold text-xs text-text-primary block">Transfer Bank</span>
              <span className="text-[10px] text-text-muted">BCA, Mandiri, Virtual Account</span>
            </button>
          </div>
        </section>

        {/* Summary Card */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-2 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal Produk</span>
            <span className="font-medium text-text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Ongkos Kirim ({courier.name})</span>
            <span className="font-medium text-text-primary">{formatCurrency(courier.cost)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Diskon Promo</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm font-bold">
            <span className="text-text-primary">Total Tagihan</span>
            <span className="text-base text-accent font-bold">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full py-4 px-6 bg-accent text-white rounded-2xl font-bold text-sm hover:bg-amber-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {isProcessing ? 'Memproses Pesanan...' : `Bayar Sekarang (${formatCurrency(grandTotal)})`}
          <ArrowRight size={16} />
        </button>

        {/* Payment Gateway Modal */}
        <PaymentGatewayModal
          isOpen={showGateway}
          onClose={() => setShowGateway(false)}
          onSuccess={handleGatewaySuccess}
          amount={grandTotal}
          invoiceNumber={pendingInvoiceNumber}
          orderTitle="Belanja Produk Nail Art"
          context="product_ecommerce"
          recipientName="PT Clean &amp; Nail Commerce Escrow"
          recipientBank="BCA"
          recipientAccount="8801928371"
          qrisMerchantName="CLEAN &amp; NAIL STORE"
        />
      </div>
    </CustomerLayout>
  );
}
