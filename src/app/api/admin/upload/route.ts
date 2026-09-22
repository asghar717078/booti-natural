import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Mock upload response
    // In a real app we'd parse the multipart form data and save the file
    return NextResponse.json({ 
      url: '/uploads/mock-uploaded-image.jpg',
      detail: 'File uploaded successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Upload failed' }, { status: 400 });
  }
}
