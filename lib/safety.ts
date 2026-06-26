import { TicketResponse } from './types'

const BANNED_REQUEST_PHRASES = [
  'enter your pin', 'share your pin', 'provide your pin', 'your pin',
  'enter your otp', 'share your otp', 'provide your otp', 'your otp',
  'enter your password', 'share your password', 'provide your password',
  'card number', 'full card', 'cvv',
]

const UNAUTHORIZED_COMMITMENT_PHRASES = [
  'we will refund', 'we will reverse', 'you will get your money back',
  'we will return your money', 'refund will be processed', 'money will be refunded',
  'we will unblock', 'account will be unblocked', 'we will recover',
]

const SAFE_REPLY_GENERIC = 'We have received your concern and our support team will review it. Any eligible amount will be returned through official channels. Please do not share your PIN or OTP with anyone. Contact us only through official bKash support channels.'

function containsAny(text: string, phrases: string[]): boolean {
  const lower = text.toLowerCase()
  return phrases.some(p => lower.includes(p))
}

export function enforceSafety(response: TicketResponse): TicketResponse {
  const result = { ...response }

  // Rule 1: Never ask for credentials
  if (containsAny(result.customer_reply, BANNED_REQUEST_PHRASES)) {
    result.customer_reply = SAFE_REPLY_GENERIC
  }

  // Rule 2: Never make unauthorized commitments
  if (containsAny(result.customer_reply, UNAUTHORIZED_COMMITMENT_PHRASES)) {
    result.customer_reply = result.customer_reply
      .replace(/we will refund you/gi, 'any eligible amount will be returned through official channels')
      .replace(/we will reverse/gi, 'our team will review the reversal eligibility through official channels')
      .replace(/you will get your money back/gi, 'any eligible amount will be returned through official channels')
      .replace(/we will return your money/gi, 'any eligible amount will be returned through official channels')
  }

  // Also check recommended_next_action for unauthorized commitments
  if (containsAny(result.recommended_next_action, UNAUTHORIZED_COMMITMENT_PHRASES)) {
    result.recommended_next_action = result.recommended_next_action
      .replace(/confirm.*refund/gi, 'initiate refund review through official policy')
      .replace(/process.*refund/gi, 'escalate for refund eligibility review')
  }

  // Rule 3: Force human review for critical/phishing cases
  if (result.case_type === 'phishing_or_social_engineering') {
    result.human_review_required = true
    result.department = 'fraud_risk'
    if (result.severity !== 'critical') result.severity = 'critical'
  }

  // Rule 4: Force human review for critical severity
  if (result.severity === 'critical') {
    result.human_review_required = true
  }

  return result
}
