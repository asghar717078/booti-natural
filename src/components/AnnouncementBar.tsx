"use client";

import { usePathname } from 'next/navigation';

export default function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname === '/checkout') return null;

  return (
    <div className="bg-dark-green text-white text-sm font-medium py-2 text-center">
      🌿 Free Shipping on Orders Above Rs. 2,000 | Cash on Delivery Available
    </div>
  );
}
