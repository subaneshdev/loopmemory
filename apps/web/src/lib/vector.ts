import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const pineconeApiKey = process.env.PINECONE_API_KEY!;
const pineconeIndexName = process.env.PINECONE_INDEX!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

// Note: In a real app, you might want to instantiate these outside the handler 
// but Next.js API routes are serverless functions, so this is fine.

export const pinecone = new Pinecone({
    apiKey: pineconeApiKey,
});

export const index = pinecone.index(pineconeIndexName);

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function getEmbedding(text: string): Promise<number[]> {
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
}
