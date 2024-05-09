import { usePathname } from 'next/navigation'

export const useIsRouteActive = () => {
  const pathname = usePathname()

  return {
    isHomeRouteActive: pathname === '/',
    isAddRouteActive: pathname === '/add'
  }
}
