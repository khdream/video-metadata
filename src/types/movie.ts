import { z } from 'zod'

export interface Movie {
  countries: string[]
  genres: string[]
  feedback: string | undefined
  id: string
  languages: string[]
  modified: 'yes' | 'no' | 'unsuitable'
  original_title: string
  plot: string
  published_by: string
  release_date: number
  publish_date: number
  sf: boolean
  sv: boolean
  type: 'movie' | 'series'
  translated_title: string
  year: number
  poster: string
}

export const MovieValidator = z.object({
  countries: z.array(z.string()),
  genres: z.array(z.string()),
  feedback: z.string().optional(),
  id: z.string(),
  languages: z.array(z.string()),
  modified: z.string(),
  original_title: z.string(),
  plot: z.string(),
  published_by: z.string(),
  release_date: z.number(),
  publish_date: z.number(),
  sf: z.boolean(),
  sv: z.boolean(),
  type: z.string(),
  translated_title: z.string(),
  year: z.number(),
  poster: z.string()
})
