import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  try {
    const response = await fetch(`${apiUrl}${path}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from API' }, { status: 500 });
  }
}
