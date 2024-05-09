import { addMovie } from '@/db'
import { MovieValidator } from '@/types'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })

  if (token.scope !== 'admin') return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })

  const data = await req.json()

  try {
    MovieValidator.parse(data)

    try {
      await addMovie(data)
      return new NextResponse(JSON.stringify({ success: true }))
    } catch (e) {
      return new NextResponse(JSON.stringify({ error: 'unable to add/update movie' }), { status: 500 })
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }))
  }
}
