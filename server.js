console.log('🔥 SERVER FILE IS RUNNING')

import express from 'express'
import pool from './db.js'

const app = express()

// Middleware
app.use(express.json())

// ----------------------
// TEST ROUTES
// ----------------------

app.get('/', (req, res) => {
  res.send('AIBO backend running 🚀')
})

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Database error')
  }
})

// ----------------------
// USERS API
// ----------------------

// CREATE USER
app.post('/users', async (req, res) => {
  const { full_name, email } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO users (full_name, email) VALUES ($1, $2) RETURNING *',
      [full_name, email]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating user')
  }
})

// GET USERS
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching users')
  }
})

// TEMP: CREATE USER FROM BROWSER
app.get('/create-user', async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (full_name, email) VALUES ('Dhruv', 'dhruv@test.com') RETURNING *"
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating user')
  }
})

// ----------------------
// MODULES API
// ----------------------

// CREATE MODULE
app.get('/create-module', async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO modules (title, description) VALUES ('AI Basics', 'Introduction to AI') RETURNING *"
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating module')
  }
})

// GET MODULES
app.get('/modules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM modules')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching modules')
  }
})

// ----------------------
// LESSONS API
// ----------------------

// CREATE LESSON
// CREATE LESSON
app.get('/create-lesson', async (req, res) => {
  try {
    const moduleResult = await pool.query('SELECT id FROM modules LIMIT 1')

    if (moduleResult.rows.length === 0) {
      return res.send('No module found. Create module first.')
    }

    const result = await pool.query(
      `INSERT INTO lessons (module_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        moduleResult.rows[0].id,
        'What is AI?',
        JSON.stringify({ text: 'AI means Artificial Intelligence' })
      ]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating lesson')
  }
})

// GET LESSONS
app.get('/lessons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lessons')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching lessons')
  }
})

// ----------------------
// SERVER START
// ----------------------
app.get('/check', (req, res) => {
  res.send('CHECK WORKING')
})
// ----------------------
// PROGRESS + XP API
// ----------------------

// COMPLETE LESSON
app.get('/complete-lesson', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id FROM users LIMIT 1')
    const lessonResult = await pool.query('SELECT id FROM lessons LIMIT 1')

    if (userResult.rows.length === 0) {
      return res.send('No user found. Create a user first.')
    }

    if (lessonResult.rows.length === 0) {
      return res.send('No lesson found. Create a lesson first.')
    }

    const result = await pool.query(
      `INSERT INTO progress (user_id, lesson_id, status, completed_at)
       VALUES ($1, $2, 'completed', NOW())
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET status = 'completed', completed_at = NOW()
       RETURNING *`,
      [userResult.rows[0].id, lessonResult.rows[0].id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating progress')
  }
})

// GET PROGRESS
app.get('/progress', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching progress')
  }
})

// ADD XP
app.get('/add-xp', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id FROM users LIMIT 1')

    if (userResult.rows.length === 0) {
      return res.send('No user found. Create a user first.')
    }

    const result = await pool.query(
      `INSERT INTO xp_records (user_id, source_type, points)
       VALUES ($1, 'lesson_completion', 10)
       RETURNING *`,
      [userResult.rows[0].id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error adding XP')
  }
})

// GET XP
app.get('/xp', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM xp_records ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching XP')
  }
})
// ----------------------
// ASSIGNMENTS API
// ----------------------

// CREATE ASSIGNMENT
app.get('/create-assignment', async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO assignments (title, description) VALUES ('AI Task', 'Build simple AI project') RETURNING *"
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating assignment')
  }
})

// GET ASSIGNMENTS
app.get('/assignments', async (req, res) => {
  const result = await pool.query('SELECT * FROM assignments')
  res.json(result.rows)
})

// SUBMIT ASSIGNMENT
app.get('/submit', async (req, res) => {
  try {
    const user = await pool.query('SELECT id FROM users LIMIT 1')
    const assignment = await pool.query('SELECT id FROM assignments LIMIT 1')

    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, submission_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [assignment.rows[0].id, user.rows[0].id, 'My submission']
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error submitting')
  }
})

// GET SUBMISSIONS
app.get('/submissions', async (req, res) => {
  const result = await pool.query('SELECT * FROM submissions')
  res.json(result.rows)
})
// ----------------------
// INSTITUTION API
// ----------------------

// CREATE INSTITUTION
app.get('/create-institution', async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO institutions (name, code) VALUES ('Demo Institute', 'DEMO001') RETURNING *"
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating institution')
  }
})

// GET INSTITUTIONS
app.get('/institutions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM institutions ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching institutions')
  }
})

// ASSIGN USER TO INSTITUTION
app.get('/assign-user-institution', async (req, res) => {
  try {
    const institutionResult = await pool.query('SELECT id FROM institutions LIMIT 1')
    const userResult = await pool.query('SELECT id FROM users LIMIT 1')

    if (institutionResult.rows.length === 0) {
      return res.send('No institution found. Create institution first.')
    }

    if (userResult.rows.length === 0) {
      return res.send('No user found. Create user first.')
    }

    const result = await pool.query(
      `UPDATE users
       SET institution_id = $1
       WHERE id = $2
       RETURNING *`,
      [institutionResult.rows[0].id, userResult.rows[0].id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error assigning user to institution')
  }
})

// GET USERS BY INSTITUTION
app.get('/institution-users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users
       WHERE institution_id IS NOT NULL
       ORDER BY created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching institution users')
  }
})
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})