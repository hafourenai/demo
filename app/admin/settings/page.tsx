'use client';

import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button } from '@/components/common';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>

        {/* General Settings */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Pengaturan Umum</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Nama Bisnis</label>
              <input
                type="text"
                defaultValue="Salon & Beauty"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email Bisnis</label>
              <input
                type="email"
                defaultValue="admin@salon.com"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
              <input
                type="tel"
                defaultValue="0812999999"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button>Simpan Pengaturan</Button>
          </div>
        </Card>

        {/* Commission Settings */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Pengaturan Komisi</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Persentase Komisi Karyawan (%)</label>
              <input
                type="number"
                defaultValue="20"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button>Simpan</Button>
          </div>
        </Card>

        {/* Service Area */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Area Layanan</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Radius Pencarian Karyawan (KM)</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button>Simpan</Button>
          </div>
        </Card>

        {/* System Status */}
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-4">Status Sistem</h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">Version: 1.0.0</p>
            <p className="text-blue-800">Database: Demo (LocalStorage)</p>
            <p className="text-blue-800">Last Updated: {new Date().toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
