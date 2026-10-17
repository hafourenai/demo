'use client';

import { Star } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { Card } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function EmployeeAccountPage() {
  const { currentUser, employees, orders } = useAppStore();

  const employee = employees.find((e) => e.id === currentUser?.id);
  const employeeOrders = orders.filter((o) => o.employeeId === currentUser?.id);
  const completedOrders = employeeOrders.filter((o) => o.status === 'completed');
  const totalCommission = completedOrders.reduce((sum, order) => sum + order.totalPrice * 0.2, 0);

  return (
    <EmployeeLayout currentPage="account">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-primary to-pink-500 text-white">
          <div className="flex items-start gap-4">
            <img
              src={employee?.photo || 'https://via.placeholder.com/80'}
              alt={employee?.name}
              className="w-20 h-20 object-cover rounded-full border-4 border-white"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{employee?.name}</h2>
              <p className="text-sm opacity-90 mt-1">{employee?.role}</p>
              <div className="flex items-center gap-2 mt-3 bg-white/20 w-fit px-3 py-1 rounded-full">
                <Star size={16} className="fill-white" />
                <span className="font-bold">{employee?.rating}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Informasi Kontak</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs font-semibold">Email</p>
              <p className="font-semibold text-gray-800 mt-1">{employee?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-semibold">Nomor HP</p>
              <p className="font-semibold text-gray-800 mt-1">{employee?.phone}</p>
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Skill</h3>
          <div className="flex flex-wrap gap-2">
            {employee?.skills.map((skill) => (
              <span key={skill} className="badge badge-primary">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Total Pekerjaan</p>
            <p className="text-2xl font-bold text-primary mt-3">{employee?.totalJobs}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Rating</p>
            <div className="flex items-center gap-1 mt-3">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-gray-800">{employee?.rating}</span>
            </div>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Total Komisi</p>
            <p className="text-lg font-bold text-green-600 mt-3">{formatCurrency(totalCommission)}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 font-semibold">Status</p>
            <p className="text-lg font-bold text-primary mt-3">
              {employee?.isActive ? 'Aktif' : 'Tidak Aktif'}
            </p>
          </Card>
        </div>

        <div className="h-8" />
      </div>
    </EmployeeLayout>
  );
}
