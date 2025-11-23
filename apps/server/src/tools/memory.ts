import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { index, getEmbedding } from '../lib/vector';

export const addMemorySchema = z.object({
    content: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export async function addMemory(args: z.infer<typeof addMemorySchema>) {
    const { content, metadata } = args;

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
            metadata: { ...metadata, content }, // Store content in metadata for retrieval if needed
        },
    ]);

    return { success: true, memory };
}

export const searchSchema = z.object({
    query: z.string(),
    limit: z.number().optional().default(5),
});

export async function search(args: z.infer<typeof searchSchema>) {
    const { query, limit } = args;

    // 1. Generate embedding
    const embedding = await getEmbedding(query);

    // 2. Search Pinecone
    const results = await index.query({
        vector: embedding,
        topK: limit,
        includeMetadata: true,
    });

    // 3. Format results
    return results.matches.map((match) => ({
        id: match.id,
        score: match.score,
        content: match.metadata?.content,
        metadata: match.metadata,
    }));
}
