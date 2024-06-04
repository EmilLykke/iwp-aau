const { sequelize } = require('../../db/dbSQLite');

const { DataTypes } = require('sequelize')

const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
        type: DataTypes.TEXT,
        min: 3,
        max: 100,
        required: true
  },
}, {
    tableName: "Genre",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

Genre.prototype.url = function () {
    return `/catalog/genre/${this.id}`
}

module.exports = Genre;