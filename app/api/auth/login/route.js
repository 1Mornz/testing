import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/authService';
import { jsonError } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const body = await request.json();
    const session = await loginUser(body.email, body.password);
    return NextResponse.json(session);
  } catch (error) {
    return jsonError(error);
  }
}
