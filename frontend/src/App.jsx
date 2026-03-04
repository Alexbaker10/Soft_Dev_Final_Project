import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api';

function BookCard({ book, onStatusAdvance, onChaptersSet, onNoteChange, onSummaryChange }) {
  const [expanded, setExpanded] = useState(false);
  const [chapterInput, setChapterInput] = useState('');

  const isReading = book.status === 'Currently Reading';
  const isFinished = book.status === 'Finished';
  const hasChapters = book.chapters && book.chapters.length > 0;
  const isExpandable = isReading || isFinished;

  const badgeClass = `status-badge${isReading ? ' reading' : isFinished ? ' finished' : ''}`;

  const handleSetChapters = () => {
    const n = parseInt(chapterInput);
    if (n > 0 && n <= 200) onChaptersSet(book.id, n);
  };

  return (
    <div className="book-card">
      <div className="book-header" onClick={() => isExpandable && setExpanded(e => !e)}>
        <span className="book-title">{book.title}</span>
        <div className="book-meta">
          <span className={badgeClass}>{book.status}</span>
          {!isFinished && (
            <button
              className="btn-action"
              onClick={e => { e.stopPropagation(); onStatusAdvance(book); }}
            >
              {isReading ? 'Mark Finished' : 'Start Reading'}
            </button>
          )}
          {isExpandable && (
            <span className="chevron">{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="book-body">
          {isReading && !hasChapters && (
            <div className="chapter-setup">
              <span className="chapter-setup-label">How many chapters?</span>
              <input
                className="input-small"
                type="number"
                min="1"
                max="200"
                value={chapterInput}
                onChange={e => setChapterInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSetChapters()}
                placeholder="—"
              />
              <button className="btn-confirm" onClick={handleSetChapters}>Set</button>
            </div>
          )}
          {hasChapters && (
            <div className="chapter-list">
              {book.chapters.map((note, i) => (
                <div key={i} className="chapter-row">
                  <span className="chapter-label">Ch. {i + 1}</span>
                  <textarea
                    className="note-input"
                    placeholder={`Notes for chapter ${i + 1}...`}
                    value={note}
                    rows={1}
                    onChange={e => onNoteChange(book.id, i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {isFinished && (
            <div className="summary-section">
              <span className="summary-label">✦ Book Summary</span>
              <textarea
                className="summary-input"
                placeholder="Write your overall thoughts on this book..."
                value={book.summary || ''}
                onChange={e => onSummaryChange(book.id, e.target.value)}
              />
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/books`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBooks(res.data.map(b => ({ ...b, chapters: [], summary: '' }))))
      .catch(() => alert('Failed to load books'));
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch {
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
      setBooks(prev => [...prev, { ...res.data, chapters: [], summary: '' }]);
      setNewBookTitle('');
    } catch {
      alert('Failed to add book');
    }
  };

  const handleStatusAdvance = async (book) => {
    const nextStatus = book.status === 'Want to Read' ? 'Currently Reading' : 'Finished';
    try {
      const res = await axios.put(
        `${API}/books/${book.id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: res.data.status } : b));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleChaptersSet = (id, count) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, chapters: Array(count).fill('') } : b));
  };

  const handleNoteChange = (id, index, value) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const chapters = [...b.chapters];
      chapters[index] = value;
      return { ...b, chapters };
    }));
  };

  const handleSummaryChange = (id, value) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, summary: value } : b));
  };

  if (!token) {
    return (
      <div className="login-wrap">
        <div className="login-box">
          <h2 className="login-title">Reading Tracker</h2>
          <form onSubmit={handleLogin}>
            <input className="login-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="login-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="login-btn" type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const sections = ['Currently Reading', 'Want to Read', 'Finished'];

  return (
    <div className="app">
      <div className="header">
        <h1 className="header-title">Reading Tracker</h1>
        <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
      <div className="main">
        <form className="add-form" onSubmit={handleAddBook}>
          <input
            className="input-text"
            value={newBookTitle}
            onChange={e => setNewBookTitle(e.target.value)}
            placeholder="Add a new book..."
          />
          <button className="btn-add" type="submit">Add Book</button>
        </form>

        {sections.map(status => {
          const group = books.filter(b => b.status === status);
          if (!group.length) return null;
          return (
            <div key={status} className="section">
              <div className="section-label">{status} · {group.length}</div>
              {group.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onStatusAdvance={handleStatusAdvance}
                  onChaptersSet={handleChaptersSet}
                  onNoteChange={handleNoteChange}
                  onSummaryChange={handleSummaryChange}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}