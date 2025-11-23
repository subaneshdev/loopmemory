import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        status: 'ok',
        service: 'loopmemory-mcp',
        timestamp: new Date().toISOString()
    });
}
