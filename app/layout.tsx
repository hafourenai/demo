import type { Metadata } from "next";
import "./globals.css";
import { StorageSyncProvider } from "@/components/StorageSyncProvider";

export const metadata: Metadata = {
  title: "Salon & Beauty",
  description: "Home Service Beauty & Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50">
        <StorageSyncProvider>
          {children}
        </StorageSyncProvider>
      </body>
    </html>
  );
}
