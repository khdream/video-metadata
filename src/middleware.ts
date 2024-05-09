import withAuth from 'next-auth/middleware'

export const config = { matcher: ['/lospuentes', '/terralta'] }

export default withAuth({
  pages: {
    signIn: '/login',
    error: '/login'
  }
})
