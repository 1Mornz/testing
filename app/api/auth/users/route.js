import { NextResponse } from 'next/server';
import { createUser, listUsers } from '@/lib/authService';
import { jsonError } from '@/lib/apiResponse';

export async function GET() {
  const users = await listUsers();
  return NextResponse.json({
    users: users.map(({ password: _password, ...user }) => user),
  });
}

export async function POST(request) {
  try {
    return NextResponse.json({ user: await createUser(await request.json()) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
