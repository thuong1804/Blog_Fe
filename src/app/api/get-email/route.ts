import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const email = (await cookies()).get('emailVerify')?.value || null;
  return NextResponse.json({ email });
}