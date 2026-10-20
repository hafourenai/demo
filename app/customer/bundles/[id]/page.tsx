'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BundleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/products');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
      Mengalihkan ke katalog produk Nail Art...
    </div>
  );
}
