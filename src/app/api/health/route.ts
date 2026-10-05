import { NextResponse } from 'next/server';
import { isMongoConnected, mongoStatusMessage } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Raja Rani Royal Game Server (Next.js App Router)',
    mongo: {
      connected: isMongoConnected,
      message: mongoStatusMessage,
    },
  });
}
