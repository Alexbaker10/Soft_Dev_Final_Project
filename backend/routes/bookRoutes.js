const express = require('express');
const router = express.Router();
const { getBooks, addBook, updateBookStatus } = require('../controllers/bookController');

router.get('/', getBooks);
router.post('/', addBook);
router.put('/:id', updateBookStatus);

module.exports = router;