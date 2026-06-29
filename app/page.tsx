export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import { Epoch } from '@/lib/types'
import TimelineClient from '@/components/timeline/TimelineClient'

async function getEpochs(): Promise<Epoch[]> {
  const { data, error } = await supabaseAdmin
    .from('epochs')
    .select('*')
    .order('order_index')

  if (error || !data) return []
  return data as Epoch[]
}

export default async function Home() {
  const epochs = await getEpochs()

  return (
    <main>
      <TimelineClient epochs={epochs} />
    </main>
  )
}
