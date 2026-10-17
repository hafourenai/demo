'use client';

import { useState } from 'react';
import { MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card, Button } from '@/components/common';
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Aktif</h1>
          <div className="text-center py-12">
            <CheckCircle size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Tidak ada order aktif</p>
            <a href="/employee/available" className="text-primary font-semibold hover:underline mt-4 inline-block">
              Lihat Order Tersedia →
            </a>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout currentPage="active">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Aktif ({activeOrders.length})</h1>

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
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">{orderService?.name}</h3>
                    <span className="badge badge-primary text-xs">{getStatusLabel(order.status)}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600">Lokasi</p>
                        <p className="font-semibold text-gray-800 text-sm">{order.address.detail}</p>
                        <p className="text-xs text-gray-600 mt-1">{order.address.recipientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock size={16} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-600">Durasi & Harga</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {orderService?.duration} menit • {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Steps */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">Progress Order</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {statusFlow.map((status, idx) => {
                        const isActive = order.status === status;
                        const isCompleted = statusFlow.indexOf(order.status as OrderStatus) >= idx;

                        return (
                          <div key={status} className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs whitespace-nowrap transition ${
                                isActive
                                  ? 'bg-primary text-white shadow-lg'
                                  : isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            {idx < statusFlow.length - 1 && (
                              <div
                                className={`w-6 h-0.5 ${
                                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
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
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-pink-500"
                    >
                      <ArrowRight size={18} />
                      {isUpdating ? 'Update...' : `Lanjut ke ${getStatusLabel(nextStatus)}`}
                    </Button>
                  )}

                  {!nextStatus && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <CheckCircle size={20} className="text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-green-700">Order Selesai! 🎉</p>
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
