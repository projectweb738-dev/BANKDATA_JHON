import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// GET /api/me — Data user yang sedang login
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      unit_kerja: user.unit_kerja ?? '',
    },
  });
}
