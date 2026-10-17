'use client';

import { useState, useEffect } from 'react';
import { Star, Briefcase, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function EmployeeDashboard() {
  const { currentUser, orders, employees } = useAppStore();
  const [stats, setStats] = useState({
    availableOrders: 0,
    activeOrders: 0,
    completedToday: 0,
    commissionToday: 0,
  });

  const employee = employees.find((e) => e.id === currentUser?.id);
  const employeeOrders = orders.filter((o) => o.employeeId === currentUser?.id);

  useEffect(() => {
    const today = new Date().toDateString();
    const todayOrders = employeeOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );

    const available = orders.filter(
      (o) =>
        o.status === 'waiting_employee' &&
        employee?.skills.some(() =>
          o.items.some(
            (item) =>
              orders
                .find((ord) => ord.items.some((i) => i.itemId === item.itemId))
                ?.items.some((i) => i.itemId === item.itemId)
          )
        )
    ).length;

    const active = employeeOrders.filter(
      (o) =>
        o.status === 'accepted' ||
        o.status === 'going_to_location' ||
        o.status === 'arrived' ||
        o.status === 'in_progress'
    ).length;

    const completed = todayOrders.filter((o) => o.status === 'completed').length;

    const commission = todayOrders.reduce((sum, order) => sum + order.totalPrice * 0.2, 0);

    setStats({
      availableOrders: available,
      activeOrders: active,
      completedToday: completed,
      commissionToday: commission,
    });
  }, [orders, employee, employeeOrders, currentUser?.id]);

  const statCards = [
    {
      icon: <Briefcase size={24} />,
      label: 'Order Tersedia',
      value: stats.availableOrders,
      color: 'primary',
    },
    {
      icon: <Clock size={24} />,
      label: 'Order Aktif',
      value: stats.activeOrders,
      color: 'accent',
    },
    {
      icon: <Star size={24} />,
      label: 'Selesai Hari Ini',
      value: stats.completedToday,
      color: 'success',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Komisi Hari Ini',
      value: formatCurrency(stats.commissionToday),
      color: 'primary',
    },
  ];

  return (
    <EmployeeLayout currentPage="home">
      <div className="px-4 py-4 space-y-4">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-text-primary">
            Selamat pagi, {employee?.name?.split(' ')[0]}
          </h2>
          <p className="text-sm text-text-secondary mt-1">{employee?.role}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, idx) => (
            <Card key={idx} className="flex flex-col items-center justify-center p-4">
              <div className={`text-${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-xs text-text-secondary text-center">{stat.label}</p>
              <p className="font-bold text-lg text-text-primary mt-1 text-center">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Rating Card */}
        <Card className="bg-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rating Anda</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-2xl font-bold">{employee?.rating}</span>
                <Star size={20} className="fill-accent text-accent" />
              </div>
              <p className="text-xs opacity-75 mt-1">{employee?.totalJobs} pekerjaan selesai</p>
            </div>
            <div className="text-4xl opacity-20">
              <Star className="fill-white" />
            </div>
          </div>
        </Card>

        {/* Active Order */}
        {employeeOrders.some(
          (o) =>
            o.status === 'accepted' ||
            o.status === 'going_to_location' ||
            o.status === 'arrived' ||
            o.status === 'in_progress'
        ) && (
          <Card className="border-l-4 border-primary">
            <h3 className="font-serif font-semibold text-text-primary mb-2">Order Aktif</h3>
            <p className="text-sm text-text-secondary">
              Anda memiliki {stats.activeOrders} order yang sedang dikerjakan
            </p>
          </Card>
        )}

        {/* Quick Action */}
        <Card className="bg-bg-alt text-center p-6">
          <p className="text-sm text-text-secondary mb-3">
            {stats.availableOrders > 0
              ? `${stats.availableOrders} order baru menunggu Anda`
              : 'Tidak ada order baru saat ini'}
          </p>
          <a href="/employee/available" className="text-primary font-semibold hover:text-primary-dark transition-colors duration-base inline-flex items-center gap-1">
            Lihat Order Tersedia <ArrowRight size={16} />
          </a>
        </Card>

        <div className="h-8" />
      </div>
    </EmployeeLayout>
  );
}
