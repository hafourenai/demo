'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Wallet, ShoppingBag, CheckCircle2, Users, MapPin } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Label } from 'recharts';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DashboardPanel, DashboardPanelHeader, DashboardPanelTitle, DashboardPanelDescription, DashboardPanelContent } from '@/components/admin/DashboardPanel';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { buildAdminAnalytics, activeCleaningStatuses, type DashboardPeriod } from '@/lib/admin-analytics';
import { formatCurrency } from '@/lib/utils';
import { OperationalMap } from '@/components/admin/OperationalMap';

const chartConfig = {
  cleaning: { label: 'Cleaning', color: '#9f5265' },
  products: { label: 'Nail art', color: '#40857c' },
};
const statusLabels: Record<string, string> = {
  searching_employee: 'Mencari mitra', assigned: 'Ditugaskan', on_the_way: 'Dalam perjalanan', arrived: 'Tiba di lokasi', in_service: 'Dikerjakan',
  waiting_payment: 'Menunggu bayar', paid: 'Dibayar', processing: 'Diproses', packed: 'Dikemas', shipped: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan',
};
const compactCurrency = (value: number) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export default function AdminDashboard() {
  const { cleaningOrders, productOrders, employees, settlements } = useAppStore();
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const analytics = useMemo(() => buildAdminAnalytics(cleaningOrders, productOrders, period), [cleaningOrders, productOrders, period]);
  const jobs = cleaningOrders.filter(o => activeCleaningStatuses.includes(o.status));
  const busy = new Set(jobs.map(o => o.employeeId).filter(Boolean));
  const outstanding = settlements.reduce((sum, s) => sum + Math.max(0, s.settlementDue - s.paidAmount), 0);
  const settlementPaid = settlements.reduce((sum, s) => sum + s.paidAmount, 0);
  const settlementTotal = settlements.reduce((sum, s) => sum + s.settlementDue, 0);
  const metrics = [
    { label: 'Volume transaksi', value: formatCurrency(analytics.gmv), note: 'GMV, tidak termasuk pesanan batal', icon: Wallet },
    { label: 'Total pesanan', value: analytics.rows.length, note: 'Cleaning dan produk nail art', icon: ShoppingBag },
    { label: 'Pesanan selesai', value: analytics.completed, note: `${analytics.rows.length ? Math.round(analytics.completed / analytics.rows.length * 100) : 0}% dari pesanan dalam periode`, icon: CheckCircle2 },
    { label: 'Mitra tersedia saat ini', value: Math.max(0, employees.length - busy.size), note: `${busy.size} bertugas · ${employees.length} mitra terdaftar`, icon: Users },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><h1 className="text-2xl font-serif font-bold text-slate-900">Ringkasan Bisnis</h1><p className="mt-0.5 text-xs text-slate-500">Operasional cleaning dan penjualan nail art, dalam satu tampilan.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="dashboard-period" className="sr-only">Periode statistik</label>
            <select id="dashboard-period" value={period} onChange={e => setPeriod(e.target.value as DashboardPeriod)} className="!w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option value="all">Semua waktu</option><option value="30">30 hari terakhir</option><option value="7">7 hari terakhir</option>
            </select>
            <Link href="/admin/reports" className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Laporan lengkap <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(metric => (
            <DashboardPanel key={metric.label}>
              <DashboardPanelHeader className="flex-row items-center justify-between !pb-3"><p className="text-xs font-semibold text-slate-500">{metric.label}</p><metric.icon size={18} className="text-slate-400" /></DashboardPanelHeader>
              <DashboardPanelContent><p className="break-words text-2xl font-bold tracking-tight tabular-nums">{ready ? metric.value : '—'}</p><p className="mt-2 text-[11px] text-slate-500">{metric.note}</p></DashboardPanelContent>
            </DashboardPanel>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <DashboardPanel>
            <DashboardPanelHeader className="sm:flex-row sm:items-start sm:justify-between"><div className="space-y-1"><DashboardPanelTitle>Tren Transaksi</DashboardPanelTitle><DashboardPanelDescription>Nilai pesanan berdasarkan tanggal dibuat, bukan laba platform.</DashboardPanelDescription></div><span className="w-fit shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{period === 'all' ? 'Bulanan' : 'Harian'}</span></DashboardPanelHeader>
            <DashboardPanelContent>
              {ready && analytics.rows.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[280px] w-full" aria-label="Grafik volume transaksi cleaning dan nail art">
                  <AreaChart data={analytics.trend} margin={{ left: 0, right: 12, top: 12 }} accessibilityLayer>
                    <defs><linearGradient id="cleaningFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9f5265" stopOpacity={0.22} /><stop offset="100%" stopColor="#9f5265" stopOpacity={0.02} /></linearGradient><linearGradient id="productFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#40857c" stopOpacity={0.18} /><stop offset="100%" stopColor="#40857c" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tickMargin={12} /><YAxis tickFormatter={compactCurrency} tickLine={false} axisLine={false} width={55} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => <span>{name === 'cleaning' ? 'Cleaning' : 'Nail art'}: {formatCurrency(Number(value))}</span>} />} />
                    <Area type="monotone" dataKey="cleaning" stroke="#9f5265" strokeWidth={2.5} fill="url(#cleaningFill)" /><Area type="monotone" dataKey="products" stroke="#40857c" strokeWidth={2.5} fill="url(#productFill)" />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              ) : <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">{ready ? 'Belum ada transaksi pada periode ini.' : 'Memuat grafik…'}</div>}
              <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><span>Pesanan dengan status pembayaran lunas</span><span className="font-semibold text-slate-900">{ready ? formatCurrency(analytics.paid) : '—'}</span></div>
            </DashboardPanelContent>
          </DashboardPanel>

          <DashboardPanel>
            <DashboardPanelHeader><div className="space-y-1"><DashboardPanelTitle>Komposisi Pesanan</DashboardPanelTitle><DashboardPanelDescription>Perbandingan dua lini bisnis, termasuk pesanan batal.</DashboardPanelDescription></div></DashboardPanelHeader>
            <DashboardPanelContent>
              {ready && analytics.rows.length > 0 ? <ChartContainer config={chartConfig} className="mx-auto h-[240px] w-full" aria-label="Komposisi jumlah pesanan">
                <PieChart accessibilityLayer><ChartTooltip content={<ChartTooltipContent nameKey="name" />} /><Pie data={analytics.composition} dataKey="value" nameKey="name" innerRadius={70} outerRadius={92} paddingAngle={4} strokeWidth={0}>
                  <Label content={({ viewBox }) => viewBox && 'cx' in viewBox && 'cy' in viewBox ? <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle"><tspan x={viewBox.cx} dy="-4" className="fill-slate-900 text-3xl font-semibold">{analytics.rows.length}</tspan><tspan x={viewBox.cx} dy="24" className="fill-slate-500 text-xs">pesanan</tspan></text> : null} />
                </Pie></PieChart>
              </ChartContainer> : <div className="flex h-[240px] items-center justify-center text-sm text-slate-500">{ready ? 'Belum ada pesanan.' : 'Memuat grafik…'}</div>}
              <div className="space-y-3">{analytics.composition.map(item => <div key={item.name} className="flex items-center gap-2 text-xs"><span className="size-2.5 rounded-sm" style={{ background: item.fill }} /><span className="text-slate-500">{item.name}</span><span className="ml-auto font-semibold tabular-nums">{ready ? item.value : '—'}</span></div>)}</div>
            </DashboardPanelContent>
          </DashboardPanel>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <DashboardPanel>
            <DashboardPanelHeader className="sm:flex-row sm:items-center sm:justify-between"><div className="space-y-1"><DashboardPanelTitle>Pesanan Terbaru</DashboardPanelTitle><DashboardPanelDescription>Aktivitas terbaru dalam periode yang dipilih.</DashboardPanelDescription></div><Link href="/admin/orders" className="flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:self-auto">Lihat semua <ArrowUpRight size={14} /></Link></DashboardPanelHeader>
            <div className="overflow-x-auto rounded-b-2xl"><table className="w-full min-w-[520px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-700"><tr className="border-y border-slate-200"><th className="px-4 py-3 font-bold">Pelanggan / invoice</th><th className="px-4 py-3 font-bold">Layanan</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 text-right font-bold">Nilai</th></tr></thead><tbody>
              {ready && analytics.rows.slice(0, 5).map(order => <tr key={order.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold">{order.customer}</p><Link className="mt-1 block text-[10px] text-slate-500 hover:underline" href={`/admin/orders?type=${order.kind === 'Cleaning' ? 'cleaning' : 'product'}`}>{order.invoice}</Link></td><td className="max-w-[140px] px-4"><p>{order.kind}</p><p className="mt-1 truncate text-[10px] text-slate-500" title={order.name}>{order.name}</p></td><td className="px-4"><span className={`inline-block whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-semibold ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : order.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{statusLabels[order.status] || order.status}</span></td><td className="px-4 text-right font-semibold tabular-nums">{formatCurrency(order.total)}</td></tr>)}
              {ready && !analytics.rows.length && <tr><td colSpan={4} className="py-10 text-center text-slate-500">Tidak ada pesanan dalam periode ini.</td></tr>}
            </tbody></table></div>
          </DashboardPanel>

          <DashboardPanel>
            <DashboardPanelHeader><div className="space-y-1"><DashboardPanelTitle>Status Pesanan</DashboardPanelTitle><DashboardPanelDescription>Distribusi progres pada periode terpilih.</DashboardPanelDescription></div></DashboardPanelHeader>
            <DashboardPanelContent className="space-y-5">{analytics.statusCounts.map((item, i) => <div key={item.label}><div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">{item.label}</span><span className="font-semibold">{ready ? item.value : '—'}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-[width]" style={{ width: `${ready && analytics.rows.length ? item.value / analytics.rows.length * 100 : 0}%`, background: ['#d2ad69', '#9f5265', '#40857c', '#94a3b8'][i] }} /></div></div>)}</DashboardPanelContent>
          </DashboardPanel>
        </div>

        {ready && <OperationalMap />}

        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardPanel>
            <DashboardPanelHeader className="flex-row items-start justify-between"><div className="space-y-1"><DashboardPanelTitle>Operasional Saat Ini</DashboardPanelTitle><DashboardPanelDescription>Penugasan mitra aktif, terlepas dari filter periode.</DashboardPanelDescription></div><MapPin size={18} className="shrink-0 text-slate-400" /></DashboardPanelHeader>
            <DashboardPanelContent className="space-y-3">
              {ready && employees.map(employee => { const job = jobs.find(o => o.employeeId === employee.id); return <div key={employee.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">{employee.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium">{employee.name}</p><p className="mt-1 truncate text-[11px] text-slate-500">{job ? `${job.serviceName} · ${statusLabels[job.status]}` : 'Siap menerima pesanan'}</p></div><span className={`text-[11px] ${job ? 'text-amber-700' : 'text-emerald-700'}`}>{job ? 'Bertugas' : 'Tersedia'}</span></div>; })}
              <p className="text-[10px] text-slate-400">Data berasal dari store aplikasi; bukan pelacakan GPS langsung.</p>
            </DashboardPanelContent>
          </DashboardPanel>
          <DashboardPanel>
            <DashboardPanelHeader className="sm:flex-row sm:items-start sm:justify-between"><div className="space-y-1"><DashboardPanelTitle>Settlement Mitra</DashboardPanelTitle><DashboardPanelDescription>100% gross ke mitra, setoran platform sesuai tarif settlement.</DashboardPanelDescription></div><Link href="/admin/settlements" className="flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">Kelola <ArrowUpRight size={14} /></Link></DashboardPanelHeader>
            <DashboardPanelContent><p className="text-xs text-slate-500">Sisa kewajiban seluruh periode</p><p className="mt-2 text-3xl font-bold tracking-tight">{ready ? formatCurrency(outstanding) : '—'}</p><div className="my-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#40857c]" style={{ width: `${ready && settlementTotal ? Math.min(100, settlementPaid / settlementTotal * 100) : 0}%` }} /></div><div className="flex justify-between gap-2 text-xs"><span className="text-slate-500">Sudah disetor</span><span className="font-medium">{ready ? formatCurrency(settlementPaid) : '—'}</span></div><div className="mt-3 flex justify-between gap-2 text-xs"><span className="text-slate-500">Total kewajiban</span><span className="font-medium">{ready ? formatCurrency(settlementTotal) : '—'}</span></div></DashboardPanelContent>
          </DashboardPanel>
        </div>
      </div>
    </AdminLayout>
  );
}
