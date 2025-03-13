'use client'

import { redirect } from '@/actions'
import { addMovie, fetchMovieMetadata } from '@/hooks'
import type { Movie, MovieMetadata } from '@/types'
import { abbreviatedDateStringToTimestamp, getCurrentDate } from '@/utils'
import {
  Button,
  Checkbox,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Textarea,
  VStack
} from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AddMovie() {
  const session = useSession()

  const [imdbId, setImdbID] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [movieMetadata, setMovieMetadata] = useState<MovieMetadata | undefined>()

  useEffect(() => {
    if (!session || !session.data) return

    // @ts-ignore
    if (!session.data.admin) {
      redirect('/')
    }
  }, [session])

  const handleImdbIDChange = (id: string) => {
    if (id === '') {
      setImdbID(undefined)
      return
    }
    setImdbID(id)
  }

  const fetchImdbMetadata = async () => {
    if (!imdbId) return
    try {
      setLoading(true)

      const metadata = await fetchMovieMetadata(imdbId)

      setMovieMetadata(metadata)
      setLoading(false)
      setError(false)
      setUploadSuccess(false)
    } catch (e) {
      setLoading(false)
      setError(true)
      setUploadSuccess(false)
    }
  }

  const [spanishTitle, setSpanishTitle] = useState<string | undefined>()

  const handleSpanishTitle = (title: string) => {
    if (title === '') {
      setSpanishTitle(undefined)
      return
    }

    setSpanishTitle(title)
  }

  const [addToSv, setAddToSv] = useState<boolean>(true)
  const [addToSf, setAddToSf] = useState<boolean>(true)
  const [feedback, setFeedback] = useState<string | undefined>(undefined)

  const handleFeedback = (feedback: string) => {
    if (feedback === '') {
      setFeedback(undefined)
      return
    }

    setFeedback(feedback)
  }

  const [modified, setModified] = useState<'yes' | 'no' | 'unsuitable'>('no')
  const [checkbox, setCheckbox] = useState<string>('2')
  const hanldeModifiedChange = (checkbox: string) => {
    setCheckbox(checkbox)

    if (checkbox === '1') {
      setModified('yes')
    }

    if (checkbox === '2') {
      setModified('no')
    }

    if (checkbox === '3') {
      setModified('unsuitable')
    }
  }

  const [addedBy, setAddedBy] = useState<string>('cr')
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorUpload, setErrorUpload] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleUpload = async () => {
    // @ts-ignore
    if (!movieMetadata || !spanishTitle || !session.data?.id) return

    setLoadingUpload(true)

    const year = movieMetadata.Year.split('–')

    const movie: Movie = {
      countries: movieMetadata.Country.split(',').map((text: string) => text.trim()),
      genres: movieMetadata.Genre.split(',').map((text: string) => text.trim()),
      feedback,
      id: movieMetadata.imdbID,
      languages: movieMetadata.Language.split(',').map((text: string) => text.trim()),
      modified,
      original_title: movieMetadata.Title,
      plot: movieMetadata.Plot,
      publish_date: getCurrentDate(),
      published_by: addedBy,
      release_date: abbreviatedDateStringToTimestamp(movieMetadata.Released),
      sf: addToSf,
      sv: addToSv,
      type: movieMetadata.Type as 'series' | 'movie',
      translated_title: spanishTitle,
      year: Number.parseInt(year[0]),
      poster: movieMetadata.Poster
    }

    const success = await addMovie(movie)

    setLoadingUpload(false)

    if (!success) {
      setErrorUpload(true)

      return
    }

    setErrorUpload(false)
    setMovieMetadata(undefined)
    setUploadSuccess(true)
  }

  return (
    <Stack height="calc(100vh - 60px)" width="100vw">
      <HStack width="100%" justifyContent="center">
        <Heading mt="16" fontSize={{ base: '26px', md: '40px' }}>
          Agregar película
        </Heading>
      </HStack>
      <VStack py="10">
        <HStack>
          <Input
            colorScheme="blue"
            placeholder="ID de IMDB"
            maxWidth="250px"
            onChange={(e) => handleImdbIDChange(e.target.value)}
          />
          <Button w="250px" colorScheme="blue" isDisabled={!imdbId} onClick={fetchImdbMetadata}>
            {loading ? <Spinner colorScheme="blue" /> : 'Cargar información'}
          </Button>
        </HStack>

        {error ? (
          <Text color="red.600" fontSize="xs">
            No se pudo cargar la información de la película. Asegurate que el ID es correcto.
          </Text>
        ) : null}

        {uploadSuccess ? (
          <Text color="green.600" fontSize="lg" py="10">
            La pelicula se agrego correctamente
          </Text>
        ) : null}

        {movieMetadata ? (
          <VStack py="5" maxWidth="600px" textAlign="center">
            <Text fontSize="18px" fontWeight="bold">
              Título
            </Text>
            <Text>{movieMetadata.Title}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Poster
            </Text>
            <Image src={movieMetadata.Poster} width="200" height="100" alt="movie poster" />
            <Text fontSize="18px" fontWeight="bold">
              Título en Español
            </Text>
            <Input colorScheme="blue" maxWidth="300px" onChange={(e) => handleSpanishTitle(e.target.value)} />
            <Text fontSize="18px" fontWeight="bold">
              Año de lanzamiento
            </Text>
            <Text>{movieMetadata.Year}</Text>
            <Text fontSize="18px" fontWeight="bold">
              País
            </Text>
            <Text>{movieMetadata.Country}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Género
            </Text>
            <Text>{movieMetadata.Genre}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Idiomas
            </Text>
            <Text>{movieMetadata.Language}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Trama
            </Text>
            <Text>{movieMetadata.Plot}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Fecha de Publicación
            </Text>
            <Text>{movieMetadata.Released}</Text>
            <Text fontSize="18px" fontWeight="bold">
              Tipo
            </Text>
            <Text>
              {movieMetadata.Type === 'series'
                ? 'Serie'
                : movieMetadata.Type === 'movie'
                  ? 'Película'
                  : movieMetadata.Type}
            </Text>
            <Text fontSize="18px" fontWeight="bold">
              Editada
            </Text>
            <RadioGroup colorScheme="blue" value={checkbox} onChange={hanldeModifiedChange}>
              <Stack direction="row">
                <Radio value="1">Sí</Radio>
                <Radio value="2">No</Radio>
                <Radio value="3">Desaconsejable</Radio>
              </Stack>
            </RadioGroup>
            <Text fontSize="18px" fontWeight="bold">
              Agregada por
            </Text>
            <RadioGroup colorScheme="blue" value={addedBy} onChange={setAddedBy}>
              <Stack direction="row">
                <Radio value="cr">cr</Radio>
                <Radio value="dlg">dlg</Radio>
                <Radio value="dly">dly</Radio>
              </Stack>
            </RadioGroup>
            <Text fontSize="18px" fontWeight="bold">
              Agregar a listas
            </Text>
            <HStack>
              <Checkbox colorScheme="blue" defaultChecked onChange={(e) => setAddToSv(e.target.checked)}>
                Sección de Varones
              </Checkbox>
              <Checkbox colorScheme="blue" defaultChecked onChange={(e) => setAddToSf(e.target.checked)}>
                Sección de Mujeres
              </Checkbox>
            </HStack>
            <Text fontSize="18px" fontWeight="bold">
              Comentario
            </Text>
            <Textarea colorScheme="blue" maxWidth="400px" onChange={(e) => handleFeedback(e.target.value)} />
            <Button
              colorScheme="blue"
              isDisabled={!movieMetadata || !spanishTitle}
              my="5"
              width="150px"
              onClick={handleUpload}
            >
              {loadingUpload ? <Spinner colorScheme="blue" /> : 'Agregar'}
            </Button>
            {errorUpload ? (
              <Text color="red.600" fontSize="xs">
                No se pudo subir la pelicula. Revisa que la información sea correcta y vuelve a intentar.
              </Text>
            ) : null}
          </VStack>
        ) : null}
      </VStack>
    </Stack>
  )
}
