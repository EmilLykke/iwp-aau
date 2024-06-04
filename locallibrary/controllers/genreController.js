const Genre = require("../models/genre.model");
const { findAllGenres, findGenreById, findAllBooks, findGenreByName, createGenre, deleteGenre, updateGenre } = require("../db/databaseService");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await findAllGenres()

  res.render('genre_list', {
    title: 'Genre list',
    genres,
  })
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    findGenreById(req.params.id),
    findAllBooks({ genre: req.params.id }),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});


// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre", genre: undefined, errors: undefined });
};


// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = { name: req.body.name };

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      // const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      const genreExists = await findGenreByName(req.body.name);
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        const newGenre = await createGenre({ name: req.body.name})
        // New genre saved. Redirect to genre detail page.
        res.redirect(newGenre);
      }
    }
  }),
];


// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of genre and all their books (in parallel)
  const [genre, allBooksByGenre] = await Promise.all([
    findGenreById(req.params.id),
    findAllBooks({ genre: req.params.id }),
  ]);

  if (genre === null) {
    // No results.
    res.redirect("/catalog/genres");
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    genre_books: allBooksByGenre,
  });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of genre and all their books (in parallel)
  const [genre, allBooksByGenre] = await Promise.all([
    findGenreById(req.params.id),
    findAllBooks({ genre: req.params.id }),
  ]);

  if (allBooksByGenre.length > 0) {
    // Genre has books. Render in same way as for GET route.
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      genre_books: allBooksByGenre,
    });
    return;
  } else {
    // Genre has no books. Delete object and redirect to the list of genres.
    await deleteGenre(req.body.genreid)
    res.redirect("/catalog/genres");
  }
});


// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {

  // Get genre, genres and genres for form.
  const genre = await findGenreById(req.params.id)

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }


  res.render("genre_form", {
    title: "Update Genre",
    genre:  genre,
    errors: undefined
  });
});


// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const genre = {
      name: req.body.name,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      // const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
      const updatedGenre = await updateGenre(req.params.id, genre)
      // Redirect to book detail page.
      res.redirect(updatedGenre);
    }
  }),
];
