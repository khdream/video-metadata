'use client'
import { redirect } from '@/actions'
import { addMovie, useMovie } from '@/hooks'
import type { Movie } from '@/types'
import { unixTimestampToDateString } from '@/utils'
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
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Edit({ params }: { params: { id: string } }) {
  const session = useSession()

  useEffect(() => {
    if (!session || !session.data) return

    // @ts-ignore
    if (!session.data.admin) {
      redirect('/')
    }
  }, [session])

  const { data: movie, error, loading } = useMovie(params.id)

  const [spanishTitle, setSpanishTitle] = useState<string | undefined>(undefined)

  const handleSpanishTitle = (title: string) => {
    if (title === '') {
      setSpanishTitle(undefined)
      return
    }

    setSpanishTitle(title)
  }

  const [addToSv, setAddToSv] = useState<boolean>(false)

  const [addToSf, setAddToSf] = useState<boolean>(false)

  const [feedback, setFeedback] = useState<string | undefined>(undefined)

  const handleFeedback = (feedback: string) => {
    if (feedback === '') {
      setFeedback(undefined)
      return
    }

    setFeedback(feedback)
  }

  const [modified, setModified] = useState<'yes' | 'no' | 'unsuitable'>('yes')

  const hanldeModifiedChange = (checkbox: string) => {
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

  useEffect(() => {
    if (!movie) return

    setSpanishTitle(movie.translated_title)
    setAddToSv(movie.sv)
    setAddToSf(movie.sf)
    setFeedback(movie.feedback)
    setModified(movie.modified)
  }, [movie])

  const [addedBy, setAddedBy] = useState<string>('cr')

  const [loadingUpload, setLoadingUpload] = useState(false)

  const [errorUpload, setErrorUpload] = useState(false)

  const handleUpload = async () => {
    if (!movie || !spanishTitle) return

    setLoadingUpload(true)

    const newMovie: Movie = {
      countries: movie.countries,
      genres: movie.genres,
      feedback: feedback,
      id: movie.id,
      languages: movie.languages,
      modified,
      published_by: addedBy,
      release_date: movie.release_date,
      original_title: movie.original_title,
      plot: movie.plot,
      publish_date: movie.publish_date,
      sf: addToSf,
      sv: addToSv,
      type: movie.type,
      translated_title: spanishTitle,
      year: movie.year,
      poster: movie.poster
    }

    const success = await addMovie(newMovie)

    setLoadingUpload(false)

    if (!success) {
      setErrorUpload(true)

      return
    }

    setErrorUpload(false)
    redirect('/')
  }

  return (
    <Stack height="calc(100vh - 60px)" width="100vw">
      {loading ? (
        <HStack w="full" justifyContent="center" h="calc(100vh - 60px)">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </HStack>
      ) : null}

      {error ? (
        <VStack w="full" justifyContent="center" h="calc(90vh - 60px)">
          <Heading>No existe</Heading>
          <Text>La película que quieres editar no se encuentra en la base de datos.</Text>
          <Text>Revisa que el ID sea correcto y vuelve a intentar.</Text>
        </VStack>
      ) : null}

      {movie ? (
        <VStack py="5" maxWidth="600px" textAlign="center" mx="auto">
          <Text fontSize="18px" fontWeight="bold">
            Título
          </Text>

          <Text>{movie.original_title}</Text>

          <Text fontSize="18px" fontWeight="bold">
            Poster
          </Text>
          <Image src={movie.poster} width="200" height="100" alt="movie poster" />

          <Text fontSize="18px" fontWeight="bold">
            Título en Español
          </Text>
          <Input
            colorScheme="blue"
            maxWidth="300px"
            defaultValue={spanishTitle}
            onChange={(e) => handleSpanishTitle(e.target.value)}
          />
          <Text fontSize="18px" fontWeight="bold">
            Año de lanzamiento
          </Text>
          <Text>{movie.year}</Text>
          <Text fontSize="18px" fontWeight="bold">
            País
          </Text>
          <Text>{movie.countries.join(', ')}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Género
          </Text>
          <Text>{movie.genres.join(', ')}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Idiomas
          </Text>
          <Text>{movie.languages}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Trama
          </Text>
          <Text>{movie.plot}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Fecha de Publicación
          </Text>
          <Text>{unixTimestampToDateString(movie.publish_date)}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Tipo
          </Text>
          <Text>{movie.type === 'series' ? 'Serie' : movie.type === 'movie' ? 'Película' : movie.type}</Text>
          <Text fontSize="18px" fontWeight="bold">
            Editada
          </Text>
          <RadioGroup colorScheme="blue" value={modified ? '1' : '2'} onChange={hanldeModifiedChange}>
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
            <Checkbox colorScheme="blue" isChecked={addToSv} onChange={(e) => setAddToSv(e.target.checked)}>
              Sección de Varones
            </Checkbox>
            <Checkbox colorScheme="blue" isChecked={addToSf} onChange={(e) => setAddToSf(e.target.checked)}>
              Sección de Mujeres
            </Checkbox>
          </HStack>
          <Text fontSize="18px" fontWeight="bold">
            Comentario
          </Text>
          <Textarea
            colorScheme="blue"
            maxWidth="400px"
            defaultValue={feedback}
            onChange={(e) => handleFeedback(e.target.value)}
          />
          <Button colorScheme="blue" my="5" width="150px" onClick={handleUpload} isDisabled={!spanishTitle || !movie}>
            {loadingUpload ? <Spinner colorScheme="blue" /> : 'Actualizar'}
          </Button>
          {errorUpload ? (
            <Text color="red.600" fontSize="xs">
              No se pudo subir la pelicula. Revisa que la información sea correcta y vuelve a intentar.
            </Text>
          ) : null}
        </VStack>
      ) : null}
    </Stack>
  )
}
