'use client'

import type { Movie, MovieMetadata } from '@/types'
import { useQuery } from '@tanstack/react-query'

export async function addMovie(movie: Movie): Promise<boolean> {
  try {
    const req = await fetch('/api/add', { method: 'POST', body: JSON.stringify(movie) })

    const response = await req.json()

    return response.success
  } catch (e) {
    return false
  }
}

export async function fetchMovieMetadata(id: string): Promise<MovieMetadata | undefined> {
  try {
    const req = await fetch(`/api/metadata/${id}`)

    if (req.status !== 200) {
      throw Error('unable to get movie')
    }

    const response = await req.json()

    if (response.Error) {
      throw Error('unable to get movie')
    }

    return response
  } catch (e) {
    throw Error('unable to get movie')
  }
}

async function fetchMovie(id: string): Promise<Movie | undefined> {
  try {
    const req = await fetch(`/api/movie/${id}`)

    if (req.status !== 200) {
      throw Error('unable to get movie')
    }

    return await req.json()
  } catch (e) {
    throw Error('unable to get movie')
  }
}

export function useMovie(id: string): {
  data: Movie | undefined
  loading: boolean
  error: boolean
} {
  const { isLoading, isError, data } = useQuery({
    queryFn: async () => await fetchMovie(id),
    queryKey: ['moview', id]
  })

  return { data, error: isError, loading: isLoading }
}
