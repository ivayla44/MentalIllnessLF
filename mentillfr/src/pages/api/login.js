// pages/api/login.js

import { db } from '@/lib/db.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for JWT token generation

const SECRET_KEY = 'iva_e_mnogo_qka'; // Set a secret key for JWT

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  // Validate credentials and retrieve user data
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token upon successful login
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
  });

  console.log("Successfull login", token);

  res.status(200).json(token);
}
