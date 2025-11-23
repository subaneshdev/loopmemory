import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { addMemory, addMemorySchema, search, searchSchema } from "./tools/memory";
import { getProjects, getProjectsSchema, whoAmI, whoAmISchema } from "./tools/identity";

const server = new Server(
    {
        name: "loopmemory",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "addMemory",
                description: "Add a new memory to the database",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                        metadata: { type: "object" },
                    },
                    required: ["content"],
                },
            },
            {
                name: "search",
                description: "Search for memories using semantic search",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" },
                        limit: { type: "number" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "whoAmI",
                description: "Get current user identity",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "getProjects",
                description: "Get list of projects",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case "addMemory": {
                const args = addMemorySchema.parse(request.params.arguments);
                const result = await addMemory(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "search": {
                const args = searchSchema.parse(request.params.arguments);
                const result = await search(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "whoAmI": {
                const result = await whoAmI();
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            case "getProjects": {
                const result = await getProjects();
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            default:
                throw new Error("Unknown tool");
        }
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Loopmemory MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
