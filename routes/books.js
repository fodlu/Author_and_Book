import express from 'express';
import BookModel from '../model/book.js';
import AuthorModel from '../model/author.js';

const router = express.Router();

// const uploadPath = path.join('public', coverImageBasePath);
// const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif'];
// const upload = multer({
//     dest: uploadPath,
//     filefilter: (req, file, callback) => {
//         callback(null, )
//     }
// })

// all books

router.get('/', async (req, res)=> {
    let query = BookModel.find();
    if(req.query.title !== null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }

    if(req.query.publishBefore !== null && req.query.publishBefore !== '') {
        query = query.lte('publishDate', req.query.publishBefore)
    }

    if(req.query.publishAfter !== null && req.query.publishAfter !== '') {
        query = query.lte('publishDate', req.query.publishAfter)
    }
    try {
        // const books = await Book.find({});
        const books = await query.exec();
        res.render('books/index', {
            books: books, 
            searchOptions: req.query
        })        
    } catch {
        res.redirect('/');
    }
})

// new book
router.get('/new', async (req, res)=> {
    renderNewPage(res, new BookModel());
});

// create book route
// router.post('/', upload.single('cover'), async (req, res)=>{
router.post('/', async (req, res)=>{
    // const filename = req.file !== null ? req.filename : null
    const book = new BookModel({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: filename,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`)
        // res.redirect('books')
    } catch {
        // if(book.coverImage !== null) {
        //     removeBookCover(book.coverImage)
        renderNewPage(res, book, true);
    }
})

/* function removeBookCover (filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if (err) console.error(err);
    })
} */

// show book
router.get('/:id', async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id).populate('author').exec();
        res.render('books/show', {book: book});
    } catch {
        res.redirect('/')
    }
})

// edit new book
router.get('/:id/edit', async (req, res)=> {
    try {
        const book = await BookModel.findById(req.params.id);
        renderEditPage(res, book);
    } catch {
        res.redirect('/')
    }
});

// Update book route
router.put('/:id', async (req, res)=>{
    let book;

    try {
        book = await BookModel.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if(req.body.cover !== null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        };
        await book.save();
        res.redirect(`books/${book.id}`);
    } catch {
        if(book !== null){
            renderEditPage(res, book, true);
        } else {
            redirect('/')
        }
    }
})

// delete book page
router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await BookModel.findByIdAndDelete(req.params.id);
        res.redirect('/')
    } catch {
        if(book !== null) {
            res.render('books/show', {
                book: book,
                errorMessage: "Could not remove book"
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage (res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError);
}

function saveCover(book, coverEncoded) {
    if(coverEncoded !== null) return;
    const cover = JSON.parse(coverEncoded);
    if(cover !== null && ImageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await AuthorModel.find({});
        const params = {
            authors: authors,
            book: book
        };
        const book = new BookModel({})
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        } 
        res.render(`/books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
}

export default router