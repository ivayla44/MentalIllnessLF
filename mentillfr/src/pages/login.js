import {useState} from 'react';
import {useRouter} from "next/router";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Assuming the backend returns a token upon successful login
        const { token } = await response.json();

        // Store the token in a secure way (e.g., localStorage) for future requests
        localStorage.setItem('token', token);

        // Redirect to a protected route or homepage
        // You can use Next.js router for navigation
        await router.push('/');


      } else {
        console.error('Login failed');

        // Handle login failure (e.g., display an error message)
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
