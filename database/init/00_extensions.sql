-- Runs once on first postgres container boot (docker-entrypoint-initdb.d).
-- Enable pgvector so RAG embeddings live inside PostgreSQL (no separate vector DB).
CREATE EXTENSION IF NOT EXISTS vector;
