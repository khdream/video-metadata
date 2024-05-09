import { pbkdf2Sync, randomBytes } from 'node:crypto'
import 'dotenv/config'
import pg from 'pg'

async function main() {
  const args = process.argv

  if (args.length < 6) {
    console.error('bun create-user [USUARIO] [CONTRASEÑA] [SCOPE (lospuentes o terralta)] [ADMIN]')
    process.exit(0)
  }

  const user = args[2]
  const password = args[3]
  const scope = args[4]
  const admin = args[5] === 'true'

  if (scope !== 'lospuentes' && scope !== 'terralta' && scope !== 'admin') {
    console.error('La variable de "scope" solamente puede ser "lospuentes" o "terralta"')
    process.exit(0)
  }

  const salt = randomBytes(128).toString('hex')

  const hash = pbkdf2Sync(password, salt, 10000, 128, 'sha512').toString('hex')

  const client = new pg.Client(process.env.DB_URL)
  await client.connect()

  await client.query(
    `INSERT INTO users (username, salt, hash, scope, admin) VALUES ('${user}', '${salt}', '${hash}', '${scope}', ${admin})`
  )

  await client.end()
}

main().catch((e) => console.log(e))
