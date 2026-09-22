import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ detail: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      url: asset.url,
      assetId: asset._id,
    });
  } catch (error) {
    console.error('[POST /api/admin/upload]', error);
    return NextResponse.json({ detail: 'Upload failed' }, { status: 500 });
  }
}
