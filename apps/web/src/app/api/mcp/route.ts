import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // For now, return a simple JSON response
    // SSE with MCP SDK requires more complex setup that may not work well with Next.js API routes
    return NextResponse.json({
        message: 'MCP endpoint - use stdio connection for local development',
        instructions: 'For production, use the stdio server with environment variables'
    });
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ ok: true });
}
