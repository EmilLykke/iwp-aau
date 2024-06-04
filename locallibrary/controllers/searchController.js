const asyncHandler = require("express-async-handler");
const {searchGenre, searchAuthor, searchBook} = require("../db/databaseService");

exports.search_get = asyncHandler(async (req, res, next) => {

    const searchValue = req.query.q;

    const [books, authors, genres] = await Promise.all([
        searchBook(searchValue),
        searchAuthor(searchValue),
        searchGenre(searchValue),
    ]);
    // console.log({ books, authors, genres });

    res.render("search", { title: "Search", books, authors, genres, searchQuery: searchValue});
});

