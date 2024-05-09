'use client'

import { AddIcon } from '@/components'
import { Box, IconButton } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export function FloatingButton() {
  const session = useSession()

  // @ts-ignore
  return session.data?.admin ? (
    <Box position="fixed" bottom="5" right="5">
      <Link href="/add">
        <IconButton
          aria-label="Add Movie"
          isRound={true}
          variant="solid"
          colorScheme="blue"
          w="50px"
          h="50px"
          boxShadow="md"
          p="2"
          icon={<AddIcon />}
        />
      </Link>
    </Box>
  ) : null
}
