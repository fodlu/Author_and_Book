import express from 'express';
import AuthorModel from '../model/author.js';
import BookModel from '../model/book.js';
const router = express.Router();

// all authors
router.get('/', async (req, res)=> {
    let searchOptions = {};
    if(req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await AuthorModel.find(searchOptions);
        res.render('author/index', {
            authors: authors, 
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
    }

})

// new author
router.get('/new', (req, res)=> {
    req.render('authors/new', {author: new AuthorModel()})
});

// create author route
router.post('/', async (req, res)=>{
    const author = new AuthorModel({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res)=>{
    try {
        const author = await AuthorModel.findById(req.params.id);
        const books = await BookModel.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/');
    }
    res.send('Show Author' + req.params.id)
})

router.get('/:id/edit', async (req, res)=>{
    try {
        const author = AuthorModel.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res)=> {
    let author;
    try {
        author = await AuthorModel.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        if(author === null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res)=> {
    let author;
    try {
        author = await AuthorModel.findById(req.params.id);
        await author.remove();
        res.redirect(`/authors`)
    } catch (error) {
        if(author === null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

export default router