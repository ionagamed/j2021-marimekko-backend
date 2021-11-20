function requiredEnv (name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Cannot find ${name} in env`)
  }
  return value
}

const dbOptions = {
  sqlite: {
    type: 'sqlite',
    database: './db.sqlite3'
  }
} as const
const DB_PRESET = requiredEnv('DB_PRESET')

export const config = {
  db: dbOptions[DB_PRESET]
}