# Content Repurposer

This tool lets you upload a blog or video and generates content snippets:
- Tweet (280 chars)
- Instagram caption
- TikTok script (60s)

## Setup

1. Clone the repo
2. Create a `.env.local` file with your OpenAI key:
```
OPENAI_API_KEY=your_openai_key
```
3. Run locally:
```bash
npm install
npm run dev
```

## Deploy
- Push to GitHub
- Connect to Vercel
- Add `OPENAI_API_KEY` in Vercel environment settings
