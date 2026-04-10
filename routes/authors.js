import express from 'express';
import AuthorModel from '../model/author.js';
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
    req.render('authors/new', {author: new AuthorModel})
});

// create author route
router.post('/', async (req, res)=>{
    const author = new AuthorModel({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

export default router