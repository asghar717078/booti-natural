'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import React from 'react';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
