'use client'

import { redirect } from '@/actions'
import { EditIcon, Table } from '@/components'
import { useList } from '@/hooks'
import type { Movie } from '@/types'
import { unixTimestampToDateString } from '@/utils'
import { Badge, Center, HStack, Heading, IconButton, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { orderBy } from 'lodash'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'

export default function LosPuentes() {
  const session = useSession()

  useEffect(() => {
    if (!session) return

    // @ts-ignore
    const scope = session?.data?.scope

    if (scope !== 'lospuentes' && scope !== 'admin') {
      redirect('/')
    }
  }, [session])

  const { data: movies, error, loading } = useList('lospuentes')

  const sortedMovies: Movie[] | undefined = useMemo(() => {
    if (!movies) return
    const moviesSorted = orderBy(movies, 'publish_date', 'desc')

    return moviesSorted
  }, [movies])

  const moviesColumnHelper = createColumnHelper<Movie>()

  const moviesColumns = useMemo(() => {
    if (!session) return

    // biome-ignore lint/suspicious/noExplicitAny: unable to match types
    const columns: any[] = [
      moviesColumnHelper.accessor('poster', {
        cell: (info) => {
          return (
            <Center w="full">
              <Link href={`https://www.imdb.com/title/${info.row.original.id}`} target="_blank" rel="noreferer">
                <Image src={info.getValue()} width="80" height="50" alt="movie poster" />
              </Link>
            </Center>
          )
        },
        header: () => '',
        size: 80
      }),
      moviesColumnHelper.accessor('original_title', {
        cell: (info) => <Text fontSize="16px">{info.getValue()}</Text>,
        header: () => 'Título Original',
        minSize: 175
      }),
      moviesColumnHelper.accessor('translated_title', {
        cell: (info) => <Text fontSize="16px">{info.getValue()}</Text>,
        header: () => 'Título en Español',
        minSize: 175
      }),
      moviesColumnHelper.accessor('year', {
        cell: (info) => (
          <HStack justifyContent="center" width="full">
            <Text fontSize="14px">{info.getValue()}</Text>
          </HStack>
        ),
        header: () => 'AÑO'
      }),
      moviesColumnHelper.accessor('publish_date', {
        cell: (info) => (
          <HStack justifyContent="center" width="full">
            <Text fontSize="14px">{unixTimestampToDateString(info.getValue())}</Text>
          </HStack>
        ),
        header: () => 'Publicada'
      }),
      moviesColumnHelper.accessor('modified', {
        cell: (info) =>
          info.getValue() === 'unsuitable' ? (
            <HStack justifyContent="center" width="full">
              <Badge colorScheme="red" w="110px" textAlign="center" fontSize="10px">
                Desaconsejable
              </Badge>
            </HStack>
          ) : info.getValue() === 'yes' ? (
            <HStack justifyContent="center" width="full">
              <Badge colorScheme="red" w="40px" textAlign="center">
                Sí
              </Badge>
            </HStack>
          ) : (
            <HStack justifyContent="center" width="full">
              <Badge colorScheme="green" w="40px" textAlign="center">
                No
              </Badge>
            </HStack>
          ),
        header: () => 'Editada'
      }),
      moviesColumnHelper.accessor('type', {
        cell: (info) =>
          info.getValue() === 'movie' ? (
            <HStack justifyContent="center" width="full">
              <Badge colorScheme="green">Película</Badge>
            </HStack>
          ) : (
            <HStack justifyContent="center" width="full">
              <Badge colorScheme="blue">Serie</Badge>
            </HStack>
          ),
        header: () => 'Tipo'
      })
    ]

    // @ts-ignore
    if (session?.data?.scope === 'admin') {
      columns.push(
        moviesColumnHelper.accessor('id', {
          cell: (info) => (
            <HStack justifyContent="center" width="full">
              <Link href={`/edit/${info.getValue()}`}>
                <IconButton aria-label="editar pelicula" size="xs" colorScheme="blue" icon={<EditIcon h="3" w="3" />} />
              </Link>
            </HStack>
          ),
          header: () => '',
          maxSize: 10
        })
      )
    }

    return columns
  }, [session, moviesColumnHelper])

  return (
    <Stack height="calc(100vh - 60px)" width="100vw">
      {loading ? (
        <HStack w="full" justifyContent="center" h="calc(100vh - 60px)">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </HStack>
      ) : null}

      {error ? (
        <VStack w="full" justifyContent="center" h="calc(90vh - 60px)">
          <Heading>Error</Heading>
          <Text>Hubo un error a la hora de cargar la lista.</Text>
          <Text>Reinicia la página. Si no funciona, ponte en contacto con los encargados.</Text>
        </VStack>
      ) : null}

      {sortedMovies ? (
        <VStack width="100%" px={{ base: '5', md: '10', lg: '20' }} spacing="5">
          <HStack width="100%" justifyContent="center">
            <Heading mt="4" fontSize={{ base: '26px', md: '40px' }}>
              Películas
            </Heading>
          </HStack>
          <Table columns={moviesColumns} data={sortedMovies} />
        </VStack>
      ) : null}
    </Stack>
  )
}
