const { DateTime } = require("luxon");
const { sequelize } = require("../../db/dbSQLite");
const { DataTypes } = require("sequelize");
const BookSchema = require("./book.model");

const BookInstanceSchema = sequelize.define('BookInstance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  book: { type: DataTypes.INTEGER, required: true, primaryKey: true }, // reference to the associated book
  imprint: { type: DataTypes.TEXT, required: true },
  status: {
    type: DataTypes.ENUM("Available", "Maintenance", "Loaned", "Reserved"),
    required: true,
    default: "Maintenance",
  },
  due_back: { type: DataTypes.TEXT, default: Date.now() },
}, {
  tableName: "BookInstance",
  timestamps: false,
  createdAt: false,
  updatedAt: false,

});

// Virtual for bookinstance's URL
BookInstanceSchema.prototype.url=function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this.id}`;
};

BookInstanceSchema.prototype.due_back_formatted=function() {
  return DateTime.fromJSDate(new Date(this.due_back)).toLocaleString(DateTime.DATE_MED)
}

BookInstanceSchema.prototype.due_back_yyyy_mm_dd=function () {
  return DateTime.fromJSDate(new Date(this.due_back)).toISODate(); // format 'YYYY-MM-DD'
};

BookInstanceSchema.belongsTo(BookSchema, { foreignKey: {name: 'book'}, targetKey: 'id'});

// Export model
module.exports = BookInstanceSchema;
