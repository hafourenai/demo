'use client';

import { Star } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card } from '@/components/common';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const { currentUser, orders, services } = useAppStore();

  const employeeCompletedOrders = orders.filter(
    (o) => o.employeeId === currentUser?.id && o.status === 'completed'
  );

  const totalEarnings = employeeCompletedOrders.reduce((sum, order) => sum + order.totalPrice * 0.2, 0);

  return (
    <EmployeeLayout currentPage="history">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pekerjaan</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Total Pekerjaan</p>
            <p className="text-2xl font-bold text-primary mt-2">{employeeCompletedOrders.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Total Komisi</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalEarnings)}</p>
          </Card>
        </div>

        {/* Completed Orders */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Pekerjaan Selesai</h3>
          {employeeCompletedOrders.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-600">Belum ada pekerjaan selesai</p>
            </Card>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {employeeCompletedOrders.map((order) => {
                const service = services.find((s) =>
                  order.items.some((item) => item.itemId === s.id && item.type === 'service')
                );

                return (
                  <Card key={order.id} className="flex gap-3">
                    <img
                      src={service?.image}
                      alt={service?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{service?.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(order.completedAt || order.createdAt)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-800">4.8</span>
                        </div>
                        <span className="text-primary font-bold text-sm">
                          +{formatCurrency(order.totalPrice * 0.2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </EmployeeLayout>
  );
}
