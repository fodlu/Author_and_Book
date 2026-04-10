import express from 'express';
const app = express();

import indexRouter from './routes/index.js'
import authorRouter from './routes/authors.js'

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false, limit: '10mb'}))

// import mongoose from 'mongoose';

app.use('/', indexRouter);
app.use('/authors', authorRouter)

app.listen(3000)