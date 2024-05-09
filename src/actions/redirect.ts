'use server'

import { redirect as nextRedirect } from 'next/navigation'

export const redirect = (url: string) => {
  return nextRedirect(url)
}
