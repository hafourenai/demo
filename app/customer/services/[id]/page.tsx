'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceDetailRedirect({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/customer/services?serviceId=${params.id}`);
  }, [params.id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <p className="text-xs text-text-secondary">Memuat formulir layanan...</p>
    </div>
  );
}
