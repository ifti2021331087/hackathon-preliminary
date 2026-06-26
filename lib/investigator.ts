import { TicketRequest, TicketResponse } from './types'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

const SAFE_FALLBACK = (ticket_id: string): TicketResponse => ({
  ticket_id,
  relevant_transaction_id: null,
  evidence_verdict: 'insufficient_data',
  case_type: 'other',
  severity: 'medium',
  department: 'customer_support',
  agent_summary: 'Automated analysis failed. This ticket requires manual review.',
  recommended_next_action: 'Review this ticket manually and escalate to the appropriate team.',
  customer_reply: 'We have received your request and our support team will review it shortly. Please do not share your PIN or OTP with anyone.',
  human_review_required: true,
  confidence: 0,
  reason_codes: ['analysis_failed', 'fallback'],
})

export async function analyzeTicket(request: TicketRequest): Promise<TicketResponse> {
  try {
    // Looks for the exact variable name you used in your .env.local file
    const apiKey = process.env.GOOGLE_API_KEY; 
    
    if (!apiKey) {
      console.error('Missing GOOGLE_API_KEY in environment variables');
      return SAFE_FALLBACK(request.ticket_id);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // FIX: We moved the SYSTEM_PROMPT directly into the user message block
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(request)}` }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json", 
          temperature: 0.1 
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return SAFE_FALLBACK(request.ticket_id);
    }

    const data = await response.json();
    const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip accidental markdown fences
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsed: TicketResponse = JSON.parse(cleaned);

    // Always enforce ticket_id match to prevent schema failure
    parsed.ticket_id = request.ticket_id;

    return parsed;
  } catch (err) {
    console.error('analyzeTicket error:', err);
    return SAFE_FALLBACK(request.ticket_id);
  }
}