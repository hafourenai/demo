import type { CleaningOrder, ProductOrder } from './types';

export type DashboardPeriod = '7' | '30' | 'all';
export const activeCleaningStatuses = ['assigned', 'on_the_way', 'arrived', 'in_service'];

export function buildAdminAnalytics(cleaning: CleaningOrder[], products: ProductOrder[], period: DashboardPeriod, now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (period === '7' ? 6 : 29));
  const rows = [
    ...cleaning.map(o => ({ id: o.id, invoice: o.invoiceNumber, customer: o.customerName || 'Pelanggan', name: o.serviceName, kind: 'Cleaning', total: o.priceBreakdown.total, status: o.status, paid: o.paymentStatus === 'paid', date: new Date(o.createdAt) })),
    ...products.map(o => ({ id: o.id, invoice: o.invoiceNumber, customer: o.customerName || 'Pelanggan', name: o.items.map(i => i.productName).join(', '), kind: 'Nail art', total: o.total, status: o.status, paid: o.paymentStatus === 'paid', date: new Date(o.createdAt) })),
  ].filter(o => Number.isFinite(o.date.getTime()) && o.date <= end && (period === 'all' || o.date >= start));

  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const dayKey = (d: Date) => `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
  const buckets = new Map<string, { label: string; cleaning: number; products: number }>();
  if (period === 'all') {
    // Include at least six calendar months so a single-month dataset remains legible.
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const oldest = rows.reduce((d, o) => o.date < d ? o.date : d, sixMonthsAgo);
    const cursor = new Date(oldest.getFullYear(), oldest.getMonth(), 1);
    while (cursor <= end) {
      buckets.set(monthKey(cursor), { label: cursor.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }), cleaning: 0, products: 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const cursor = new Date(start);
    while (cursor <= end) {
      buckets.set(dayKey(cursor), { label: cursor.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), cleaning: 0, products: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  const valid = rows.filter(o => o.status !== 'cancelled');
  valid.forEach(o => {
    const bucket = buckets.get(period === 'all' ? monthKey(o.date) : dayKey(o.date));
    if (bucket) bucket[o.kind === 'Cleaning' ? 'cleaning' : 'products'] += o.total;
  });
  const composition = [
    { name: 'Cleaning', value: rows.filter(o => o.kind === 'Cleaning').length, fill: '#9f5265' },
    { name: 'Nail art', value: rows.filter(o => o.kind === 'Nail art').length, fill: '#40857c' },
  ];
  const statusCounts = [
    { label: 'Menunggu', value: rows.filter(o => ['searching_employee', 'waiting_payment', 'paid'].includes(o.status)).length },
    { label: 'Diproses', value: rows.filter(o => [...activeCleaningStatuses, 'processing', 'packed', 'shipped'].includes(o.status)).length },
    { label: 'Selesai', value: rows.filter(o => o.status === 'completed').length },
    { label: 'Dibatalkan', value: rows.filter(o => o.status === 'cancelled').length },
  ];
  return {
    rows: rows.sort((a, b) => b.date.getTime() - a.date.getTime()),
    trend: Array.from(buckets.values()), composition, statusCounts,
    gmv: valid.reduce((sum, o) => sum + o.total, 0),
    paid: valid.filter(o => o.paid).reduce((sum, o) => sum + o.total, 0),
    completed: rows.filter(o => o.status === 'completed').length,
  };
}
