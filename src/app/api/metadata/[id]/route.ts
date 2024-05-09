import type { MovieMetadata } from '@/types'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const token = await getToken({ req })

  if (!token) return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })

  const request = await fetch(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_TOKEN}&i=${ctx.params.id}`)

  const metadata: MovieMetadata = await request.json()

  return new NextResponse(JSON.stringify(metadata))
}
