import { NextRequest, NextResponse } from 'next/server'
import { analyzeTicket } from '@/lib/investigator'
import { enforceSafety } from '@/lib/safety'
import { TicketRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
  }

  const data = body as Record<string, unknown>

  if (!data.ticket_id || typeof data.ticket_id !== 'string') {
    return NextResponse.json({ error: 'ticket_id is required and must be a string' }, { status: 400 })
  }

  if (!data.complaint || typeof data.complaint !== 'string') {
    return NextResponse.json({ error: 'complaint is required and must be a string' }, { status: 400 })
  }

  if (data.complaint.trim().length === 0) {
    return NextResponse.json({ error: 'complaint cannot be empty' }, { status: 422 })
  }

  const request: TicketRequest = {
    ticket_id: data.ticket_id as string,
    complaint: data.complaint as string,
    language: data.language as TicketRequest['language'],
    channel: data.channel as TicketRequest['channel'],
    user_type: data.user_type as TicketRequest['user_type'],
    campaign_context: data.campaign_context as string | undefined,
    transaction_history: data.transaction_history as TicketRequest['transaction_history'],
    metadata: data.metadata as Record<string, unknown> | undefined,
  }

  try {
    const result = await analyzeTicket(request)
    const safe = enforceSafety(result)
    return NextResponse.json(safe, { status: 200 })
  } catch (err) {
    console.error('Unexpected error in analyze-ticket:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
