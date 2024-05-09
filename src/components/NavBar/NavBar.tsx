'use client'

import { HomeIcon, LogoutIcon } from '@/components'
import { HStack, IconButton } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export function NavBar() {
  const session = useSession()

  return (
    <HStack
      position="relative"
      top="0"
      width="full"
      justifyContent="space-between"
      height="60px"
      px="5"
      backgroundColor="blue.500"
    >
      <Link href="/">
        <IconButton colorScheme="blue" aria-label="Home" w="50px" h="50px" icon={<HomeIcon h="35px" w="35px" />} />
      </Link>

      {session.status === 'authenticated' ? (
        <IconButton
          colorScheme="blue"
          aria-label="Home"
          w="50px"
          h="50px"
          icon={<LogoutIcon h="35px" w="35px" />}
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
        />
      ) : null}
    </HStack>
  )
}
