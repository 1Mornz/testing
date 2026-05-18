import { NextResponse } from 'next/server';

export function jsonError(error) {
  const status = error.status || 500;
  return NextResponse.json({
    error: status === 500 ? 'Something went wrong' : error.message,
    details: error.details,
  }, { status });
}
