'use client';

import { useState } from 'react';
import { MapPin, User } from 'lucide-react';
import useAppStore from '@/lib/store';
import { activeCleaningStatuses } from '@/lib/admin-analytics';
import { DashboardPanel, DashboardPanelHeader, DashboardPanelTitle, DashboardPanelDescription, DashboardPanelContent } from './DashboardPanel';

export function OperationalMap() {
  const { employees, cleaningOrders } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState('');
  const markers = employees.map((employee, i) => {
    const job = cleaningOrders.find(o => o.employeeId === employee.id && activeCleaningStatuses.includes(o.status));
    const status = !job ? 'available' : job.status === 'on_the_way' ? 'on_the_way' : 'in_service';
    return { id: employee.id, name: employee.name, status, detail: job?.serviceName || 'Siap menerima pesanan', x: 15 + ((i * 24 + 10) % 65), y: 18 + ((i * 28 + 15) % 50) };
  });
  const waiting = cleaningOrders.filter(o => o.status === 'searching_employee').map((order, i) => ({ id: order.id, name: order.customerName || order.serviceName, status: 'waiting', detail: `${order.serviceName} · ${order.address.detail}`, x: 25 + ((i * 30 + 12) % 55), y: 30 + ((i * 20 + 20) % 40) }));
  const all = [...markers, ...waiting];
  const colors: Record<string, string> = { available: '#40857c', on_the_way: '#d2ad69', in_service: '#526a8b', waiting: '#9f5265' };
  const labels: Record<string, string> = { available: 'Mitra tersedia', on_the_way: 'Dalam perjalanan', in_service: 'Sedang bertugas', waiting: 'Menunggu mitra' };
  const current = all.find(m => m.id === selected);

  return <DashboardPanel>
    <DashboardPanelHeader className="sm:flex-row sm:items-start sm:justify-between"><div className="space-y-1"><DashboardPanelTitle>Peta Operasional</DashboardPanelTitle><DashboardPanelDescription>Simulasi sebaran mitra dan pesanan. Posisi bukan koordinat GPS aktual.</DashboardPanelDescription></div><span className="w-fit shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">Simulasi</span></DashboardPanelHeader>
    <DashboardPanelContent>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter peta">
        {[['all', 'Semua'], ...Object.entries(labels)].map(([key, label]) => <button key={key} onClick={() => { setFilter(key); setSelected(''); }} aria-pressed={filter === key} className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${filter === key ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{label}</button>)}
      </div>
      <div className="relative h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-[#f0f3f1]" aria-label="Diagram simulasi lokasi operasional">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true"><path d="M0 70L1000 180M0 250L1000 70M200 0L500 300M800 0L630 300" stroke="white" strokeWidth="18" fill="none" /><path d="M0 70L1000 180M0 250L1000 70M200 0L500 300M800 0L630 300" stroke="#d9e2dd" strokeWidth="2" fill="none" /><path d="M0 140Q300 50 550 180T1000 240" stroke="#d5e7e9" strokeWidth="22" fill="none" /></svg>
        <span className="absolute right-4 top-4 text-[10px] uppercase tracking-widest text-slate-400">Jabodetabek · ilustrasi</span>
        {all.filter(m => filter === 'all' || m.status === filter).map(marker => <button key={marker.id} title={`${marker.name}: ${labels[marker.status]}`} aria-label={`${marker.name}: ${labels[marker.status]}`} onClick={() => setSelected(marker.id)} style={{ left: `${marker.x}%`, top: `${marker.y}%`, backgroundColor: colors[marker.status] }} className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">{marker.status === 'waiting' ? <MapPin size={15} /> : <User size={15} />}</button>)}
        <div className="absolute bottom-3 left-3 right-3 rounded-[8px] border border-slate-200 bg-white p-3 text-xs sm:right-auto sm:max-w-sm">{current ? <><p className="font-semibold">{current.name} · {labels[current.status]}</p><p className="mt-1 text-slate-500">{current.detail}</p></> : <p className="text-slate-500">Pilih penanda untuk melihat detail mitra atau pesanan.</p>}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">{Object.entries(labels).map(([key, label]) => <span key={key} className="flex items-center gap-2 text-[11px] text-slate-500"><span className="size-2 rounded-full" style={{ background: colors[key] }} />{label}</span>)}</div>
    </DashboardPanelContent>
  </DashboardPanel>;
}
