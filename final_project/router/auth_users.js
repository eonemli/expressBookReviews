const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to validate if username exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Helper function to authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

regd_users.use("/auth/*", (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware
    });
});

// Route: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and credentials are valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT for the user
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Respond with the token
  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Route: Add or Modify Book Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Temporarily bypass authorization for testing
  console.log("Authorization skipped for testing"); // Remove this for production

  const isbn = req.params.isbn; // Retrieve ISBN
  const review = req.body.review || "No review provided"; // Retrieve review from request body
  const username = "testUser"; // Use a placeholder username

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews field exists for the book
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or modify the review for the user
  books[isbn].reviews[username] = review;

  console.log(`Book with ISBN ${isbn} successfully updated by user ${username}`);
  console.log("Updated Reviews:", books[isbn].reviews);

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews,
  });
});

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add the new user to the users array
    users.push({ username, password });
  
    console.log(`User ${username} registered successfully.`);
    return res.status(201).json({ message: "User registered successfully" });
  });


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route parameter
    const username = req.user?.username; // Get the username from the authenticated user (middleware)

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" }); // Return error if book doesn't exist
    }

    const book = books[isbn];

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review not found for the current user" }); // Return error if review doesn't exist for the user
    }

    // Delete the user's review
    delete book.reviews[username];

    console.log(`Review by user ${username} for book with ISBN ${isbn} deleted.`);
    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: book.reviews,
    });
});

// Exported Modules
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;