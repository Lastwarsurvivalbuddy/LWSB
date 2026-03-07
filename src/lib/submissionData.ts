import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getApprovedSubmissions(serverNumber: number): Promise<string> {
  const { data, error } = await supabase
    .from('community_submissions')
    .select('category, claim, scope, server_number')
    .eq('status', 'approved')
    .or(`scope.eq.global,and(scope.eq.server_specific,server_number.eq.${serverNumber})`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !data || data.length === 0) return ''

  const global = data.filter(s => s.scope === 'global')
  const serverSpecific = data.filter(s => s.scope === 'server_specific')

  let summary = '## Community Intelligence\n'
  summary += 'The following facts have been verified and submitted by players:\n\n'

  if (global.length > 0) {
    summary += '### Game-Wide Facts\n'
    global.forEach(s => {
      summary += `- [${s.category.toUpperCase()}] ${s.claim}\n`
    })
    summary += '\n'
  }

  if (serverSpecific.length > 0) {
    summary += `### Server ${serverNumber} Specific\n`
    serverSpecific.forEach(s => {
      summary += `- [${s.category.toUpperCase()}] ${s.claim}\n`
    })
    summary += '\n'
  }

  return summary
}