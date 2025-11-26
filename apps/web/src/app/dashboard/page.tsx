'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Search, Settings, MessageSquare, Link as LinkIcon, FileText, X, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import ConnectModal from '@/components/ConnectModal';

export default function Dashboard() {
    const [memories, setMemories] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'note' | 'link' | 'file'>('note');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMemories();
    }, []);

    async function fetchMemories() {
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setMemories(data.map(m => ({
                id: m.id,
                content: m.content,
                date: new Date(m.created_at).toLocaleDateString(),
                tags: m.metadata?.tags || []
            })));
        }
    }

    const handleAddMemory = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);

        // In a real app, we would call the MCP server or API route here
        // For V2 prototype, we'll insert directly into Supabase for now
        // mimicking what the MCP tool does (minus embedding generation for simplicity in this frontend-only step)

        try {
            const response = await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    metadata: { type: activeTab, tags: ['manual'] }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add memory');
            }

            setContent('');
            setIsAddModalOpen(false);
            fetchMemories();
        } catch (error) {
            console.error('Error adding memory:', error);
            alert('Failed to save memory. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <div className="flex items-center gap-2 font-bold text-xl mb-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    Loopmemory
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem active icon={<Brain className="w-5 h-5" />} label="Memories" href="/dashboard" />
                    <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Chat" href="/dashboard/chat" />
                    <button
                        onClick={() => setIsConnectModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        <LinkIcon className="w-5 h-5" />
                        Connect
                    </button>
                    <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" href="#" />
                </nav>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Storage Used</p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-blue-500" />
                    </div>
                    <p className="text-xs text-right text-gray-400 mt-1">25%</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Your Memories</h1>
                    <div className="flex gap-3">
                        <Link href="/dashboard/chat" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Open Chat
                        </Link>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Memory
                        </button>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your memories..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Memory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories.map((memory) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-2">
                                    {memory.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-white/10 text-xs text-gray-300">#{tag}</span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{memory.date}</span>
                            </div>
                            <p className="text-gray-300 line-clamp-3 group-hover:text-white transition-colors">
                                {memory.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Add Memory Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h2 className="font-semibold">Add Memory</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-lg">
                                    <TabButton active={activeTab === 'note'} onClick={() => setActiveTab('note')} icon={<FileText className="w-4 h-4" />} label="Note" />
                                    <TabButton active={activeTab === 'link'} onClick={() => setActiveTab('link')} icon={<LinkIcon className="w-4 h-4" />} label="Link" />
                                    <TabButton active={activeTab === 'file'} onClick={() => setActiveTab('file')} icon={<Plus className="w-4 h-4" />} label="File" />
                                </div>

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={activeTab === 'link' ? "Paste URL here..." : "Write your memory here..."}
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMemory}
                                    disabled={isSubmitting || !content.trim()}
                                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Memory
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connect Modal */}
            <ConnectModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
        </div>
    );
}

function NavItem({ icon, label, active = false, href }: { icon: React.ReactNode, label: string, active?: boolean, href: string }) {
    return (
        <Link href={href} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {icon}
            {label}
        </Link>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            {icon}
            {label}
        </button>
    );
}
