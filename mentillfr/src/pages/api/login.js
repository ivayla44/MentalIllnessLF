// pages/api/login.js

import { db } from '@/lib/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  // validate credentials and retrieve user data
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const session = crypto.randomBytes(16).toString('base64');
  res.setHeader("Set-Cookie", [`session=${session}; HttpOnly; Path=/`, `user=${user.id}; HttpOnly; Path=/`]);

  console.log("Successfull login", user.id);

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
    },
    session: session,
  });
}
