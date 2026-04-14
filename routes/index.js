import express from 'express';
const router = express.Router();
import BookModel from '../model/book.js';

router.get('/', async (req, res)=> {
    let books;
    try {
        books = await BookModel.find().sort({createdAt: 'desc'}).limit(10).exec();
    } catch {
        books = []
    }
    
    res.render('index', {
        books: books
    });
})

export default router