import { VercelRequest, VercelResponse } from '@vercel/node';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { addMemory, addMemorySchema, search, searchSchema } from '../src/tools/memory.js';
import { getProjects, whoAmI } from '../src/tools/identity.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        console.log('New MCP SSE connection');

        // Generate session ID
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create SSE transport
        const transport = new SSEServerTransport(`/api/message`, res);

        // Send endpoint event
        res.write(`event: endpoint\n`);
        res.write(`data: /api/message?sessionId=${sessionId}\n\n`);

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

        req.on('close', () => {
            console.log('Client disconnected');
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
