'use client'

import { redirect } from '@/actions'
import { EyeIcon, EyeSlashedIcon } from '@/components'
import {
  Button,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import type { Session } from 'next-auth'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function LogIn() {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'authenticated') {
      redirect('/')
    }
  }, [session])

  const [user, setUser] = useState<string | undefined>(undefined)

  const [password, setPassword] = useState<string | undefined>(undefined)

  const [invalidAuth, setInvalidAuth] = useState<boolean>(false)

  const [loadingAction, setLoadingAction] = useState<boolean>(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleUserChange = (user: string) => {
    setUser(user === '' ? undefined : user)

    setInvalidAuth(false)
  }

  const handlePasswordChange = (password: string) => {
    setPassword(password === '' ? undefined : password)

    setInvalidAuth(false)
  }

  const handleLogIn = async (username?: string, password?: string) => {
    if (!user || !password) return

    setLoadingAction(true)

    const result = await signIn('credentials', {
      username: username,
      password: password,
      redirect: false
    })

    if (result?.ok) {
      const session = (await getSession()) as Session & { scope: string }

      if (session) {
        if (session.scope === 'admin') {
          redirect('/')
        }

        if (session.scope === 'terralta') {
          redirect('/terralta')
        }

        if (session.scope === 'lospuentes') {
          redirect('/lospuentes')
        }
      }
    } else {
      setLoadingAction(false)
      setInvalidAuth(true)
    }
  }

  return (
    <VStack alignItems="center" height="full" justifyContent="flex-start" paddingTop="100px" spacing="50px" mx="auto">
      <Heading>Iniciar Sesión</Heading>
      <VStack alignItems="center" paddingTop="5" paddingX="20px" spacing="3" width="90%">
        <Input
          borderRadius="2xl"
          paddingY="5"
          placeholder="Ingresa tu usuario"
          type="text"
          maxWidth="300px"
          onChange={(e) => handleUserChange(e.target.value)}
        />

        <InputGroup maxWidth="300px">
          <Input
            borderRadius="2xl"
            paddingY="5"
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />

          <InputRightElement height="full" marginRight="2">
            <IconButton
              aria-label="show password"
              colorScheme="blue"
              icon={
                showPassword ? <EyeSlashedIcon boxSize="5" color="primary" /> : <EyeIcon boxSize="5" color="primary" />
              }
              rounded="full"
              size="sm"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
            />
          </InputRightElement>
        </InputGroup>
      </VStack>
      <Button
        onClick={async () => await handleLogIn(user, password)}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="2xl"
        boxShadow="base"
        colorScheme="blue"
        isDisabled={!user || !password}
        paddingX="5"
      >
        {loadingAction ? <Spinner colorScheme="blue" /> : <Text fontWeight="bold">Entrar</Text>}
      </Button>

      {invalidAuth ? (
        <Text color="red.600" fontSize="xs">
          La información de usuario o la contraseña no son correctas
        </Text>
      ) : null}
    </VStack>
  )
}
