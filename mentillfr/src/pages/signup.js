import { useState } from 'react';
import {useRouter} from "next/router";
import Link from "next/link";

const Signup = () => {
    const router = useRouter(); // Get the router instance

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
          await response.json();
          await router.push("/login");
      } else {
          console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
            <Link href="/login">Login</Link>


    </div>
  );
};

export default Signup;
