// pages/api/register.js

import { db } from '@/lib/db.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  console.log(username, password);
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);

    const userId = result.lastID;

    res.status(201).json({ message: 'User registered successfully', userId});
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
