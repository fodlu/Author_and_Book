import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts' 

const app = express();


import indexRouter from './routes/index.js';
import authorRouter from './routes/authors.js';
import bookRouter from './routes/books.js';

app.set('view engine', 'ejs');
app.set('views', 'view')
app.set('layout', 'layouts/layout');
app.use(expressLayouts)
app.use(express.urlencoded({extended: false, limit: '10mb'}));
app.use(express.static('public'));

mongoose.connect(process.env.DATABASE_URL)
.then(()=> {
    console.log('Mongodb connected');
    app.listen(process.env.PORT, ()=>{
        console.log(`Server connected to port ${process.env.PORT}`);
    });
})
.catch((err)=> {
    console.error('Mongodb connection failed:', err.message);
});


app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
