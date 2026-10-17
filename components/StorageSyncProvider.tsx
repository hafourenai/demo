'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@/lib/store';

export function StorageSyncProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Listen untuk perubahan storage dari tab lain
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salon-app-storage') {
        // Reload data dari localStorage
        if (e.newValue) {
          try {
            const newState = JSON.parse(e.newValue);
            // Trigger re-render dengan data terbaru
            useAppStore.setState(newState.state);
          } catch (error) {
            console.error('Failed to parse storage change:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isMounted) return <>{children}</>;

  return children;
}
