'use client';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store configuration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Store Name</p>
          <p className="text-sm text-gray-500 mt-0.5">Booti Natural</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Sanity Project</p>
          <p className="text-sm text-gray-500 font-mono mt-0.5">{process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'k793bvl7'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Dataset</p>
          <p className="text-sm text-gray-500 mt-0.5">production</p>
        </div>
      </div>
    </div>
  );
}
