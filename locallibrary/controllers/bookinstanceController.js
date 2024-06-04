const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { findAllBookInstances, findBookInstanceById, findAllBooks, createBookInstance, deleteBookInstance , updateBookInstance} = require("../db/databaseService");




// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await findAllBookInstances()

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await findBookInstanceById(req.params.id)


  if (bookInstance === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Book:",
    bookinstance: bookInstance,
  });
});


// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await findAllBooks({}, {title: 1})

  res.render("bookinstance_form", {
    title: "Create BookInstance",
    book_list: allBooks,
    selected_book: undefined,
    bookinstance: undefined,
    errors: undefined
  });
});


// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = {
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back.toString(),
    };

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await findAllBooks({}, {title: 1})

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book.id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data from form is valid
      const newBookInstance = await createBookInstance(bookInstance)
      res.redirect(newBookInstance);
    }
  }),
];


// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of book and all their books (in parallel)
  const bookinstance = await findBookInstanceById(req.params.id)

  if (bookinstance === null) {
    // No results.
    res.redirect("/catalog/bookinstances");
  }

  console.log(bookinstance)

  res.render("bookinstance_delete", {
    title: "Delete Bookinstance",
    bookinstance: bookinstance,
  });
});


// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    // Delete object and redirect to the list of authors.
    await deleteBookInstance(req.body.bookinstanceid)
    res.redirect("/catalog/bookinstances");
});

// Display bookinstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  // Get bookinstance, authors and genres for form.
  const [ bookinstance, allBooks ] = await Promise.all([
    findBookInstanceById(req.params.id),
    findAllBooks({}, {title: 1})
  ])

  if (bookinstance === null) {
    // No results.
    const err = new Error("BookInstance not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  res.render("bookinstance_form", {
    title: "Update BookInstance",
    bookinstance: bookinstance,
    book_list: allBooks,
    selected_book: bookinstance.book.id,
    errors: undefined
  });
});


// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // Validate and sanitize fields.
  body("book", "Book must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("imprint", "Imprint must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "Status must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("due_back", "Due back must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a bookinstanceInstance object with escaped/trimmed data and old id.
    const bookinstance = {
      book: req.body.book,
      imprint: req.body.imprint,
      status:  req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    };

    const allBooks  = await findAllBooks({}, {title: 1})

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("bookinstance_form", {
        title: "Update BookInstance",
        bookinstance: bookinstance,
        selected_book: bookinstance.book.id,
        book_list: allBooks,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedBookInstance = await updateBookInstance(req.params.id, bookinstance)

      // Redirect to bookinstance detail page.
      res.redirect(updatedBookInstance);
    }
  }),
];

