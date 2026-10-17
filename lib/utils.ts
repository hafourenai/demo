import { Promo } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateDiscount = (promo: Promo, amount: number): number => {
  if (promo.type === 'percentage') {
    return Math.round((amount * promo.value) / 100);
  } else if (promo.type === 'nominal') {
    return promo.value;
  }
  return 0;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substr(0, 2);
};

export const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    return '';
  }
};

export const formatTime = (date: Date | undefined): string => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  } catch (error) {
    return '';
  }
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    waiting_employee: 'Menunggu Karyawan',
    accepted: 'Diterima',
    going_to_location: 'Menuju Lokasi',
    arrived: 'Tiba di Lokasi',
    in_progress: 'Sedang Dikerjakan',
    completed: 'Selesai',
    cancelled_customer: 'Dibatalkan Customer',
    cancelled_admin: 'Dibatalkan Admin',
    pending: 'Pending',
    success: 'Berhasil',
    failed: 'Gagal',
    diproses: 'Diproses',
    in_delivery: 'Dalam Pengiriman',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    waiting_employee: 'yellow',
    accepted: 'blue',
    going_to_location: 'blue',
    arrived: 'green',
    in_progress: 'blue',
    completed: 'green',
    cancelled_customer: 'red',
    cancelled_admin: 'red',
    pending: 'yellow',
    success: 'green',
    failed: 'red',
  };
  return colors[status] || 'gray';
};
