const { sequelize } = require("../app");
// const { DateTime } = require("luxon");

const { DataTypes } = require('sequelize')
  
const AuthorSchema = sequelize.define('Author', {
  first_name: { type: DataTypes.TEXT, required: true, maxLength: 100 },
  family_name: { type: DataTypes.TEXT, required: true, maxLength: 100 },
  date_of_birth: { type: DataTypes.DATE },
  date_of_death: { type: DataTypes.DATE },
  image_path: { type: DataTypes.TEXT },
}, {
  tableName: "Author",
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});


// Export model
module.exports = AuthorSchema;
