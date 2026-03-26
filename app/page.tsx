export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getFirstLandingPage } from '@/lib/queries'

export default async function Home() {
  const lp = await getFirstLandingPage()
  if (lp) {
    redirect(`/editor/${lp.id}`)
  }
  redirect('/editor')
}
