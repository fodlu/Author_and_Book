import mongoose from "mongoose";
import BookModel from './book'

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {
    BookModel.find({author: this.id}, (err, books)=> {
        if(err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author has books still'))
        } else {
            next()
        }
    })
})

const AuthorModel = mongoose.model('Author', authorSchema);

export default AuthorModel;