import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { addMemory, addMemorySchema, search, searchSchema } from './tools/memory.js';
import { getProjects, whoAmI } from './tools/identity.js';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'loopmemory-mcp' });
});

// SSE endpoint for MCP (Legacy SSE Transport)
app.get('/mcp', async (req: Request, res: Response) => {
    console.log('New MCP SSE connection');

    // Generate session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create SSE transport FIRST (it will set headers)
    const transport = new SSEServerTransport(`/message`, res);

    // AFTER transport is created, send the endpoint event
    // The transport has already set the SSE headers
    res.write(`event: endpoint\n`);
    res.write(`data: /message?sessionId=${sessionId}\n\n`);

    const server = new Server(
        {
            name: 'loopmemory',
            version: '1.0.0',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: 'addMemory',
                description: 'Add a new memory to the database',
                inputSchema: {
                    type: 'object',
                    properties: {
                        content: { type: 'string' },
                        metadata: { type: 'object' },
                    },
                    required: ['content'],
                },
            },
            {
                name: 'search',
                description: 'Search for memories using semantic search',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: { type: 'string' },
                        limit: { type: 'number' },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'whoAmI',
                description: 'Get current user identity',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'getProjects',
                description: 'Get list of projects',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
        ],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
            switch (request.params.name) {
                case 'addMemory': {
                    const args = addMemorySchema.parse(request.params.arguments);
                    const result = await addMemory(args);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'search': {
                    const args = searchSchema.parse(request.params.arguments);
                    const result = await search(args);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'whoAmI': {
                    const result = await whoAmI();
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'getProjects': {
                    const result = await getProjects();
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                default:
                    throw new Error('Unknown tool');
            }
        } catch (error: any) {
            return {
                content: [{ type: 'text', text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    });

    await server.connect(transport);

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected');
    });
});

// POST endpoint for messages (required by SSE transport)
app.post('/message', async (req: Request, res: Response) => {
    // This is handled by the SSE transport
    res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Loopmemory MCP API Server running on http://localhost:${PORT}`);
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
