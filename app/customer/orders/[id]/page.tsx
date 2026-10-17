'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Star, MessageCircle } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button, StatusBadge } from '@/components/common';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { OrderStatus } from '@/lib/types';

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    employees,
    services,
    products,
    updateOrderStatus,
    getOrderById,
  } = useAppStore();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRating, setShowRating] = useState(false);

  const order = getOrderById(params.id);

  if (!order) {
    return (
      <CustomerLayout currentPage="orders">
        <div className="px-4 py-4">
          <p className="text-text-secondary">Pesanan tidak ditemukan</p>
        </div>
      </CustomerLayout>
    );
  }

  const employee = order.employeeId ? employees.find((e) => e.id === order.employeeId) : null;

  const getStatusForBadge = (status: string): 'active' | 'pending' | 'completed' | 'cancelled' => {
    if (status === 'completed') return 'completed';
    if (status === 'cancelled_customer' || status === 'cancelled_admin') return 'cancelled';
    if (status === 'waiting_employee' || status === 'waiting_confirmation') return 'pending';
    return 'active';
  };

  const handleCancel = () => {
    if (order.status === 'waiting_employee') {
      updateOrderStatus(params.id, 'cancelled_customer');
      setShowCancelConfirm(false);
    } else {
      if (!cancelReason) {
        alert('Pilih alasan pembatalan');
        return;
      }
      updateOrderStatus(params.id, 'cancelled_customer');
      setShowCancelConfirm(false);
    }
  };

  const canCancel =
    order.status === 'waiting_employee' || 
    order.status === 'accepted' || 
    order.status === 'going_to_location';

  const statusSteps: OrderStatus[] = [
    'waiting_employee',
    'accepted',
    'going_to_location',
    'arrived',
    'in_progress',
    'completed',
  ];

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <CustomerLayout currentPage="orders">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <Link href="/customer/orders" className="flex items-center gap-2 mb-4 text-primary hover:text-primary-dark transition-colors duration-base">
          <ArrowLeft size={24} />
          <span className="font-semibold">Kembali</span>
        </Link>

        <h1 className="text-2xl font-serif font-bold text-text-primary">Detail Pesanan</h1>

        {/* Order Status */}
        <Card className="bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Status Pesanan</p>
              <p className="font-bold text-lg text-text-primary mt-1">{getStatusLabel(order.status)}</p>
            </div>
            <StatusBadge status={getStatusForBadge(order.status)} label={getStatusLabel(order.status)} />
          </div>
        </Card>

        {/* Timeline */}
        <div className="space-y-3">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-base ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-border text-text-muted'
                  }`}
                >
                  {index <= currentStepIndex ? '✓' : index + 1}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 my-1 transition-colors duration-base ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
              <div className="pb-3">
                <p className={`font-semibold ${index <= currentStepIndex ? 'text-text-primary' : 'text-text-muted'}`}>
                  {getStatusLabel(step)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Employee Info */}
        {employee && (
          <Card>
            <h3 className="font-serif font-semibold text-text-primary mb-3">Karyawan Anda</h3>
            <div className="flex gap-3">
              <img
                src={employee.photo || 'https://via.placeholder.com/60'}
                alt={employee.name}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="font-serif font-semibold text-text-primary">{employee.name}</h4>
                <p className="text-xs text-text-secondary">{employee.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-warning fill-warning" />
                  <span className="text-xs font-semibold text-text-primary">{employee.rating}</span>
                  <span className="text-xs text-text-secondary">({employee.totalJobs} pekerjaan)</span>
                </div>
              </div>
              <button className="p-2 hover:bg-bg-alt rounded-md transition-colors duration-base" aria-label="Hubungi karyawan">
                <MessageCircle size={20} className="text-text-secondary" />
              </button>
            </div>
          </Card>
        )}

        {/* Items */}
        <div>
          <h3 className="font-serif font-semibold text-text-primary mb-3">Pesanan</h3>
          <div className="space-y-2">
            {order.items.map((item) => {
              const service = services.find((s) => s.id === item.itemId);
              const product = products.find((p) => p.id === item.itemId);
              const itemData = service || product;

              if (!itemData) return null;

              return (
                <Card key={item.id} className="flex gap-3">
                  <img
                    src={itemData.image}
                    alt={itemData.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif font-semibold text-text-primary text-sm">{itemData.name}</h4>
                    {service && item.variationId && (
                      <p className="text-xs text-text-secondary">
                        {service.variations.find((v) => v.id === item.variationId)?.name}
                      </p>
                    )}
                    <p className="text-primary font-bold text-sm mt-1">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        <Card>
          <h3 className="font-serif font-semibold text-text-primary mb-3">Alamat Pengiriman</h3>
          <div className="flex gap-2">
            <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary">{order.address.detail}</p>
              <p className="text-xs text-text-secondary mt-1">{order.address.recipientName}</p>
              <p className="text-xs text-text-secondary">{order.address.phone}</p>
            </div>
          </div>
        </Card>

        {/* Price Summary */}
        <Card className="bg-bg-alt border border-border">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalPrice + order.promoDiscount)}</span>
            </div>
            {order.promoDiscount > 0 && (
              <div className="flex justify-between text-success font-semibold">
                <span>Diskon</span>
                <span>-{formatCurrency(order.promoDiscount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
              <span className="text-text-primary">Total</span>
              <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </Card>

        {/* Order Meta */}
        <Card className="bg-bg-alt">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>No. Pesanan</span>
              <span className="font-mono font-bold text-text-primary">#{order.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tanggal Pesan</span>
              <span className="font-semibold text-text-primary">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-text-primary">
                {order.paymentMethod === 'cash' ? 'Cash' : order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer'}
              </span>
            </div>
          </div>
        </Card>

        {/* Rating */}
        {order.status === 'completed' && !showRating && (
          <Button onClick={() => setShowRating(true)} variant="secondary" className="w-full">
            Berikan Rating
          </Button>
        )}

        {showRating && (
          <Card>
            <h3 className="font-serif font-semibold text-text-primary mb-3">Berikan Rating</h3>
            <div className="space-y-3">
              <div className="flex gap-2 justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl transition-transform duration-base hover:scale-110"
                    aria-label={`Rating ${star} bintang`}
                  >
                    {star <= rating ? <Star size={28} className="fill-warning text-warning" /> : <Star size={28} className="text-text-muted" />}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tulis ulasan Anda..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                rows={3}
              />
              <Button className="w-full" onClick={() => setShowRating(false)}>
                Kirim Rating
              </Button>
            </div>
          </Card>
        )}

        {/* Cancel Button */}
        {canCancel && order.status !== 'completed' && (
          <Button
            onClick={() => setShowCancelConfirm(true)}
            variant="secondary"
            className="w-full text-danger border-danger/20"
          >
            Batalkan Pesanan
          </Button>
        )}

        {/* Cancel Confirmation */}
        {showCancelConfirm && (
          <Card className="bg-danger/5 border border-danger/20">
            <h3 className="font-serif font-semibold text-danger mb-3">Batalkan Pesanan?</h3>
            {order.status !== 'waiting_employee' && (
              <div className="mb-3">
                <label className="text-sm text-text-primary font-semibold">Alasan Pembatalan</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full mt-2 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-danger text-sm"
                >
                  <option value="">Pilih alasan</option>
                  <option value="wrong_service">Salah memilih layanan</option>
                  <option value="wrong_address">Salah alamat</option>
                  <option value="schedule_changed">Jadwal berubah</option>
                  <option value="waiting_too_long">Menunggu terlalu lama</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCancelConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Tidak
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 bg-danger hover:bg-danger/80"
              >
                Ya, Batalkan
              </Button>
            </div>
          </Card>
        )}

        <div className="h-8" />
      </div>
    </CustomerLayout>
  );
}
