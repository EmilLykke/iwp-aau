const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/data.db'
});

const connectSQLite = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQLite');
    } catch (error) {
        console.error('SQLite connection error:', error);
    }
};


module.exports = { connectSQLite, sequelize};
