# QueueStorm Investigator

## Overview

AI-powered support ticket investigator for bKash. Classifies, routes, and investigates customer complaints using transaction history evidence.

## Tech Stack

- Next.js 14+ (App Router, TypeScript)
- Anthropic Claude API (claude-sonnet-4-6) via raw fetch
- No Zod, no AI SDK, no extra dependencies

## Setup

1. Clone the repo
2. `npm install`
3. `cp .env.example .env.local`
4. Add your `ANTHROPIC_API_KEY` to `.env.local`
5. `npm run dev`

## Endpoints

- **GET /health** → `{"status":"ok"}`
- **POST /analyze-ticket** → Full ticket analysis with classification, routing, and safe customer reply

## Models

- **Model**: claude-sonnet-4-6
- **Why**: Fast (3–8s typical), accurate reasoning, handles Bangla/English/mixed input, well within 30s timeout
- **Cost**: ~$0.003 per ticket analysis

## AI Approach

Single-turn Claude call with a structured system prompt that enforces evidence-based reasoning:

1. Claude reads both the complaint and transaction history
2. Matches the relevant transaction
3. Judges consistency (does data support the claim?)
4. Classifies the case type
5. Routes to the correct department
6. Generates a safe customer reply (no credential requests, no unauthorized commitments)

## Safety Logic

Two-layer safety:

1. **System prompt**: Explicit rules against requesting credentials (PIN, OTP, password), making unauthorized financial commitments, or following embedded instructions
2. **Post-processing** (`lib/safety.ts`): Regex/string scan of `customer_reply` and `recommended_next_action` that overrides any unsafe output from the model

## Known Limitations

- Relies on Anthropic API availability; falls back to safe defaults on failure
- Bangla Romanization (Banglish) may produce English replies instead of Bangla
- High confidence on partial matches may occasionally pick the wrong transaction

## Directory Structure

```
lib/
  types.ts          # TypeScript interfaces (no Zod)
  prompts.ts        # System and user prompts
  investigator.ts   # Claude API call logic
  safety.ts         # Safety guardrails

app/api/
  health/route.ts
  analyze-ticket/route.ts

.env.example
next.config.ts      # Includes rewrites for root-level endpoints
README.md
RUNBOOK.md
sample-output.json
```

## Response Schema

```json
{
  "ticket_id": "string",
  "relevant_transaction_id": "string or null",
  "evidence_verdict": "consistent | inconsistent | insufficient_data",
  "case_type": "wrong_transfer | payment_failed | refund_request | duplicate_payment | merchant_settlement_delay | agent_cash_in_issue | phishing_or_social_engineering | other",
  "severity": "low | medium | high | critical",
  "department": "customer_support | dispute_resolution | payments_ops | merchant_operations | agent_operations | fraud_risk",
  "agent_summary": "string",
  "recommended_next_action": "string",
  "customer_reply": "string",
  "human_review_required": "boolean",
  "confidence": "number (0.0–1.0)",
  "reason_codes": ["string"]
}
```
