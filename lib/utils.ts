import { PricingRule, Promo, CleaningOrderStatus, ProductOrderStatus } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const generateInvoiceNumber = (type: 'CLN' | 'PRD'): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${type}-${year}${month}${day}-${randomSuffix}`;
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
  const dist = R * c;
  return Math.round(dist * 10) / 10; // 1 decimal place
};

export interface CleaningPriceCalculation {
  basePrice: number;
  distanceKm: number;
  distanceFee: number;
  addonsTotal: number;
  serviceFee: number;
  discount: number;
  total: number;
}

export const calculateCleaningPrice = (
  buildingSizeM2: number,
  distanceKm: number,
  addons: { price: number; quantity: number }[],
  pricingRule: PricingRule,
  promo?: Promo
): CleaningPriceCalculation => {
  // 1. Base Price based on tiers
  let basePrice = 100000;
  const size = Math.max(1, buildingSizeM2);

  const matchedTier = pricingRule.basePriceTiers.find(
    (tier) => size >= tier.minM2 && size <= tier.maxM2
  );

  if (matchedTier) {
    basePrice = matchedTier.price;
  } else if (size > 200) {
    basePrice =
      325000 + Math.round((size - 200) * (pricingRule.pricePerM2Above200 || 1500));
  }

  // 2. Distance Fee (PRD section 17 & 18)
  let distanceFee = 0;
  if (distanceKm > pricingRule.freeDistanceKm) {
    const chargeableKm = Math.ceil(distanceKm - pricingRule.freeDistanceKm);
    distanceFee = chargeableKm * pricingRule.pricePerKm;
  }

  // 3. Add-ons Total
  const addonsTotal = addons.reduce(
    (sum, a) => sum + (a.price || 0) * (a.quantity || 1),
    0
  );

  // 4. Service Fee
  const serviceFee = pricingRule.serviceFee || 5000;

  // 5. Discount Calculation
  const subtotalBeforeDiscount = basePrice + distanceFee + addonsTotal + serviceFee;
  let discount = 0;

  if (promo && promo.isActive) {
    if (!promo.minTransaction || subtotalBeforeDiscount >= promo.minTransaction) {
      if (promo.type === 'percentage') {
        discount = Math.round((subtotalBeforeDiscount * promo.value) / 100);
      } else {
        discount = promo.value;
      }
    }
  }

  const total = Math.max(0, subtotalBeforeDiscount - discount);

  return {
    basePrice,
    distanceKm,
    distanceFee,
    addonsTotal,
    serviceFee,
    discount,
    total,
  };
};

export const calculateDiscount = (promo: Promo, amount: number): number => {
  if (promo.type === 'percentage') {
    return Math.round((amount * promo.value) / 100);
  } else if (promo.type === 'nominal') {
    return promo.value;
  }
  return 0;
};

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    return String(date);
  }
};

export const formatTime = (date: Date | string | undefined): string => {
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

export const getStatusLabel = (status: CleaningOrderStatus | ProductOrderStatus | string): string => {
  const labels: Record<string, string> = {
    // Cleaning Statuses
    searching_employee: 'Mencari Karyawan',
    assigned: 'Karyawan Ditemukan',
    on_the_way: 'Sedang Menuju Lokasi',
    arrived: 'Karyawan Tiba',
    in_service: 'Cleaning Berlangsung',
    completed: 'Selesai',
    cancelled_customer: 'Dibatalkan Customer',
    cancelled_admin: 'Dibatalkan Admin',

    // Product Order Statuses
    waiting_payment: 'Menunggu Pembayaran',
    paid: 'Sudah Dibayar',
    processing: 'Sedang Diproses',
    packed: 'Sudah Dikemas',
    shipped: 'Dalam Pengiriman',
    cancelled: 'Dibatalkan',

    // Payment Statuses
    unpaid: 'Belum Bayar',
    waiting_confirmation: 'Menunggu Konfirmasi',
  };
  return labels[status] || status;
};

export const getStatusColor = (
  status: CleaningOrderStatus | ProductOrderStatus | string
): 'primary' | 'success' | 'warning' | 'danger' => {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'success';
    case 'searching_employee':
    case 'waiting_payment':
    case 'waiting_confirmation':
    case 'unpaid':
      return 'warning';
    case 'cancelled':
    case 'cancelled_customer':
    case 'cancelled_admin':
      return 'danger';
    case 'assigned':
    case 'on_the_way':
    case 'arrived':
    case 'in_service':
    case 'processing':
    case 'packed':
    case 'shipped':
    default:
      return 'primary';
  }
};
