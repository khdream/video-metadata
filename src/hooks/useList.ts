'use client'

import type { Movie } from '@/types'
import { useQuery } from '@tanstack/react-query'

async function fetchList(scope: 'lospuentes' | 'terralta'): Promise<Movie[]> {
  try {
    const req = await fetch(`/api/list/${scope}`)

    if (req.status !== 200) {
      throw Error('unable to get movies list')
    }

    return await req.json()
  } catch (e) {
    throw Error('unable to get movies list')
  }
}

export function useList(scope: 'lospuentes' | 'terralta'): {
  data: Movie[] | undefined
  loading: boolean
  error: boolean
} {
  const { isLoading, isError, data } = useQuery({
    queryFn: async () => await fetchList(scope),
    queryKey: ['list', scope]
  })

  return { data, error: isError, loading: isLoading }
}
