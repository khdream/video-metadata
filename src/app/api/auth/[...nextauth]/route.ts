import { pbkdf2Sync } from 'node:crypto'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import pg from 'pg'

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      return { ...session, ...token }
    }
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials, req) {
        const client = new pg.Client(process.env.DB_URL)
        await client.connect()

        if (!credentials?.username || !credentials.password) return null

        const result = await client.query(`SELECT * FROM users WHERE username = '${credentials.username}'`)

        if (result.rows.length === 0) return null

        const data = result.rows[0]

        const newHash = pbkdf2Sync(credentials.password, data.salt, 10000, 128, 'sha512').toString('hex')

        if (data.hash !== newHash) return null

        return { id: data.username, scope: data.scope, admin: data.admin }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
