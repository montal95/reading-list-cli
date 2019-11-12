const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

//Map local promises
mongoose.Promise = global.Promise;

//Connect to DB
const db = mongoose.connect("mongodb://localhost:27017/readingListCLI", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Closes Connection to MongoDB
const terminate = () => {
  mongoose.connection.close();
};

//Import MongoDB Model
const ReadingList = require("./models/readingList");

//Search for book to add to Reading List
const searchBook = async function(book) {
  console.info(`Searching for: ${book}`);

  //Using axios to make the query to the Google API
  const googleResponse = await axios.get(
    "https://www.googleapis.com/books/v1/volumes",
    {
      //set paramaters for the query
      params: {
        q: book,
        key: process.env.GOOGLE_API_KEY,
        maxResults: 10
      }
    }
  );
  return responseHandler(googleResponse);
};

//cleans response data from google API query
const responseHandler = res => {
  //console.info(res.data.items);
  let responseArray = res.data.items;
  //Empty array variable
  let searchResults = [];
  //loop through results and clean it up for user display and prep for DB
  for (let i = 0; i < 5; i++) {
    let authors = "";
    const bookInfo = responseArray[i].volumeInfo;
    const title = bookInfo.title;
    //Makes sure publisher doesn't come back as undefined
    const publisher =
      bookInfo.publisher === undefined ? "None Listed" : bookInfo.publisher;

    //If statements used to change authors array into a string of authors
    //None listed if undefined or blank
    if (bookInfo.authors === undefined || bookInfo.authors[i] === "") {
      authors = "None Listed";
    } else if (bookInfo.authors.length === 1) {
      authors = bookInfo.authors[0];
    } else {
      //A list of authors will be converted into a string of authors '<author1>, <author2>...'
      authors = bookInfo.authors[0];
      for (let a = 1; a < bookInfo.authors.length; a++) {
        authors = authors + `, ${bookInfo.authors[a]}`;
      }
    }
    //loop through API query results to return only important information
    searchResults[i] = {
      title: title,
      author: authors,
      publishingcompany: publisher,
      name: `${title} by ${authors}, published by ${publisher}`
    };
  }
  //console.info(searchResults);
  //returned cleaned up result array
  return searchResults;
};

const concatArrToStr = arr => {
  let str = "";
  if (arr === undefined || arr[0] === "") {
    return (str = "No authors listed");
  }
  str = arr[0];
  if (arr.length > 1) {
    arr.forEach(author => {
      str = `${str}, ${author}`;
    });
  }
  return str;
};

//Add book to the reading list
const addBook = book => {
  ReadingList.create(book)
    .then(book => {
      console.info("New Book Added to Reading List:");
      console.info(book);
      //close DB after adding new book entry
      terminate();
    })
    .catch(err => {
      console.info(err);
      terminate();
    });
};

//Delete book from reading list
const removeBook = _id => {
  ReadingList.deleteOne({ _id }).then(book => {
    console.info("Book removed from reading list");
    terminate();
  });
};

//Full reading list
const fullList = () => {
  ReadingList.find().then(books => {
    //prints list of books
    books.forEach(book => {
      console.info(book);
    });
    //Shows how many matches are found...with proper grammar
    const matches =
      books.length === 1
        ? `${books.length} match found`
        : `${books.length} matches found`;
    console.info(matches);
    terminate();
  });
};

module.exports = { searchBook, addBook, fullList, removeBook, concatArrToStr };
