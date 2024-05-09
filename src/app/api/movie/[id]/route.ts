import { getMovie } from '@/db'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const token = await getToken({ req })

  if (!token) return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })

  const movie = await getMovie(ctx.params.id)

  if (!movie) return new NextResponse(JSON.stringify({ error: 'movie not found' }), { status: 404 })

  return new NextResponse(JSON.stringify(movie))
}
