const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', function (req, res) {
    const { username, password } = req.body; // Extract username and password from the request body

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Use JSON.stringify to format the books data
  return res.status(200).send(JSON.stringify(books, null, 2));
});




// Get the list of books available in the shop using Async-Await
public_users.get('/books-async', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/booksdb'); // Simulate fetching books from an API or database
        return res.status(200).json(response.data); // Return the data on success
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: "Unable to fetch books" }); // Handle errors
    }
});

// Get the list of books available in the shop using Promises
public_users.get('/books', (req, res) => {
    axios.get('http://localhost:5000/booksdb') // Simulate fetching books from an API or database
        .then((response) => {
            return res.status(200).json(response.data); // Return the data on success
        })
        .catch((error) => {
            console.error("Error fetching books:", error.message);
            return res.status(500).json({ message: "Unable to fetch books" }); // Handle errors
        });
});


// Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from route parameters

    axios.get(`http://localhost:5000/booksdb`)
        .then((response) => {
            const books = response.data;
            if (books[isbn]) {
                return res.status(200).json(books[isbn]); // Return book details if ISBN exists
            } else {
                return res.status(404).json({ message: "Book not found" }); // Return 404 if ISBN is not found
            }
        })
        .catch((error) => {
            console.error("Error fetching books:", error.message);
            return res.status(500).json({ message: "Unable to fetch books" }); // Handle errors
        });
});

// Get book details based on ISBN using Async-Await
public_users.get('/books-async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from route parameters

    try {
        const response = await axios.get(`http://localhost:5000/booksdb`);
        const books = response.data;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]); // Return book details if ISBN exists
        } else {
            return res.status(404).json({ message: "Book not found" }); // Return 404 if ISBN is not found
        }
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: "Unable to fetch books" }); // Handle errors
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the URL
    const book = books[isbn]; // Look up the book by ISBN

    if (book) {
        return res.status(200).json(book); // Send the book details
    } else {
        return res.status(404).json({ message: "Book not found" }); // Handle not found
    }
});
  
// Get book details based on the author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Retrieve the author from the URL
    const matchingBooks = [];

    // Iterate through the books object
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            matchingBooks.push(books[isbn]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Send the matching books
    } else {
        return res.status(404).json({ message: "No books found for the given author" }); // Handle no matches
    }
});


// Get book details based on Author using Promises
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author; // Extract author from route parameters

    axios.get(`http://localhost:5000/booksdb`)
        .then((response) => {
            const books = response.data;
            const filteredBooks = Object.values(books).filter(
                (book) => book.author.toLowerCase() === author.toLowerCase()
            );
            if (filteredBooks.length > 0) {
                return res.status(200).json(filteredBooks); // Return books if author matches
            } else {
                return res.status(404).json({ message: "No books found for the given author" });
            }
        })
        .catch((error) => {
            console.error("Error fetching books:", error.message);
            return res.status(500).json({ message: "Unable to fetch books" });
        });
});
// Get book details based on Author using Async-Await
public_users.get('/books-async/author/:author', async (req, res) => {
    const author = req.params.author; // Extract author from route parameters

    try {
        const response = await axios.get(`http://localhost:5000/booksdb`);
        const books = response.data;
        const filteredBooks = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author.toLowerCase()
        );
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks); // Return books if author matches
        } else {
            return res.status(404).json({ message: "No books found for the given author" });
        }
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: "Unable to fetch books" });
    }
});

// Get book details based on Title using Promises
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title; // Extract title from route parameters

    axios.get(`http://localhost:5000/booksdb`)
        .then((response) => {
            const books = response.data;
            const filteredBooks = Object.values(books).filter(
                (book) => book.title.toLowerCase() === title.toLowerCase()
            );
            if (filteredBooks.length > 0) {
                return res.status(200).json(filteredBooks); // Return books if title matches
            } else {
                return res.status(404).json({ message: "No books found for the given title" });
            }
        })
        .catch((error) => {
            console.error("Error fetching books:", error.message);
            return res.status(500).json({ message: "Unable to fetch books" });
        });
});


// Get book details based on Title using Async-Await
public_users.get('/books-async/title/:title', async (req, res) => {
    const title = req.params.title; // Extract title from route parameters

    try {
        const response = await axios.get(`http://localhost:5000/booksdb`);
        const books = response.data;
        const filteredBooks = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title.toLowerCase()
        );
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks); // Return books if title matches
        } else {
            return res.status(404).json({ message: "No books found for the given title" });
        }
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: "Unable to fetch books" });
    }
});





// Get book details based on the title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Retrieve the title from the URL
    const matchingBooks = [];

    // Iterate through the books object
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            matchingBooks.push(books[isbn]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Send the matching book details
    } else {
        return res.status(404).json({ message: "No books found with the given title" }); // Handle no matches
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the URL
    const book = books[isbn]; // Look up the book by ISBN

    if (book) {
        return res.status(200).json({ reviews: book.reviews || "No reviews available" }); // Send the reviews or default message
    } else {
        return res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
});

module.exports.general = public_users;
