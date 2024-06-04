// Importing connection modules
const connectMongoDB = require('./dbMongo');
const { connectSQLite } = require('./dbSQLite');

const {Op} = require('sequelize');

// Import Author models
const AuthorMongo = require('../models/author.model');
const AuthorSQLite = require('../models/sequlize/author.model');

// Import Book models
const BookMongo = require('../models/book.model');
const BookSQLite = require('../models/sequlize/book.model');

// Import BookInstance models
const BookInstanceMongo = require('../models/bookinstance.model');
const BookInstanceSQLite = require('../models/sequlize/bookinstance.model');

const GenreMongo = require('../models/genre.model');
const GenreSQLite = require('../models/sequlize/genre.model');


global.dbType = 'sqlite';

async function switchDatabase(type) {
    if (type === global.dbType) {
        console.log(`Already using ${type}`);
        return;
    }

    if (global.dbType === 'mongo') {
        // Disconnect MongoDB if connected
        await mongoose.disconnect();
    } else if (global.dbType === 'sqlite') {
        // Disconnect SQLite if connected
        await sequelize.close();
    }

    if (type === 'mongo') {
        await connectMongoDB();
        global.dbType = 'mongo';
    } else if (type === 'sqlite') {
        await connectSQLite();
        global.dbType = 'sqlite';
    }
}

// Search functions
async function searchAuthor(searchValue){
    if(global.dbType === 'mongo'){
        // E.g search for "bo"
        // Use regex so it also gets titles and names like "Test book", "Devin Bob". So not an exact match
        // Use $options: 'i' to make it case insensitive
        return await AuthorMongo.find({ first_name: { $regex: searchValue, $options: "i" } }).exec();
    } else if(global.dbType === 'sqlite'){
        const authors = await AuthorSQLite.findAll({where: {first_name: {[Op.substring]: searchValue}}});
        return authors.map(author => ({
            ...author.dataValues,
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
        }));
    
    }
}

async function searchBook(searchValue){
    if(global.dbType === 'mongo'){
        return await BookMongo.find({ title: { $regex: searchValue, $options: "i" } }).exec();
    } else if(global.dbType === 'sqlite'){
        const books = await BookSQLite.findAll({where: {title: {[Op.substring]: searchValue}}, include: [AuthorSQLite, GenreSQLite]});
        const booksWithAuthor = books.map(book => ({
            ...book.dataValues,
            url: book.url(),
            genre: [book.Genre.dataValues],
            author: {
                name: book.Author.name(),
                url: book.Author.url(),
                lifespan: book.Author.lifespan(),
                image_url: book.Author.image_url(),
                ...book.Author.dataValues
            }
        }));
        return booksWithAuthor;
    }
}

async function searchGenre(searchValue){
    if(global.dbType === 'mongo'){
        return await GenreMongo.find({ name: { $regex: searchValue, $options: "i" } }).exec();
    } else if(global.dbType === 'sqlite'){
        const genres = await GenreSQLite.findAll({where: {name: {[Op.substring]: searchValue}}}); 
        return genres
    }
}


// Author database operations
async function countAuthor() {
    if (global.dbType === 'mongo') {
        return await AuthorMongo.countDocuments().exec();
    } else if (global.dbType === 'sqlite') {
        return await AuthorSQLite.count();
    }
}

async function findAllAuthors() {
    if (global.dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        const authors = await AuthorMongo.find().sort({ family_name: 1 }).exec()
        return authors.map(author => ({
            ...author._doc,
            id: author._id,
            name: author.name,
            url: author.url,
            lifespan: author.lifespan,
            image_url: author.image_url,
        }))
    } else if (global.dbType === 'sqlite') {
        // Assuming a Author model exists for Sequelize
        const authors = await AuthorSQLite.findAll({ order: [['family_name', 'ASC']] });
        return authors.map(author => ({
            ...author.dataValues,
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
        }));
    }
}

async function findAuthorById(id) {
    if (global.dbType === 'mongo') {
        const author = await AuthorMongo.findById(id).exec();

        return {
            ...author._doc,
            id: author._id,
            name: author.name,
            url: author.url,
            lifespan: author.lifespan,
            image_url: author.image_url,
        }
    } else if (global.dbType === 'sqlite') {
        const author = await AuthorSQLite.findByPk(id);
        return {
            ...author.dataValues,
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
        };
    }
}

async function createAuthor(author) {
    if (global.dbType === 'mongo') {
        const newAuthor = new AuthorMongo(author);
        await newAuthor.save()
        return newAuthor.url;
    } else if (global.dbType === 'sqlite') {
        const newAuthor = await AuthorSQLite.create(author)
        return newAuthor.url();
    }
}

async function updateAuthor(id, author) {
    if(global.dbType === 'mongo'){
        const newAuthor = new AuthorMongo(author);
        const updatedAuthor = await AuthorMongo.findByIdAndUpdate(id, newAuthor, {}).exec();
        return updatedAuthor.url;
    } else if(global.dbType === 'sqlite'){
        delete author._id;
        await AuthorSQLite.update(author, {where: {id}});
        const authorInstance = await AuthorSQLite.findByPk(id);
        return authorInstance.url();

    }

}

async function deleteAuthor(id) {
    if(global.dbType === 'mongo'){
        return await AuthorMongo.findByIdAndDelete(id).exec();
    } else if(global.dbType === 'sqlite'){
        return await AuthorSQLite.destroy({where: {id}});
    }
}

// Book database operations
async function countBook() {
    if (global.dbType === 'mongo') {
        return await BookMongo.countDocuments().exec();
    } else if (global.dbType === 'sqlite') {
        return await BookSQLite.count();
    }
}

async function findAllBooks(filter, order) {
     if (global.dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await BookMongo.find(filter).populate('author').exec()
    } else if (global.dbType === 'sqlite') {


        const order2 = order ?  Object.keys(order).map(key => ([key, 'ASC'])) : undefined;

        const books = order ? await BookSQLite.findAll({where: filter, order: order2, include: [AuthorSQLite, GenreSQLite]}) : await BookSQLite.findAll({where: filter, include: [AuthorSQLite, GenreSQLite]});


        const booksWithAuthor = books.map(book => ({
            ...book.dataValues,
            url: book.url(),
            genre: [book.Genre.dataValues],
            author: {
                name: book.Author.name(),
                url: book.Author.url(),
                lifespan: book.Author.lifespan(),
                image_url: book.Author.image_url(),
                ...book.Author.dataValues
            }
        }));

        return booksWithAuthor
    }   
}

async function createBook(book) {
    if(global.dbType === 'mongo'){
        const newBook = new BookMongo(book);
        await newBook.save()
        return newBook.url;
    } else if(global.dbType === 'sqlite'){
        const newBook = await BookSQLite.create({...book, genre: book.genre[0] })
        return newBook.url();
    }
}

async function findBookById(id, filter) {
    if(global.dbType === 'mongo'){
        const book = filter ? await BookMongo.find({_id: id, ...filter}).populate('author').populate('genre').exec() : await BookMongo.findById(id).populate('author').populate('genre').exec();
        return book
    } else if(global.dbType === 'sqlite'){
        const book = await BookSQLite.findOne({where: {
            id,
            ...filter
        }, include: [ 
                 AuthorSQLite,
                 GenreSQLite,
        ]
    });
    
        return {
            ...book.dataValues,
            url: book.url(),
            author: {
                name: book.Author.name(),
                url: book.Author.url(),
                lifespan: book.Author.lifespan(),
                image_url: book.Author.image_url(),
                ...book.Author.dataValues
            },
            genre: [{
                ...book.Genre.dataValues,
                url: book.Genre.url(),
            }]
        };
    }
}

async function updateBook(id, book) {
    if(global.dbType === 'mongo'){
        const newBook = new BookMongo(book);
        const updatedBook = await BookMongo.findByIdAndUpdate(id, newBook, {}).exec();
        return updatedBook.url;
    } else if(global.dbType === 'sqlite'){
        delete book._id;
        await BookSQLite.update({...book, genre: book.genre[0]}, {where: {id}});
        const bookInstance = await BookSQLite.findByPk(id);
        return bookInstance.url();
    }
}

async function deleteBook(id) {
    if(global.dbType === 'mongo'){
        return await BookMongo.findByIdAndDelete(id).exec();
    } else if(global.dbType === 'sqlite'){
        return await BookSQLite.destroy({where: {id}});
    }
}


// BookInstance database operations
async function countBookInstance(filter) {
    if(global.dbType === 'mongo'){
        return await BookInstanceMongo.countDocuments(filter).exec();
    } else if(global.dbType === 'sqlite'){
        return await BookInstanceSQLite.count({where: filter});
    }
}

async function findAllBookInstances(filter) {
    if (global.dbType === 'mongo') {
        // Assuming a BookInstance model exists for Mongoose
        return await BookInstanceMongo.find(filter).populate('book').exec()
    } else if (global.dbType === 'sqlite') {
        // Assuming a BookInstance model exists for Sequelize
        const mappedBookInstances = await BookInstanceSQLite.findAll({ where: filter, include: [ {model: BookSQLite, include: [AuthorSQLite, GenreSQLite]}]});
        return mappedBookInstances.map(bookInstance => ({
            ...bookInstance.dataValues,
            url: bookInstance.url(),
            due_back_formatted: bookInstance.due_back_formatted(),
            due_back_yyyy_mm_dd: bookInstance.due_back_yyyy_mm_dd(),
            book: {
                ...bookInstance.Book.dataValues,
                author: {
                    name: bookInstance.Book.Author.name(),
                    url: bookInstance.Book.Author.url(),
                    lifespan: bookInstance.Book.Author.lifespan(),
                    image_url: bookInstance.Book.Author.image_url(),
                    ...bookInstance.Book.Author.dataValues
                },
                genre: [{
                    ...bookInstance.Book.Genre.dataValues,
                    url: bookInstance.Book.Genre.url(),
                }],
                url: bookInstance.Book.url(),
            },
        }))
    }
}

async function findBookInstanceById(id) {
    if (global.dbType === 'mongo') {
        return await BookInstanceMongo.findById(id).populate('book').exec();
    }
    else if (global.dbType === 'sqlite') {
        const bookInstance = await BookInstanceSQLite.findOne({ where: { id }, include: [ {model: BookSQLite, include: [AuthorSQLite, GenreSQLite]}]});
        const mappedBookInstance =
        {
            ...bookInstance.dataValues,
            url: bookInstance.url(),
            due_back_formatted: bookInstance.due_back_formatted(),
            due_back_yyyy_mm_dd: bookInstance.due_back_yyyy_mm_dd(),
            book: {
                ...bookInstance.Book.dataValues,
                author: {
                    name: bookInstance.Book.Author.name(),
                    url: bookInstance.Book.Author.url(),
                    lifespan: bookInstance.Book.Author.lifespan(),
                    image_url: bookInstance.Book.Author.image_url(),
                    ...bookInstance.Book.Author.dataValues
                },
                genre: [{
                    ...bookInstance.Book.Genre.dataValues,
                    url: bookInstance.Book.Genre.url(),
                }],
                url: bookInstance.Book.url(),
            },
        }

        return mappedBookInstance;
    }
}

async function createBookInstance(bookInstance) {
    if(global.dbType === 'mongo'){
        const newBookInstance = new BookInstanceMongo(bookInstance);
        await newBookInstance.save();
        return newBookInstance.url;
    } else if(global.dbType === 'sqlite'){
        const newBookInstance = await BookInstanceSQLite.create(bookInstance);
        return newBookInstance.url();
    }
}

async function deleteBookInstance(id) {
    if(global.dbType === 'mongo'){
        return await BookInstanceMongo.findByIdAndDelete(id).exec();
    } else if(global.dbType === 'sqlite'){
        return await BookInstanceSQLite.destroy({where: {id}});
    }

}

async function updateBookInstance(id, bookInstance) {
    if(global.dbType === 'mongo'){
        const newBookInstance = new BookInstanceMongo(bookInstance);
        const updatedBookInstance = await BookInstanceMongo.findByIdAndUpdate(id, newBookInstance, {}).exec();
        return updatedBookInstance.url;
    } else if(global.dbType === 'sqlite'){
        delete bookInstance._id;
        await BookInstanceSQLite.update(bookInstance, {where: {id}});
        const bookInstanceInstance = await BookInstanceSQLite.findByPk(id);
        return bookInstanceInstance.url();
    }
}

// Genre database operations
async function countGenre() {
    if (global.dbType === 'mongo') {
        return await GenreMongo.countDocuments().exec();
    } else if (global.dbType === 'sqlite') {
        return await GenreSQLite.count();
    }
}

async function findAllGenres() {
    if (global.dbType === 'mongo') {
        const genres = await GenreMongo.find().exec();
        return genres.map(genre => ({
            ...genre._doc,
            id: genre._id,
            name: genre.name,
            url: genre.url,
        }))
    } else if (global.dbType === 'sqlite') {
        const genres = await GenreSQLite.findAll({ order: [['name', 'ASC']] });
        console.log(genres);
        return genres.map(genre => ({
            ...genre.dataValues,
            url: genre.url(),
        }));
    }
}

async function findGenreById(id) {
    if(global.dbType === 'mongo'){
        const genre = await GenreMongo.findById(id).exec();
        return {
            ...genre._doc,
            id: genre._id,
            url: genre.url,
        }
    } else if(global.dbType === 'sqlite'){
        const genre = await GenreSQLite.findByPk(id);
        return {
            ...genre.dataValues,
            url: genre.url(),
        };
    }
}

async function findGenreByName(name) {
    if(global.dbType === 'mongo'){
        return await GenreMongo
            .findOne({name})
            .exec();
    }
    else if(global.dbType === 'sqlite'){
        return await GenreSQLite.findOne({where: {name}});
    }
}

async function createGenre(genre){
    if(global.dbType === 'mongo'){
        const newGenre = new GenreMongo(genre);
        await newGenre.save();
        return newGenre.url;
    } else if(global.dbType === 'sqlite'){
        const newGenre = await GenreSQLite.create(genre);
        return newGenre.url();
    }

}

async function deleteGenre(id) {
    if(global.dbType === 'mongo'){
        return await GenreMongo.findByIdAndDelete(id).exec();
    } else if(global.dbType === 'sqlite'){
        return await GenreSQLite.destroy({where: {id}});
    }
}

async function updateGenre(id, genre) {
    if(global.dbType === 'mongo'){
        const newGenre = new GenreMongo(genre);
        const updatedGenre = await GenreMongo.findByIdAndUpdate(id, newGenre, {}).exec();
        return updatedGenre.url;
    } else if(global.dbType === 'sqlite'){
        delete genre._id;
        await GenreSQLite.update(genre, {where: {id}});
        const genreInstance = await GenreSQLite.findByPk(id);
        return genreInstance.url();
    }
}

module.exports = { switchDatabase,searchAuthor, searchBook, searchGenre, countAuthor, countGenre, countBookInstance, countBook, findAllAuthors, findAuthorById, createAuthor, updateAuthor, deleteAuthor, findAllBooks, findBookById, createBook, updateBook, deleteBook, findAllBookInstances, findBookInstanceById, findAllGenres, findGenreById, findGenreByName, createGenre, deleteGenre, updateGenre, createBookInstance, deleteBookInstance, updateBookInstance};
