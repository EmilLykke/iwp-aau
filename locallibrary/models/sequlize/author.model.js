const { sequelize } = require('../../db/dbSQLite');
const { DateTime } = require("luxon");

const { DataTypes } = require('sequelize')
  
const AuthorSchema = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: { type: DataTypes.TEXT, required: true, maxLength: 100 },
  family_name: { type: DataTypes.TEXT, required: true, maxLength: 100 },
  date_of_birth: { type: DataTypes.TEXT },
  date_of_death: { type: DataTypes.TEXT },
  image_path: { type: DataTypes.TEXT },
  
}, {
  tableName: "Author",
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});


AuthorSchema.prototype.name = function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
};

// Virtual for author's URL
AuthorSchema.prototype.url = function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this.id}`;
};

AuthorSchema.prototype.lifespan=function () {
  return this.date_of_birth ? DateTime.fromJSDate(new Date(this.date_of_birth)).toLocaleString(DateTime.DATE_MED) : '';
}

AuthorSchema.prototype.image_url=function () {
  return this.image_path ? `/${this.image_path}` : '';
};


// Export model
module.exports = AuthorSchema;
