import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { index, getEmbedding } from '@/lib/vector';

export async function POST(request: Request) {
    try {
        const { content, metadata } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // 1. Generate embedding
        const embedding = await getEmbedding(content);

        // 2. Insert into Supabase
        const { data: memory, error } = await supabase
            .from('memories')
            .insert({ content, metadata })
            .select()
            .single();

        if (error) throw new Error(`Supabase error: ${error.message}`);

        // 3. Insert into Pinecone
        await index.upsert([
            {
                id: memory.id,
                values: embedding,
                metadata: { ...metadata, content }, // Store content in metadata for retrieval
            },
        ]);

        return NextResponse.json({ success: true, memory });
    } catch (error: any) {
        console.error('Error adding memory:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
