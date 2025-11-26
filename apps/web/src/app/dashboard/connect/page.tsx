'use client';

import { ArrowLeft, Brain, Check, Copy, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const clients = [
    { id: 'cursor', name: 'Cursor', icon: 'Terminal', command: 'cursor' },
    { id: 'claude', name: 'Claude Desktop', icon: 'Brain', command: 'claude' },
    { id: 'vscode', name: 'VSCode', icon: 'Code', command: 'vscode' },
    { id: 'cline', name: 'Cline', icon: 'Bot', command: 'cline' },
    { id: 'gemini', name: 'Gemini CLI', icon: 'Sparkles', command: 'gemini' },
];

export default function Connect() {
    const [selectedClient, setSelectedClient] = useState('claude');
    const [copied, setCopied] = useState(false);

    // We use the local path to the server for the command
    // Since this is running locally, we point to the absolute path of the server
    // Note: In a real deployed scenario, this would be a URL like https://api.loopmemory.ai/mcp
    const serverPath = "/Users/subanesh/Library/Mobile Documents/com~apple~CloudDocs/Antigravity/loopmemory/apps/server/dist/index.js";

    // Constructing the command to match the screenshot style but adapted for local usage
    // Using the cloned install-mcp tool if available, or falling back to manual config if npx fails
    // The user requested "npx -y install-mcp@latest ..." style.
    // We found that 'install-mcp' is available on npm.
    // We'll use the published package but point to the local server path.

    const installCommand = `npx -y install-mcp@latest "${serverPath}" --client ${selectedClient}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center px-6 gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    Connect Loopmemory to Your AI
                </div>
            </header>

            <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">Connect to Your AI</h1>
                    <p className="text-gray-400">Enable your AI assistant to create, search, and access your memories directly using the Model Context Protocol (MCP).</p>
                </div>

                {/* Step 1: Select Client */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">1</div>
                        <h2 className="text-lg font-semibold">Select Your AI Client</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClient(client.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${selectedClient === client.id
                                    ? 'bg-blue-600/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {/* Icons would be dynamic here, simplified for now */}
                                <span>{client.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Project (Optional - Placeholder) */}
                <div className="mb-8 opacity-50 pointer-events-none">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">2</div>
                        <h2 className="text-lg font-semibold">Select Target Project (Optional)</h2>
                    </div>
                    <div className="w-full max-w-md p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400">
                        Auto-select project
                    </div>
                </div>

                {/* Step 3: Command */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">3</div>
                        <h2 className="text-lg font-semibold">Installation Command</h2>
                    </div>

                    <div className="relative group">
                        <div className="bg-black border border-white/10 rounded-xl p-6 font-mono text-sm text-gray-300 break-all">
                            {installCommand}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        Copy and run this command in your terminal to install the MCP server.
                    </p>
                </div>

                <div className="flex justify-end gap-4 mt-12">
                    <Link href="/dashboard" className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        Done
                    </Link>
                </div>
            </div>
        </div>
    );
}
