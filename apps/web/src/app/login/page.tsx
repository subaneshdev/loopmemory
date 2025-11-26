'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain } from 'lucide-react';

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                router.push('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    Loopmemory
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#3b82f6',
                                    brandAccent: '#2563eb',
                                    inputText: 'white',
                                    inputBackground: '#1a1a1a',
                                    inputBorder: '#333',
                                    inputLabelText: '#9ca3af',
                                },
                            },
                        },
                        className: {
                            container: 'w-full',
                            button: 'rounded-lg px-4 py-2',
                            input: 'rounded-lg px-4 py-2',
                        },
                    }}
                    providers={['github', 'google']}
                    theme="dark"
                />
            </div>
        </div>
    );
}
