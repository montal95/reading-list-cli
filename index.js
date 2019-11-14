const mongoose = require("mongoose");
const Datastore = require("nedb");
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
  let googleResponse;
  //Using axios to make the query to the Google API
  try {
    googleResponse = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        //set paramaters for the query
        params: {
          q: book,
          key: process.env.GOOGLE_API_KEY,
          maxResults: 5
        }
      }
    );
  } catch (err) {
    console.info(`API Error: ${err.message}`);
    console.info("Canceling all actions");
    terminate();
    return;
  }

  return responseHandler(googleResponse);
};

//cleans response data from google API query
const responseHandler = res => {
  //console.info(res.data.items);
  let responseArray = res.data.items;
  //Empty array variable
  let searchResults = [];
  //loop through results and clean it up for user display and prep for DB
  for (let i = 0; i < responseArray.length; i++) {
    const bookInfo = responseArray[i].volumeInfo;
    const title = bookInfo.title;
    const authors = concatArrToStr(bookInfo.authors);
    const publisher =
      bookInfo.publisher === "" || bookInfo.publisher === undefined
        ? "N/A"
        : bookInfo.publisher;

    //loop through API query results to return only important information
    searchResults[i] = {
      title: title,
      author: authors,
      publishingcompany: publisher,
      name: `${title} by ${authors}, published by ${publisher}`
    };
  }

  //returned cleaned up result array
  return searchResults;
};

const concatArrToStr = arr => {
  let str = "";
  if (arr === undefined || arr[0] === "" || arr[0] === undefined) {
    return (str = "N/A");
  }
  for (let i = 0; i < arr.length; i++) {
    i === 0 ? (str = arr[0]) : (str = `${str}, ${arr[i]}`);
  }
  return str;
};

//Add book to the reading list
const addBook = book => {
  if (book === "Cancel") {
    terminate();
    return;
  }
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

module.exports = {
  searchBook,
  addBook,
  fullList,
  removeBook,
  concatArrToStr,
  responseHandler
};
