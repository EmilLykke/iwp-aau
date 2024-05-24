// Importing connection modules
const connectMongoDB = require('./dbMongo');
const { connectSQLite } = require('./dbSQLite');
const AuthorMongo = require('../models/author.model');
const AuthorSQLite = require('../models/sequlize/author.model');

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


async function findAllAuthors() {
    if (dbType === 'mongo') {
        // Assuming a Author model exists for Mongoose
        return await AuthorMongo.find().sort({ family_name: 1 }).exec()
    } else if (dbType === 'sqlite') {
        // Assuming a Author model exists for Sequelize
        const authors = await AuthorSQLite.findAll();
        console.log(authors[0].url);
        return authors.map(author => ({
            name: author.name(),
            url: author.url(),
            lifespan: author.lifespan(),
            image_url: author.image_url(),
            ...author
        }));
    }
}

module.exports = { switchDatabase, findAllAuthors };
