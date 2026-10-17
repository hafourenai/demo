'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card, Button, EmptyState } from '@/components/common';
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
        alert('Order berhasil diambil!');
      } else {
        alert('Maaf, order telah diambil karyawan lain');
      }

      setClaming(null);
    }, 800);
  };

  return (
    <EmployeeLayout currentPage="available">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-serif font-bold text-text-primary">Order Tersedia</h1>

        {availableOrders.length === 0 ? (
          <EmptyState
            icon={<Zap size={48} />}
            title="Tidak ada order tersedia"
            description="Refresh halaman untuk melihat update terbaru"
          />
        ) : (
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3 flex gap-2 items-start">
              <Zap size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                <strong className="text-text-primary">{availableOrders.length}</strong> order menunggu. Klik "Ambil Order" untuk mendapatkan pekerjaan.
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
                  className="border-l-4 border-primary hover:shadow-md transition-shadow duration-base"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div>
                      <h3 className="font-serif font-semibold text-text-primary text-lg">{orderService?.name}</h3>
                      <p className="text-xs text-text-secondary mt-1">{orderService?.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Location */}
                      <div className="flex gap-2">
                        <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-text-muted">Lokasi</p>
                          <p className="font-semibold text-text-primary text-sm">
                            {order.address.detail.split(',')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex gap-2">
                        <Clock size={16} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-text-muted">Durasi</p>
                          <p className="font-semibold text-text-primary text-sm">
                            {orderService?.duration} menit
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex gap-2">
                        <DollarSign size={16} className="text-success flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-text-muted">Harga</p>
                          <p className="font-bold text-primary text-sm">
                            {formatCurrency(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Commission */}
                      <div className="flex gap-2">
                        <Zap size={16} className="text-warning flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-text-muted">Komisi (20%)</p>
                          <p className="font-bold text-warning text-sm">
                            {formatCurrency(order.totalPrice * 0.2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-bg-alt rounded-md p-2">
                      <p className="text-xs text-text-muted">Penerima</p>
                      <p className="font-semibold text-text-primary text-sm">
                        {order.address.recipientName}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">{order.address.phone}</p>
                    </div>

                    {/* Claim Button */}
                    <Button
                      onClick={() => handleClaimOrder(order.id)}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? 'Memproses...' : 'Ambil Order'}
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
