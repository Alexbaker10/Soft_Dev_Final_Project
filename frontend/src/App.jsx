import { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = { id: Date.now(), title: newBookTitle, status: 'Want to Read' };
    setBooks([...books, newBook]);
    setNewBookTitle('');
  };

  const updateStatus = (id) => {
    setBooks(books.map(b => b.id === id ? { ...b, status: 'Currently Reading' } : b));
  };

  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Reading Tracker</h1>
      
      <form onSubmit={handleAddBook}>
        <input value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)} placeholder="Add a book to Want to Read..." />
        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} - {book.status} 
            {book.status === 'Want to Read' && (
              <button onClick={() => updateStatus(book.id)}>Start Reading</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
