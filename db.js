import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aibo',
  password: 'Dhruv',
  port: 5432,
})

export default pool