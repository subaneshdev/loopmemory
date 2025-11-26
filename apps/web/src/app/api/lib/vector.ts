import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!pineconeApiKey || !pineconeIndexName || !geminiApiKey) {
    throw new Error('Missing PINECONE_API_KEY, PINECONE_INDEX, or GEMINI_API_KEY');
}

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
