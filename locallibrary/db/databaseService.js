// Importing connection modules
const connectMongoDB = require('./dbMongo');
const { connectSQLite } = require('./dbSQLite');

// Import Author models
const AuthorMongo = require('../models/author.model');
const AuthorSQLite = require('../models/sequlize/author.model');

// Import Book models
const BookMongo = require('../models/book.model');
const BookSQLite = require('../models/sequlize/book.model');


let dbType = 'sqlite'; // Default to mongo

async function switchDatabase(type) {
    if (type === dbType) {
        console.log(`Already using ${type}`);
        return;
    }

    if (dbType === 'mongo') {
        // Disconnect MongoDB if connected
        await mongoose.disconnect();
    } else if (dbType === 'sqlite') {
        // Disconnect SQLite if connected
        await sequelize.close();
    }

    if (type === 'mongo') {
        await connectMongoDB();
        dbType = 'mongo';
    } else if (type === 'sqlite') {
        await connectSQLite();
        dbType = 'sqlite';
    }
}


// Author database operations
async function findAllAuthors() {
    if (dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await AuthorMongo.find().sort({ family_name: 1 }).exec()
    } else if (dbType === 'sqlite') {
        // Assuming a Author model exists for Sequelize
        const authors = await AuthorSQLite.findAll({ order: [['family_name', 'ASC']] });
        return authors.map(author => ({
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
            ...author.dataValues
        }));
    }
}

async function findAuthorById(id) {
    if (dbType === 'mongo') {
        return await AuthorMongo.findById(id).exec();
    } else if (dbType === 'sqlite') {
        const author = await AuthorSQLite.findByPk(id);
        return {
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
            ...author.dataValues
        };
    }
}

// Book database operations
async function findAllBooks(filter) {
     if (dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await BookMongo.find(filter).exec()
    } else if (dbType === 'sqlite') {
        // Assuming a Author model exists for Sequelize
        const books = await BookSQLite.findAll(filter);
        return books.map(book => ({
            url: book.url(),
            ...book.dataValues
        }));
    }   
}

async function findBookById(id, filter) {
    if(dbType === 'mongo'){
        return filter ? await BookMongo.find({_id: id, ...filter}).exec() : await BookMongo.findById(id).exec();
    } else if(dbType === 'sqlite'){
        const book = filter ? await BookSQLite.findOne({where: {
            id,
            ...filter
        }}) : await BookSQLite.findByPk(id);
        return {
            url: book.url(),
            ...book.dataValues
        };
    }
}

module.exports = { switchDatabase, findAllAuthors, findAuthorById, findAllBooks, findBookById};
