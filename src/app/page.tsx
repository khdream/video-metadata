'use client'

import { HStack, Heading, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <Stack height="calc(100vh - 60px)" width="100vw">
      <HStack width="100%" justifyContent="center">
        <Heading mt="16" fontSize={{ base: '26px', md: '40px' }}>
          Videoteca México
        </Heading>
      </HStack>
      <HStack
        justifyContent="center"
        py="10"
        width="100%"
        maxWidth="800px"
        mx="auto"
        px="10"
        spacing={{ base: '5', md: '200px' }}
      >
        <Link href="/terralta">
          <Image src="/terralta.jpeg" width={120} height={126} alt="Terralta" />
        </Link>
        <Link href="/lospuentes">
          <Image src="/lospuentes.jpeg" width={120} height={126} alt="Los Puentes" />
        </Link>
      </HStack>
    </Stack>
  )
}
