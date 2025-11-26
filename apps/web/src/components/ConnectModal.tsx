'use client';

import { Brain, Check, Copy, Terminal, X, Code, Sparkles, Bot } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const clients = [
    { id: 'cursor', name: 'Cursor', icon: Terminal, command: 'cursor' },
    { id: 'claude', name: 'Claude Desktop', icon: Brain, command: 'claude' },
    { id: 'vscode', name: 'VSCode', icon: Code, command: 'vscode' },
    { id: 'cline', name: 'Cline', icon: Bot, command: 'cline' },
    { id: 'gemini', name: 'Gemini CLI', icon: Sparkles, command: 'gemini' },
];

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
    const [selectedClient, setSelectedClient] = useState('claude');
    const [copied, setCopied] = useState(false);

    // For deployment, this would be your actual API URL
    // For local development, use localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/mcp";
    const installCommand = `npx -y install-mcp@latest ${apiUrl} --client ${selectedClient}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold text-white">Connect Loopmemory to Your AI</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            <p className="text-gray-400 mb-8">
                                Enable your AI assistant to create, search, and access your memories directly using the Model Context Protocol (MCP).
                            </p>

                            {/* Step 1: Select Client */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">1</div>
                                    <h3 className="text-md font-medium text-white">Select Your AI Client</h3>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {clients.map((client) => {
                                        const Icon = client.icon;
                                        return (
                                            <button
                                                key={client.id}
                                                onClick={() => setSelectedClient(client.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${selectedClient === client.id
                                                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{client.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Step 2: Project (Optional) */}
                            <div className="mb-8 opacity-50 pointer-events-none">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">2</div>
                                    <h3 className="text-md font-medium text-white">Select Target Project (Optional)</h3>
                                </div>
                                <div className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-500 text-sm flex justify-between items-center">
                                    <span>Auto-select project</span>
                                    <span className="text-xs">▼</span>
                                </div>
                            </div>

                            {/* Step 3: Command */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">3</div>
                                    <h3 className="text-md font-medium text-white">Installation Command</h3>
                                </div>

                                <div className="relative group">
                                    <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-sm text-gray-300 break-all pr-12">
                                        {installCommand}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Copy and run this command in your terminal to install the MCP server.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
