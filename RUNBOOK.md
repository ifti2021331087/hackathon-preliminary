# Runbook

## Local Setup

```bash
git clone <repo-url>
cd hackathon-preli
npm install
cp .env.example .env.local
# Edit .env.local and add: ANTHROPIC_API_KEY=your_key_here
npm run dev
```

## Test health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok"}
```

## Test analyze-ticket

```bash
curl -X POST http://localhost:3000/analyze-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-001",
    "complaint": "I sent 5000 taka to a wrong number",
    "language": "en",
    "transaction_history": [
      {
        "transaction_id": "TXN-9101",
        "timestamp": "2026-04-14T14:08:22Z",
        "type": "transfer",
        "amount": 5000,
        "counterparty": "+8801719876543",
        "status": "completed"
      }
    ]
  }'
```

## Deployment

The judge harness expects to hit:
- GET `https://your-app.vercel.app/health`
- POST `https://your-app.vercel.app/analyze-ticket`

The rewrites in `next.config.ts` ensure these routes work at the root level (not `/api/`).

### Deploy to Vercel

```bash
vercel deploy
```

Add your `ANTHROPIC_API_KEY` to Vercel Environment Variables.

## Troubleshooting

### API key not found
- Check `.env.local` has `ANTHROPIC_API_KEY=...`
- Check Vercel Environment Variables if deployed
- Restart dev server: `npm run dev`

### 5000 BDT timeout or no response
- Anthropic API may be slow; typical: 3–8 seconds
- Default timeout: 30 seconds (judge harness should handle this)
- Check Claude API status: https://status.anthropic.com

### Malformed response from Claude
- Check Claude API version compatibility
- Safety layer should catch and return safe fallback
- Look at server logs for detailed error

## Monitoring

All errors are logged to `console.error()`. In production (Vercel), check function logs:
```bash
vercel logs --follow
```
