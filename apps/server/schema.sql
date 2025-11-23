-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your memories
create table memories (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for projects (optional, for getProjects)
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for memories
create or replace function match_memories (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query;
end;
$$;
