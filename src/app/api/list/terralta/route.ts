import { getList } from '@/db'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })

  if (!token) return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })

  const list = await getList('terralta')

  return new NextResponse(JSON.stringify(list))
}
