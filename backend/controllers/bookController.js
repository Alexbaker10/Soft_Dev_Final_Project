const { books } = require('../models/db');

exports.getBooks = (req, res) => {
    res.json(books);
};

exports.addBook = (req, res) => {
    const { title, status } = req.body;
    const newBook = { id: Date.now(), title, status: status || 'Want To Read' };
    books.push(newBook);
    res.status(201).json(newBook);
};

exports.updateBookStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const book = books.find(b => b.id == id);
    if (!book) return res.status(404).json({ error: 'Book Not Found' });
    book.status = status;
    res.json(book);
};