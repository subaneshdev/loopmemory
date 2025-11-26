import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'ok',
        service: 'loopmemory-mcp',
        timestamp: new Date().toISOString()
    });
}
