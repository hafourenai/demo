'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, MessageCircle } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
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
          <p>Order not found</p>
        </div>
      </CustomerLayout>
    );
  }

  const employee = order.employeeId ? employees.find((e) => e.id === order.employeeId) : null;
  const statusColor = getStatusColor(order.status);

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

  // Simulate order progression
  useEffect(() => {
    if (order.status === 'waiting_employee' && Math.random() > 0.7) {
      // Randomly simulate employee claiming order
    }
  }, []);

  return (
    <CustomerLayout currentPage="orders">
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <Link href="/customer/orders" className="flex items-center gap-2 mb-4">
          <ArrowLeft size={24} />
          <span className="font-semibold">Kembali</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">Detail Pesanan</h1>

        {/* Order Status */}
        <Card className={`bg-${statusColor}-50 border-${statusColor}-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Status Pesanan</p>
              <p className="font-bold text-lg text-gray-800 mt-1">{getStatusLabel(order.status)}</p>
            </div>
            <Badge variant={statusColor === 'green' ? 'success' : statusColor === 'red' ? 'danger' : 'warning'}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </Card>

        {/* Timeline */}
        <div className="space-y-3">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index <= currentStepIndex ? '✓' : index + 1}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 my-1 transition ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pb-3">
                <p className={`font-semibold ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-500'}`}>
                  {getStatusLabel(step)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Employee Info */}
        {employee && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">Karyawan Anda</h3>
            <div className="flex gap-3">
              <img
                src={employee.photo || 'https://via.placeholder.com/60'}
                alt={employee.name}
                className="w-16 h-16 object-cover rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{employee.name}</h4>
                <p className="text-xs text-gray-600">{employee.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-800">{employee.rating}</span>
                  <span className="text-xs text-gray-600">({employee.totalJobs} pekerjaan)</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <MessageCircle size={20} className="text-gray-600" />
              </button>
            </div>
          </Card>
        )}

        {/* Items */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Pesanan</h3>
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
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Alamat Pengiriman</h3>
          <div className="flex gap-2">
            <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">{order.address.detail}</p>
              <p className="text-xs text-gray-600 mt-1">{order.address.recipientName}</p>
              <p className="text-xs text-gray-600">{order.address.phone}</p>
            </div>
          </div>
        </Card>

        {/* Price Summary */}
        <Card className="bg-gray-50 border-gray-300">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalPrice + order.promoDiscount)}</span>
            </div>
            {order.promoDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Diskon</span>
                <span>-{formatCurrency(order.promoDiscount)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </Card>

        {/* Order Meta */}
        <Card className="bg-gray-50">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>No. Pesanan</span>
              <span className="font-mono font-bold text-gray-800">#{order.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tanggal Pesan</span>
              <span className="font-semibold text-gray-800">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-gray-800">
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
            <h3 className="font-semibold text-gray-800 mb-3">Berikan Rating</h3>
            <div className="space-y-3">
              <div className="flex gap-2 justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl transition hover:scale-110"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tulis ulasan Anda..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
            className="w-full text-red-600 border-red-200"
          >
            Batalkan Pesanan
          </Button>
        )}

        {/* Cancel Confirmation */}
        {showCancelConfirm && (
          <Card className="bg-red-50 border-red-200">
            <h3 className="font-semibold text-red-800 mb-3">Batalkan Pesanan?</h3>
            {order.status !== 'waiting_employee' && (
              <div className="mb-3">
                <label className="text-sm text-gray-700 font-semibold">Alasan Pembatalan</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
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
                className="flex-1 bg-red-600 hover:bg-red-700"
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
