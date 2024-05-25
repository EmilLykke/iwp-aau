const Author = require("../models/author.model");
const Book = require("../models/book.model");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const { findAllAuthors, findAuthorById, findAllBooks } = require("../db/databaseService");

const upload = multer()


// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  // const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  const allAuthors = await findAllAuthors();
  console.log(allAuthors);
  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    await findAuthorById(req.params.id),
    await findAllBooks({author: req.params.id}),
  ]);

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author",errors: undefined, author: undefined  });
};

// Handle Author create on POST.
exports.author_create_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Handle file upload
  upload.single("image_path"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req.body);

    const image = req.file;

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      image_path: image.originalname,
    });

    try {
      fs.writeFileSync(`author_images/${image.originalname}`, image.buffer);
    } catch (error) {
      errors.push({ msg: "Error saving image" });
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Save author.
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];



// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});


// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  const errors = []

  try {
    fs.rmSync(`author_images/${author.image_path}`);
  } catch (error) {
    errors.push({ msg: "Error removing image" });
  }

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
      errors: errors,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});


// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  // Get author, authors and genres for form.
  const author = await Author.findById(req.params.id).exec()

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_form", {
    title: "Update Author",
    author:  author,
    errors: undefined,
    fileErrors: undefined
  });
});


// Handle Author update on POST.
exports.author_update_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("family_name", "Family name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("date_of_birth" )
    .trim()
    .escape(),
  body("date_of_death")
  .trim()
  .escape(),

  // Handle file upload
  upload.single("image_path"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req.body)
    const fileErrors = []
    const image = req.file;


    const author = await Author.findById(req.params.id).exec();

    try {
      fs.rmSync(`author_images/${author.image_path}`);
    } catch (error) { 
      fileErrors.push({ msg: "Error removing image" });
    }
    
    const newAuthor = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id, // This is required, or a new ID will be assigned!
      image_path: image.originalname,
    });

    try {
      fs.writeFileSync(`author_images/${image.originalname}`, image.buffer);
    } catch (error) {
      fileErrors.push({ msg: "Error updating image" });
    }

    if (!errors.isEmpty() && fileErrors.length > 0) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("author_form", {
        title: "Update Author",
        author: author,
        errors: errors.array(),
        fileErrors: fileErrors,
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, newAuthor, {});
      // Redirect to book detail page.
      res.redirect(updatedAuthor.url);
    }
  }),
];
