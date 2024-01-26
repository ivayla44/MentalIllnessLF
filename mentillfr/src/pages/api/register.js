// pages/api/register.js

import { db } from '@/lib/db.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for JWT token generation

const SECRET_KEY = 'iva_e_mnogo_qka'; // Set a secret key for JWT

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  // Validate username and password (add more validation as needed)
  console.log(username, password);
  // Hash the password before storing it in the database
  const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

  try {
    // Insert the new user into the database
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);

    const userId = result.lastID;

    // Generate a JWT token upon successful registration
    const token = jwt.sign({ userId, username }, SECRET_KEY, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
