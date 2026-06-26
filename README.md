QueueStorm Investigator API
This is an AI-powered support ticket investigator designed to provide fast, evidence-based, and safe analysis of digital finance customer complaints. It correlates customer claims with transaction histories to ensure accurate routing and compliant, helpful support.

🚀 Live Endpoint
Base URL: https://hackathon-preliminary-7rzo.vercel.app

Health Check: [GET] /health

Ticket Analysis: [POST] /analyze-ticket

🛠 Features
Evidence-Based Reasoning: Systematically correlates customer complaints with transaction logs to determine claim validity.

Safety-First Design: Implements strict guardrails to prevent phishing and unauthorized financial commitments.

Structured Taxonomy: Maps cases to specific departments (dispute_resolution, fraud_risk, etc.) for efficient routing.

Lean Implementation: Built using native fetch for maximum performance, avoiding heavy external AI SDKs.

📋 API Documentation
1. Health Check
Checks if the API is operational.

Method: GET

Endpoint: /health

Response: {"status": "ok"}

2. Analyze Ticket
Analyzes a support ticket and returns a structured verdict.

Method: POST

Endpoint: /analyze-ticket

Headers: Content-Type: application/json

Body: { "ticket_id": string, "complaint": string, "transaction_history": array }

🔐 AI Approach & Safety Logic
Model: We utilize Gemini 3.5 Flash for its superior speed and instruction-following capabilities.

Evidence Analysis: The model acts as an investigator by comparing the complaint text against the transaction_history. It explicitly identifies the relevant_transaction_id and provides an evidence_verdict.

Safety Guardrails: * No Credentials: The system is pre-prompted to never request or acknowledge PINs, OTPs, or passwords.

No Unauthorized Refunds: Responses are restricted to "any eligible amount will be returned through official channels," preventing unauthorized financial promises.

Prompt Injection: The system is hardened against adversarial input that attempts to override these safety protocols.

⚠️ Known Limitations
Data Dependence: Accuracy is limited by the quality and completeness of the provided transaction history.

Ambiguity: Cases with multiple plausible transaction matches are flagged for human review to prevent incorrect dispute initiation.

🚀 Deployment & Local Setup
Local Development
Clone the repository.

Install dependencies: npm install.

Create a .env.local file with your GOOGLE_API_KEY.

Run the development server: npm run dev.

Deployment to Vercel
Fork this repository.

Connect to Vercel and set the Root Directory to ./.

Add GOOGLE_API_KEY to Vercel Environment Variables.

Deploy.

Sample Request
JSON
{
  "ticket_id": "TEST-001",
  "complaint": "I sent 5000 taka to a wrong number.",
  "transaction_history": []
}
Sample Response
JSON
{
  "ticket_id": "TEST-001",
  "relevant_transaction_id": null,
  "evidence_verdict": "insufficient_data",
  "case_type": "wrong_transfer",
  "department": "dispute_resolution",
  "severity": "high",
  "agent_summary": "Customer claims to have sent 5000 BDT...",
  "recommended_next_action": "Request the customer to provide...",
  "customer_reply": "We have received your request regarding...",
  "human_review_required": true
}
