import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const STATUSES = ['Want to Read', 'Currently Reading', 'Finished'];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');

  
  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/books`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBooks(res.data))
      .catch(() => alert('Failed to load books'));
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed: invalid credentials');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setBooks([]);
    localStorage.removeItem('token');
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    try {
      const res = await axios.post(
        `${API}/books`,
        { title: newBookTitle, status: 'Want to Read' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks([...books, res.data]);
      setNewBookTitle('');
    } catch {
      alert('Failed to add book');
    }
  };

  const updateStatus = async (book) => {
    const nextStatus = STATUSES[(STATUSES.indexOf(book.status) + 1) % STATUSES.length];
    try {
      const res = await axios.put(
        `${API}/books/${book.id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks(books.map(b => b.id === book.id ? res.data : b));
    } catch {
      alert('Failed to update status');
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Reading Tracker</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleAddBook}>
        <input
          value={newBookTitle}
          onChange={e => setNewBookTitle(e.target.value)}
          placeholder="Add a book..."
        />
        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} — <em>{book.status}</em>
            {book.status !== 'Finished' && (
              <button onClick={() => updateStatus(book)} style={{ marginLeft: '8px' }}>
                {book.status === 'Want to Read' ? 'Start Reading' : 'Mark Finished'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
