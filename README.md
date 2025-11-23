# Loopmemory

**Universal Memory Layer for AI Assistants via Model Context Protocol (MCP)**

Loopmemory is an open-source, self-hostable alternative to Supermemory that provides persistent, semantic memory across all your AI applications.

## 🚀 Features

- **Universal Memory**: Share context across Claude, Cursor, VS Code, and any MCP-compatible AI
- **Semantic Search**: Powered by Pinecone vector embeddings and Google Gemini
- **Four Core Tools**: `addMemory`, `search`, `getProjects`, `whoAmI`
- **Beautiful Web Dashboard**: Manage memories via Next.js web interface
- **One-Click Setup**: Deploy to Vercel and connect via `install-mcp`

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Claude    │────▶│  MCP Server  │────▶│  Supabase   │
│   Cursor    │     │   (SSE/HTTP) │     │  Pinecone   │
│   VS Code   │     │              │     │   Gemini    │
└─────────────┘     └──────────────┘     └─────────────┘
```

## 📦 Quick Start

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/loopmemory&root-directory=apps/server)

### Connect to Claude

```bash
npx -y install-mcp@latest https://your-deployment.vercel.app/mcp --client claude
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.local.example apps/web/.env.local

# Run MCP server
cd apps/server && npm run dev:api

# Run web app
cd apps/web && npm run dev -- -p 3001
```

## 📚 Documentation

- [Build Guide](./docs/build_guide.md)
- [Deployment Guide](./docs/deployment_guide.md)
- [API Reference](./docs/api.md)

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

ISubanesh :)
