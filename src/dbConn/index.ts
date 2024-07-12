import { Pool } from 'pg'

const ssl = { rejectUnauthorized: false }

const pool = new Pool({ ssl })

export { pool }