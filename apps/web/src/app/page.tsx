'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain, Search, Share2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        Loopmemory
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
                        <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
                        <Link href="/login" className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            The <span className="text-gradient">Universal Memory</span><br />
                            for your AI Assistants
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Bridge the gap between isolated AI applications. Store context once, access it everywhere—Claude, ChatGPT, Cursor, and more.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/login" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                                Start for free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="px-8 py-4 bg-white/10 border border-white/10 rounded-full font-medium hover:bg-white/20 transition-colors">
                                View Documentation
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
                        <FeatureCard
                            icon={<Share2 className="w-6 h-6 text-blue-400" />}
                            title="Universal Sync"
                            description="Your memories travel with you. Context built in one AI is instantly available in all others."
                        />
                        <FeatureCard
                            icon={<Search className="w-6 h-6 text-purple-400" />}
                            title="Semantic Search"
                            description="Don't just store text. Understand relationships between people, places, and ideas."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-pink-400" />}
                            title="Instant Setup"
                            description="One command to install. Works with any MCP-compatible client out of the box."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition-colors"
        >
            <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </motion.div>
    );
}
