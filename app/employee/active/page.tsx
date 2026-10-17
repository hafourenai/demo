'use client';

import { useState } from 'react';
import { MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card, Button, StatusBadge, EmptyState } from '@/components/common';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { OrderStatus } from '@/lib/types';

export default function ActiveOrdersPage() {
  const { currentUser, orders, services, updateOrderStatus } = useAppStore();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const activeOrders = orders.filter(
    (o) =>
      o.employeeId === currentUser?.id &&
      ['accepted', 'going_to_location', 'arrived', 'in_progress'].includes(o.status)
  );

  const statusFlow: OrderStatus[] = ['accepted', 'going_to_location', 'arrived', 'in_progress', 'completed'];

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const handleStatusUpdate = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextStatus = getNextStatus(order.status as OrderStatus);
    if (nextStatus) {
      setUpdatingOrderId(orderId);
      setTimeout(() => {
        updateOrderStatus(orderId, nextStatus);
        setUpdatingOrderId(null);
      }, 500);
    }
  };

  if (activeOrders.length === 0) {
    return (
      <EmployeeLayout currentPage="active">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-4">Order Aktif</h1>
          <EmptyState
            icon={<CheckCircle size={48} />}
            title="Tidak ada order aktif"
            description="Ambil order dari halaman Order Tersedia untuk mulai bekerja"
            action={{ label: 'Lihat Order Tersedia', onClick: () => (window.location.href = '/employee/available') }}
          />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout currentPage="active">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-serif font-bold text-text-primary">Order Aktif ({activeOrders.length})</h1>

        <div className="space-y-3">
          {activeOrders.map((order) => {
            const orderService = services.find((s) =>
              order.items.some((item) => item.itemId === s.id && item.type === 'service')
            );
            const nextStatus = getNextStatus(order.status as OrderStatus);
            const isUpdating = updatingOrderId === order.id;

            return (
              <Card key={order.id} className="border-l-4 border-primary">
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-semibold text-text-primary">{orderService?.name}</h3>
                    <StatusBadge status="active" label={getStatusLabel(order.status)} />
                  </div>

                  {/* Details */}
                  <div className="space-y-2 bg-canvas-alt p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-text-muted">Lokasi</p>
                        <p className="font-semibold text-text-primary text-sm">{order.address.detail}</p>
                        <p className="text-xs text-text-secondary mt-1">{order.address.recipientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock size={16} className="text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-text-muted">Durasi & Harga</p>
                        <p className="font-semibold text-text-primary text-sm">
                          {orderService?.duration} menit • {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Steps */}
                  <div className="bg-canvas-alt rounded-md p-3">
                    <p className="text-xs text-text-muted mb-2">Progress Order</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {statusFlow.map((status, idx) => {
                        const isActive = order.status === status;
                        const isCompleted = statusFlow.indexOf(order.status as OrderStatus) >= idx;

                        return (
                          <div key={status} className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs whitespace-nowrap transition-colors duration-base ${
                                isActive
                                  ? 'bg-primary text-white shadow-md'
                                  : isCompleted
                                  ? 'bg-success text-white'
                                  : 'bg-border text-text-muted'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            {idx < statusFlow.length - 1 && (
                              <div
                                className={`w-6 h-0.5 ${
                                  isCompleted ? 'bg-success' : 'bg-border'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  {nextStatus && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id)}
                      disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <ArrowRight size={18} />
                      {isUpdating ? 'Update...' : `Lanjut ke ${getStatusLabel(nextStatus)}`}
                    </Button>
                  )}

                  {!nextStatus && (
                    <div className="bg-success/10 border border-success/20 rounded-md p-3 text-center">
                      <CheckCircle size={20} className="text-success mx-auto mb-1" />
                      <p className="text-sm font-semibold text-success">Order Selesai</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="h-8" />
      </div>
    </EmployeeLayout>
  );
}
