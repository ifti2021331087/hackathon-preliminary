QueueStorm Investigator API
This is a high-performance, AI-powered support ticket investigator built with Next.js and Gemini 3.5 Flash. It provides automated, safe, and evidence-grounded analysis for support tickets, strictly adhering to fintech security and compliance standards.

🚀 Live Endpoint
Base URL: https://hackathon-preliminary-7rzo.vercel.app

Health Check: [GET] /health

Ticket Analysis: [POST] /analyze-ticket

🛠 Features
Evidence-Based: Correlates customer complaints with transaction history to verify claims.

Safety-First: Automated safety guardrails prevent credential phishing and unauthorized financial commitments (e.g., refunds).

Compliance Ready: Returns structured JSON with confidence scores, severity levels, and specific reason codes for easy auditing.

Pure Implementation: Built using raw fetch—no external AI SDKs, ensuring maximum performance and minimal dependency overhead.

📋 API Documentation
1. Health Check
Checks if the API is operational.

Endpoint: /health

Method: GET

Response: {"status": "ok"}

2. Analyze Ticket
Analyzes a support ticket and returns a structured verdict.

Endpoint: /analyze-ticket

Method: POST

Headers: Content-Type: application/json

Body Example:

JSON
{
  "ticket_id": "TKT-001",
  "complaint": "I sent 5000 taka to a wrong number.",
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
}
🔐 Compliance & Safety
No SDKs: Built with raw fetch for a minimal, lightweight footprint.

Financial Guardrails: Automatically blocks any mention of PIN/OTP/Password in generated customer replies.

Human-in-the-Loop: Automatically flags human_review_required: true for high-value transactions, phishing attempts, and ambiguous evidence.
