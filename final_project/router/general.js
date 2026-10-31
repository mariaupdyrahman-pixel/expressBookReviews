const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }

  return res.status(404).json({ message: "Username and password are required" });
});

// Get all books using Axios and Promise callbacks
public_users.get('/books', function (req, res) {
  axios.get('http://localhost:5000/')
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
