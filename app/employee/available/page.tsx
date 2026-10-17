'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card, Button } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function AvailableOrdersPage() {
  const {
    currentUser,
    orders,
    services,
    employees,
    claimOrder,
  } = useAppStore();

  const [claiming, setClaming] = useState<string | null>(null);
  const [claimedOrders, setClaimedOrders] = useState<string[]>([]);

  const employee = employees.find((e) => e.id === currentUser?.id);

  // Get available orders that match employee skills
  const availableOrders = orders
    .filter((o) => o.status === 'waiting_employee')
    .filter((o) => {
      const orderService = services.find((s) =>
        o.items.some((item) => item.itemId === s.id && item.type === 'service')
      );
      return orderService && employee?.skills.includes(orderService.name);
    })
    .filter((o) => !claimedOrders.includes(o.id));

  const handleClaimOrder = (orderId: string) => {
    setClaming(orderId);

    // Simulate network delay
    setTimeout(() => {
      const success = claimOrder(orderId, currentUser?.id || '');

      if (success) {
        setClaimedOrders([...claimedOrders, orderId]);
        alert('Order berhasil diambil! 🎉');
      } else {
        alert('Maaf, order telah diambil karyawan lain 😢');
      }

      setClaming(null);
    }, 800);
  };

  return (
    <EmployeeLayout currentPage="available">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Tersedia</h1>

        {availableOrders.length === 0 ? (
          <div className="text-center py-12">
            <Zap size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Tidak ada order tersedia saat ini</p>
            <p className="text-xs text-gray-500 mt-2">Refresh halaman untuk melihat update terbaru</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 items-start">
              <Zap size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <strong>{availableOrders.length}</strong> order menunggu. Klik "Ambil Order" untuk mendapatkan pekerjaan.
              </p>
            </div>

            {availableOrders.map((order) => {
              const orderService = services.find((s) =>
                order.items.some((item) => item.itemId === s.id && item.type === 'service')
              );
              const isProcessing = claiming === order.id;

              return (
                <Card
                  key={order.id}
                  className="border-l-4 border-primary hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{orderService?.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{orderService?.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Location */}
                      <div className="flex gap-2">
                        <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Lokasi</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {order.address.detail.split(',')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex gap-2">
                        <Clock size={16} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Durasi</p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {orderService?.duration} menit
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex gap-2">
                        <DollarSign size={16} className="text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Harga</p>
                          <p className="font-bold text-primary text-sm">
                            {formatCurrency(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Commission */}
                      <div className="flex gap-2">
                        <Zap size={16} className="text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">Komisi (20%)</p>
                          <p className="font-bold text-yellow-600 text-sm">
                            {formatCurrency(order.totalPrice * 0.2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-600">Penerima</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {order.address.recipientName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{order.address.phone}</p>
                    </div>

                    {/* Claim Button */}
                    <Button
                      onClick={() => handleClaimOrder(order.id)}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-primary to-pink-500 hover:shadow-lg transition"
                    >
                      {isProcessing ? '⏳ Memproses...' : '🎯 Ambil Order'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="h-8" />
      </div>
    </EmployeeLayout>
  );
}
