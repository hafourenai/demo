'use client';

import { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button } from '@/components/common';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    currentUser,
    cart,
    removeFromCart,
    updateCartItem,
    clearCart,
    services,
    products,
    promos,
    createOrder,
    getCartTotal,
    customers,
  } = useAppStore();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'qris'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);

  const customer = customers.find((c) => c.id === currentUser?.id);
  const subtotal = getCartTotal();
  const promoData = promos.find((p) => p.id === selectedPromo);
  const discount = promoData ? (promoData.type === 'percentage' ? (subtotal * promoData.value) / 100 : promoData.value) : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert('Pilih alamat terlebih dahulu');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const address = customer?.addresses.find((a) => a.id === selectedAddress);
      if (!address) return;

      const newOrder: Order = {
        id: generateId(),
        customerId: currentUser?.id || '',
        items: cart,
        address,
        status: 'waiting_employee',
        totalPrice: total,
        promoId: selectedPromo || undefined,
        promoDiscount: discount,
        paymentMethod,
        paymentStatus: 'success',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createOrder(newOrder);
      clearCart();
      setIsProcessing(false);

      router.push(`/customer/orders/${newOrder.id}`);
    }, 1500);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <CustomerLayout currentPage="orders">
        <div className="px-4 py-4">
          <Link href="/customer/services" className="flex items-center gap-2 mb-6">
            <ArrowLeft size={24} />
            <span className="font-semibold">Kembali</span>
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Keranjang Anda kosong</p>
            <Link href="/customer/services" className="mt-4 inline-block">
              <Button>Mulai Berbelanja</Button>
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout currentPage="orders">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <Link href="/customer/products" className="flex items-center gap-2 mb-6">
          <ArrowLeft size={24} />
          <span className="font-semibold">Kembali</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        {/* Items */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Pesanan Anda</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cart.map((item) => {
              const service = services.find((s) => s.id === item.itemId);
              const product = products.find((p) => p.id === item.itemId);
              const itemData = service || product;

              if (!itemData) return null;

              return (
                <Card key={item.id} className="flex gap-3">
                  <img
                    src={itemData.image}
                    alt={itemData.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{itemData.name}</h4>
                    {service && item.variationId && (
                      <p className="text-xs text-gray-600">
                        {service.variations.find((v) => v.id === item.variationId)?.name}
                      </p>
                    )}
                    <p className="text-primary font-bold text-sm mt-1">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Address Selection */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Alamat Pengiriman</h3>
          <div className="space-y-2">
            {customer?.addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`w-full p-3 rounded-lg border-2 transition text-left ${
                  selectedAddress === address.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">
                  {address.label === 'home' ? '🏠 Rumah' : address.label === 'office' ? '🏢 Kantor' : '📍 Lainnya'}
                </div>
                <p className="text-xs text-gray-600 mt-1">{address.detail}</p>
                <p className="text-xs text-gray-500 mt-1">{address.recipientName} • {address.phone}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Kode Promo</h3>
          <div className="space-y-2">
            {promos.map((promo) => (
              <button
                key={promo.id}
                onClick={() => setSelectedPromo(promo.id)}
                className={`w-full p-3 rounded-lg border-2 transition text-left ${
                  selectedPromo === promo.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-800">{promo.name}</div>
                    <p className="text-xs text-gray-600 mt-1">{promo.code}</p>
                  </div>
                  <div className="badge badge-success text-xs">
                    {promo.type === 'percentage' ? `${promo.value}%` : formatCurrency(promo.value)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Metode Pembayaran</h3>
          <div className="space-y-2">
            {[
              { value: 'qris', label: '📱 QRIS', desc: 'Scan QR Code' },
              { value: 'transfer', label: '🏦 Transfer Bank', desc: 'Virtual Account' },
              { value: 'cash', label: '💵 Cash', desc: 'Bayar di tempat' },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setPaymentMethod(value as any)}
                className={`w-full p-3 rounded-lg border-2 transition text-left ${
                  paymentMethod === value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">{label}</div>
                <p className="text-xs text-gray-600 mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <Card className="bg-gray-50 border-gray-300">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Diskon</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </Card>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isProcessing || !selectedAddress}
          className="w-full text-lg"
        >
          {isProcessing ? 'Memproses...' : `Lanjut Pembayaran`}
        </Button>

        <div className="h-8" />
      </div>
    </CustomerLayout>
  );
}
