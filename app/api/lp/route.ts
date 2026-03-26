import { NextResponse } from 'next/server'
import { createLandingPage, getFirstLandingPage, slugExists } from '@/lib/queries'
import type { LandingPageInput } from '@/lib/types'

export async function GET() {
  try {
    const lp = await getFirstLandingPage()
    return NextResponse.json({ lp })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body: LandingPageInput = await req.json()

    if (!body.store_name?.trim()) {
      return NextResponse.json({ error: '店舗名は必須です' }, { status: 400 })
    }
    if (!body.slug?.trim()) {
      return NextResponse.json({ error: 'スラッグは必須です' }, { status: 400 })
    }
    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return NextResponse.json({ error: 'スラッグは英小文字・数字・ハイフンのみ使用できます' }, { status: 400 })
    }
    if (await slugExists(body.slug)) {
      return NextResponse.json({ error: 'このスラッグはすでに使われています' }, { status: 400 })
    }

    const lp = await createLandingPage(body)
    return NextResponse.json({ lp }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
