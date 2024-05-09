'use client'

import { FloatingButton, NavBar } from '@/components'
import { useIsRouteActive } from '@/hooks'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient()

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'blue.600'
      }
    }
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  const { isAddRouteActive } = useIsRouteActive()

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NavBar />
          {children}
          {isAddRouteActive ? null : <FloatingButton />}
        </SessionProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
