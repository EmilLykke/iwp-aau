// Importing connection modules
const connectMongoDB = require('./dbMongo');
const { connectSQLite } = require('./dbSQLite');

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


// Author database operations
async function findAllAuthors() {
    if (global.dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await AuthorMongo.find().sort({ family_name: 1 }).exec()
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
        console.log(id);
        return await AuthorSQLite.destroy({where: {id}});
    }
}

// Book database operations
async function findAllBooks(filter, order) {
     if (global.dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await BookMongo.find(filter).exec()
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

async function findBookById(id, filter) {
    if(global.dbType === 'mongo'){
        return filter ? await BookMongo.find({_id: id, ...filter}).exec() : await BookMongo.findById(id).exec();
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


// BookInstance database operations
async function findAllBookInstances(filter) {
    if (global.dbType === 'mongo') {
        // Assuming a BookInstance model exists for Mongoose
        return await BookInstanceMongo.find(filter).exec()
    } else if (global.dbType === 'sqlite') {
        // Assuming a BookInstance model exists for Sequelize
        const mappedBookInstances = await BookInstanceSQLite.findAll({ where: filter, include: [ {model: BookSQLite, include: [AuthorSQLite, GenreSQLite]}]});
        return mappedBookInstances.map(bookInstance => ({
            ...bookInstance.dataValues,
            url: bookInstance.url(),
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
        return await BookInstanceMongo.findById(id).exec();
    }
    else if (global.dbType === 'sqlite') {
        const bookInstance = await BookInstanceSQLite.findOne({ where: { id }, include: [ {model: BookSQLite, include: [AuthorSQLite, GenreSQLite]}]});
        const mappedBookInstance =
        {
            ...bookInstance.dataValues,
            url: bookInstance.url(),
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

module.exports = { switchDatabase, findAllAuthors, findAuthorById, createAuthor, updateAuthor, deleteAuthor, findAllBooks, findBookById, findAllBookInstances, findBookInstanceById};
