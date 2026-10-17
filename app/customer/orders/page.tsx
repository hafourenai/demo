'use client';

import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card } from '@/components/common';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default function OrdersPage() {
  const { currentUser, orders, services, products } = useAppStore();
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const customerOrders = orders.filter((o) => o.customerId === currentUser?.id);

  const activeOrders = customerOrders.filter(
    (o) => !['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status)
  );

  const completedOrders = customerOrders.filter(
    (o) => ['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status)
  );

  const displayedOrders = tab === 'active' ? activeOrders : completedOrders;

  const getOrderItemsLabel = (order: typeof orders[0]) => {
    const serviceItems = order.items.filter((i) => i.type === 'service');
    const productItems = order.items.filter((i) => i.type === 'product');

    const labels = [];
    if (serviceItems.length > 0) labels.push('LAYANAN');
    if (productItems.length > 0) labels.push('PRODUK');

    return labels.join(' • ');
  };

  return (
    <CustomerLayout currentPage="orders">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-3 font-semibold transition border-b-2 ${
              tab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Clock size={18} className="inline mr-2" />
            Berjalan ({activeOrders.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-3 font-semibold transition border-b-2 ${
              tab === 'completed'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <CheckCircle size={18} className="inline mr-2" />
            Selesai ({completedOrders.length})
          </button>
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {tab === 'active' ? 'Tidak ada pesanan berjalan' : 'Tidak ada pesanan selesai'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              const firstItem = order.items[0];
              const service = services.find((s) => s.id === firstItem?.itemId);
              const product = products.find((p) => p.id === firstItem?.itemId);
              const itemData = service || product;

              return (
                <Link key={order.id} href={`/customer/orders/${order.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition">
                    <div className="flex gap-3">
                      {itemData && (
                        <img
                          src={itemData.image}
                          alt={itemData.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{itemData?.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{getOrderItemsLabel(order)}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`badge badge-${statusColor} text-xs flex-shrink-0`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-3">
                          <span className="text-xs text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-primary font-bold">{formatCurrency(order.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="h-8" />
      </div>
    </CustomerLayout>
  );
}
