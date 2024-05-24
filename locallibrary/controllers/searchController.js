const asyncHandler = require("express-async-handler");
const Author = require("../models/author.model");
const Book = require("../models/book.model");
const Genre = require("../models/genre.model");

exports.search_get = asyncHandler(async (req, res, next) => {

    const searchValue = req.query.q;

    // E.g search for "bo"
    // Use regex so it also gets titles and names like "Test book", "Devin Bob". So not an exact match
    // Use $options: 'i' to make it case insensitive
    const [books, authors, genres] = await Promise.all([
        Book.find({ title: { $regex: searchValue, $options: "i" } }).exec(),
        Author.find({ first_name: { $regex: searchValue, $options: "i" } }).exec(),
        Genre.find({ name: { $regex: searchValue, $options: "i" } }).exec()
    ]);

    res.render("search", { title: "Search", books, authors, genres, searchQuery: searchValue});
});

