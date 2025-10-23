'use client';

import Head from 'next/head';
import InventoryManagement from '@/components/admin/InventoryManagement';

export default function AdminInventoryPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Inventory Management - Admin Panel</title>
      </Head>
      <InventoryManagement />
    </>
  );
}
