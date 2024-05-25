const { sequelize } = require('../../db/dbSQLite');
const AuthorSchema = require('./author.model');
const GenreSchema = require('./genre.model');

const { DataTypes } = require('sequelize')

const BookSchema = sequelize.define('Book',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.TEXT, required: true },
  author: { type: DataTypes.INTEGER, primaryKey: true, required: true },
  summary: { type: DataTypes.TEXT, required: true },
  isbn: { type: DataTypes.TEXT, required: true },
  genre: [{ type: DataTypes.INTEGER, primaryKey: true}],
}, {
  tableName: "Book",
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

// Virtual for book's URL
BookSchema.prototype.url = function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this.id}`;
};

// https://sequelize.org/docs/v7/associations/belongs-to/
BookSchema.belongsTo(AuthorSchema, { foreignKey: {name: 'author'}, targetKey: 'id'});

BookSchema.belongsTo(GenreSchema, { foreignKey: {name: 'genre'}, targetKey: 'id'});

// Export model
module.exports = BookSchema;
