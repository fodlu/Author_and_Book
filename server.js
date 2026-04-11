import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts' 

const app = express();

import indexRouter from './routes/index.js';
import authorRouter from './routes/authors.js';

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

// const db = mongoose.connection;
// db.on('error', error => console.error(error))
// db.once('once', () => console.error('Connected to mongoose'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
