import type { Movie } from '@/types'
import pg from 'pg'

export const getList = async (scope: 'lospuentes' | 'terralta'): Promise<Movie[]> => {
  const client = new pg.Client(process.env.DB_URL)
  await client.connect()

  let query = 'SELECT * FROM movies WHERE '

  if (scope === 'lospuentes') {
    query += 'sv = true'
  }

  if (scope === 'terralta') {
    query += 'sf = true'
  }

  const data = await client.query<Movie>(query)

  await client.end()

  return data.rows
}

export const getMovie = async (id: string): Promise<Movie | undefined> => {
  const client = new pg.Client(process.env.DB_URL)
  await client.connect()

  const query = `SELECT * FROM movies WHERE id = '${id}'`

  const data = await client.query<Movie>(query)

  if (data.rowCount === 0) return

  await client.end()

  return data.rows[0]
}

export const addMovie = async (movie: Movie): Promise<void> => {
  const client = new pg.Client(process.env.DB_URL)
  await client.connect()

  const query = `
    INSERT INTO movies (countries, genres, id, year, languages, release_date, publish_date, published_by, original_title, plot, modified, feedback, type, translated_title, sv, sf, poster) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    ON CONFLICT (id)
    DO UPDATE SET 
      countries = $1,
      genres = $2,
      year = $4,
      languages = $5,
      release_date = $6,
      publish_date = $7,
      published_by = $8,
      original_title = $9,
      plot = $10,
      modified = $11,
      feedback = $12,
      type = $13,
      translated_title = $14,
      sv = $15,
      sf = $16,
      poster = $17
    `

  const data = await client.query(query, [
    movie.countries,
    movie.genres,
    movie.id,
    movie.year,
    movie.languages,
    movie.release_date,
    movie.publish_date,
    movie.published_by,
    movie.original_title,
    movie.plot,
    movie.modified,
    movie.feedback,
    movie.type,
    movie.translated_title,
    movie.sv,
    movie.sf,
    movie.poster
  ])

  if (data.rowCount === 0) return

  await client.end()

  return data.rows[0]
}
