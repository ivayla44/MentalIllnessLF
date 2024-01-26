// pages/search.js
import { useState } from 'react';
import Link from 'next/link';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: searchQuery }),
      });

      if (response.ok) {
        const users = await response.json();
        setSearchResults(users);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div>
      <h1>User Search</h1>
      <input
        type="text"
        placeholder="Search for users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {searchResults.map(user => (
          <li key={user.id}>
            <Link href={`/user/${user.id}`}>
              <a>{user.username}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
