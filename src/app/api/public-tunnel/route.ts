import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tunnelFilePath = path.join(process.cwd(), '.tunnel_url');
    if (fs.existsSync(tunnelFilePath)) {
      const tunnelUrl = fs.readFileSync(tunnelFilePath, 'utf8').trim();
      if (tunnelUrl) {
        return NextResponse.json({ success: true, url: tunnelUrl });
      }
    }
  } catch {}

  return NextResponse.json({ success: false, url: null });
}
