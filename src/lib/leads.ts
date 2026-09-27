import { LEAD_ENDPOINT } from '../content/site'

export type LeadResult = { ok: boolean; errors?: string[]; dryRun?: boolean }

/**
 * POST to the same API Gateway → Lambda → SES pipeline the live site uses.
 *
 * On localhost (dev or `vite preview`) it is a dry run: nothing is sent, the
 * payload is logged, and the UI still shows its success state. The live API only
 * allows the production origin anyway. Set VITE_LEADS_LIVE=true to force real sends.
 */
export async function postLead(payload: Record<string, unknown>): Promise<LeadResult> {
  const body = {
    ...payload,
    source_page: location.pathname,
    referrer: document.referrer || '',
  }
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
  if ((import.meta.env.DEV || local) && import.meta.env.VITE_LEADS_LIVE !== 'true') {
    console.info('[leads] dry run (localhost), not sent:', body)
    await new Promise((r) => setTimeout(r, 650))
    return { ok: true, dryRun: true }
  }
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json().catch(() => ({ ok: res.ok }))) as LeadResult
}

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
